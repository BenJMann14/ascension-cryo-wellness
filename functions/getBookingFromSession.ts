import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.6.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { sessionId } = await req.json();

    if (!sessionId) {
      return Response.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session.metadata?.booking_id) {
      return Response.json({ error: 'Booking ID not found' }, { status: 404 });
    }

    // Fetch the booking from database
    const bookings = await base44.asServiceRole.entities.Booking.filter({ 
      id: session.metadata.booking_id 
    });

    if (!bookings || bookings.length === 0) {
      return Response.json({ error: 'Booking not found' }, { status: 404 });
    }

    const booking = bookings[0];

    // Update booking status to confirmed and paid
    await base44.asServiceRole.entities.Booking.update(booking.id, {
      status: 'confirmed',
      payment_status: 'paid',
      payment_intent_id: session.payment_intent,
      confirmation_number: 'ASC-' + sessionId.slice(-8).toUpperCase()
    });

    return Response.json({ 
      booking: {
        ...booking,
        confirmation_number: 'ASC-' + sessionId.slice(-8).toUpperCase(),
        status: 'confirmed',
        payment_status: 'paid'
      }
    });

  } catch (error) {
    console.error('Error fetching booking from session:', error);
    return Response.json({ 
      error: error.message || 'Failed to fetch booking' 
    }, { status: 500 });
  }
});