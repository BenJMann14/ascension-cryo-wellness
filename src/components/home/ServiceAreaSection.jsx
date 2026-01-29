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
              {/* Clean map image */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-xl">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697aae0c4062dd0f1716e345/1233e6a73_Screenshot2026-01-28at193550.png"
                  alt="San Antonio Service Area Map"
                  className="w-full h-full object-cover"
                />
                
                {/* Leon Valley marker */}
                <div className="absolute" style={{ top: '38%', left: '23%' }}>
                  <motion.div 
                    className="relative"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full shadow-lg shadow-cyan-400/60 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-blue-500" />
                  </motion.div>
                  <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="px-3 py-1.5 bg-white text-slate-900 text-xs rounded-full font-semibold shadow-lg">
                      Leon Valley
                    </span>
                  </div>
                </div>
              </div>

              {/* 60 mile label */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-slate-200">
                <span className="text-2xl font-bold text-cyan-600">60</span>
                <span className="text-sm text-slate-600 ml-1">mile radius</span>
              </div>
              
              {/* Map legend */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-slate-200">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <div className="w-3 h-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full" />
                  <span>Service Area</span>
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