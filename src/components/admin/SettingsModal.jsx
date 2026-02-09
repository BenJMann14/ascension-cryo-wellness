import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, CreditCard, CheckCircle, XCircle, ExternalLink, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function SettingsModal({ open, onClose }) {
  const [calendarStatus, setCalendarStatus] = useState('connected');
  const [stripeStatus, setStripeStatus] = useState('connected');

  const handleTestCalendar = async () => {
    try {
      const response = await base44.functions.invoke('testGoogleCalendar', {});
      if (response.data.success) {
        toast.success('Google Calendar is connected and working');
        setCalendarStatus('connected');
      } else {
        toast.error('Calendar connection failed');
        setCalendarStatus('error');
      }
    } catch (error) {
      toast.error('Failed to test calendar connection');
      setCalendarStatus('error');
    }
  };

  const handleTestStripe = async () => {
    try {
      const response = await base44.functions.invoke('testStripeConnection', {});
      if (response.data.success) {
        toast.success('Stripe is connected and working');
        setStripeStatus('connected');
      } else {
        toast.error('Stripe connection failed');
        setStripeStatus('error');
      }
    } catch (error) {
      toast.error('Failed to test Stripe connection');
      setStripeStatus('error');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Google Calendar Integration */}
          <div className="border rounded-lg p-6 bg-slate-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Google Calendar</h3>
                  <p className="text-sm text-slate-600">Manage calendar integration</p>
                </div>
              </div>
              <Badge className={calendarStatus === 'connected' ? 'bg-green-600' : 'bg-red-600'}>
                {calendarStatus === 'connected' ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 mr-1" />
                    Not Connected
                  </>
                )}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-900 font-medium mb-1">Current Setup</p>
                    <p className="text-sm text-blue-800">
                      Your Google Calendar is connected via App Connectors. To reconnect or change accounts:
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleTestCalendar}
                  className="flex-1"
                >
                  Test Connection
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open('https://base44.app/dashboard', '_blank')}
                  className="flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Manage in Dashboard
                </Button>
              </div>

              <div className="bg-slate-100 border border-slate-300 rounded-lg p-4 mt-3">
                <p className="text-xs font-semibold text-slate-700 mb-2">For Self-Hosting:</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  When self-hosting, you'll need to set up your own Google Calendar OAuth credentials. 
                  Visit the Google Cloud Console, create OAuth 2.0 credentials, and configure the redirect URIs for your domain.
                </p>
              </div>
            </div>
          </div>

          {/* Stripe Integration */}
          <div className="border rounded-lg p-6 bg-slate-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Stripe Payments</h3>
                  <p className="text-sm text-slate-600">Manage payment integration</p>
                </div>
              </div>
              <Badge className={stripeStatus === 'connected' ? 'bg-green-600' : 'bg-red-600'}>
                {stripeStatus === 'connected' ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 mr-1" />
                    Not Connected
                  </>
                )}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-purple-900 font-medium mb-1">Current Setup</p>
                    <p className="text-sm text-purple-800">
                      Your Stripe API keys are configured as environment variables. To update:
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleTestStripe}
                  className="flex-1"
                >
                  Test Connection
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open('https://base44.app/dashboard', '_blank')}
                  className="flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Update Keys in Dashboard
                </Button>
              </div>

              <div className="bg-slate-100 border border-slate-300 rounded-lg p-4 mt-3">
                <p className="text-xs font-semibold text-slate-700 mb-2">For Self-Hosting:</p>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">
                  Set these environment variables on your server:
                </p>
                <code className="text-xs bg-slate-900 text-green-400 p-2 rounded block">
                  STRIPE_SECRET_KEY=sk_live_...<br/>
                  STRIPE_PUBLISHABLE_KEY=pk_live_...
                </code>
                <p className="text-xs text-slate-600 mt-2">
                  Get your keys from <a href="https://dashboard.stripe.com/apikeys" target="_blank" className="text-blue-600 hover:underline">Stripe Dashboard</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}