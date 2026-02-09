import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    
    if (!stripeKey) {
      return Response.json({ 
        success: false, 
        error: 'Stripe API key not configured' 
      });
    }

    const stripe = new Stripe(stripeKey);
    
    // Test the connection by retrieving account information
    const account = await stripe.accounts.retrieve();
    
    return Response.json({ 
      success: true,
      mode: stripeKey.includes('_test_') ? 'test' : 'live',
      accountId: account.id
    });

  } catch (error) {
    console.error('Stripe test error:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});