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
  
  // Stripe form
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [stripePublishableKey, setStripePublishableKey] = useState('');
  const [stripeSaving, setStripeSaving] = useState(false);
  
  // Google Calendar form
  const [showCalendarForm, setShowCalendarForm] = useState(false);
  const [calendarClientId, setCalendarClientId] = useState('');
  const [calendarClientSecret, setCalendarClientSecret] = useState('');
  const [calendarRefreshToken, setCalendarRefreshToken] = useState('');
  const [calendarSaving, setCalendarSaving] = useState(false);

  React.useEffect(() => {
    if (open) {
      checkCalendarStatus();
      checkStripeStatus();
      loadStripeKeys();
    }
  }, [open]);

  const loadStripeKeys = async () => {
    try {
      const response = await base44.functions.invoke('getStripeKeys', {});
      if (response.data.success && response.data.hasKeys) {
        // Keys are already set, just show masked version
      }
    } catch (error) {
      console.error('Failed to load Stripe keys:', error);
    }
  };

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

  const handleSaveStripeKeys = async () => {
    if (!stripeSecretKey || !stripePublishableKey) {
      toast.error('Both keys are required');
      return;
    }

    setStripeSaving(true);
    try {
      const response = await base44.functions.invoke('updateStripeKeys', {
        secretKey: stripeSecretKey,
        publishableKey: stripePublishableKey
      });
      
      if (response.data.success) {
        toast.success('Stripe keys saved successfully');
        setShowStripeForm(false);
        setStripeSecretKey('');
        setStripePublishableKey('');
        checkStripeStatus();
      } else {
        toast.error('Failed to save keys');
      }
    } catch (error) {
      toast.error('Error saving keys: ' + error.message);
    } finally {
      setStripeSaving(false);
    }
  };

  const handleSaveCalendarCredentials = async () => {
    if (!calendarClientId || !calendarClientSecret || !calendarRefreshToken) {
      toast.error('All fields are required');
      return;
    }

    setCalendarSaving(true);
    try {
      const response = await base44.functions.invoke('updateGoogleCalendarCredentials', {
        clientId: calendarClientId,
        clientSecret: calendarClientSecret,
        refreshToken: calendarRefreshToken
      });
      
      if (response.data.success) {
        toast.success('Calendar credentials saved successfully');
        setShowCalendarForm(false);
        setCalendarClientId('');
        setCalendarClientSecret('');
        setCalendarRefreshToken('');
        checkCalendarStatus();
      } else {
        toast.error('Failed to save credentials');
      }
    } catch (error) {
      toast.error('Error saving credentials: ' + error.message);
    } finally {
      setCalendarSaving(false);
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

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={checkCalendarStatus}
                  className="flex-1"
                  disabled={calendarStatus === null}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${calendarStatus === null ? 'animate-spin' : ''}`} />
                  {calendarStatus === null ? 'Checking...' : 'Refresh Status'}
                </Button>
                <Button 
                  onClick={() => setShowCalendarForm(!showCalendarForm)}
                  className="flex-1"
                >
                  {showCalendarForm ? 'Cancel' : 'Update Credentials'}
                </Button>
              </div>

              {showCalendarForm && (
                <div className="bg-white border rounded-lg p-4 space-y-3">
                  <div>
                    <Label className="text-xs">Client ID</Label>
                    <Input
                      type="text"
                      placeholder="xxx.apps.googleusercontent.com"
                      value={calendarClientId}
                      onChange={(e) => setCalendarClientId(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Client Secret</Label>
                    <Input
                      type="password"
                      placeholder="GOCSPX-xxx"
                      value={calendarClientSecret}
                      onChange={(e) => setCalendarClientSecret(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Refresh Token</Label>
                    <Input
                      type="password"
                      placeholder="1//xxx"
                      value={calendarRefreshToken}
                      onChange={(e) => setCalendarRefreshToken(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button 
                    onClick={handleSaveCalendarCredentials}
                    disabled={calendarSaving}
                    className="w-full"
                  >
                    {calendarSaving ? 'Saving...' : 'Save Credentials'}
                  </Button>
                  <p className="text-xs text-slate-600">
                    Get these from <a href="https://console.cloud.google.com/apis/credentials" target="_blank" className="text-blue-600 hover:underline">Google Cloud Console</a>
                  </p>
                </div>
              )}
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

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={checkStripeStatus}
                  className="flex-1"
                  disabled={stripeStatus === null}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${stripeStatus === null ? 'animate-spin' : ''}`} />
                  {stripeStatus === null ? 'Checking...' : 'Refresh Status'}
                </Button>
                <Button 
                  onClick={() => setShowStripeForm(!showStripeForm)}
                  className="flex-1"
                >
                  {showStripeForm ? 'Cancel' : 'Update Keys'}
                </Button>
              </div>

              {showStripeForm && (
                <div className="bg-white border rounded-lg p-4 space-y-3">
                  <div>
                    <Label className="text-xs">Secret Key</Label>
                    <Input
                      type="password"
                      placeholder="sk_live_xxx or sk_test_xxx"
                      value={stripeSecretKey}
                      onChange={(e) => setStripeSecretKey(e.target.value)}
                      className="mt-1 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Publishable Key</Label>
                    <Input
                      type="text"
                      placeholder="pk_live_xxx or pk_test_xxx"
                      value={stripePublishableKey}
                      onChange={(e) => setStripePublishableKey(e.target.value)}
                      className="mt-1 font-mono text-xs"
                    />
                  </div>
                  <Button 
                    onClick={handleSaveStripeKeys}
                    disabled={stripeSaving}
                    className="w-full"
                  >
                    {stripeSaving ? 'Saving...' : 'Save Keys'}
                  </Button>
                  <p className="text-xs text-slate-600">
                    Get your keys from <a href="https://dashboard.stripe.com/apikeys" target="_blank" className="text-blue-600 hover:underline">Stripe Dashboard</a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}