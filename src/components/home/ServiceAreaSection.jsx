import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import GradientButton from '../ui/GradientButton';

export default function ServiceAreaSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-100 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-20" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Service Area Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative max-w-lg mx-auto">
              {/* Central location card */}
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-8 shadow-2xl text-white">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-8 h-8" />
                  <div>
                    <div className="text-sm opacity-90">Based in</div>
                    <div className="text-2xl font-bold">Leon Valley</div>
                  </div>
                </div>
                
                {/* Radius visualization */}
                <div className="relative h-48 flex items-center justify-center my-8">
                  <motion.div 
                    className="absolute inset-0 border-4 border-white/30 rounded-full"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div 
                    className="absolute inset-8 border-4 border-white/40 rounded-full"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  />
                  <motion.div 
                    className="absolute inset-16 border-4 border-white/50 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  />
                  <div className="relative z-10 text-center">
                    <div className="text-5xl font-bold">60</div>
                    <div className="text-sm opacity-90">Mile Radius</div>
                  </div>
                </div>
                
                <div className="text-center text-sm opacity-90">
                  Serving all of San Antonio & surrounding areas
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium mb-4">
              Service Area
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Serving San Antonio & Beyond
            </h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              We bring elite recovery directly to you—anywhere within 60 miles of Leon Valley. 
              From downtown San Antonio to the surrounding communities, quality wellness is just a booking away.
            </p>

            {/* Coverage areas */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {['Leon Valley', 'San Antonio', 'Alamo Heights', 'Stone Oak', 'Helotes', 'New Braunfels'].map((area) => (
                <div key={area} className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-cyan-500" />
                  <span>{area}</span>
                </div>
              ))}
            </div>

            {/* Contact info */}
            <div className="bg-slate-50 rounded-2xl p-6 mb-8">
              <h3 className="font-semibold text-slate-900 mb-4">Ready to book?</h3>
              <div className="space-y-3">
                <a href="mailto:info@ascensioncryo.com" className="flex items-center gap-3 text-slate-600 hover:text-cyan-600 transition-colors">
                  <Mail className="w-5 h-5" />
                  <span>info@ascensioncryo.com</span>
                </a>
                <a href="tel:+12105551234" className="flex items-center gap-3 text-slate-600 hover:text-cyan-600 transition-colors">
                  <Phone className="w-5 h-5" />
                  <span>(210) 555-1234</span>
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl('BookSession')}>
                <GradientButton size="lg" className="w-full sm:w-auto">
                  Book Your Session
                  <ArrowRight className="w-5 h-5" />
                </GradientButton>
              </Link>
              <Link to={createPageUrl('Contact')}>
                <GradientButton variant="outline" size="lg" className="w-full sm:w-auto">
                  Event Inquiries
                </GradientButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}