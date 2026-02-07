import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import AddressValidator from '@/components/booking/AddressValidator';
import CalendarPicker from '@/components/booking/CalendarPicker';
import CustomerInfoForm from '@/components/booking/CustomerInfoForm';
import ServiceSelector from '@/components/booking/ServiceSelector';
import PaymentStep from '@/components/booking/PaymentStep';
import ConfirmationStep from '@/components/booking/ConfirmationStep';

const STEPS = ['address', 'calendar', 'customer', 'services', 'payment', 'confirmation'];

export default function BookSession() {
  const urlParams = new URLSearchParams(window.location.search);
  const isReturningFromPayment = urlParams.get('success') && urlParams.get('session_id');
  
  const [currentStep, setCurrentStep] = useState(isReturningFromPayment ? 5 : 0);
  const [isLoading, setIsLoading] = useState(isReturningFromPayment);
  const [preselectedServiceId, setPreselectedServiceId] = useState(null);
  const [bookingData, setBookingData] = useState({
    addressData: null,
    calendarData: null,
    customerData: null,
    services: []
  });
  const [paymentData, setPaymentData] = useState(null);

  // Check for Stripe return and preselected service
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const success = urlParams.get('success');
    const serviceParam = urlParams.get('service');
    
    if (success && sessionId) {
      // Payment successful, fetch booking data and show confirmation
      const fetchBooking = async () => {
        setIsLoading(true);
        try {
          const response = await base44.functions.invoke('getBookingFromSession', { sessionId });
          
          if (response.data?.booking) {
            const booking = response.data.booking;
            
            // Reconstruct booking data from saved booking
            // Parse the appointment date properly - ensure it's treated as local time
            const [year, month, day] = booking.appointment_date.split('-').map(Number);
            const appointmentDate = new Date(year, month - 1, day);
            
            setBookingData({
              addressData: {
                address: booking.service_address,
                city: booking.service_city,
                zip: booking.service_zip,
                distance: booking.distance_miles,
                fullAddress: `${booking.service_address}, ${booking.service_city}, ${booking.service_zip}`
              },
              calendarData: {
                date: appointmentDate,
                time: booking.appointment_time,
                formattedDate: appointmentDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }),
                formattedTime: booking.appointment_time
              },
              customerData: {
                firstName: booking.customer_first_name,
                lastName: booking.customer_last_name,
                email: booking.customer_email,
                phone: booking.customer_phone,
                specialRequests: booking.special_requests
              },
              services: booking.services_selected || []
            });
            
            setPaymentData({
              confirmationNumber: booking.confirmation_number || 'ASC-' + sessionId.slice(-8).toUpperCase(),
              sessionId
            });
            
            setCurrentStep(5);
            }
            } catch (error) {
            console.error('Error fetching booking:', error);
            } finally {
            setIsLoading(false);
            }
            };

            fetchBooking();
    }

    if (serviceParam) {
      // Map service IDs from Services page to ServiceSelector IDs
      const serviceMap = {
        'cryo': 'cryo-full',
        'compression': 'compression',
        'redlight': 'redlight',
        'vibration': 'vibration',
        'bodysculpt': 'body-sculpt',
        'facial': 'facial',
        'scalp': 'scalp'
      };
      setPreselectedServiceId(serviceMap[serviceParam] || null);
    }
  }, []);

  const handleAddressValidated = (data) => {
    setBookingData(prev => ({ ...prev, addressData: data }));
    setCurrentStep(1);
  };

  const handleCalendarSelect = (data) => {
    setBookingData(prev => ({ ...prev, calendarData: data }));
    setCurrentStep(2);
  };

  const handleCustomerInfo = (data) => {
    setBookingData(prev => ({ ...prev, customerData: data }));
    setCurrentStep(3);
  };

  const handleServicesSelect = (services) => {
    setBookingData(prev => ({ ...prev, services }));
    setCurrentStep(4);
  };

  const handlePaymentComplete = async (payment) => {
    // Save booking to database
    try {
      const totalAmount = bookingData.services.reduce((sum, s) => sum + s.price, 0);
      const totalDuration = bookingData.services.reduce((sum, s) => {
        const match = s.duration.match(/(\d+)/);
        return sum + (match ? parseInt(match[1]) : 30);
      }, 0);

      await base44.entities.Booking.create({
        confirmation_number: payment.confirmationNumber,
        booking_type: 'individual',
        status: 'confirmed',
        customer_first_name: bookingData.customerData.firstName,
        customer_last_name: bookingData.customerData.lastName,
        customer_email: bookingData.customerData.email,
        customer_phone: bookingData.customerData.phone,
        service_address: bookingData.addressData.address,
        service_city: bookingData.addressData.city,
        service_zip: bookingData.addressData.zip,
        distance_miles: bookingData.addressData.distance || 0,
        appointment_date: bookingData.calendarData.date.toISOString().split('T')[0],
        appointment_time: bookingData.calendarData.time,
        services_selected: bookingData.services.map(s => ({
          service_id: s.id,
          service_name: s.name,
          price: s.price
        })),
        total_amount: totalAmount,
        estimated_duration: totalDuration,
        payment_status: 'paid',
        special_requests: bookingData.customerData.specialRequests || '',
        marketing_opt_in: bookingData.customerData.marketingOptIn || false
      });
    } catch (error) {
      console.error('Error saving booking:', error);
    }

    setPaymentData(payment);
    setCurrentStep(5);
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Progress indicator
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your booking confirmation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {currentStep < 5 && <ProgressIndicator />}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 0 && (
              <AddressValidator onValidated={handleAddressValidated} />
            )}
            {currentStep === 1 && (
              <CalendarPicker 
                onSelect={handleCalendarSelect}
                onBack={goBack}
              />
            )}
            {currentStep === 2 && (
              <CustomerInfoForm 
                addressData={bookingData.addressData}
                onSubmit={handleCustomerInfo}
                onBack={goBack}
              />
            )}
            {currentStep === 3 && (
              <ServiceSelector 
                onSubmit={handleServicesSelect}
                onBack={goBack}
                preselectedServiceId={preselectedServiceId}
              />
            )}
            {currentStep === 4 && (
              <PaymentStep 
                bookingData={bookingData}
                onSubmit={handlePaymentComplete}
                onBack={goBack}
              />
            )}
            {currentStep === 5 && (
              <ConfirmationStep 
                bookingData={bookingData}
                paymentData={paymentData}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}