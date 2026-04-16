// Payment Configuration
// Update this with your actual QR code image path and payment instructions

export const PAYMENT_CONFIG = {
  // Path to your QR code image in the public folder
  qrCodeImagePath: '/images/QR.jpeg', // Your QR code image
  
  // Payment instructions
  instructions: [
    'Open your UPI/Payment app',
    'Scan the QR code above',
    'Confirm the payment amount',
    'Click "Payment Complete" to proceed',
  ],
  
  // Payment method label
  paymentMethod: 'UPI / QR Code',
  
  // Additional note (optional)
  note: 'Please keep your booking reference safe for your records',
}
