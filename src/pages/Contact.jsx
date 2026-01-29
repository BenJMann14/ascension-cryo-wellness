import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  CheckCircle,
  Calendar,
  Users,
  Trophy,
  Building,
  Sparkles,
  Loader2
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';

const eventTypes = [
  { value: 'volleyball', label: 'Volleyball Tournament', icon: Trophy },
  { value: 'marathon', label: 'Marathon/Running Event', icon: Users },
  { value: 'crossfit_hyrox', label: 'CrossFit/Hyrox Competition', icon: Trophy },
  { value: 'team_training', label: 'Team Training', icon: Users },
  { value: 'corporate_wellness', label: 'Corporate Wellness', icon: Building },
  { value: 'other', label: 'Other', icon: Sparkles }
];

const eventTypesWeServe = [
  "Volleyball tournaments",
  "CrossFit and Hyrox competitions",
  "Marathons and running events",
  "Team training camps",
  "Corporate wellness events",
  "Sports tournaments of all kinds"
];

const benefits = [
  "Quick setup and breakdown",
  "Professional mobile recovery station",
  "Multiple athletes served efficiently",
  "Enhances event experience",
  "Attracts participants with recovery offerings",
  "Flexible pricing for events of all sizes"
];

export default function Contact() {
  const [formData, setFormData] = useState({
    event_type: '',
    event_name: '',
    event_date: '',
    event_location: '',
    expected_attendance: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    services_interested: [],
    additional_details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      services_interested: prev.services_interested.includes(service)
        ? prev.services_interested.filter(s => s !== service)
        : [...prev.services_interested, service]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await base44.entities.EventInquiry.create({
        ...formData,
        expected_attendance: parseInt(formData.expected_attendance) || 0,
        status: 'new'
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50/50 to-white" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium mb-4">
              Contact Us
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Let's Bring Ascension to Your Event
            </h1>
            <p className="text-xl text-slate-600">
              Planning a tournament, competition, or team event? We'd love to help your 
              athletes recover faster and perform better.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <GlassCard className="p-8">
                {!isSubmitted ? (
                  <>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">
                      Event Inquiry Form
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Event Type */}
                      <div className="space-y-2">
                        <Label htmlFor="event_type">Event Type *</Label>
                        <Select 
                          value={formData.event_type} 
                          onValueChange={(value) => handleChange('event_type', value)}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                          <SelectContent>
                            {eventTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Event Name */}
                      <div className="space-y-2">
                        <Label htmlFor="event_name">Event Name *</Label>
                        <Input
                          id="event_name"
                          value={formData.event_name}
                          onChange={(e) => handleChange('event_name', e.target.value)}
                          placeholder="e.g., San Antonio Volleyball Championship"
                          required
                        />
                      </div>

                      {/* Event Date & Location */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="event_date">Event Date</Label>
                          <Input
                            id="event_date"
                            type="date"
                            value={formData.event_date}
                            onChange={(e) => handleChange('event_date', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="event_location">Event Location</Label>
                          <Input
                            id="event_location"
                            value={formData.event_location}
                            onChange={(e) => handleChange('event_location', e.target.value)}
                            placeholder="City/Venue"
                          />
                        </div>
                      </div>

                      {/* Expected Attendance */}
                      <div className="space-y-2">
                        <Label htmlFor="expected_attendance">Expected Attendance</Label>
                        <Input
                          id="expected_attendance"
                          type="number"
                          value={formData.expected_attendance}
                          onChange={(e) => handleChange('expected_attendance', e.target.value)}
                          placeholder="Approximate number of participants"
                        />
                      </div>

                      {/* Contact Info */}
                      <div className="pt-4 border-t">
                        <h3 className="font-semibold text-slate-900 mb-4">Your Information</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="contact_name">Your Name *</Label>
                            <Input
                              id="contact_name"
                              value={formData.contact_name}
                              onChange={(e) => handleChange('contact_name', e.target.value)}
                              required
                            />
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="contact_email">Email *</Label>
                              <Input
                                id="contact_email"
                                type="email"
                                value={formData.contact_email}
                                onChange={(e) => handleChange('contact_email', e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="contact_phone">Phone</Label>
                              <Input
                                id="contact_phone"
                                type="tel"
                                value={formData.contact_phone}
                                onChange={(e) => handleChange('contact_phone', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Services Interested */}
                      <div className="space-y-3">
                        <Label>Services Interested In</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {['All services', 'Cryotherapy', 'Compression', 'Red Light', 'Vibration', 'Custom package'].map((service) => (
                            <label key={service} className="flex items-center gap-2 cursor-pointer">
                              <Checkbox
                                checked={formData.services_interested.includes(service)}
                                onCheckedChange={() => handleServiceToggle(service)}
                              />
                              <span className="text-sm text-slate-700">{service}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="space-y-2">
                        <Label htmlFor="additional_details">Additional Details</Label>
                        <Textarea
                          id="additional_details"
                          value={formData.additional_details}
                          onChange={(e) => handleChange('additional_details', e.target.value)}
                          placeholder="Tell us more about your event and any specific needs..."
                          rows={4}
                        />
                      </div>

                      <GradientButton 
                        type="submit" 
                        size="lg" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Request Event Quote
                          </>
                        )}
                      </GradientButton>
                    </form>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">
                      Thank You!
                    </h2>
                    <p className="text-slate-600 mb-6">
                      Your event inquiry has been submitted. We'll get back to you within 24-48 hours 
                      with a customized quote for your event.
                    </p>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          event_type: '',
                          event_name: '',
                          event_date: '',
                          event_location: '',
                          expected_attendance: '',
                          contact_name: '',
                          contact_email: '',
                          contact_phone: '',
                          services_interested: [],
                          additional_details: ''
                        });
                      }}
                      className="text-cyan-600 font-medium hover:text-cyan-700"
                    >
                      Submit another inquiry
                    </button>
                  </motion.div>
                )}
              </GlassCard>
            </motion.div>

            {/* Right Column - Contact Info & Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Direct Contact */}
              <GlassCard className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Get In Touch</h2>
                <div className="space-y-4">
                  <a href="mailto:info@ascensioncryo.com" className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-cyan-50 transition-colors group">
                    <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center group-hover:bg-cyan-200 transition-colors">
                      <Mail className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Email</div>
                      <div className="font-semibold text-slate-900">info@ascensioncryo.com</div>
                    </div>
                  </a>
                  <a href="tel:+12105551234" className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-cyan-50 transition-colors group">
                    <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center group-hover:bg-cyan-200 transition-colors">
                      <Phone className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Phone</div>
                      <div className="font-semibold text-slate-900">(210) 555-1234</div>
                    </div>
                  </a>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Service Area</div>
                      <div className="font-semibold text-slate-900">Leon Valley, San Antonio & 60-mile radius</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Hours</div>
                      <div className="font-semibold text-slate-900">By Appointment</div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Event Types */}
              <GlassCard className="p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Event Types We Serve</h3>
                <ul className="space-y-3">
                  {eventTypesWeServe.map((type, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700">
                      <Calendar className="w-5 h-5 text-cyan-500" />
                      {type}
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* Why Book */}
              <GlassCard className="p-8 bg-gradient-to-br from-cyan-50 to-blue-50">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Why Book Ascension for Your Event?</h3>
                <ul className="space-y-3">
                  {benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700">
                      <CheckCircle className="w-5 h-5 text-cyan-600" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}