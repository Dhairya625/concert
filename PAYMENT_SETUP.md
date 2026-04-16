# QR Code Payment Setup

## How to Set Up Your Payment QR Code

1. **Generate Your QR Code**
   - Create a UPI QR code using your payment provider (Google Pay, PhonePe, Razorpay QR, etc.)
   - Or use any payment gateway that provides QR code functionality

2. **Add Your QR Code Image**
   - Place your QR code image in: `/public/images/payment-qr.png`
   - Supported formats: PNG, JPG, JPEG, WebP
   - Recommended size: 500x500px or larger

3. **Verify Configuration**
   - Open `src/lib/payment-config.ts`
   - Ensure `qrCodeImagePath` matches your image location
   - Update `instructions` if needed to match your payment process
   - Update `paymentMethod` if using a different payment method

4. **Test**
   - Go through the checkout flow
   - You should see your QR code in the payment modal
   - Users can now scan and pay

## File Locations

- **Config File**: `src/lib/payment-config.ts`
- **Component**: `src/app/checkout/CheckoutClient.tsx`
- **API Route**: `src/app/api/book-ticket/route.ts`
- **Public Images**: `public/images/`

## Payment Flow

1. User fills checkout form
2. Clicks "Proceed to Payment"
3. Booking is created in database
4. QR code modal appears with payment instructions
5. User scans QR code and pays
6. User clicks "Payment Complete"
7. Redirected to confirmation page with booking code

## Notes

- Bookings are created immediately when user initiates payment
- The database trigger automatically decrements available tickets
- Users receive their booking code for reference
- Store the booking code for customer support inquiries
