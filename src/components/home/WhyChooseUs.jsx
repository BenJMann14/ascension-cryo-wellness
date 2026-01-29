import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Timer, Shield, Users, Zap, Heart } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: "We Come to You",
    description: "100% mobile service—recovery at your home, gym, or event. No travel required."
  },
  {
    icon: Timer,
    title: "Quick Sessions",
    description: "5-15 minutes for recovery treatments, up to 60 minutes for aesthetics. Fit it into any schedule."
  },
  {
    icon: Shield,
    title: "Drug-Free & Non-Invasive",
    description: "Natural wellness modalities with no chemicals, needles, or downtime."
  },
  {
    icon: Zap,
    title: "Athlete-Tested",
    description: "Elite recovery methods used by professional athletes worldwide."
  },
  {
    icon: Users,
    title: "Teams & Events",
    description: "Perfect for tournaments, competitions, and team training camps."
  },
  {
    icon: Heart,
    title: "Longevity Focus",
    description: "Supporting your long-term health, performance, and vitality."
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(6,182,212,0.15),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.1),transparent_40%)]" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium mb-4">
            The Ascension Difference
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Choose Ascension?
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Elevate your recovery with personalized, mobile wellness solutions.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}