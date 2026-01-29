import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { base44 } from '@/api/base44Client';
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
  ShoppingCart,
  AlertCircle
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';
import { Button } from "@/components/ui/button";

export default function PaymentStep({ bookingData, onSubmit, onBack }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const { addressData, calendarData, customerData, services } = bookingData;

  const totalPrice = services.reduce((sum, s) => sum + s.price, 0);

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Check if running in iframe (preview mode)
      if (window.self !== window.top) {
        setError('Payment checkout is only available from the published app. Please open this app in a new tab to complete your booking.');
        setIsProcessing(false);
        return;
      }

      const { data } = await base44.functions.invoke('createCheckoutSession', {
        services,
        bookingData,
        origin: window.location.origin
      });

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to initiate checkout. Please try again.');
      setIsProcessing(false);
    }
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
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Secure Payment</h3>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-cyan-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Powered by Stripe</h4>
                  <p className="text-sm text-slate-600">
                    Your payment is processed securely through Stripe. We support all major credit cards, Apple Pay, Google Pay, and more.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-900 mb-1">Payment Error</h4>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="bg-slate-50 rounded-xl p-4">
              <h4 className="font-medium text-slate-900 mb-2">What happens next?</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-600" />
                  You'll be redirected to Stripe's secure checkout
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-600" />
                  Complete payment with your preferred method
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-600" />
                  Receive instant confirmation & booking details
                </li>
              </ul>
            </div>

            {/* Security Note */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Lock className="w-4 h-4" />
              <span>Your payment is secured with 256-bit SSL encryption</span>
            </div>

            {/* Submit Button */}
            <GradientButton
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Redirecting to Stripe...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Continue to Payment - ${totalPrice}
                </>
              )}
            </GradientButton>

            <p className="text-xs text-center text-slate-500">
              By clicking continue, you agree to our cancellation policy
            </p>
          </div>
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