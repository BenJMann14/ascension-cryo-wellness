import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { secretKey, publishableKey } = await req.json();

    if (!secretKey || !publishableKey) {
      return Response.json({ error: 'Both keys are required' }, { status: 400 });
    }

    // Save to Settings entity for self-hosting
    const existingSecretKey = await base44.asServiceRole.entities.Settings.filter({ 
      setting_key: 'STRIPE_SECRET_KEY' 
    });
    const existingPublishableKey = await base44.asServiceRole.entities.Settings.filter({ 
      setting_key: 'STRIPE_PUBLISHABLE_KEY' 
    });

    if (existingSecretKey.length > 0) {
      await base44.asServiceRole.entities.Settings.update(existingSecretKey[0].id, {
        setting_value: secretKey
      });
    } else {
      await base44.asServiceRole.entities.Settings.create({
        setting_key: 'STRIPE_SECRET_KEY',
        setting_value: secretKey,
        setting_type: 'string'
      });
    }

    if (existingPublishableKey.length > 0) {
      await base44.asServiceRole.entities.Settings.update(existingPublishableKey[0].id, {
        setting_value: publishableKey
      });
    } else {
      await base44.asServiceRole.entities.Settings.create({
        setting_key: 'STRIPE_PUBLISHABLE_KEY',
        setting_value: publishableKey,
        setting_type: 'string'
      });
    }

    return Response.json({ 
      success: true,
      message: 'Stripe keys saved successfully'
    });

  } catch (error) {
    console.error('Update Stripe keys error:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});