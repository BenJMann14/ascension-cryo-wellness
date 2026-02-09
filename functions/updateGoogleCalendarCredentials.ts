import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { clientId, clientSecret, refreshToken } = await req.json();

    if (!clientId || !clientSecret || !refreshToken) {
      return Response.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Save to Settings entity for self-hosting
    const credentials = {
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken
    };

    const existing = await base44.asServiceRole.entities.Settings.filter({ 
      setting_key: 'GOOGLE_CALENDAR_CREDENTIALS' 
    });

    if (existing.length > 0) {
      await base44.asServiceRole.entities.Settings.update(existing[0].id, {
        setting_value: JSON.stringify(credentials)
      });
    } else {
      await base44.asServiceRole.entities.Settings.create({
        setting_key: 'GOOGLE_CALENDAR_CREDENTIALS',
        setting_value: JSON.stringify(credentials),
        setting_type: 'json'
      });
    }

    return Response.json({ 
      success: true,
      message: 'Google Calendar credentials saved successfully'
    });

  } catch (error) {
    console.error('Update Google Calendar credentials error:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});