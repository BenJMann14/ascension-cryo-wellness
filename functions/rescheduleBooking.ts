import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { bookingId, newDate, newTime } = await req.json();

    // Fetch the booking
    const booking = await base44.entities.Booking.get(bookingId);

    // Verify booking exists
    if (!booking) {
      return Response.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check if booking is cancelled or completed
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return Response.json({ error: 'Cannot reschedule cancelled or completed booking' }, { status: 400 });
    }

    // Check 24-hour policy for current appointment
    const currentAppointmentDateTime = new Date(`${booking.appointment_date}T${booking.appointment_time}`);
    const now = new Date();
    const hoursUntilCurrentAppointment = (currentAppointmentDateTime - now) / (1000 * 60 * 60);

    if (hoursUntilCurrentAppointment < 24) {
      return Response.json({ 
        error: 'Cannot reschedule within 24 hours of current appointment',
        canReschedule: false,
        hoursUntilAppointment: Math.round(hoursUntilCurrentAppointment)
      }, { status: 400 });
    }

    // Update booking with new date/time
    await base44.entities.Booking.update(bookingId, {
      appointment_date: newDate,
      appointment_time: newTime
    });

    // Update Google Calendar event
    try {
      const [year, month, day] = newDate.split('-').map(Number);
      const [hours, minutes] = newTime.split(':').map(Number);
      
      const newDateTime = new Date(year, month - 1, day, hours, minutes);
      const endDateTime = new Date(newDateTime);
      endDateTime.setHours(endDateTime.getHours() + 1); // 1 hour duration
      
      await base44.functions.invoke('createCalendarEvent', {
        title: `Ascension Cryo & Wellness - ${booking.services_selected?.[0]?.service_name || 'Service'}`,
        description: `Booking: ${booking.confirmation_number}\nCustomer: ${booking.customer_first_name} ${booking.customer_last_name}`,
        startTime: newDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        customerEmail: booking.customer_email,
        isReschedule: true,
        originalDate: booking.appointment_date,
        originalTime: booking.appointment_time
      });
    } catch (calendarError) {
      console.error('Failed to update calendar:', calendarError);
      // Don't fail the booking reschedule if calendar update fails
    }

    return Response.json({ 
      success: true,
      message: 'Booking rescheduled successfully'
    });

  } catch (error) {
    console.error('Reschedule booking error:', error);
    return Response.json({ 
      error: error.message || 'Failed to reschedule booking' 
    }, { status: 500 });
  }
});