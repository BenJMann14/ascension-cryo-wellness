import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Try to get the calendar access token
    const accessToken = await base44.asServiceRole.connectors.getAccessToken('googlecalendar');
    
    if (!accessToken) {
      return Response.json({ 
        success: false, 
        error: 'No calendar connection found' 
      });
    }

    // Test the connection by fetching calendar list
    const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      return Response.json({ 
        success: false, 
        error: 'Failed to connect to Google Calendar' 
      });
    }

    const data = await response.json();
    
    return Response.json({ 
      success: true,
      calendars: data.items?.length || 0
    });

  } catch (error) {
    console.error('Calendar test error:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});