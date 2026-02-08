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
                
                console.log('Processing event:', event.summary, {
                    start: eventStart.toISOString(),
                    end: eventEnd.toISOString(),
                    rawStart: event.start,
                    rawEnd: event.end
                });
                
                // If all-day event or multi-day event
                if (!event.start.dateTime || (eventEnd - eventStart) >= 86400000) {
                    const currentDate = new Date(eventStart);
                    while (currentDate <= eventEnd) {
                        const dateKey = currentDate.toISOString().split('T')[0];
                        unavailableDates.add(dateKey);
                        console.log('Blocked all-day:', dateKey);
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                } else {
                    // Time-specific event - convert to America/Chicago timezone
                    const chicagoTimeStart = eventStart.toLocaleString('en-US', { timeZone: 'America/Chicago' });
                    const chicagoTimeEnd = eventEnd.toLocaleString('en-US', { timeZone: 'America/Chicago' });
                    
                    const localStart = new Date(chicagoTimeStart);
                    const localEnd = new Date(chicagoTimeEnd);
                    
                    const dateKey = localStart.toLocaleDateString('en-CA'); // YYYY-MM-DD format
                    if (!unavailableTimes[dateKey]) {
                        unavailableTimes[dateKey] = [];
                    }
                    
                    const startHour = localStart.getHours();
                    const startMin = localStart.getMinutes();
                    const endHour = localEnd.getHours();
                    const endMin = localEnd.getMinutes();
                    
                    console.log('Event time in Chicago:', {
                        dateKey,
                        startHour,
                        startMin,
                        endHour,
                        endMin
                    });
                    
                    // Block all 30-minute slots that overlap with the event
                    const eventStartMin = startHour * 60 + startMin;
                    const eventEndMin = endHour * 60 + endMin;
                    
                    // Start from 8:00 AM and check each 30-min slot until 6:00 PM
                    for (let slotHour = 8; slotHour <= 18; slotHour++) {
                        for (let slotMin = 0; slotMin < 60; slotMin += 30) {
                            if (slotHour === 18 && slotMin > 0) break; // Stop at 6:00 PM
                            
                            const slotStartMin = slotHour * 60 + slotMin;
                            const slotEndMin = slotStartMin + 30;
                            
                            // Check if this slot overlaps with the event
                            if (slotStartMin < eventEndMin && slotEndMin > eventStartMin) {
                                const timeSlot = `${slotHour.toString().padStart(2, '0')}:${slotMin.toString().padStart(2, '0')}`;
                                if (!unavailableTimes[dateKey].includes(timeSlot)) {
                                    unavailableTimes[dateKey].push(timeSlot);
                                    console.log('Blocked time slot:', dateKey, timeSlot);
                                }
                            }
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

        console.log('Final blocked dates:', Array.from(unavailableDates));
        console.log('Final blocked times:', unavailableTimes);

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