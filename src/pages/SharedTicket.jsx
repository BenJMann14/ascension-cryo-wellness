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
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-fuchsia-600 to-pink-600 py-12 px-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white rounded-3xl p-8 shadow-2xl border-4 ${
            ticket.is_used ? 'border-slate-300' : 'border-slate-900'
          } relative overflow-hidden`}
        >
          {/* Used Stamp */}
          {ticket.is_used && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="bg-red-500 text-white font-black text-5xl px-12 py-6 rotate-12 rounded-xl shadow-2xl">
                USED ✓
              </div>
            </div>
          )}

          <div className={ticket.is_used ? 'blur-sm' : ''}>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="bg-gradient-to-br from-pink-500 to-fuchsia-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-2">
                Recovery Pass
              </h1>
              <p className="text-lg font-bold text-pink-600">
                Pass #{ticket.ticket_number}
              </p>
            </div>

            {/* Redemption Code */}
            <div className="bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-2xl p-6 mb-6 border-3 border-yellow-500">
              <p className="text-sm font-bold text-slate-700 mb-2">Redemption Code</p>
              <p className="text-4xl font-black text-slate-900 tracking-wider text-center">
                {teamPass.redemption_code}
              </p>
            </div>

            {/* Services Included */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6 border-2 border-slate-200">
              <p className="font-bold text-slate-900 mb-3">Services Included:</p>
              <div className="space-y-2 text-sm text-slate-700">
                <p>✓ Localized Cryotherapy</p>
                <p>✓ Compression Therapy</p>
                <p>✓ Red Light Therapy</p>
                <p>✓ Vibration Plate</p>
              </div>
            </div>

            {/* Pass Info */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6 border-2 border-blue-200">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xs text-slate-600 mb-1">From</p>
                  <p className="font-bold text-slate-900">
                    {teamPass.customer_first_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Remaining</p>
                  <p className="font-bold text-slate-900">
                    {teamPass.remaining_passes}/{teamPass.total_passes}
                  </p>
                </div>
              </div>
            </div>

            {/* Usage Info */}
            {ticket.is_used ? (
              <div className="bg-red-50 rounded-xl p-4 mb-6 border-2 border-red-200">
                <p className="text-sm font-bold text-red-800 mb-2">
                  <CheckCircle2 className="w-4 h-4 inline mr-1" />
                  Used
                </p>
                <p className="text-xs text-slate-600">
                  Service: {ticket.service_type}
                </p>
                {ticket.used_at && (
                  <p className="text-xs text-slate-600">
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
                  onClick={() => setShowRedeemDialog(true)}
                  className="w-full bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-400 hover:to-fuchsia-500 text-white font-black text-lg py-6 mb-3"
                >
                  Use This Pass
                </Button>
                <Button
                  onClick={shareTicket}
                  variant="outline"
                  className="w-full font-bold border-2"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  {copied ? 'Link Copied!' : 'Share Ticket'}
                </Button>
              </>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-6 text-center text-white/90 text-sm">
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