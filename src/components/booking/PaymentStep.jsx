import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  CreditCard, 
  Lock, 
  Check, 
  ArrowLeft, 
  Loader2,
  Calendar,
  Clock,
  MapPin,
  User,
  ShoppingCart
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';
import { Button } from "@/components/ui/button";

export default function PaymentStep({ bookingData, onSubmit, onBack }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  const { addressData, calendarData, customerData, services } = bookingData;

  const totalPrice = services.reduce((sum, s) => sum + s.price, 0);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleCardChange = (field, value) => {
    let formattedValue = value;
    if (field === 'number') formattedValue = formatCardNumber(value);
    if (field === 'expiry') formattedValue = formatExpiry(value);
    if (field === 'cvc') formattedValue = value.replace(/\D/g, '').slice(0, 4);
    setCardData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In production, this would integrate with Stripe
    const confirmationNumber = 'ASC-' + Date.now().toString(36).toUpperCase();
    
    onSubmit({
      confirmationNumber,
      paymentMethod,
      totalPaid: totalPrice
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 rounded-full mb-4">
          <CreditCard className="w-5 h-5 text-cyan-600" />
          <span className="font-medium text-cyan-700">Step 5 of 5</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          Complete Your Booking
        </h2>
        <p className="text-slate-600">
          Review your booking and complete payment
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Order Summary */}
        <GlassCard className="p-6 order-2 lg:order-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Booking Summary</h3>
          
          {/* Appointment Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-cyan-600 mt-0.5" />
              <div>
                <div className="font-medium text-slate-900">{calendarData.formattedDate}</div>
                <div className="text-sm text-slate-500">{calendarData.formattedTime}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-cyan-600 mt-0.5" />
              <div>
                <div className="font-medium text-slate-900">{addressData.fullAddress}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-cyan-600 mt-0.5" />
              <div>
                <div className="font-medium text-slate-900">
                  {customerData.firstName} {customerData.lastName}
                </div>
                <div className="text-sm text-slate-500">{customerData.email}</div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Services
            </h4>
            <div className="space-y-3">
              {services.map(service => (
                <div key={service.id} className="flex justify-between items-start">
                  <div>
                    <div className="text-slate-700">{service.name}</div>
                    <div className="text-sm text-slate-500">{service.duration}</div>
                  </div>
                  <div className="font-medium text-slate-900">${service.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold text-slate-900">Total</span>
              <span className="font-bold text-cyan-600">${totalPrice}</span>
            </div>
          </div>

          {/* Refund Policy */}
          <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
            <strong>Cancellation Policy:</strong> Full refund available for cancellations made 24+ hours before your appointment.
          </div>
        </GlassCard>

        {/* Payment Form */}
        <GlassCard className="p-6 order-1 lg:order-2">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Method</h3>
          
          {/* Payment Method Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { id: 'card', label: 'Credit Card', icon: '💳' },
              { id: 'apple', label: 'Apple Pay', icon: '' },
              { id: 'google', label: 'Google Pay', icon: '🅖' },
              { id: 'paypal', label: 'PayPal', icon: '🅿️' }
            ].map(method => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`
                  p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 text-sm font-medium
                  ${paymentMethod === method.id 
                    ? 'border-cyan-500 bg-cyan-50 text-cyan-700' 
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }
                `}
              >
                <span>{method.icon}</span>
                {method.label}
              </button>
            ))}
          </div>

          {/* Card Form */}
          {paymentMethod === 'card' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  value={cardData.name}
                  onChange={(e) => handleCardChange('name', e.target.value)}
                  placeholder="John Doe"
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <div className="relative">
                  <Input
                    id="cardNumber"
                    value={cardData.number}
                    onChange={(e) => handleCardChange('number', e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    className="h-12 pl-12"
                  />
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    value={cardData.expiry}
                    onChange={(e) => handleCardChange('expiry', e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    value={cardData.cvc}
                    onChange={(e) => handleCardChange('cvc', e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    className="h-12"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Other payment methods placeholder */}
          {paymentMethod !== 'card' && (
            <div className="text-center py-8 text-slate-500">
              <p>You'll be redirected to complete payment with {paymentMethod === 'apple' ? 'Apple Pay' : paymentMethod === 'google' ? 'Google Pay' : 'PayPal'}</p>
            </div>
          )}

          {/* Security Note */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-6">
            <Lock className="w-4 h-4" />
            <span>Your payment is secured with 256-bit SSL encryption</span>
          </div>

          {/* Submit Button */}
          <GradientButton
            onClick={handleSubmit}
            disabled={isProcessing}
            className="w-full mt-6"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Pay ${totalPrice} & Confirm Booking
              </>
            )}
          </GradientButton>
        </GlassCard>
      </div>

      {/* Back Button */}
      <div className="flex justify-start">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isProcessing}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
}