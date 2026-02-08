import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.6.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      console.error('No session ID provided');
      return Response.json({ error: 'Session ID required' }, { status: 400 });
    }

    console.log('Fetching Stripe session:', sessionId);

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    console.log('Session metadata:', session.metadata);

    if (!session.metadata?.booking_id) {
      console.error('No booking_id in session metadata');
      return Response.json({ error: 'Booking ID not found in session' }, { status: 404 });
    }

    console.log('Fetching booking:', session.metadata.booking_id);

    // Fetch the booking from database using service role
    const bookings = await base44.asServiceRole.entities.Booking.filter({ 
      id: session.metadata.booking_id 
    });

    console.log('Bookings found:', bookings?.length);

    if (!bookings || bookings.length === 0) {
      console.error('Booking not found in database');
      return Response.json({ error: 'Booking not found' }, { status: 404 });
    }

    const booking = bookings[0];
    const confirmationNumber = 'ASC-' + sessionId.slice(-8).toUpperCase();

    console.log('Updating booking status for:', booking.id);

    // Update booking status to confirmed and paid
    await base44.asServiceRole.entities.Booking.update(booking.id, {
      status: 'confirmed',
      payment_status: 'paid',
      payment_intent_id: session.payment_intent,
      confirmation_number: confirmationNumber
    });

    console.log('Booking updated successfully');

    // Create Google Calendar event immediately
    try {
      console.log('Creating calendar event for booking:', booking.id);
      const calendarResponse = await base44.asServiceRole.functions.invoke('createCalendarEvent', {
        bookingId: booking.id
      });
      console.log('✅ Calendar event created successfully:', calendarResponse.data);
    } catch (calendarError) {
      console.error('❌ Failed to create calendar event:', calendarError.message);
      console.error('Calendar error details:', calendarError);
      // Don't fail the booking if calendar creation fails
    }

    return Response.json({ 
      booking: {
        ...booking,
        confirmation_number: confirmationNumber,
        status: 'confirmed',
        payment_status: 'paid'
      }
    });

  } catch (error) {
    console.error('Error in getBookingFromSession:', error);
    return Response.json({ 
      error: error.message || 'Failed to fetch booking',
      stack: error.stack
    }, { status: 500 });
  }
});