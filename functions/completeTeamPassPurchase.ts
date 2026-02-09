import Stripe from 'npm:stripe';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

function generateRedemptionCode(lastName) {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `${lastName.toUpperCase()}-${randomDigits}`;
}

async function sendConfirmationEmail(base44, passData) {
  const emailHTML = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 900;">TEAM PASS CONFIRMED! 🎉</h1>
      </div>
      
      <div style="background: #f9fafb; padding: 40px 20px;">
        <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 4px solid #1e293b; margin-bottom: 30px;">
          <h2 style="text-align: center; color: #1e293b; margin-top: 0; font-size: 24px;">Your Redemption Code</h2>
          <div style="text-align: center; background: #fef3c7; padding: 30px; border-radius: 12px; margin: 20px 0; border: 3px solid #eab308;">
            <div style="font-size: 48px; font-weight: 900; color: #1e293b; letter-spacing: 2px;">
              ${passData.redemption_code}
            </div>
          </div>
          <div style="text-align: center; font-size: 20px; color: #ec4899; font-weight: bold; margin: 20px 0;">
            ${passData.total_passes} Passes Available
          </div>
        </div>

        <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h3 style="color: #1e293b; margin-top: 0;">How to Use Your Passes:</h3>
          <ol style="color: #64748b; line-height: 1.8; padding-left: 20px;">
            <li><strong>Find our booth</strong> at the volleyball tournament</li>
            <li><strong>Show this code</strong> or just say your last name</li>
            <li><strong>We'll redeem a pass</strong> and get you recovering quickly</li>
          </ol>
          
          <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #3b82f6;">
            <p style="margin: 0; color: #1e40af; font-weight: 600;">💡 Pro Tip: Screenshot this email or save the code in your phone!</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
            <p style="color: #64748b; margin: 5px 0;"><strong>Passes can be shared</strong> among teammates and family members</p>
            <p style="color: #64748b; margin: 5px 0;"><strong>Valid for</strong> the tournament weekend</p>
            <p style="color: #64748b; margin: 5px 0;"><strong>Any service combination</strong> allowed</p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #64748b; font-size: 14px;">
          <p>Questions? Just ask at the booth!</p>
        </div>
      </div>
    </div>
  `;

  await base44.integrations.Core.SendEmail({
    to: passData.customer_email,
    subject: `Your Team Pass Code: ${passData.redemption_code}`,
    body: emailHTML
  });
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { sessionId } = await req.json();
    
    console.log('Processing team pass purchase for session:', sessionId);
    
    // Check if we already processed this session
    const existingPass = await base44.asServiceRole.entities.TeamPass.filter({ 
      stripe_session_id: sessionId 
    });
    
    if (existingPass.length > 0) {
      console.log('Team pass already exists for this session');
      return Response.json({ 
        success: true, 
        teamPass: existingPass[0] 
      });
    }
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('Stripe session retrieved:', session.payment_status);
    
    if (session.payment_status !== 'paid') {
      console.error('Payment not completed:', session.payment_status);
      return Response.json({ error: 'Payment not completed' }, { status: 400 });
    }

    const metadata = session.metadata;
    console.log('Metadata:', metadata);
    
    const lastName = metadata.customer_last_name;
    
    // Generate unique redemption code
    let redemptionCode = generateRedemptionCode(lastName);
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      const existing = await base44.asServiceRole.entities.TeamPass.filter({ 
        redemption_code: redemptionCode 
      });
      
      if (existing.length === 0) {
        isUnique = true;
      } else {
        redemptionCode = generateRedemptionCode(lastName);
        attempts++;
      }
    }

    const totalPasses = parseInt(metadata.total_passes);
    console.log('Creating team pass with', totalPasses, 'passes');
    
    // Generate individual tickets
    const individualTickets = Array.from({ length: totalPasses }, (_, i) => ({
      ticket_id: `${redemptionCode}-T${i + 1}-${Date.now()}`,
      ticket_number: i + 1,
      is_used: false,
      used_at: null,
      used_by: null,
      service_type: null
    }));
    
    const teamPass = await base44.asServiceRole.entities.TeamPass.create({
      redemption_code: redemptionCode,
      customer_first_name: metadata.customer_first_name,
      customer_last_name: metadata.customer_last_name,
      customer_email: session.customer_email,
      customer_phone: metadata.customer_phone || '',
      total_passes: totalPasses,
      remaining_passes: totalPasses,
      payment_status: 'paid',
      stripe_session_id: sessionId,
      stripe_payment_intent_id: session.payment_intent,
      purchase_amount: session.amount_total / 100,
      individual_tickets: individualTickets,
      redemption_history: []
    });

    console.log('Team pass created successfully:', teamPass.id);

    // Send confirmation email
    try {
      await sendConfirmationEmail(base44, teamPass);
      console.log('Confirmation email sent');
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the whole transaction if email fails
    }

    return Response.json({ 
      success: true, 
      teamPass 
    });
  } catch (error) {
    console.error('Error completing team pass purchase:', error);
    console.error('Error stack:', error.stack);
    return Response.json({ error: error.message }, { status: 500 });
  }
});