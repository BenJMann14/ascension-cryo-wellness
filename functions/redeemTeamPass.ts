import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify admin user
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { passId, serviceType } = await req.json();
    
    const teamPass = await base44.asServiceRole.entities.TeamPass.get(passId);
    
    if (!teamPass) {
      return Response.json({ error: 'Team pass not found' }, { status: 404 });
    }

    if (teamPass.remaining_passes <= 0) {
      return Response.json({ error: 'No passes remaining' }, { status: 400 });
    }

    const redemption = {
      redeemed_at: new Date().toISOString(),
      redeemed_by: user.email,
      service_type: serviceType || 'General Recovery'
    };

    const updatedHistory = [...(teamPass.redemption_history || []), redemption];

    const updated = await base44.asServiceRole.entities.TeamPass.update(passId, {
      remaining_passes: teamPass.remaining_passes - 1,
      redemption_history: updatedHistory
    });

    return Response.json({ 
      success: true,
      teamPass: updated
    });
  } catch (error) {
    console.error('Error redeeming team pass:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});