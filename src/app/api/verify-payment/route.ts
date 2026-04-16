import { NextRequest, NextResponse } from 'next/server'
import { verifyPaymentSignature, generateBookingCode } from '@/lib/razorpay'
import { createClient } from '@/lib/supabase/server'
import type { ApiResponse, BookingFormData } from '@/types'

interface VerifyPayload {
  razorpayPaymentId: string
  razorpayOrderId: string
  razorpaySignature: string
  bookingData: BookingFormData
  amount: number
}

interface BookingResult {
  bookingCode: string
  bookingId: string
}

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<BookingResult>>> {
  try {
    const body = await req.json() as VerifyPayload
    const {
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      bookingData,
      amount,
    } = body

    // 1. Verify signature
    const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Payment signature invalid' }, { status: 400 })
    }

    const supabase = await createClient()

    // 2. Fetch the order row
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('id, status, ticket_type_id, quantity')
      .eq('razorpay_order_id', razorpayOrderId)
      .single()

    if (orderErr || !order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    if (order.status === 'paid') {
      return NextResponse.json({ success: false, error: 'Order already processed' }, { status: 409 })
    }

    // 3. Mark order paid
    const { error: updateErr } = await supabase
      .from('orders')
      .update({ status: 'paid' })
      .eq('id', order.id)

    if (updateErr) {
      console.error('Order update error:', updateErr)
    }

    // 4. Create booking (trigger decrements availability)
    const bookingCode = generateBookingCode()
    const { data: booking, error: bookingErr } = await supabase
      .from('bookings')
      .insert({
        order_id: order.id,
        ticket_type_id: order.ticket_type_id,
        quantity: order.quantity,
        user_email: bookingData.email,
        first_name: bookingData.firstName,
        last_name: bookingData.lastName,
        phone: bookingData.phone,
        total_amount: amount,
        status: 'confirmed',
        booking_code: bookingCode,
        razorpay_payment_id: razorpayPaymentId,
      })
      .select('id')
      .single()

    if (bookingErr) {
      console.error('Booking insert error:', bookingErr)
      return NextResponse.json({ success: false, error: 'Booking creation failed' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        bookingCode,
        bookingId: booking.id,
      },
    })
  } catch (err) {
    console.error('verify-payment error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
