import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { CheckCircle2, Ticket, Copy, Check, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import confetti from 'canvas-confetti';

export default function TeamPassSuccess() {
  const [teamPass, setTeamPass] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showRedeemDialog, setShowRedeemDialog] = useState(false);
  const [serviceType, setServiceType] = useState('Cryo Therapy');
  const [isRedeeming, setIsRedeeming] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      fetchTeamPass(sessionId);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, []);

  const fetchTeamPass = async (sessionId) => {
    try {
      const response = await base44.functions.invoke('completeTeamPassPurchase', { sessionId });
      if (response.data.teamPass) {
        setTeamPass(response.data.teamPass);
      }
    } catch (error) {
      console.error('Error fetching team pass:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = () => {
    if (teamPass) {
      navigator.clipboard.writeText(teamPass.redemption_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSelfRedeem = async () => {
    setIsRedeeming(true);
    try {
      const response = await base44.functions.invoke('selfRedeemTeamPass', {
        passId: teamPass.id,
        serviceType
      });

      if (response.data.success) {
        setTeamPass(response.data.teamPass);
        setShowRedeemDialog(false);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (error) {
      console.error('Redemption error:', error);
      alert('Failed to redeem pass. Please try again.');
    } finally {
      setIsRedeeming(false);
    }
  };

  const sharePass = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Team Recovery Pass',
          text: `Redemption Code: ${teamPass.redemption_code}\n${teamPass.remaining_passes} passes remaining`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      copyCode();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold">Loading your passes...</p>
        </div>
      </div>
    );
  }

  if (!teamPass) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-slate-600">Unable to load pass information.</p>
          <Link to={createPageUrl('VolleyballRecovery')}>
            <Button className="mt-4">Return to Volleyball Recovery</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-fuchsia-600 to-pink-600 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
          >
            <CheckCircle2 className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-5xl font-black text-white mb-3">PASSES SECURED! 🎉</h1>
          <p className="text-2xl text-white/90 font-bold">
            {teamPass.total_passes} Recovery Passes for Your Team
          </p>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-slate-900 mb-8"
        >
          <div className="text-center mb-4">
            <h2 className="text-2xl font-black text-slate-900 mb-4">📲 Share With Your Team</h2>
            <p className="text-slate-700 font-medium mb-2">
              Each teammate can screenshot their individual ticket below
            </p>
            <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-300 inline-block">
              <p className="font-bold text-slate-900">
                Your Code: <span className="text-3xl font-black text-pink-600">{teamPass.redemption_code}</span>
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
              <p className="text-sm font-bold text-slate-900 mb-1">✅ To Use a Pass:</p>
              <p className="text-xs text-slate-700">Tap "Use Pass" button on any ticket below</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
              <p className="text-sm font-bold text-slate-900 mb-1">📧 Email Sent!</p>
              <p className="text-xs text-slate-700">Check {teamPass.customer_email}</p>
            </div>
          </div>
        </motion.div>

        {/* Individual Tickets */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {teamPass.individual_tickets?.map((ticket) => {
            const isUsed = ticket.is_used;
            
            const shareUrl = `${window.location.origin}${createPageUrl('SharedTicket')}?pass=${teamPass.id}&ticket=${ticket.ticket_id}`;
            
            const shareTicket = async () => {
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: `Recovery Pass #${ticket.ticket_number}`,
                    text: `Here's your recovery pass from ${teamPass.customer_first_name}!`,
                    url: shareUrl
                  });
                } catch (error) {
                  console.log('Share cancelled');
                }
              } else {
                navigator.clipboard.writeText(shareUrl);
                setCopied(ticket.ticket_id);
                setTimeout(() => setCopied(false), 2000);
              }
            };

            return (
              <motion.div
                key={ticket.ticket_id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + ticket.ticket_number * 0.05 }}
                className={`bg-white rounded-2xl p-6 shadow-xl border-4 relative ${
                  isUsed ? 'border-slate-300 opacity-60' : 'border-slate-900'
                }`}
              >
                {isUsed && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="bg-red-500 text-white font-black text-4xl px-8 py-4 rotate-12 rounded-xl shadow-2xl">
                      USED ✓
                    </div>
                  </div>
                )}
                
                <div className={isUsed ? 'blur-sm' : ''}>
                  <div className="text-center mb-4">
                    <div className="bg-gradient-to-br from-pink-500 to-fuchsia-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Ticket className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900">
                      Pass #{ticket.ticket_number}
                    </h3>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-xl p-4 mb-4 border-2 border-yellow-500">
                    <p className="text-xs font-bold text-slate-700 mb-1">Redemption Code</p>
                    <p className="text-2xl font-black text-slate-900 tracking-wider">
                      {teamPass.redemption_code}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 mb-4">
                    <p>✓ Cryo Therapy</p>
                    <p>✓ Compression Boots</p>
                  </div>

                  {!isUsed && (
                    <>
                      <Button
                        onClick={shareTicket}
                        variant="outline"
                        className="w-full font-bold border-2 mb-2"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        {copied === ticket.ticket_id ? 'Link Copied!' : 'Share Ticket'}
                      </Button>
                      <a 
                        href={shareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          className="w-full bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-400 hover:to-fuchsia-500 text-white font-black text-sm py-3"
                        >
                          Use Ticket
                        </Button>
                      </a>
                    </>
                  )}
                  
                  {isUsed && ticket.service_type && (
                    <div className="text-xs text-slate-600 text-center mt-2">
                      Used: {ticket.service_type}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center"
        >
          <p className="text-white font-bold mb-4">
            ✓ Each teammate gets their own ticket<br/>
            ✓ Screenshot and share the tickets above<br/>
            ✓ Valid for tournament weekend
          </p>
          <Link to={createPageUrl('VolleyballRecovery')}>
            <Button variant="outline" className="bg-white hover:bg-slate-100 text-slate-900 font-black border-4 border-slate-900">
              Back to Tournament Info
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Self-Redeem Dialog */}
      <Dialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Use a Pass</DialogTitle>
            <DialogDescription>
              Mark one pass as used. This cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-300">
              <p className="text-sm font-bold text-slate-900 mb-2">⚠️ Confirm Your Service</p>
              <p className="text-xs text-slate-600">
                Make sure you're about to receive the service before confirming
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
              <p className="text-sm text-slate-600 mb-1">Passes Remaining</p>
              <p className="text-4xl font-black text-green-600">
                {teamPass?.remaining_passes} → {teamPass?.remaining_passes - 1}
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Service Type
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full p-3 border-2 border-slate-300 rounded-xl font-bold"
              >
                <option value="Cryo Therapy">Cryo Therapy</option>
                <option value="Compression Boots">Compression Boots</option>
              </select>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRedeemDialog(false)}
                className="flex-1 font-bold"
                disabled={isRedeeming}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSelfRedeem}
                disabled={isRedeeming}
                className="flex-1 bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-400 hover:to-fuchsia-500 text-white font-black"
              >
                {isRedeeming ? 'Using...' : 'Confirm Use'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}