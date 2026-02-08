import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.6.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return Response.json({ error: 'Session ID required' }, { status: 400 });
    }

    console.log('Fetching individual service session:', sessionId);

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status !== 'paid') {
      return Response.json({ error: 'Payment not completed' }, { status: 400 });
    }

    // Check if already processed
    const existing = await base44.asServiceRole.entities.IndividualService.filter({ 
      stripe_session_id: sessionId 
    });
    
    if (existing && existing.length > 0) {
      console.log('Service already processed');
      return Response.json({ service: existing[0] });
    }

    const confirmationNumber = 'VB-' + Date.now().toString().slice(-6);

    console.log('Creating IndividualService record');

    // Create the service record
    const service = await base44.asServiceRole.entities.IndividualService.create({
      confirmation_number: confirmationNumber,
      service_name: session.metadata.service_name,
      price: session.amount_total / 100,
      customer_first_name: session.metadata.customer_first_name,
      customer_last_name: session.metadata.customer_last_name,
      customer_email: session.customer_email,
      customer_phone: session.metadata.customer_phone || '',
      payment_status: 'paid',
      stripe_session_id: sessionId,
      event_type: 'volleyball',
      is_redeemed: false
    });

    console.log('✅ IndividualService created:', service.id);

    return Response.json({ 
      service: {
        ...service,
        confirmation_number: confirmationNumber
      }
    });

  } catch (error) {
    console.error('Error in completeIndividualServicePurchase:', error);
    return Response.json({ 
      error: error.message || 'Failed to complete purchase',
      stack: error.stack
    }, { status: 500 });
  }
});