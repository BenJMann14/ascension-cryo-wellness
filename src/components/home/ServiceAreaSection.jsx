import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import GradientButton from '../ui/GradientButton';

export default function ServiceAreaSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Map Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Circular service area visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Outer ring - 60 mile radius */}
                <motion.div 
                  className="absolute w-full h-full rounded-full border-2 border-dashed border-cyan-300 opacity-50"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Middle ring */}
                <div className="absolute w-3/4 h-3/4 rounded-full border border-cyan-200 opacity-40" />
                
                {/* Inner area */}
                <div className="absolute w-1/2 h-1/2 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 opacity-60" />
                
                {/* Center point - San Antonio */}
                <div className="relative">
                  <motion.div 
                    className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="px-3 py-1 bg-slate-900 text-white text-sm rounded-full font-medium">
                      Leon Valley / San Antonio
                    </span>
                  </div>
                </div>
              </div>

              {/* 60 mile label */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                <span className="text-2xl font-bold text-cyan-600">60</span>
                <span className="text-sm text-slate-600 ml-1">mile radius</span>
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