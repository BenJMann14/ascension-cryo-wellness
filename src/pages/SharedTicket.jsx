import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Ticket, CheckCircle2, XCircle, Loader2, Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import confetti from 'canvas-confetti';

export default function SharedTicket() {
  const [ticket, setTicket] = useState(null);
  const [teamPass, setTeamPass] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRedeemDialog, setShowRedeemDialog] = useState(false);
  const [serviceType, setServiceType] = useState('Cryo Therapy');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ticketId = urlParams.get('ticket');
    const passId = urlParams.get('pass');

    if (ticketId && passId) {
      fetchTicketData(passId, ticketId);
    }
  }, []);

  const fetchTicketData = async (passId, ticketId) => {
    try {
      const response = await base44.functions.invoke('getSharedTicket', { 
        passId, 
        ticketId 
      });
      
      if (response.data.ticket && response.data.teamPass) {
        setTicket(response.data.ticket);
        setTeamPass(response.data.teamPass);
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseTicket = async () => {
    setIsRedeeming(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const response = await base44.functions.invoke('useSharedTicket', {
        passId: urlParams.get('pass'),
        ticketId: urlParams.get('ticket'),
        serviceType
      });

      if (response.data.success) {
        setTicket(response.data.ticket);
        setTeamPass(response.data.teamPass);
        setShowRedeemDialog(false);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (error) {
      console.error('Error using ticket:', error);
      alert('Failed to use ticket. Please try again.');
    } finally {
      setIsRedeeming(false);
    }
  };

  const shareTicket = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Recovery Pass #${ticket.ticket_number}`,
          text: `Your recovery pass from ${teamPass.customer_first_name}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-pink-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-bold">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticket || !teamPass) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Ticket Not Found</h1>
          <p className="text-slate-600">This ticket link is invalid or expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl shadow-2xl relative overflow-hidden`}
        >
          {/* Used Stamp */}
          {ticket.is_used && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="bg-red-500 text-white font-black text-5xl px-12 py-6 rotate-12 rounded-xl shadow-2xl border-4 border-red-700">
                USED ✓
              </div>
            </div>
          )}

          <div className={ticket.is_used ? 'blur-sm' : ''}>
            {/* Logo Header */}
            <div className="bg-white rounded-t-3xl pt-8 pb-6 px-8 text-center border-b-4 border-slate-200">
              <div className="w-40 h-40 mx-auto mb-6 flex items-center justify-center bg-white rounded-full border-8 border-slate-300 shadow-lg">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697aae0c4062dd0f1716e345/9b621d955_AscensionCryoWellness_Logo1.jpg" 
                  alt="Ascension Logo" 
                  className="w-32 h-32 object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">
                Ascension Cryo & Wellness
              </h1>
              <p className="text-slate-600 text-sm font-medium">
                ascensioncryo.base44.app
              </p>
            </div>

            {/* Pass Info */}
            <div className="p-8 text-center">
              <p className="text-lg font-bold text-slate-700 mb-3">
                Recovery Pass #{ticket.ticket_number}
              </p>
              <p className="text-slate-600 text-sm mb-6">
                From: {teamPass.customer_first_name}
              </p>
            </div>

            {/* Redemption Code */}
            <div className="mx-8 mb-6">
              <div className="bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-2xl p-6 border-4 border-yellow-500 shadow-lg">
                <p className="text-sm font-bold text-slate-700 mb-2 text-center">Redemption Code</p>
                <p className="text-4xl font-black text-slate-900 tracking-wider text-center">
                  {teamPass.redemption_code}
                </p>
              </div>
            </div>

            {/* Services Included */}
            <div className="mx-8 mb-6">
              <div className="bg-white rounded-xl p-4 border-2 border-slate-300 shadow">
                <p className="font-bold text-slate-900 mb-3 text-sm">✓ Services Included:</p>
                <div className="space-y-2 text-sm text-slate-700">
                  <p>✓ Cryo Therapy</p>
                  <p>✓ Compression Boots</p>
                </div>
              </div>
            </div>

            {/* Usage Info */}
            <div className="px-8 pb-8">
              {ticket.is_used ? (
                <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
                  <p className="text-sm font-bold text-red-800 mb-2 text-center">
                    <CheckCircle2 className="w-4 h-4 inline mr-1" />
                    Used
                  </p>
                  <p className="text-xs text-slate-600 text-center">
                    Service: {ticket.service_type}
                  </p>
                  {ticket.used_at && (
                    <p className="text-xs text-slate-600 text-center">
                      {new Date(ticket.used_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <Button
                    onClick={shareTicket}
                    variant="outline"
                    className="w-full font-bold border-2 mb-3"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    {copied ? 'Link Copied!' : 'Share Ticket'}
                  </Button>
                  <Button
                    onClick={() => setShowRedeemDialog(true)}
                    className="w-full bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-400 hover:to-fuchsia-500 text-white font-black text-lg py-6"
                  >
                    View Ticket
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-6 text-center text-slate-600 text-sm">
          <p className="font-bold">Valid for tournament weekend</p>
          <p>Show this screen at the recovery booth</p>
        </div>
      </div>

      {/* Use Ticket Dialog */}
      <Dialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Use This Pass</DialogTitle>
            <DialogDescription>
              Mark this pass as used. This cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-300">
              <p className="text-sm font-bold text-slate-900 mb-2">⚠️ Confirm Your Service</p>
              <p className="text-xs text-slate-600">
                Make sure you're about to receive the service before confirming
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
                <option value="Red Light Therapy">Red Light Therapy</option>
                <option value="Vibration Plate">Vibration Plate</option>
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
                onClick={handleUseTicket}
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