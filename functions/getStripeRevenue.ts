import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  apiVersion: '2024-12-18.acacia',
});

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Fetch all payment intents from the last 90 days
    const ninetyDaysAgo = Math.floor(Date.now() / 1000) - (90 * 24 * 60 * 60);
    
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100,
      created: {
        gte: ninetyDaysAgo
      }
    });

    // Group by date and calculate daily revenue
    const revenueByDate = {};
    
    paymentIntents.data.forEach(intent => {
      if (intent.status === 'succeeded') {
        const date = new Date(intent.created * 1000).toISOString().split('T')[0];
        if (!revenueByDate[date]) {
          revenueByDate[date] = 0;
        }
        revenueByDate[date] += intent.amount / 100; // Convert from cents
      }
    });

    // Convert to array and sort by date
    const chartData = Object.entries(revenueByDate)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate total and average
    const total = chartData.reduce((sum, item) => sum + item.amount, 0);
    const average = chartData.length > 0 ? total / chartData.length : 0;

    return Response.json({
      chartData,
      total,
      average,
      transactionCount: paymentIntents.data.filter(p => p.status === 'succeeded').length
    });

  } catch (error) {
    console.error('Stripe revenue fetch error:', error);
    return Response.json({ 
      error: error.message || 'Failed to fetch revenue data' 
    }, { status: 500 });
  }
});