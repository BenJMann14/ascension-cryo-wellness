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

    // Prepare event details - ensure proper date parsing
    // appointment_date is in YYYY-MM-DD format, appointment_time is in HH:MM format
    const appointmentDateTime = new Date(booking.appointment_date + 'T' + booking.appointment_time + ':00');
    
    if (isNaN(appointmentDateTime.getTime())) {
      console.error('Invalid date/time:', booking.appointment_date, booking.appointment_time);
      throw new Error('Invalid appointment date or time');
    }
    
    const endDateTime = new Date(appointmentDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + (booking.estimated_duration || 60));

    // Build description with services and special requests
    const servicesList = booking.services_selected
      ?.map(s => `- ${s.service_name} ($${s.price})`)
      .join('\n') || '';
    
    const description = `
📍 SERVICE ADDRESS:
${booking.service_address}
${booking.service_city}, ${booking.service_zip}

👤 CUSTOMER:
${booking.customer_first_name} ${booking.customer_last_name}
📧 ${booking.customer_email}
📱 ${booking.customer_phone}

💆 SERVICES:
${servicesList}

💵 TOTAL: $${booking.total_amount}
⏱️ DURATION: ${booking.estimated_duration || 60} minutes

${booking.special_requests ? `📝 SPECIAL REQUESTS:\n${booking.special_requests}\n` : ''}
✅ CONFIRMATION: ${booking.confirmation_number}
    `.trim();

    // Build service names for summary
    const serviceNames = booking.services_selected
      ?.map(s => s.service_name)
      .join(', ') || 'Mobile Recovery';

    // Create calendar event
    const event = {
      summary: `${booking.customer_first_name} ${booking.customer_last_name} - ${serviceNames}`,
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
      },
      colorId: '9' // Set color to blue for easy visibility
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