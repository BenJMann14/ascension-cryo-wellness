import Stripe from 'npm:stripe';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

const PASS_PRICING = {
  3: { price: 135, perPass: 45 },
  6: { price: 240, perPass: 40 },
  9: { price: 315, perPass: 35 },
  12: { price: 360, perPass: 30 }
};

Deno.serve(async (req) => {
  try {
    const { passes, customerInfo } = await req.json();
    
    if (!PASS_PRICING[passes]) {
      return Response.json({ error: 'Invalid pass quantity' }, { status: 400 });
    }

    const pricing = PASS_PRICING[passes];
    const baseUrl = req.headers.get('origin') || 'https://your-app.base44.com';
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${passes} Team Recovery Passes`,
            description: `Recovery session passes for volleyball tournament - $${pricing.perPass} per pass`,
          },
          unit_amount: pricing.price * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${baseUrl}/team-pass-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/volleyball-recovery`,
      customer_email: customerInfo.email,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        pass_type: 'team_pass',
        total_passes: passes.toString(),
        customer_first_name: customerInfo.firstName,
        customer_last_name: customerInfo.lastName,
        customer_phone: customerInfo.phone || ''
      }
    });

    return Response.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('Error creating team pass checkout:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});