import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify admin user
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchQuery } = await req.json();
    
    if (!searchQuery || searchQuery.trim().length < 2) {
      return Response.json({ results: [] });
    }

    const query = searchQuery.trim().toUpperCase();
    
    // Get all team passes and filter client-side for flexibility
    const allPasses = await base44.asServiceRole.entities.TeamPass.filter({
      payment_status: 'paid'
    }, '-created_date', 100);

    // Filter by redemption code or last name
    const results = allPasses.filter(pass => {
      return pass.redemption_code.includes(query) || 
             pass.customer_last_name.toUpperCase().includes(query) ||
             pass.customer_first_name.toUpperCase().includes(query);
    });

    return Response.json({ results });
  } catch (error) {
    console.error('Error searching team passes:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});