import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { ApiResponse } from '@/types'
import crypto from 'crypto'

// Generate booking code
function generateBookingCode(): string {
  return 'CLD-MC-' + crypto.randomBytes(6).toString('hex').toUpperCase()
}

// POST /api/book-ticket — create a booking with QR code payment
export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await req.json()
    const { ticketTypeId, quantity, firstName, lastName, email, phone, amount } = body as {
      ticketTypeId: string
      quantity: number
      firstName: string
      lastName: string
      email: string
      phone: string
      amount: number
    }

    // Validate input
    if (!ticketTypeId || !quantity || !firstName || !lastName || !email || !phone) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check ticket availability
    const { data: ticketRow } = await supabase
      .from('ticket_types')
      .select('available')
      .eq('id', ticketTypeId)
      .single()

    if (!ticketRow || ticketRow.available < quantity) {
      return NextResponse.json({ success: false, error: 'Not enough tickets available' }, { status: 409 })
    }

    // Create dummy order to bypass Razorpay gateway
    const bookingCode = generateBookingCode()
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        razorpay_order_id: 'dummy_' + bookingCode,
        amount,
        ticket_type_id: ticketTypeId,
        quantity,
        user_email: email,
        status: 'paid'
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error('Order creation error:', orderError)
      return NextResponse.json({ success: false, error: 'Failed to create internal order' }, { status: 500 })
    }

    // Create booking record
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        order_id: order.id,
        ticket_type_id: ticketTypeId,
        quantity,
        user_email: email,
        first_name: firstName,
        last_name: lastName,
        phone,
        total_amount: amount,
        booking_code: bookingCode,
        status: 'confirmed', // Mark as confirmed when QR payment is initiated
      })
      .select()
      .single()

    if (bookingError || !booking) {
      console.error('Booking creation error:', bookingError)
      return NextResponse.json({ 
        success: false, 
        error: bookingError?.message || 'Failed to create booking',
        details: bookingError?.details || bookingError?.hint || undefined
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        bookingCode,
        bookingId: booking.id,
      },
    })
  } catch (err) {
    console.error('book-ticket POST error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/book-ticket?code=CLD-MC-XXXXX — lookup booking by code
export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const code = req.nextUrl.searchParams.get('code')
    if (!code) {
      return NextResponse.json({ success: false, error: 'Booking code required' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id, booking_code, status, quantity, total_amount, first_name, last_name, user_email, created_at,
        ticket_types (id, name)
      `)
      .eq('booking_code', code)
      .single()

    if (error || !data) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('book-ticket GET error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
