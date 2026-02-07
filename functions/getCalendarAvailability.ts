import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { startDate, endDate } = await req.json();

        // Get Google Calendar access token
        const accessToken = await base44.asServiceRole.connectors.getAccessToken("googlecalendar");

        // Fetch events from Google Calendar
        const calendarResponse = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
            `timeMin=${new Date(startDate).toISOString()}&` +
            `timeMax=${new Date(endDate).toISOString()}&` +
            `singleEvents=true&orderBy=startTime`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!calendarResponse.ok) {
            const error = await calendarResponse.text();
            console.error('Google Calendar API error:', error);
            return Response.json({ 
                error: 'Failed to fetch calendar events',
                details: error 
            }, { status: calendarResponse.status });
        }

        const calendarData = await calendarResponse.json();
        
        // Also fetch CalendarBlock entities
        const calendarBlocks = await base44.asServiceRole.entities.CalendarBlock.list();

        // Process Google Calendar events into unavailable dates and times
        const unavailableDates = new Set();
        const unavailableTimes = {};

        // Process Google Calendar events
        if (calendarData.items) {
            for (const event of calendarData.items) {
                if (!event.start) continue;

                const eventStart = event.start.dateTime ? new Date(event.start.dateTime) : new Date(event.start.date);
                const eventEnd = event.end.dateTime ? new Date(event.end.dateTime) : new Date(event.end.date);
                
                // If all-day event or multi-day event
                if (!event.start.dateTime || (eventEnd - eventStart) >= 86400000) {
                    const currentDate = new Date(eventStart);
                    while (currentDate <= eventEnd) {
                        unavailableDates.add(currentDate.toISOString().split('T')[0]);
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                } else {
                    // Time-specific event - block ALL overlapping time slots
                    const dateKey = eventStart.toISOString().split('T')[0];
                    if (!unavailableTimes[dateKey]) {
                        unavailableTimes[dateKey] = [];
                    }
                    
                    // Convert to local time (America/Chicago)
                    const startHour = eventStart.getHours();
                    const startMin = eventStart.getMinutes();
                    const endHour = eventEnd.getHours();
                    const endMin = eventEnd.getMinutes();
                    
                    // Block any 30-minute slot that overlaps with the event
                    // Start from the 30-min slot that contains or precedes the event start
                    let slotHour = Math.floor(startHour);
                    let slotMin = startMin < 30 ? 0 : 30;
                    
                    // If event starts after slot start, still block that slot
                    // Continue until we've blocked all slots that overlap with the event
                    while (slotHour < endHour || (slotHour === endHour && slotMin < endMin)) {
                        const timeSlot = `${slotHour.toString().padStart(2, '0')}:${slotMin.toString().padStart(2, '0')}`;
                        
                        // Check if this time slot overlaps with the event
                        const slotStart = slotHour * 60 + slotMin;
                        const slotEnd = slotStart + 30;
                        const eventStartMin = startHour * 60 + startMin;
                        const eventEndMin = endHour * 60 + endMin;
                        
                        // If there's any overlap, block the slot
                        if (slotStart < eventEndMin && slotEnd > eventStartMin) {
                            unavailableTimes[dateKey].push(timeSlot);
                        }
                        
                        slotMin += 30;
                        if (slotMin >= 60) {
                            slotMin = 0;
                            slotHour++;
                        }
                    }
                    
                    // Also block the slot that contains the end time
                    if (endMin > 0) {
                        const endSlotHour = endHour;
                        const endSlotMin = endMin <= 30 ? 0 : 30;
                        const endTimeSlot = `${endSlotHour.toString().padStart(2, '0')}:${endSlotMin.toString().padStart(2, '0')}`;
                        if (!unavailableTimes[dateKey].includes(endTimeSlot)) {
                            unavailableTimes[dateKey].push(endTimeSlot);
                        }
                    }
                }
            }
        }

        // Process CalendarBlock entities
        for (const block of calendarBlocks) {
            const blockDate = new Date(block.block_date);
            const dateKey = blockDate.toISOString().split('T')[0];

            if (block.is_all_day) {
                unavailableDates.add(dateKey);
            } else if (block.start_time && block.end_time) {
                if (!unavailableTimes[dateKey]) {
                    unavailableTimes[dateKey] = [];
                }

                // Parse start and end times
                const [startHour, startMin] = block.start_time.split(':').map(Number);
                const [endHour, endMin] = block.end_time.split(':').map(Number);

                // Generate blocked time slots
                let currentHour = startHour;
                let currentMin = startMin < 30 ? 0 : 30;
                
                while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
                    const timeSlot = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
                    unavailableTimes[dateKey].push(timeSlot);
                    
                    currentMin += 30;
                    if (currentMin >= 60) {
                        currentMin = 0;
                        currentHour++;
                    }
                }
            }
        }

        return Response.json({
            unavailableDates: Array.from(unavailableDates),
            unavailableTimes
        });

    } catch (error) {
        console.error('Error fetching calendar availability:', error);
        return Response.json({ 
            error: error.message,
            unavailableDates: [],
            unavailableTimes: {}
        }, { status: 500 });
    }
});