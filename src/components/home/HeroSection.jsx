import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Calendar } from 'lucide-react';
import GradientButton from '../ui/GradientButton';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50" />
      
      {/* Animated orbs */}
      <motion.div 
        className="absolute top-20 right-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-20 left-10 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
      />
      
      {/* Ice crystal decorations */}
      <div className="absolute top-40 left-1/4 w-2 h-2 bg-cyan-400 rotate-45 opacity-40" />
      <div className="absolute top-60 right-1/3 w-3 h-3 bg-blue-400 rotate-45 opacity-30" />
      <div className="absolute bottom-40 right-1/4 w-2 h-2 bg-cyan-300 rotate-45 opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Tagline */}
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100/80 backdrop-blur-sm rounded-full mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-cyan-600" />
              <span className="text-sm font-medium text-cyan-700">Train. Recover. Ascend.</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6">
              Elite Recovery.
              <span className="block bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Delivered to You.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-slate-600 mb-8 max-w-lg leading-relaxed">
              Mobile cryotherapy and advanced recovery services brought directly to your door. 
              Quick sessions, powerful results—serving San Antonio and surrounding areas.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl('BookSession')}>
                <GradientButton size="lg" className="w-full sm:w-auto">
                  <Calendar className="w-5 h-5" />
                  Book Your Session
                </GradientButton>
              </Link>
              <Link to={createPageUrl('Contact')}>
                <GradientButton variant="secondary" size="lg" className="w-full sm:w-auto">
                  Bring Us to Your Event
                  <ArrowRight className="w-5 h-5" />
                </GradientButton>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex items-center gap-4 sm:gap-8">
              <div className="text-center">
                <div className="text-xl sm:text-3xl font-bold text-slate-900">5-60 min</div>
                <div className="text-xs sm:text-sm text-slate-500">Sessions</div>
              </div>
              <div className="w-px h-10 sm:h-12 bg-slate-200" />
              <div className="text-center">
                <div className="text-xl sm:text-3xl font-bold text-slate-900">60 mi</div>
                <div className="text-xs sm:text-sm text-slate-500">Service Radius</div>
              </div>
              <div className="w-px h-10 sm:h-12 bg-slate-200" />
              <div className="text-center">
                <div className="text-xl sm:text-3xl font-bold text-slate-900">100%</div>
                <div className="text-xs sm:text-sm text-slate-500">Mobile</div>
              </div>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main image container */}
              <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80" 
                  alt="Athletic Recovery"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/40 to-transparent" />
              </div>

              {/* Floating card */}
              <motion.div 
                className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-white/50"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">❄️</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Cryotherapy</div>
                    <div className="text-sm text-slate-500">-10°F Targeted Relief</div>
                  </div>
                </div>
              </motion.div>

              {/* Stats floating card */}
              <motion.div 
                className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/50"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                    Drug-Free
                  </div>
                  <div className="text-xs text-slate-500">Recovery Solution</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}