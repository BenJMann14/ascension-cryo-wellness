import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.6.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

// Service to Stripe price mapping
const SERVICE_PRICE_MAP = {
  'cryo-single': 'price_1SukSWCoYuwTgPPSCOUg8KOe',
  'cryo-dual': 'price_1SukSWCoYuwTgPPSKa0Rv99m',
  'cryo-full': 'price_1SukSWCoYuwTgPPSCfv5rGHG',
  'compression': 'price_1SukSWCoYuwTgPPSCd3uQNnt',
  'compression-addon': 'price_1SukSWCoYuwTgPPS66tmuzY1',
  'redlight': 'price_1SukSWCoYuwTgPPSoUrHiCNP',
  'redlight-addon': 'price_1SukSWCoYuwTgPPSAZ1f9MG6',
  'vibration': 'price_1SukSWCoYuwTgPPStMMD4Ome',
  'vibration-addon': 'price_1SukSWCoYuwTgPPSdRZg8PXF',
  'bodysculpt': 'price_1SukSWCoYuwTgPPSiPALX3UJ',
  'facial': 'price_1SukSWCoYuwTgPPSQfK3DTQZ',
  'scalp': 'price_1SukSWCoYuwTgPPSxkQ1S97I'
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Optional: Verify user is authenticated
    const user = await base44.auth.me().catch(() => null);
    
    const { services, bookingData, origin } = await req.json();
    
    if (!services || !Array.isArray(services) || services.length === 0) {
      return Response.json({ error: 'No services selected' }, { status: 400 });
    }

    // Build line items from services
    const lineItems = services.map(service => {
      const priceId = SERVICE_PRICE_MAP[service.id];
      if (!priceId) {
        throw new Error(`Unknown service ID: ${service.id}`);
      }
      return {
        price: priceId,
        quantity: 1
      };
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/BookSession?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${origin}/BookSession?canceled=true`,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        booking_data: JSON.stringify(bookingData),
        user_email: user?.email || bookingData?.customerData?.email || 'guest'
      }
    });

    return Response.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Checkout session creation error:', error);
    return Response.json({ 
      error: error.message || 'Failed to create checkout session' 
    }, { status: 500 });
  }
});