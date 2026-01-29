import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import ServiceSelector from '@/components/booking/ServiceSelector';
import EventCustomerForm from '@/components/booking/EventCustomerForm';
import PaymentStep from '@/components/booking/PaymentStep';
import ConfirmationStep from '@/components/booking/ConfirmationStep';

const STEPS = ['services', 'customer', 'payment', 'confirmation'];

export default function EventBookingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState({
    services: [],
    customerData: null,
    addressData: null
  });
  const [paymentData, setPaymentData] = useState(null);

  // Check for Stripe return
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const success = urlParams.get('success');
    
    if (success && sessionId) {
      const confirmationNumber = 'ASC-' + sessionId.slice(-8).toUpperCase();
      setPaymentData({
        confirmationNumber,
        sessionId
      });
      setCurrentStep(3);
    }
  }, []);

  const handleServicesSelect = (services) => {
    setBookingData(prev => ({ ...prev, services }));
    setCurrentStep(1);
  };

  const handleCustomerInfo = (data) => {
    setBookingData(prev => ({ 
      ...prev, 
      customerData: data.customerData
    }));
    setCurrentStep(2);
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const ProgressIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-2">
        {STEPS.slice(0, -1).map((step, index) => (
          <React.Fragment key={step}>
            <div 
              className={`w-3 h-3 rounded-full transition-all ${
                index < currentStep 
                  ? 'bg-cyan-500' 
                  : index === currentStep 
                    ? 'bg-cyan-500 scale-125' 
                    : 'bg-slate-200'
              }`}
            />
            {index < STEPS.length - 2 && (
              <div className={`w-8 h-0.5 ${index < currentStep ? 'bg-cyan-500' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {currentStep < 3 && <ProgressIndicator />}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 0 && (
              <ServiceSelector 
                onSubmit={handleServicesSelect}
                onBack={() => window.history.back()}
                currentStep={1}
                totalSteps={3}
              />
            )}
            {currentStep === 1 && (
              <EventCustomerForm 
                onSubmit={handleCustomerInfo}
                onBack={goBack}
              />
            )}
            {currentStep === 2 && (
              <PaymentStep 
                bookingData={{
                  ...bookingData,
                  calendarData: {
                    formattedDate: 'Event Day',
                    formattedTime: 'On-site'
                  }
                }}
                onSubmit={() => {}}
                onBack={goBack}
              />
            )}
            {currentStep === 3 && (
              <ConfirmationStep 
                bookingData={{
                  ...bookingData,
                  calendarData: {
                    formattedDate: 'Event Day',
                    formattedTime: 'On-site'
                  }
                }}
                paymentData={paymentData}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}