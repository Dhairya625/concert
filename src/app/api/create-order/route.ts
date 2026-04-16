import { NextRequest, NextResponse } from 'next/server'
import { getRazorpayInstance } from '@/lib/razorpay'
import { getTicketById } from '@/lib/tickets'
import { createClient } from '@/lib/supabase/server'
import type { ApiResponse, RazorpayOrderResponse } from '@/types'

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<RazorpayOrderResponse>>> {
  try {
    const body = await req.json()
    const { ticketTypeId, quantity, email } = body as {
      ticketTypeId: string
      quantity: number
      email: string
    }

    // Validate input
    if (!ticketTypeId || !quantity || !email) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const ticket = getTicketById(ticketTypeId)
    if (!ticket) {
      return NextResponse.json({ success: false, error: 'Invalid ticket type' }, { status: 400 })
    }

    const qty = Math.max(1, Math.min(10, Number(quantity)))
    const amount = ticket.price * qty // paise

    // Check availability in DB
    const supabase = await createClient()
    const { data: ticketRow } = await supabase
      .from('ticket_types')
      .select('available')
      .eq('id', ticketTypeId)
      .single()

    if (!ticketRow || ticketRow.available < qty) {
      return NextResponse.json({ success: false, error: 'Not enough tickets available' }, { status: 409 })
    }

    // Create Razorpay order
    const razorpay = getRazorpayInstance()
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: { ticketTypeId, quantity: qty, email },
    })

    // Persist order in DB
    const { error: dbErr } = await supabase.from('orders').insert({
      razorpay_order_id: order.id,
      amount,
      currency: 'INR',
      status: 'created',
      ticket_type_id: ticketTypeId,
      quantity: qty,
      user_email: email,
    })

    if (dbErr) {
      console.error('DB order insert error:', dbErr)
      // Non-fatal — Razorpay order still valid
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount as number,
        currency: order.currency,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      },
    })
  } catch (err) {
    console.error('create-order error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
