// ============================================
// DOMAIN TYPES — Coldplay × Minecraft Tickets
// ============================================

export type TicketTier = 'standard' | 'emerald' | 'diamond' | 'vip'

export interface TicketType {
  id: string
  tier: TicketTier
  name: string
  price: number // in INR paise (razorpay)
  priceDisplay: string
  description: string
  perks: string[]
  available: number
  total: number
  color: string
  glowClass: string
  badgeLabel: string
}

export interface BookingFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  quantity: number
  ticketTypeId: string
  // optional auth
  guestCheckout: boolean
}

export interface Order {
  id: string
  razorpayOrderId: string
  amount: number
  currency: string
  status: 'created' | 'paid' | 'failed'
  ticketTypeId: string
  quantity: number
  userEmail: string
  createdAt: string
}

export interface Booking {
  id: string
  orderId: string
  ticketTypeId: string
  quantity: number
  userEmail: string
  firstName: string
  lastName: string
  phone: string
  totalAmount: number
  status: 'confirmed' | 'cancelled' | 'pending'
  bookingCode: string
  createdAt: string
}

export interface RazorpayOrderResponse {
  orderId: string
  amount: number
  currency: string
  keyId: string
}

export interface PaymentVerificationPayload {
  razorpayPaymentId: string
  razorpayOrderId: string
  razorpaySignature: string
  bookingData: BookingFormData
  amount: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
