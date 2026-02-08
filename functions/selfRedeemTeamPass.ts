import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const { passId, serviceType } = await req.json();

    if (!passId || !serviceType) {
      return Response.json({ error: 'Pass ID and service type required' }, { status: 400 });
    }

    // Fetch the team pass
    const teamPass = await base44.asServiceRole.entities.TeamPass.get(passId);

    if (!teamPass) {
      return Response.json({ error: 'Team pass not found' }, { status: 404 });
    }

    if (teamPass.remaining_passes <= 0) {
      return Response.json({ error: 'No passes remaining' }, { status: 400 });
    }

    // Create redemption record
    const redemption = {
      redeemed_at: new Date().toISOString(),
      redeemed_by: 'Self-redeemed',
      service_type: serviceType
    };

    // Update the team pass
    const updatedPass = await base44.asServiceRole.entities.TeamPass.update(passId, {
      remaining_passes: teamPass.remaining_passes - 1,
      redemption_history: [...(teamPass.redemption_history || []), redemption]
    });

    return Response.json({ success: true, teamPass: updatedPass });
  } catch (error) {
    console.error('Self-redemption error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});