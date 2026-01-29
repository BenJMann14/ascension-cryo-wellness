import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { 
  CheckCircle, 
  Loader2, 
  CreditCard,
  ArrowRight,
  Snowflake,
  Wind,
  Sun,
  Activity,
  Zap,
  ShoppingCart,
  Clock,
  User,
  Mail,
  Phone,
  FileSignature
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Event themes
const themes = {
  volleyball: {
    name: 'Volleyball Tournament',
    gradient: 'from-orange-500 to-amber-600',
    bgGradient: 'from-orange-50 to-amber-50',
    accent: 'text-orange-600',
    accentBg: 'bg-orange-100',
    headline: 'Fast Court-Side Recovery',
    subhead: 'Get back in the game faster'
  },
  marathon: {
    name: 'Marathon / Running Event',
    gradient: 'from-blue-600 to-indigo-700',
    bgGradient: 'from-blue-50 to-indigo-50',
    accent: 'text-blue-600',
    accentBg: 'bg-blue-100',
    headline: 'Mile After Mile Recovery',
    subhead: 'Recover like a champion'
  },
  hyrox: {
    name: 'Hyrox / CrossFit Competition',
    gradient: 'from-red-600 to-slate-800',
    bgGradient: 'from-red-50 to-slate-100',
    accent: 'text-red-600',
    accentBg: 'bg-red-100',
    headline: 'Elite Athlete Recovery',
    subhead: 'Train harder, recover faster'
  }
};

// Event pricing
const eventServices = {
  single: [
    { id: 'cryo', name: 'Localized Cryotherapy', price: 50, duration: '5-15 min', icon: Snowflake },
    { id: 'compression', name: 'Compression Therapy', price: 40, duration: '15 min', icon: Wind },
    { id: 'redlight', name: 'Red Light Therapy', price: 30, duration: '15 min', icon: Sun },
    { id: 'vibration', name: 'Vibration Plate', price: 20, duration: '10 min', icon: Activity }
  ],
  combos: [
    { id: 'combo-express', name: 'Recovery Express', description: 'Cryo + Vibration', price: 65, savings: 10, duration: '~20 min', icon: Zap },
    { id: 'combo-reset', name: 'Athlete Reset', description: 'Cryo + Compression', price: 80, savings: 15, duration: '~30 min', icon: Zap },
    { id: 'combo-full', name: 'Full Recovery Stack', description: 'Cryo + Compression + Red Light', price: 110, savings: 20, duration: '~45 min', icon: Zap, featured: true }
  ]
};

const STEPS = ['services', 'info', 'waiver', 'payment', 'confirmation'];

export default function EventBooking() {
  const urlParams = new URLSearchParams(window.location.search);
  const eventTheme = urlParams.get('theme') || 'hyrox';
  
  const [step, setStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    marketingOptIn: false
  });
  const [waiverSigned, setWaiverSigned] = useState(false);
  const [waiverAgreed, setWaiverAgreed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);

  const theme = themes[eventTheme] || themes.hyrox;
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => {
    const match = s.duration?.match(/(\d+)/);
    return sum + (match ? parseInt(match[1]) : 15);
  }, 0);

  const toggleService = (service) => {
    const exists = selectedServices.find(s => s.id === service.id);
    if (exists) {
      setSelectedServices(prev => prev.filter(s => s.id !== service.id));
    } else {
      setSelectedServices(prev => [...prev, service]);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const confirmationNumber = 'EVT-' + Date.now().toString(36).toUpperCase();
    
    try {
      await base44.entities.Booking.create({
        confirmation_number: confirmationNumber,
        booking_type: 'event',
        status: 'confirmed',
        customer_first_name: customerInfo.firstName,
        customer_last_name: customerInfo.lastName,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        services_selected: selectedServices.map(s => ({
          service_id: s.id,
          service_name: s.name,
          price: s.price
        })),
        total_amount: totalPrice,
        estimated_duration: totalDuration,
        payment_status: 'paid',
        waiver_signed: true,
        waiver_signed_at: new Date().toISOString(),
        marketing_opt_in: customerInfo.marketingOptIn,
        event_theme: eventTheme
      });
    } catch (error) {
      console.error('Error saving booking:', error);
    }

    setConfirmationData({ confirmationNumber });
    setIsProcessing(false);
    setStep(4);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bgGradient}`}>
      {/* Header */}
      <header className={`bg-gradient-to-r ${theme.gradient} text-white py-6`}>
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Snowflake className="w-6 h-6" />
            <span className="font-bold text-lg">Ascension</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">{theme.headline}</h1>
          <p className="text-white/80">{theme.subhead}</p>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Progress */}
        {step < 4 && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {['Services', 'Info', 'Waiver', 'Pay'].map((label, i) => (
              <React.Fragment key={label}>
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                  ${i <= step 
                    ? `bg-gradient-to-r ${theme.gradient} text-white` 
                    : 'bg-white text-slate-400 border-2'
                  }
                `}>
                  {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                {i < 3 && <div className={`w-8 h-0.5 ${i < step ? `bg-gradient-to-r ${theme.gradient}` : 'bg-slate-200'}`} />}
              </React.Fragment>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Services */}
          {step === 0 && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Your Services</h2>
                <p className="text-slate-600">Quick 2-minute booking</p>
              </div>

              {/* Single Services */}
              <div className="space-y-3">
                <h3 className={`font-semibold ${theme.accent}`}>Single Services</h3>
                {eventServices.single.map(service => {
                  const isSelected = selectedServices.some(s => s.id === service.id);
                  return (
                    <button
                      key={service.id}
                      onClick={() => toggleService(service)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                        isSelected 
                          ? `border-current ${theme.accentBg} ${theme.accent}` 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? theme.accentBg : 'bg-slate-100'}`}>
                        {isSelected ? <CheckCircle className="w-5 h-5" /> : <service.icon className="w-5 h-5 text-slate-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">{service.name}</div>
                        <div className="text-sm text-slate-500">{service.duration}</div>
                      </div>
                      <div className="font-bold text-lg text-slate-900">${service.price}</div>
                    </button>
                  );
                })}
              </div>

              {/* Combos */}
              <div className="space-y-3">
                <h3 className={`font-semibold ${theme.accent}`}>Popular Combos</h3>
                {eventServices.combos.map(service => {
                  const isSelected = selectedServices.some(s => s.id === service.id);
                  return (
                    <button
                      key={service.id}
                      onClick={() => toggleService(service)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                        isSelected 
                          ? `border-current ${theme.accentBg} ${theme.accent}` 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      } ${service.featured ? 'ring-2 ring-amber-300' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? theme.accentBg : 'bg-slate-100'}`}>
                        {isSelected ? <CheckCircle className="w-5 h-5" /> : <Zap className="w-5 h-5 text-slate-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">{service.name}</span>
                          {service.featured && <Badge className="bg-amber-100 text-amber-700 text-xs">Best Value</Badge>}
                        </div>
                        <div className="text-sm text-slate-500">{service.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-slate-900">${service.price}</div>
                        <div className="text-xs text-green-600">Save ${service.savings}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Summary */}
              {selectedServices.length > 0 && (
                <GlassCard className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600">{selectedServices.length} service(s)</span>
                    <span className="font-bold text-xl">${totalPrice}</span>
                  </div>
                  <div className="text-sm text-slate-500">Est. time: ~{totalDuration} min</div>
                </GlassCard>
              )}

              <GradientButton
                onClick={() => setStep(1)}
                disabled={selectedServices.length === 0}
                className="w-full"
                size="lg"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </GradientButton>
            </motion.div>
          )}

          {/* Step 2: Customer Info */}
          {step === 1 && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Information</h2>
              </div>

              <GlassCard className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      value={customerInfo.firstName}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="John"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      value={customerInfo.lastName}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Doe"
                      className="h-12"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john@example.com"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(210) 555-1234"
                    className="h-12"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={customerInfo.marketingOptIn}
                    onCheckedChange={(checked) => setCustomerInfo(prev => ({ ...prev, marketingOptIn: checked }))}
                  />
                  <span className="text-sm text-slate-600">Email me about future events and offers</span>
                </label>
              </GlassCard>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(0)} className="flex-1">Back</Button>
                <GradientButton
                  onClick={() => setStep(2)}
                  disabled={!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !customerInfo.phone}
                  className="flex-1"
                  size="lg"
                >
                  Continue to Waiver
                </GradientButton>
              </div>
            </motion.div>
          )}

          {/* Step 3: Waiver */}
          {step === 2 && (
            <motion.div
              key="waiver"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <FileSignature className={`w-12 h-12 mx-auto mb-3 ${theme.accent}`} />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Terms & Waiver</h2>
              </div>

              <GlassCard className="p-4 max-h-64 overflow-y-auto text-sm text-slate-600 leading-relaxed">
                <h4 className="font-semibold text-slate-900 mb-2">WAIVER AND RELEASE OF LIABILITY</h4>
                <p className="mb-3">
                  I understand that the services provided by Ascension Cryo & Wellness are wellness services 
                  and not medical treatments. I acknowledge that these services include cryotherapy, compression 
                  therapy, red light therapy, and vibration therapy.
                </p>
                <p className="mb-3">
                  I hereby release Ascension Cryo & Wellness, its owner Martin Tomlin, and all associated parties 
                  from any and all liability for any injury or harm that may result from participating in these 
                  wellness services.
                </p>
                <p className="mb-3">
                  I confirm that I have disclosed any relevant medical conditions and have consulted with a 
                  healthcare provider if necessary before receiving these services.
                </p>
                <p>
                  By signing below, I acknowledge that I have read, understood, and agree to the terms of this waiver.
                </p>
              </GlassCard>

              <div className="space-y-3">
                <label className="flex items-start gap-2 cursor-pointer">
                  <Checkbox
                    checked={waiverAgreed}
                    onCheckedChange={(checked) => setWaiverAgreed(checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-slate-700">I have read and agree to the waiver above</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <Checkbox
                    checked={waiverSigned}
                    onCheckedChange={(checked) => setWaiverSigned(checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-slate-700">I confirm I do not have any contraindications to these services</span>
                </label>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                <GradientButton
                  onClick={() => setStep(3)}
                  disabled={!waiverAgreed || !waiverSigned}
                  className="flex-1"
                  size="lg"
                >
                  Continue to Payment
                </GradientButton>
              </div>
            </motion.div>
          )}

          {/* Step 4: Payment */}
          {step === 3 && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <CreditCard className={`w-12 h-12 mx-auto mb-3 ${theme.accent}`} />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Complete Payment</h2>
              </div>

              <GlassCard className="p-4">
                <h3 className="font-semibold text-slate-900 mb-3">Order Summary</h3>
                {selectedServices.map(service => (
                  <div key={service.id} className="flex justify-between py-2 border-b last:border-0">
                    <span className="text-slate-700">{service.name}</span>
                    <span className="font-medium">${service.price}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-3 text-lg font-bold">
                  <span>Total</span>
                  <span className={theme.accent}>${totalPrice}</span>
                </div>
              </GlassCard>

              {/* Simplified payment buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button className="p-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2">
                   Apple Pay
                </button>
                <button className="p-4 bg-white border-2 rounded-xl font-medium flex items-center justify-center gap-2">
                  🅖 Google Pay
                </button>
              </div>

              <div className="text-center text-sm text-slate-500">or pay with card</div>

              <GlassCard className="p-4 space-y-4">
                <Input placeholder="Card number" className="h-12" />
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="MM/YY" className="h-12" />
                  <Input placeholder="CVC" className="h-12" />
                </div>
              </GlassCard>

              <GradientButton
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay $${totalPrice}`
                )}
              </GradientButton>

              <Button variant="outline" onClick={() => setStep(2)} className="w-full">Back</Button>
            </motion.div>
          )}

          {/* Step 5: Confirmation */}
          {step === 4 && confirmationData && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className={`w-24 h-24 bg-gradient-to-r ${theme.gradient} rounded-full flex items-center justify-center mx-auto`}
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>

              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
                <p className="text-slate-600">Show this screen to Martin</p>
              </div>

              <GlassCard className="p-6">
                <div className="text-sm text-slate-500 mb-1">Confirmation #</div>
                <div className="text-2xl font-bold font-mono text-slate-900 mb-4">
                  {confirmationData.confirmationNumber}
                </div>

                <div className="border-t pt-4 text-left space-y-2">
                  <div className="font-medium text-slate-900">{customerInfo.firstName} {customerInfo.lastName}</div>
                  <div className="text-slate-600">{selectedServices.map(s => s.name).join(', ')}</div>
                  <div className="text-lg font-bold text-slate-900">Total: ${totalPrice}</div>
                </div>
              </GlassCard>

              <p className="text-sm text-slate-500">
                Confirmation sent to {customerInfo.email}
              </p>

              <Button
                variant="outline"
                onClick={() => {
                  setStep(0);
                  setSelectedServices([]);
                  setCustomerInfo({ firstName: '', lastName: '', email: '', phone: '', marketingOptIn: false });
                  setWaiverAgreed(false);
                  setWaiverSigned(false);
                  setConfirmationData(null);
                }}
                className="w-full"
              >
                Book Another Session
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}