import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function IndividualServicePurchase({ isOpen, onClose, service }) {
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInfoChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckout = async () => {
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !customerInfo.phone) {
      alert('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    try {
      // Store booking info in localStorage for the success page
      localStorage.setItem('booking_service_name', service.name);
      localStorage.setItem('booking_price', service.price);
      localStorage.setItem('booking_customer_name', `${customerInfo.firstName} ${customerInfo.lastName}`);
      localStorage.setItem('booking_customer_email', customerInfo.email);

      const response = await base44.functions.invoke('createIndividualServiceCheckout', {
        serviceName: service.name,
        price: service.price,
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
    setCustomerInfo({ firstName: '', lastName: '', email: '', phone: '' });
    onClose();
  };

  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border-8 border-slate-900"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-fuchsia-600 p-6 relative">
          <button
            onClick={resetAndClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-3xl font-black text-white mb-2">BOOK SESSION</h2>
          <p className="text-white/90 font-medium">{service.name}</p>
        </div>

        <div className="p-6">
          {/* Service Summary */}
          <div className="bg-pink-50 rounded-2xl p-6 border-4 border-pink-200 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Service</p>
                <p className="text-2xl font-black text-pink-600">{service.name}</p>
                <p className="text-slate-600 font-medium">{service.description}</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black text-slate-900">${service.price}</p>
                <p className="text-sm font-bold text-slate-600">{service.duration}</p>
              </div>
            </div>
          </div>

          {/* Customer Info Form */}
          <h3 className="text-xl font-black text-slate-900 mb-4">Your Information</h3>
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
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

          <Button
            onClick={handleCheckout}
            disabled={isProcessing || !customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !customerInfo.phone}
            className="w-full bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-400 hover:to-fuchsia-500 text-white font-black text-xl py-6 rounded-2xl"
          >
            {isProcessing ? 'Processing...' : `Book Now - $${service.price}`}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}