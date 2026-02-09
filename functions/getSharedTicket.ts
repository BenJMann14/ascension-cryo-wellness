import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { passId, ticketId } = await req.json();

    // Fetch team pass
    const teamPass = await base44.asServiceRole.entities.TeamPass.get(passId);

    if (!teamPass) {
      return Response.json({ error: 'Pass not found' }, { status: 404 });
    }

    // Find the specific ticket
    const ticket = teamPass.individual_tickets?.find(t => t.ticket_id === ticketId);

    if (!ticket) {
      return Response.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return Response.json({
      success: true,
      ticket,
      teamPass
    });
  } catch (error) {
    console.error('Error fetching shared ticket:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});