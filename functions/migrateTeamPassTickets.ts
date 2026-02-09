import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get all team passes
    const teamPasses = await base44.asServiceRole.entities.TeamPass.list();
    
    let migratedCount = 0;
    
    for (const pass of teamPasses) {
      // Check if this pass needs migration (no individual_tickets or empty array)
      if (!pass.individual_tickets || pass.individual_tickets.length === 0) {
        console.log(`Migrating team pass ${pass.id} - ${pass.redemption_code}`);
        
        // Generate individual tickets based on total_passes
        const individualTickets = [];
        const usedCount = pass.total_passes - pass.remaining_passes;
        
        for (let i = 1; i <= pass.total_passes; i++) {
          individualTickets.push({
            ticket_id: `${pass.redemption_code}-T${i}-${Date.now()}`,
            ticket_number: i,
            is_used: i <= usedCount, // Mark first N tickets as used if already redeemed
            used_at: i <= usedCount ? new Date().toISOString() : null,
            used_by: i <= usedCount ? 'system_migration' : null,
            service_type: i <= usedCount ? 'Previously redeemed' : null
          });
        }
        
        await base44.asServiceRole.entities.TeamPass.update(pass.id, {
          individual_tickets: individualTickets
        });
        
        migratedCount++;
      }
    }
    
    return Response.json({ 
      success: true, 
      message: `Migrated ${migratedCount} team passes`,
      total: teamPasses.length
    });
    
  } catch (error) {
    console.error('Migration error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});