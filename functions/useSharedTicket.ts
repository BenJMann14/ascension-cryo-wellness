import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { passId, ticketId, serviceType } = await req.json();

    // Fetch team pass
    const teamPass = await base44.asServiceRole.entities.TeamPass.get(passId);

    if (!teamPass) {
      return Response.json({ error: 'Pass not found' }, { status: 404 });
    }

    // Find the specific ticket
    const ticketIndex = teamPass.individual_tickets.findIndex(t => t.ticket_id === ticketId);

    if (ticketIndex === -1) {
      return Response.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const ticket = teamPass.individual_tickets[ticketIndex];

    if (ticket.is_used) {
      return Response.json({ error: 'Ticket already used' }, { status: 400 });
    }

    if (teamPass.remaining_passes <= 0) {
      return Response.json({ error: 'No passes remaining' }, { status: 400 });
    }

    // Mark ticket as used
    const updatedTickets = [...teamPass.individual_tickets];
    updatedTickets[ticketIndex] = {
      ...ticket,
      is_used: true,
      used_at: new Date().toISOString(),
      service_type: serviceType
    };

    // Update redemption history
    const updatedHistory = [
      ...(teamPass.redemption_history || []),
      {
        redeemed_at: new Date().toISOString(),
        redeemed_by: ticketId,
        service_type: serviceType
      }
    ];

    // Update team pass
    const updatedPass = await base44.asServiceRole.entities.TeamPass.update(passId, {
      individual_tickets: updatedTickets,
      redemption_history: updatedHistory,
      remaining_passes: teamPass.remaining_passes - 1
    });

    return Response.json({
      success: true,
      ticket: updatedTickets[ticketIndex],
      teamPass: updatedPass
    });
  } catch (error) {
    console.error('Error using shared ticket:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});