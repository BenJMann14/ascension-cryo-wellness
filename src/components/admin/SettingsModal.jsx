import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, CreditCard, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function SettingsModal({ open, onClose }) {
  const [calendarStatus, setCalendarStatus] = useState(null);
  const [stripeStatus, setStripeStatus] = useState(null);
  const [calendarInfo, setCalendarInfo] = useState(null);
  const [stripeInfo, setStripeInfo] = useState(null);

  React.useEffect(() => {
    if (open) {
      checkCalendarStatus();
      checkStripeStatus();
    }
  }, [open]);

  const checkCalendarStatus = async () => {
    try {
      const response = await base44.functions.invoke('testGoogleCalendar', {});
      if (response.data.success) {
        setCalendarStatus('connected');
        setCalendarInfo({ calendars: response.data.calendars });
      } else {
        setCalendarStatus('error');
        setCalendarInfo({ error: response.data.error });
      }
    } catch (error) {
      setCalendarStatus('error');
      setCalendarInfo({ error: error.message });
    }
  };

  const checkStripeStatus = async () => {
    try {
      const response = await base44.functions.invoke('testStripeConnection', {});
      if (response.data.success) {
        setStripeStatus('connected');
        setStripeInfo({ mode: response.data.mode, accountId: response.data.accountId });
      } else {
        setStripeStatus('error');
        setStripeInfo({ error: response.data.error });
      }
    } catch (error) {
      setStripeStatus('error');
      setStripeInfo({ error: error.message });
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
              {calendarStatus === null ? (
                <Badge className="bg-slate-400">
                  Checking...
                </Badge>
              ) : calendarStatus === 'connected' ? (
                <Badge className="bg-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge className="bg-red-600">
                  <XCircle className="w-3 h-3 mr-1" />
                  Error
                </Badge>
              )}
            </div>

            <div className="space-y-3">
              {calendarStatus === 'connected' && calendarInfo && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-green-900 font-medium mb-1">✓ Connected & Working</p>
                      <p className="text-sm text-green-800">
                        Access to {calendarInfo.calendars} calendar{calendarInfo.calendars !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {calendarStatus === 'error' && calendarInfo && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex gap-2">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-900 font-medium mb-1">Connection Error</p>
                      <p className="text-sm text-red-800">{calendarInfo.error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 font-semibold mb-2">📋 How to Manage:</p>
                <ol className="text-sm text-blue-800 space-y-1 ml-4 list-decimal">
                  <li>Go to your Base44 Dashboard</li>
                  <li>Click on "Integrations" tab</li>
                  <li>Find "Google Calendar" under "My Integrations"</li>
                  <li>Click to reconnect or change accounts</li>
                </ol>
              </div>

              <Button 
                variant="outline" 
                onClick={checkCalendarStatus}
                className="w-full"
                disabled={calendarStatus === null}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${calendarStatus === null ? 'animate-spin' : ''}`} />
                {calendarStatus === null ? 'Checking...' : 'Refresh Status'}
              </Button>
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
              {stripeStatus === null ? (
                <Badge className="bg-slate-400">
                  Checking...
                </Badge>
              ) : stripeStatus === 'connected' ? (
                <Badge className="bg-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge className="bg-red-600">
                  <XCircle className="w-3 h-3 mr-1" />
                  Error
                </Badge>
              )}
            </div>

            <div className="space-y-3">
              {stripeStatus === 'connected' && stripeInfo && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-green-900 font-medium mb-1">✓ Connected & Working</p>
                      <p className="text-sm text-green-800">
                        Mode: <span className="font-semibold">{stripeInfo.mode === 'test' ? 'Test Mode' : 'Live Mode'}</span>
                      </p>
                      {stripeInfo.mode === 'test' && (
                        <p className="text-xs text-green-700 mt-1">
                          💳 Use test card: 4242 4242 4242 4242
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {stripeStatus === 'error' && stripeInfo && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex gap-2">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-900 font-medium mb-1">Connection Error</p>
                      <p className="text-sm text-red-800">{stripeInfo.error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-900 font-semibold mb-2">📋 How to Manage:</p>
                <ol className="text-sm text-purple-800 space-y-1 ml-4 list-decimal">
                  <li>Go to your Base44 Dashboard</li>
                  <li>Click on "Integrations" tab</li>
                  <li>Find "Stripe" under "My Integrations"</li>
                  <li>Update your API keys (or claim account if in test mode)</li>
                </ol>
              </div>

              <Button 
                variant="outline" 
                onClick={checkStripeStatus}
                className="w-full"
                disabled={stripeStatus === null}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${stripeStatus === null ? 'animate-spin' : ''}`} />
                {stripeStatus === null ? 'Checking...' : 'Refresh Status'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}