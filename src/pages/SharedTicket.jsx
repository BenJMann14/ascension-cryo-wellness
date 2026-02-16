import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Ticket, CheckCircle2, XCircle, Loader2, Copy, Share2, Check } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Ticket Container with Notches */}
          <div className={`bg-white rounded-3xl shadow-2xl relative overflow-hidden ${ticket.is_used ? 'opacity-75' : ''}`}>
            {/* Decorative Side Notches */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-800 rounded-r-full -ml-3 z-20" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-800 rounded-l-full -mr-3 z-20" />
            
            {/* Perforated Line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px border-t-2 border-dashed border-slate-300 z-10" />

            {/* Used Stamp */}
            {ticket.is_used && (
              <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                <div className="bg-red-500 text-white font-black text-5xl px-12 py-6 rotate-12 rounded-2xl shadow-2xl border-4 border-red-700">
                  USED ✓
                </div>
              </div>
            )}

            <div className={ticket.is_used ? 'blur-sm' : ''}>
              {/* Top Section - Brand Header */}
              <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 pt-12 pb-10 px-8">
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" 
                       style={{
                         backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                         backgroundSize: '60px 60px'
                       }}
                  />
                </div>

                <div className="relative text-center">
                  <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center bg-white rounded-2xl shadow-xl">
                    <img 
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697aae0c4062dd0f1716e345/9b621d955_AscensionCryoWellness_Logo1.jpg" 
                      alt="Ascension" 
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                  <h1 className="text-white text-xl font-bold mb-1">
                    Ascension Cryo & Wellness
                  </h1>
                  <p className="text-slate-400 text-xs">
                    ascensioncryo.base44.app
                  </p>
                </div>
              </div>

              {/* Middle Section - Pass Info */}
              <div className="bg-gradient-to-b from-slate-50 to-white px-8 pt-8 pb-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white px-4 py-2 rounded-full text-sm font-black mb-3 shadow-lg">
                    <Ticket className="w-4 h-4" />
                    PASS #{ticket.ticket_number}
                  </div>
                  <p className="text-slate-600 text-sm">
                    From: <span className="font-bold text-slate-900">{teamPass.customer_first_name}</span>
                  </p>
                </div>

                {/* Redemption Code - Hero Element */}
                <div className="bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-400 rounded-2xl p-6 shadow-xl border-4 border-yellow-500 mb-6 transform hover:scale-105 transition-transform">
                  <p className="text-xs font-bold text-slate-700 mb-2 text-center uppercase tracking-wider">
                    Redemption Code
                  </p>
                  <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-widest text-center font-mono">
                    {teamPass.redemption_code}
                  </p>
                </div>

                {/* Services Grid */}
                <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-black text-slate-900 text-sm">Services Included</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-700">
                      <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                      <span className="text-sm font-medium">Cryo Therapy</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                      <span className="text-sm font-medium">Compression Boots</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section - Actions */}
              <div className="bg-slate-50 px-8 py-6 border-t-2 border-dashed border-slate-200">
                {ticket.is_used ? (
                  <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200 text-center">
                    <p className="text-sm font-bold text-red-800 mb-2">
                      <CheckCircle2 className="w-5 h-5 inline mr-1" />
                      Redeemed
                    </p>
                    <p className="text-xs text-slate-600">
                      Service: {ticket.service_type}
                    </p>
                    {ticket.used_at && (
                      <p className="text-xs text-slate-600 mt-1">
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
                  <div className="space-y-3">
                    <Button
                      onClick={() => setShowRedeemDialog(true)}
                      className="w-full bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-400 hover:to-fuchsia-500 text-white font-black text-lg py-7 rounded-xl shadow-lg"
                    >
                      <Ticket className="w-5 h-5 mr-2" />
                      Use This Pass
                    </Button>
                    <Button
                      onClick={shareTicket}
                      variant="outline"
                      className="w-full font-bold border-2 border-slate-300 hover:bg-slate-100 py-3 rounded-xl"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      {copied ? 'Link Copied!' : 'Share Ticket'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Decorative Corner Elements */}
          <div className="absolute -top-2 -left-2 w-8 h-8 border-l-4 border-t-4 border-slate-600 rounded-tl-2xl opacity-50" />
          <div className="absolute -top-2 -right-2 w-8 h-8 border-r-4 border-t-4 border-slate-600 rounded-tr-2xl opacity-50" />
          <div className="absolute -bottom-2 -left-2 w-8 h-8 border-l-4 border-b-4 border-slate-600 rounded-bl-2xl opacity-50" />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-4 border-b-4 border-slate-600 rounded-br-2xl opacity-50" />
        </motion.div>

        {/* Footer */}
        <div className="mt-6 text-center text-slate-400 text-sm">
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