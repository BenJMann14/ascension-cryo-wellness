import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  apiVersion: '2024-12-18.acacia',
});

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { bookingId } = await req.json();

    // Fetch the booking
    const booking = await base44.entities.Booking.get(bookingId);

    // Verify ownership
    if (booking.customer_email !== user.email && user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return Response.json({ error: 'Booking is already cancelled' }, { status: 400 });
    }

    // Check 24-hour policy
    const appointmentDateTime = new Date(`${booking.appointment_date}T${booking.appointment_time}`);
    const now = new Date();
    const hoursUntilAppointment = (appointmentDateTime - now) / (1000 * 60 * 60);

    if (hoursUntilAppointment < 24) {
      return Response.json({ 
        error: 'Cannot cancel within 24 hours of appointment',
        canCancel: false,
        hoursUntilAppointment: Math.round(hoursUntilAppointment)
      }, { status: 400 });
    }

    // Process refund if payment was made
    if (booking.payment_intent_id && booking.payment_status === 'paid') {
      const refund = await stripe.refunds.create({
        payment_intent: booking.payment_intent_id,
        amount: Math.round(booking.total_amount * 100),
      });

      await base44.entities.Booking.update(bookingId, {
        status: 'cancelled',
        payment_status: 'refunded'
      });

      return Response.json({ 
        success: true,
        refunded: true,
        refundAmount: refund.amount / 100
      });
    }

    // No payment to refund, just cancel
    await base44.entities.Booking.update(bookingId, {
      status: 'cancelled'
    });

    return Response.json({ 
      success: true,
      refunded: false
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    return Response.json({ 
      error: error.message || 'Failed to cancel booking' 
    }, { status: 500 });
  }
});