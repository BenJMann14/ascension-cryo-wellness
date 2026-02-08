import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { CheckCircle2, Ticket, Calendar, User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

export default function IndividualServiceSuccess() {
  const [searchParams] = useSearchParams();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRedeemed, setIsRedeemed] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      fetchBookingDetails(sessionId);
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [searchParams]);

  const fetchBookingDetails = async (sessionId) => {
    try {
      const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY}`
        }
      });
      
      // For now, we'll use the metadata from URL params or local storage
      // In production, you'd fetch this from your backend
      const data = {
        serviceName: localStorage.getItem('booking_service_name') || 'Recovery Service',
        price: localStorage.getItem('booking_price') || '50',
        customerName: localStorage.getItem('booking_customer_name') || 'Guest',
        customerEmail: localStorage.getItem('booking_customer_email') || '',
        confirmationNumber: `VB-${Date.now().toString().slice(-6)}`
      };
      
      setBookingData(data);
      
      // Clear local storage
      localStorage.removeItem('booking_service_name');
      localStorage.removeItem('booking_price');
      localStorage.removeItem('booking_customer_name');
      localStorage.removeItem('booking_customer_email');
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsUsed = () => {
    setIsRedeemed(true);
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading your ticket...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-xl text-slate-600 mb-4">Booking not found</p>
          <Link to={createPageUrl('VolleyballRecovery')}>
            <Button>Return to Tournament Page</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Message */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">
            BOOKING CONFIRMED!
          </h1>
          <p className="text-xl text-slate-600 font-medium">
            Your recovery session is ready
          </p>
        </motion.div>

        {/* Ticket Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-slate-900"
        >
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-pink-500 to-fuchsia-600 p-6 relative">
            <div className="flex items-center gap-3 mb-2">
              <Ticket className="w-8 h-8 text-white" />
              <h2 className="text-2xl font-black text-white">YOUR TICKET</h2>
            </div>
            <p className="text-white/90 font-medium">Show this at our booth</p>
            
            {/* Decorative notches */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full" />
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full" />
          </div>

          {/* Ticket Body */}
          <div className="p-8">
            {/* Confirmation Number */}
            <div className="text-center mb-8 pb-8 border-b-4 border-dashed border-slate-200">
              <p className="text-sm font-bold text-slate-600 mb-2">CONFIRMATION NUMBER</p>
              <p className="text-4xl font-black text-pink-600 tracking-wider">
                {bookingData.confirmationNumber}
              </p>
            </div>

            {/* Service Details */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-600">SERVICE</p>
                  <p className="text-xl font-black text-slate-900">{bookingData.serviceName}</p>
                  <p className="text-lg font-bold text-pink-600">${bookingData.price}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-600">CUSTOMER</p>
                  <p className="text-lg font-bold text-slate-900">{bookingData.customerName}</p>
                </div>
              </div>

              {bookingData.customerEmail && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-600">EMAIL</p>
                    <p className="text-lg font-medium text-slate-900">{bookingData.customerEmail}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="mt-8 bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-200">
              <h3 className="font-black text-slate-900 mb-3">HOW TO REDEEM:</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="font-black text-pink-600">1.</span>
                  <span>Visit our booth at the tournament venue</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black text-pink-600">2.</span>
                  <span>Show this confirmation number</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black text-pink-600">3.</span>
                  <span>Enjoy your 15-minute recovery session!</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={createPageUrl('VolleyballRecovery')}>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto border-2 border-slate-900 font-bold"
            >
              Back to Tournament Page
            </Button>
          </Link>
          {!isRedeemed ? (
            <Button 
              onClick={handleMarkAsUsed}
              className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-400 hover:to-fuchsia-500 font-black"
            >
              Mark as Used ✓
            </Button>
          ) : (
            <Button 
              disabled
              className="w-full sm:w-auto bg-green-600 font-black"
            >
              ✓ Session Redeemed
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}