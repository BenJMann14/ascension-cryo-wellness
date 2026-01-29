import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  QrCode, 
  Calendar, 
  DollarSign, 
  Users, 
  Settings,
  Copy,
  Check,
  Download,
  Eye
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';

const eventThemes = [
  { id: 'volleyball', name: 'Volleyball Tournament', emoji: '🏐', color: 'from-orange-500 to-amber-600' },
  { id: 'basketball', name: 'Basketball Tournament', emoji: '🏀', color: 'from-orange-600 to-red-600' },
  { id: 'marathon', name: 'Marathon / Running', emoji: '🏃', color: 'from-blue-600 to-indigo-700' },
  { id: 'hyrox', name: 'Hyrox / CrossFit', emoji: '🏋️', color: 'from-red-600 to-slate-800' },
  { id: 'soccer', name: 'Soccer Tournament', emoji: '⚽', color: 'from-green-600 to-emerald-700' },
  { id: 'football', name: 'Football Event', emoji: '🏈', color: 'from-amber-700 to-brown-800' },
  { id: 'tennis', name: 'Tennis Tournament', emoji: '🎾', color: 'from-lime-500 to-green-600' },
  { id: 'triathlon', name: 'Triathlon', emoji: '🏊', color: 'from-cyan-500 to-blue-600' },
  { id: 'mma', name: 'MMA / Combat Sports', emoji: '🥊', color: 'from-red-700 to-black' },
  { id: 'general', name: 'General Sports Event', emoji: '🏆', color: 'from-cyan-500 to-blue-600' }
];

export default function AdminDashboard() {
  const [selectedTheme, setSelectedTheme] = useState('volleyball');
  const [eventName, setEventName] = useState('');
  const [showPricing, setShowPricing] = useState(true);
  const [copied, setCopied] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');

  const baseUrl = window.location.origin;
  
  const generateQRUrl = () => {
    const params = new URLSearchParams({
      theme: selectedTheme,
      ...(eventName && { event: eventName }),
      pricing: showPricing ? '1' : '0'
    });
    const url = `${baseUrl}/EventBooking?${params.toString()}`;
    setGeneratedUrl(url);
    return url;
  };

  const copyToClipboard = () => {
    const url = generatedUrl || generateQRUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQRCode = () => {
    const url = generatedUrl || generateQRUrl();
    // Using QR code API to generate image
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}`;
    
    const link = document.createElement('a');
    link.href = qrImageUrl;
    link.download = `ascension-qr-${selectedTheme}-${Date.now()}.png`;
    link.click();
  };

  const previewUrl = () => {
    const url = generatedUrl || generateQRUrl();
    window.open(url, '_blank');
  };

  const selectedThemeData = eventThemes.find(t => t.id === selectedTheme);
  const qrPreviewUrl = generatedUrl ? 
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(generatedUrl)}` :
    null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600">Manage your events and generate QR codes</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* QR Code Generator */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Event QR Code Generator</h2>
                  <p className="text-sm text-slate-500">Create custom QR codes for on-site bookings</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Event Type Selection */}
                <div className="space-y-2">
                  <Label>Event Type *</Label>
                  <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventThemes.map(theme => (
                        <SelectItem key={theme.id} value={theme.id}>
                          <span className="flex items-center gap-2">
                            <span>{theme.emoji}</span>
                            <span>{theme.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Event Name */}
                <div className="space-y-2">
                  <Label>Event Name (Optional)</Label>
                  <Input
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g., San Antonio Volleyball Championship 2025"
                    className="h-12"
                  />
                </div>

                {/* Options */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <Label>Show Pricing on Landing Page</Label>
                    <p className="text-sm text-slate-500">Display prices next to services</p>
                  </div>
                  <Switch checked={showPricing} onCheckedChange={setShowPricing} />
                </div>

                {/* Theme Preview */}
                <div className={`p-4 rounded-xl bg-gradient-to-r ${selectedThemeData?.color} text-white`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedThemeData?.emoji}</span>
                    <div>
                      <div className="font-bold">{selectedThemeData?.name}</div>
                      <div className="text-sm opacity-80">Theme Preview</div>
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <GradientButton 
                  onClick={generateQRUrl} 
                  className="w-full" 
                  size="lg"
                >
                  <QrCode className="w-5 h-5" />
                  Generate QR Code
                </GradientButton>
              </div>
            </GlassCard>
          </div>

          {/* QR Code Preview */}
          <div>
            <GlassCard className="p-6 sticky top-8">
              <h3 className="font-semibold text-slate-900 mb-4">QR Code Preview</h3>
              
              {qrPreviewUrl ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="bg-white p-4 rounded-xl shadow-inner flex items-center justify-center">
                    <img 
                      src={qrPreviewUrl} 
                      alt="QR Code"
                      className="w-48 h-48"
                    />
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-slate-500 mb-1">Scan to test</p>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${selectedThemeData?.color} text-white text-sm`}>
                      <span>{selectedThemeData?.emoji}</span>
                      <span>{selectedThemeData?.name}</span>
                    </div>
                  </div>

                  {/* URL Display */}
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">Landing Page URL:</p>
                    <p className="text-xs text-slate-700 break-all font-mono">{generatedUrl}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyToClipboard}
                      className="flex-1"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={downloadQRCode}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={previewUrl}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-center text-slate-500">
                    <span>Copy URL</span>
                    <span>Download</span>
                    <span>Preview</span>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <QrCode className="w-16 h-16 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500">Generate a QR code to preview</p>
                </div>
              )}
            </GlassCard>

            {/* Print Instructions */}
            {qrPreviewUrl && (
              <GlassCard className="p-4 mt-4">
                <h4 className="font-medium text-slate-900 mb-2">Print Tips</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Download and print at 3"x3" minimum</li>
                  <li>• Place at eye level on your booth</li>
                  <li>• Ensure good lighting for scanning</li>
                  <li>• Test scan before the event</li>
                </ul>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}