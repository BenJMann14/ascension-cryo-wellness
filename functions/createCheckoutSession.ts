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
  'body-sculpt': 'price_1SukSWCoYuwTgPPSiPALX3UJ',
  'facial': 'price_1SukSWCoYuwTgPPSQfK3DTQZ',
  'scalp': 'price_1SukSWCoYuwTgPPSxkQ1S97I',
  'pkg-rapid': 'price_1SukSWCoYuwTgPPSCOUg8KOe',
  'pkg-injury': 'price_1SukSWCoYuwTgPPSCOUg8KOe',
  'pkg-elite': 'price_1SukSWCoYuwTgPPSCOUg8KOe',
  'combo-express': 'price_1SukSWCoYuwTgPPSCOUg8KOe',
  'combo-reset': 'price_1SukSWCoYuwTgPPSCOUg8KOe',
  'combo-boost': 'price_1SukSWCoYuwTgPPSCOUg8KOe',
  'combo-full': 'price_1SukSWCoYuwTgPPSCOUg8KOe',
  'combo-lymph': 'price_1SukSWCoYuwTgPPSCOUg8KOe'
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

    // Create booking record first to store all data
    // Parse the date properly - it comes as a serialized string from frontend
    const dateObj = new Date(bookingData.calendarData.date);
    const appointmentDateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    
    const booking = await base44.asServiceRole.entities.Booking.create({
      customer_first_name: bookingData.customerData.firstName,
      customer_last_name: bookingData.customerData.lastName,
      customer_email: bookingData.customerData.email,
      customer_phone: bookingData.customerData.phone,
      service_address: bookingData.addressData.address,
      service_city: bookingData.addressData.city,
      service_zip: bookingData.addressData.zip,
      distance_miles: bookingData.addressData.distance,
      appointment_date: appointmentDateStr,
      appointment_time: bookingData.calendarData.time,
      services_selected: services.map(s => ({
        service_id: s.id,
        service_name: s.name,
        price: s.price
      })),
      total_amount: services.reduce((sum, s) => sum + s.price, 0),
      estimated_duration: services.reduce((sum, s) => sum + (parseInt(s.duration) || 15), 0),
      special_requests: bookingData.customerData.specialRequests || '',
      marketing_opt_in: bookingData.customerData.marketingOptIn || false,
      status: 'pending',
      payment_status: 'pending',
      booking_type: 'individual'
    });

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

    // Create checkout session with minimal metadata
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/BookSession?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${origin}/BookSession?canceled=true`,
      customer_email: bookingData.customerData.email,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        booking_id: booking.id,
        customer_email: bookingData.customerData.email
      }
    });

    return Response.json({ 
      sessionId: session.id,
      url: session.url,
      bookingId: booking.id
    });

  } catch (error) {
    console.error('Checkout session creation error:', error);
    return Response.json({ 
      error: error.message || 'Failed to create checkout session' 
    }, { status: 500 });
  }
});