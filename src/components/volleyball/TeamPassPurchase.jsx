import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Users, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const TEAM_PASSES = [
  { passes: 3, price: 135, perPass: 45, savings: 15 },
  { passes: 6, price: 240, perPass: 40, savings: 60, popular: true },
  { passes: 9, price: 315, perPass: 35, savings: 135 },
  { passes: 12, price: 360, perPass: 30, savings: 240 }
];

export default function TeamPassPurchase({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [selectedPasses, setSelectedPasses] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePassSelect = (passOption) => {
    setSelectedPasses(passOption);
    setStep(2);
  };

  const handleInfoChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckout = async () => {
    if (!selectedPasses || !customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !customerInfo.phone) {
      alert('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await base44.functions.invoke('createTeamPassCheckout', {
        passes: selectedPasses.passes,
        customerInfo
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setSelectedPasses(null);
    setCustomerInfo({ firstName: '', lastName: '', email: '', phone: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-8 border-slate-900"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-fuchsia-600 p-6 relative">
          <button
            onClick={resetAndClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-white" />
            <h2 className="text-3xl font-black text-white">GET TEAM PASSES</h2>
          </div>
          <p className="text-white/90 font-medium">Share with your team & save big!</p>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-2xl font-black text-slate-900 mb-6">Select Your Pass Package</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {TEAM_PASSES.map((pass) => (
                    <motion.button
                      key={pass.passes}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePassSelect(pass)}
                      className={`relative rounded-2xl p-6 text-left border-4 ${
                        pass.popular
                          ? 'bg-gradient-to-br from-pink-600 to-fuchsia-700 border-pink-600 shadow-xl'
                          : 'bg-white border-slate-900 hover:shadow-lg'
                      }`}
                    >
                      {pass.popular && (
                        <Badge className="absolute -top-2 -right-2 bg-yellow-400 text-slate-900 font-black">
                          🔥 POPULAR
                        </Badge>
                      )}
                      <div className={`text-6xl font-black mb-2 ${pass.popular ? 'text-yellow-300' : 'text-pink-600'}`}>
                        {pass.passes}
                      </div>
                      <div className={`text-xl font-black mb-4 ${pass.popular ? 'text-white' : 'text-slate-900'}`}>
                        PASSES
                      </div>
                      <div className={`text-4xl font-black mb-1 ${pass.popular ? 'text-white' : 'text-slate-900'}`}>
                        ${pass.price}
                      </div>
                      <div className={`text-sm font-bold ${pass.popular ? 'text-yellow-200' : 'text-slate-600'}`}>
                        ${pass.perPass} per pass
                      </div>
                      <div className={`mt-3 flex items-center gap-2 ${pass.popular ? 'text-yellow-300' : 'text-green-600'}`}>
                        <Sparkles className="w-4 h-4" />
                        <span className="font-black">SAVE ${pass.savings}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button
                  onClick={() => setStep(1)}
                  className="text-pink-600 font-bold mb-4 hover:underline"
                >
                  ← Back to packages
                </button>

                {selectedPasses && (
                  <div className="bg-pink-50 rounded-2xl p-6 border-4 border-pink-200 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Selected Package</p>
                        <p className="text-3xl font-black text-pink-600">{selectedPasses.passes} Passes</p>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-black text-slate-900">${selectedPasses.price}</p>
                        <p className="text-sm font-bold text-green-600">Save ${selectedPasses.savings}</p>
                      </div>
                    </div>
                  </div>
                )}

                <h3 className="text-2xl font-black text-slate-900 mb-4">Your Information</h3>
                <div className="space-y-4 mb-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        First Name *
                      </label>
                      <Input
                        value={customerInfo.firstName}
                        onChange={(e) => handleInfoChange('firstName', e.target.value)}
                        placeholder="John"
                        className="border-2 border-slate-300 rounded-xl p-3 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Last Name *
                      </label>
                      <Input
                        value={customerInfo.lastName}
                        onChange={(e) => handleInfoChange('lastName', e.target.value)}
                        placeholder="Smith"
                        className="border-2 border-slate-300 rounded-xl p-3 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleInfoChange('email', e.target.value)}
                      placeholder="john.smith@email.com"
                      className="border-2 border-slate-300 rounded-xl p-3 font-medium"
                    />
                    <p className="text-xs text-slate-500 mt-1">We'll send your redemption code here</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => handleInfoChange('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                      className="border-2 border-slate-300 rounded-xl p-3 font-medium"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200 mb-6">
                  <h4 className="font-black text-slate-900 mb-2 flex items-center gap-2">
                    <Check className="w-5 h-5 text-blue-600" />
                    What happens next:
                  </h4>
                  <ul className="space-y-1 text-sm text-slate-700">
                    <li>• Get instant redemption code</li>
                    <li>• Receive confirmation email with all details</li>
                    <li>• Show code at booth to redeem passes</li>
                  </ul>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing || !customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !customerInfo.phone}
                  className="w-full bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-400 hover:to-fuchsia-500 text-white font-black text-xl py-6 rounded-2xl"
                >
                  {isProcessing ? 'Processing...' : `Checkout - $${selectedPasses?.price}`}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}