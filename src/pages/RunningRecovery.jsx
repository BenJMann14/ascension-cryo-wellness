import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Clock, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  Droplets,
  Heart,
  Sparkles,
  Wind
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';

const services = [
  {
    icon: Heart,
    name: 'Compression Therapy',
    description: 'Full-leg recovery for tired muscles',
    duration: '15-20 min',
    price: 40,
    highlight: true
  },
  {
    icon: Droplets,
    name: 'Lower Body Cryo',
    description: 'Target knees, calves, ankles, feet',
    duration: '20 min',
    price: 120,
    highlight: true
  },
  {
    icon: Activity,
    name: 'Runner\'s Recovery Stack',
    description: 'Compression + Cryo + Red Light combo',
    duration: '35-40 min',
    price: 140,
    highlight: false
  }
];

const packages = [
  {
    name: 'Weekly Runner',
    sessions: '4 Sessions',
    price: 220,
    savings: 40,
    ideal: 'Perfect for consistent training',
    features: [
      'Weekly recovery sessions',
      'Reduce cumulative fatigue',
      'Prevent overuse injuries',
      'Valid for 30 days'
    ]
  },
  {
    name: 'Marathon Prep',
    sessions: '12 Sessions',
    price: 600,
    savings: 180,
    ideal: 'Best for race training blocks',
    features: [
      'Full training cycle support',
      'Mix any services',
      'Priority scheduling',
      'Valid for 90 days'
    ]
  }
];

const benefits = [
  'Reduce shin splints & IT band pain',
  'Speed up post-run recovery',
  'Prevent common running injuries',
  'Improve circulation & lymphatic drainage',
  'Decrease muscle soreness',
  'Maintain training consistency'
];

const runnerTypes = [
  {
    type: '5K Specialists',
    needs: 'Quick recovery for high-intensity speed work',
    ideal: 'Compression + Cryo for legs'
  },
  {
    type: 'Marathon Runners',
    needs: 'Deep tissue recovery for long training runs',
    ideal: 'Full recovery stack'
  },
  {
    type: 'Ultra Runners',
    needs: 'Complete system restoration',
    ideal: 'Multi-session packages'
  },
  {
    type: 'Trail Runners',
    needs: 'Joint & stability muscle recovery',
    ideal: 'Localized cryo + compression'
  }
];

export default function RunningRecovery() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-cyan-100/50" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
              <Activity className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-700">Runner's Recovery Experts</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Run More.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                Hurt Less.
              </span>
            </h1>

            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Elite mobile recovery designed specifically for runners. Keep your legs fresh, 
              your training consistent, and your PRs coming.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to={createPageUrl('EventBookingFlow')}>
                <GradientButton size="xl" className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500">
                  Book Recovery Session
                  <ArrowRight className="w-5 h-5" />
                </GradientButton>
              </Link>
              <Link to={createPageUrl('Contact')}>
                <GradientButton size="xl" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-500">
                  Running Club Inquiries
                </GradientButton>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-5 h-5 text-blue-600" />
                <span>Quick 15-40 min sessions</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Wind className="w-5 h-5 text-blue-600" />
                <span>Mobile - We come to you</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Award className="w-5 h-5 text-blue-600" />
                <span>Used by marathon runners</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Runner Types */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Recovery For Every Runner
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              From 5Ks to ultras, we've got your recovery covered
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {runnerTypes.map((runner, idx) => (
              <motion.div
                key={runner.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlassCard className="p-6 bg-white/10 backdrop-blur-xl border-white/20 h-full">
                  <h3 className="text-lg font-bold text-white mb-2">{runner.type}</h3>
                  <p className="text-blue-100 text-sm mb-3">{runner.needs}</p>
                  <div className="text-xs text-cyan-300 font-medium">
                    → {runner.ideal}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Recovery Services for Runners
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Science-backed treatments to keep you running strong
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
                <GlassCard className={`p-6 h-full ${service.highlight ? 'ring-2 ring-blue-500' : ''}`}>
                  {service.highlight && (
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mb-4">
                      <Sparkles className="w-3 h-3" />
                      Most Popular
                    </div>
                  )}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{service.name}</h3>
                  <p className="text-slate-600 mb-4">{service.description}</p>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-slate-500">{service.duration}</span>
                    <span className="text-2xl font-bold text-blue-600">${service.price}</span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Training Packages
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Consistent recovery for consistent performance
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
                <GlassCard className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-1">{pkg.name}</h3>
                      <p className="text-blue-600">{pkg.sessions}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">${pkg.price}</div>
                      <div className="text-sm text-green-600">Save ${pkg.savings}</div>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 mb-6 italic">{pkg.ideal}</p>
                  
                  <ul className="space-y-3">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-700">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link to={createPageUrl('EventBookingFlow')} className="block mt-6">
                    <GradientButton className="w-full bg-gradient-to-r from-blue-500 to-cyan-600">
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
              Why Runners Choose Us
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
                    <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <p className="text-slate-700 font-medium">{benefit}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Level Up Your Running?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Book your recovery session and feel the difference
          </p>
          <Link to={createPageUrl('EventBookingFlow')}>
            <GradientButton size="xl" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
              Book Your Session Now
              <ArrowRight className="w-5 h-5" />
            </GradientButton>
          </Link>
        </div>
      </section>
    </div>
  );
}