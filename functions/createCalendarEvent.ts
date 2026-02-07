import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return Response.json({ error: 'Booking ID required' }, { status: 400 });
    }

    // Fetch booking details
    const bookings = await base44.asServiceRole.entities.Booking.filter({ id: bookingId });
    
    if (!bookings || bookings.length === 0) {
      return Response.json({ error: 'Booking not found' }, { status: 404 });
    }

    const booking = bookings[0];

    // Get Google Calendar access token
    const accessToken = await base44.asServiceRole.connectors.getAccessToken('googlecalendar');

    // Prepare event details
    const appointmentDateTime = new Date(booking.appointment_date + 'T' + booking.appointment_time);
    const endDateTime = new Date(appointmentDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + (booking.estimated_duration || 60));

    // Build description with services and special requests
    const servicesList = booking.services_selected
      ?.map(s => `- ${s.service_name} ($${s.price})`)
      .join('\n') || '';
    
    const description = `
Customer: ${booking.customer_first_name} ${booking.customer_last_name}
Email: ${booking.customer_email}
Phone: ${booking.customer_phone}

Services:
${servicesList}

Total: $${booking.total_amount}

${booking.special_requests ? `Special Requests:\n${booking.special_requests}` : ''}

Confirmation: ${booking.confirmation_number}
    `.trim();

    // Create calendar event
    const event = {
      summary: `Ascension Cryo - ${booking.customer_first_name} ${booking.customer_last_name}`,
      location: `${booking.service_address}, ${booking.service_city}, ${booking.service_zip}`,
      description: description,
      start: {
        dateTime: appointmentDateTime.toISOString(),
        timeZone: 'America/Chicago'
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'America/Chicago'
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 60 },
          { method: 'popup', minutes: 30 }
        ]
      }
    };

    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Google Calendar API error:', error);
      throw new Error(`Failed to create calendar event: ${error}`);
    }

    const calendarEvent = await response.json();
    console.log('Calendar event created:', calendarEvent.id);

    return Response.json({ 
      success: true,
      eventId: calendarEvent.id,
      eventLink: calendarEvent.htmlLink
    });

  } catch (error) {
    console.error('Error creating calendar event:', error);
    return Response.json({ 
      error: error.message || 'Failed to create calendar event' 
    }, { status: 500 });
  }
});