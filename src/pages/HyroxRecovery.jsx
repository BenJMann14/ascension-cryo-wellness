import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Clock, 
  Target, 
  CheckCircle2, 
  ArrowRight,
  Droplets,
  Sparkles,
  Zap,
  Heart
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';

const services = [
  {
    icon: Droplets,
    name: 'Full Body Cryo Protocol',
    description: 'Complete inflammation reduction for all muscle groups',
    duration: '20-25 min',
    price: 150,
    highlight: true
  },
  {
    icon: Heart,
    name: 'Compression Recovery',
    description: 'Full-leg pneumatic compression therapy',
    duration: '15-20 min',
    price: 40,
    highlight: false
  },
  {
    icon: Zap,
    name: 'Complete Recovery Stack',
    description: 'Cryo + Compression + Red Light + Vibration',
    duration: '45 min',
    price: 180,
    highlight: true
  }
];

const packages = [
  {
    name: 'Race Recovery',
    sessions: '3 Sessions',
    price: 250,
    savings: 50,
    ideal: 'Perfect for race week recovery',
    features: [
      'Pre-race preparation',
      'Post-race recovery',
      'Next-day restoration',
      'Valid for 30 days'
    ]
  },
  {
    name: 'Training Block',
    sessions: '8 Sessions',
    price: 550,
    savings: 200,
    ideal: 'Best for intense training phases',
    features: [
      'Mix any services',
      'Priority scheduling',
      'Performance tracking',
      'Valid for 60 days'
    ]
  }
];

const benefits = [
  'Accelerate full-body recovery',
  'Reduce DOMS (delayed onset muscle soreness)',
  'Combat cumulative training fatigue',
  'Support intense training blocks',
  'Optimize race day performance',
  'Prevent overtraining injuries'
];

const stations = [
  { name: 'SkiErg', recovery: 'Upper body cryo, shoulder relief' },
  { name: 'Sled Push', recovery: 'Quad & glute compression' },
  { name: 'Sled Pull', recovery: 'Full leg cryotherapy' },
  { name: 'Burpee Broad Jump', recovery: 'Core & leg combo treatment' },
  { name: 'Rowing', recovery: 'Back & leg recovery' },
  { name: 'Farmers Carry', recovery: 'Forearm & shoulder cryo' },
  { name: 'Sandbag Lunges', recovery: 'Deep leg tissue work' },
  { name: 'Wall Balls', recovery: 'Full body restoration' }
];

export default function HyroxRecovery() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-orange-900/20" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-600 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-600 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-900/50 backdrop-blur-sm border border-red-500/30 rounded-full mb-6">
              <Flame className="w-5 h-5 text-red-400" />
              <span className="font-semibold text-red-300">HYROX Recovery Specialists</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Recover Like a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                Champion
              </span>
            </h1>

            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Elite recovery for elite athletes. Accelerate your recovery between training 
              sessions and dominate race day.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to={createPageUrl('EventBookingFlow')}>
                <GradientButton size="xl" className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500">
                  Book Recovery Session
                  <ArrowRight className="w-5 h-5" />
                </GradientButton>
              </Link>
              <Link to={createPageUrl('Contact')}>
                <GradientButton size="xl" variant="secondary" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Team Inquiries
                </GradientButton>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-5 h-5 text-red-400" />
                <span>Sessions from 15-45 min</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Target className="w-5 h-5 text-red-400" />
                <span>Mobile service to your location</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-red-400" />
                <span>Used by competitive athletes</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Station-Specific Recovery */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Station-Specific Recovery
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              We understand every station's demands on your body
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stations.map((station, idx) => (
              <motion.div
                key={station.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <GlassCard className="p-4 bg-white/5 backdrop-blur-xl border-white/10">
                  <div className="text-red-400 font-bold mb-2">{station.name}</div>
                  <div className="text-sm text-slate-400">{station.recovery}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recovery Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Performance Recovery Solutions
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Science-backed treatments for high-intensity athletes
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
                <GlassCard className={`p-6 h-full bg-white/5 backdrop-blur-xl ${service.highlight ? 'ring-2 ring-red-500' : 'border-white/10'}`}>
                  {service.highlight && (
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-red-900/50 text-red-300 rounded-full text-xs font-semibold mb-4">
                      <Sparkles className="w-3 h-3" />
                      Most Popular
                    </div>
                  )}
                  <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                  <p className="text-slate-300 mb-4">{service.description}</p>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-slate-400">{service.duration}</span>
                    <span className="text-2xl font-bold text-red-400">${service.price}</span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20 bg-gradient-to-br from-red-900/20 to-orange-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Training & Race Packages
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Commit to recovery, see better results
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
                <GlassCard className="p-8 bg-white/5 backdrop-blur-xl border-white/10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{pkg.name}</h3>
                      <p className="text-red-300">{pkg.sessions}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-red-400">${pkg.price}</div>
                      <div className="text-sm text-green-400">Save ${pkg.savings}</div>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 mb-6 italic">{pkg.ideal}</p>
                  
                  <ul className="space-y-3">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-200">
                        <CheckCircle2 className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link to={createPageUrl('EventBookingFlow')} className="block mt-6">
                    <GradientButton className="w-full bg-gradient-to-r from-red-600 to-orange-600">
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why HYROX Athletes Choose Us
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
                <GlassCard className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                    <p className="text-slate-200 font-medium">{benefit}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Train Harder. Recover Faster. Race Better.
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Book your recovery session and unlock your full potential
          </p>
          <Link to={createPageUrl('EventBookingFlow')}>
            <GradientButton size="xl" variant="secondary" className="bg-white text-red-600 hover:bg-red-50">
              Book Your Session Now
              <ArrowRight className="w-5 h-5" />
            </GradientButton>
          </Link>
        </div>
      </section>
    </div>
  );
}