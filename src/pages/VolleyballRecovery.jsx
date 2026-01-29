import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Clock, 
  Trophy, 
  CheckCircle2, 
  ArrowRight,
  Droplets,
  Heart,
  Sparkles
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';

const services = [
  {
    icon: Heart,
    name: 'Compression Boots',
    description: 'Rapid recovery for legs between matches',
    duration: '15-20 min',
    price: 40,
    highlight: true
  },
  {
    icon: Droplets,
    name: 'Localized Cryo - Legs',
    description: 'Target inflammation in knees, ankles, calves',
    duration: '15-20 min',
    price: 75,
    highlight: true
  },
  {
    icon: Zap,
    name: 'Full Recovery Protocol',
    description: 'Cryo + Compression + Red Light combo',
    duration: '30-40 min',
    price: 120,
    highlight: false
  }
];

const packages = [
  {
    name: 'Tournament Package',
    sessions: '3 Sessions',
    price: 200,
    savings: 40,
    ideal: 'Perfect for multi-day tournaments',
    features: [
      'Use between matches',
      'Reduce soreness & fatigue',
      'Faster recovery time',
      'Valid for 30 days'
    ]
  },
  {
    name: 'Season Pass',
    sessions: '10 Sessions',
    price: 600,
    savings: 150,
    ideal: 'Best value for competitive players',
    features: [
      'Mix any services',
      'Priority scheduling',
      'Team discounts available',
      'Valid for 90 days'
    ]
  }
];

const benefits = [
  'Reduce muscle soreness between matches',
  'Decrease inflammation in joints',
  'Accelerate recovery time',
  'Improve performance in back-to-back games',
  'Prevent overuse injuries',
  'Maintain peak energy levels'
];

export default function VolleyballRecovery() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-red-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 to-red-100/50" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-400 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-6">
              <Trophy className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-700">Volleyball Recovery Specialists</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Dominate Between{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                Matches
              </span>
            </h1>

            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Elite mobile recovery that comes to your tournament. Reduce soreness, 
              boost energy, and play at your peak—match after match.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to={createPageUrl('BookSession')}>
                <GradientButton size="xl" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500">
                  Book Tournament Recovery
                  <ArrowRight className="w-5 h-5" />
                </GradientButton>
              </Link>
              <Link to={createPageUrl('Contact')}>
                <GradientButton size="xl" variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-500">
                  Team Inquiries
                </GradientButton>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-5 h-5 text-orange-600" />
                <span>Quick 15-20 min sessions</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Zap className="w-5 h-5 text-orange-600" />
                <span>Mobile - We come to you</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <CheckCircle2 className="w-5 h-5 text-orange-600" />
                <span>Used by D1 athletes</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Most Popular Services */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Game Day Recovery
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Fast-acting treatments designed for volleyball athletes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlassCard className={`p-6 h-full ${service.highlight ? 'ring-2 ring-orange-500' : ''}`}>
                  {service.highlight && (
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold mb-4">
                      <Sparkles className="w-3 h-3" />
                      Most Popular
                    </div>
                  )}
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{service.name}</h3>
                  <p className="text-slate-600 mb-4">{service.description}</p>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-slate-500">{service.duration}</span>
                    <span className="text-2xl font-bold text-orange-600">${service.price}</span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tournament Packages */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-orange-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-500 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Tournament Packages
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Save big and stay ready for every match
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg, idx) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlassCard className="p-8 bg-white/10 backdrop-blur-xl border-white/20">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{pkg.name}</h3>
                      <p className="text-orange-300">{pkg.sessions}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-orange-400">${pkg.price}</div>
                      <div className="text-sm text-green-400">Save ${pkg.savings}</div>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 mb-6 italic">{pkg.ideal}</p>
                  
                  <ul className="space-y-3">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-200">
                        <CheckCircle2 className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link to={createPageUrl('BookSession')} className="block mt-6">
                    <GradientButton className="w-full bg-gradient-to-r from-orange-500 to-red-600">
                      Get This Package
                    </GradientButton>
                  </Link>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Volleyball Players Choose Us
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                    <p className="text-slate-700 font-medium">{benefit}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Dominate Your Next Tournament?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Book your recovery session now and play at your absolute best
          </p>
          <Link to={createPageUrl('BookSession')}>
            <GradientButton size="xl" variant="secondary" className="bg-white text-orange-600 hover:bg-orange-50">
              Book Your Session Now
              <ArrowRight className="w-5 h-5" />
            </GradientButton>
          </Link>
        </div>
      </section>
    </div>
  );
}