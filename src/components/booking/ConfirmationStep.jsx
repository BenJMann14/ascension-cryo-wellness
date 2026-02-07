import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Calendar, 
  MapPin, 
  Download,
  Mail,
  Phone,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';
import { Button } from "@/components/ui/button";

export default function ConfirmationStep({ bookingData, paymentData }) {
  const { addressData, calendarData, customerData, services } = bookingData;
  const totalPrice = services.reduce((sum, s) => sum + s.price, 0);

  const generateICSFile = () => {
    const date = calendarData.date;
    const time = calendarData.time;
    
    // Parse date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Parse time components
    const [hours, minutes] = time.split(':');
    const endHour = String((parseInt(hours) + 1) % 24).padStart(2, '0');
    
    // Build ICS datetime strings (no timezone, local time)
    const startDT = `${year}${month}${day}T${hours}${minutes}00`;
    const endDT = `${year}${month}${day}T${endHour}${minutes}00`;
    
    const now = new Date();
    const nowDT = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}00`;

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Ascension Cryo & Wellness//EN
BEGIN:VEVENT
UID:${paymentData.confirmationNumber}@ascensioncryo.com
DTSTAMP:${nowDT}
DTSTART:${startDT}
DTEND:${endDT}
SUMMARY:Ascension Cryo & Wellness Appointment
DESCRIPTION:Confirmation: ${paymentData.confirmationNumber}\\n\\nServices: ${services.map(s => s.service_name || s.name).join(', ')}\\n\\nTotal: $${totalPrice}
LOCATION:${addressData.fullAddress}
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT1H
ACTION:DISPLAY
DESCRIPTION:Appointment Reminder
END:VALARM
END:VEVENT
END:VCALENDAR`.replace(/\n/g, '\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `booking-${paymentData.confirmationNumber}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <motion.div 
        className="text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
      >
        <motion.div 
          className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-slate-600 text-lg">
          Your recovery session has been scheduled.
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard className="p-6 md:p-8">
          <div className="text-center pb-6 border-b mb-6">
            <p className="text-sm text-slate-500 mb-1">Confirmation Number</p>
            <p className="text-2xl font-bold text-cyan-600 font-mono">{paymentData.confirmationNumber}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">Date & Time</div>
                  <div className="font-semibold text-slate-900">{calendarData.formattedDate}</div>
                  <div className="text-cyan-600 font-medium">{calendarData.time}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">Location</div>
                  <div className="font-semibold text-slate-900">{addressData.fullAddress}</div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm text-slate-500 mb-2">Services Booked</div>
              <div className="space-y-2">
                {services.map((service, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                    <span className="text-slate-700">{service.service_name || service.name}</span>
                    <span className="font-medium text-slate-900">${service.price}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 font-bold">
                  <span className="text-slate-900">Total Paid</span>
                  <span className="text-cyan-600">${totalPrice}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
            <Button
              variant="outline"
              onClick={generateICSFile}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Add to Calendar
            </Button>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard className="p-6 bg-gradient-to-r from-cyan-50 to-blue-50">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-600" />
            What's Next?
          </h3>
          <ul className="space-y-3 text-slate-700">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>A confirmation email has been sent to <strong>{customerData.email}</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Martin will arrive at your location 5-10 minutes before your appointment</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Wear comfortable clothing that allows access to treatment areas</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Stay hydrated before and after your session</span>
            </li>
          </ul>
        </GlassCard>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <GlassCard className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Questions or Need to Reschedule?</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="mailto:info@ascensioncryo.com" className="flex items-center gap-3 text-slate-600 hover:text-cyan-600 transition-colors">
              <Mail className="w-5 h-5" />
              <span>info@ascensioncryo.com</span>
            </a>
            <a href="tel:+12105551234" className="flex items-center gap-3 text-slate-600 hover:text-cyan-600 transition-colors">
              <Phone className="w-5 h-5" />
              <span>(210) 555-1234</span>
            </a>
          </div>
        </GlassCard>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Link to={createPageUrl('Home')}>
          <GradientButton variant="outline" size="lg" className="w-full sm:w-auto">
            Return Home
          </GradientButton>
        </Link>
        <Link to={createPageUrl('BookSession')}>
          <GradientButton size="lg" className="w-full sm:w-auto">
            Book Another Session
            <ArrowRight className="w-5 h-5" />
          </GradientButton>
        </Link>
      </div>
    </div>
  );
}