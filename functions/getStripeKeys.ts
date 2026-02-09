import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Try to get from Settings entity first (self-hosted)
    const secretKeySettings = await base44.asServiceRole.entities.Settings.filter({ 
      setting_key: 'STRIPE_SECRET_KEY' 
    });
    const publishableKeySettings = await base44.asServiceRole.entities.Settings.filter({ 
      setting_key: 'STRIPE_PUBLISHABLE_KEY' 
    });

    const secretKey = secretKeySettings.length > 0 
      ? secretKeySettings[0].setting_value 
      : Deno.env.get('STRIPE_SECRET_KEY') || '';
    
    const publishableKey = publishableKeySettings.length > 0 
      ? publishableKeySettings[0].setting_value 
      : Deno.env.get('STRIPE_PUBLISHABLE_KEY') || '';

    // Mask the keys for display (show last 4 chars)
    const maskedSecretKey = secretKey ? `sk_...${secretKey.slice(-4)}` : '';
    const maskedPublishableKey = publishableKey ? `pk_...${publishableKey.slice(-4)}` : '';

    return Response.json({ 
      success: true,
      secretKey: maskedSecretKey,
      publishableKey: maskedPublishableKey,
      hasKeys: !!(secretKey && publishableKey)
    });

  } catch (error) {
    console.error('Get Stripe keys error:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});