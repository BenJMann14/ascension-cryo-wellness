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

    const { entityType, entityId } = await req.json();

    let entity;
    let paymentIntentId;
    let refundAmount;

    // Fetch the entity and get payment intent
    if (entityType === 'Booking') {
      entity = await base44.asServiceRole.entities.Booking.get(entityId);
      paymentIntentId = entity.payment_intent_id;
      refundAmount = entity.total_amount;
    } else if (entityType === 'TeamPass') {
      entity = await base44.asServiceRole.entities.TeamPass.get(entityId);
      paymentIntentId = entity.stripe_payment_intent_id;
      refundAmount = entity.purchase_amount;
    } else if (entityType === 'IndividualService') {
      entity = await base44.asServiceRole.entities.IndividualService.get(entityId);
      // Get payment intent from stripe session
      const session = await stripe.checkout.sessions.retrieve(entity.stripe_session_id);
      paymentIntentId = session.payment_intent;
      refundAmount = entity.price;
    } else {
      return Response.json({ error: 'Invalid entity type' }, { status: 400 });
    }

    if (!paymentIntentId) {
      return Response.json({ error: 'No payment intent found' }, { status: 400 });
    }

    // Process refund with Stripe
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: Math.round(refundAmount * 100), // Convert to cents
    });

    // Update entity status
    if (entityType === 'Booking') {
      await base44.asServiceRole.entities.Booking.update(entityId, {
        status: 'cancelled',
        payment_status: 'refunded'
      });
    } else if (entityType === 'TeamPass') {
      await base44.asServiceRole.entities.TeamPass.update(entityId, {
        payment_status: 'refunded'
      });
    } else if (entityType === 'IndividualService') {
      await base44.asServiceRole.entities.IndividualService.update(entityId, {
        payment_status: 'refunded'
      });
    }

    return Response.json({ 
      success: true, 
      refund: {
        id: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      }
    });

  } catch (error) {
    console.error('Refund error:', error);
    return Response.json({ 
      error: error.message || 'Failed to process refund' 
    }, { status: 500 });
  }
});