import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Snowflake, Wind, Sun, Activity, ArrowRight } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const services = [
  {
    icon: Snowflake,
    title: "Localized Cryotherapy",
    description: "Targeted cold therapy at -10°F for rapid inflammation reduction and pain relief.",
    color: "from-cyan-500 to-cyan-600",
    bgColor: "bg-cyan-50",
    iconColor: "text-cyan-600",
    expandId: "cryo"
  },
  {
    icon: Wind,
    title: "Compression Therapy",
    description: "Normatec pneumatic compression for enhanced circulation and faster recovery.",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    expandId: "compression"
  },
  {
    icon: Sun,
    title: "Red Light Therapy",
    description: "Cellular regeneration and tissue repair through therapeutic light wavelengths.",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600",
    expandId: "redlight"
  },
  {
    icon: Activity,
    title: "Vibration Therapy",
    description: "Lymphatic drainage and muscle activation through whole-body vibration.",
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
    expandId: "vibration"
  }
];

export default function ServicesOverview() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.05),transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Advanced Recovery Modalities
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Science-backed treatments delivered with precision and care—right at your doorstep.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard className="h-full p-6 group">
                <div className={`w-14 h-14 ${service.bgColor} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className={service.iconColor} style={{ width: '28px', height: '28px' }} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 mb-5 leading-relaxed">{service.description}</p>
                <Link 
                  to={createPageUrl('Services') + '?expand=' + service.expandId} 
                  className="inline-flex items-center text-cyan-600 font-medium hover:text-cyan-700 transition-colors group/link"
                >
                  Learn More 
                  <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link 
            to={createPageUrl('Services')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
          >
            View All Services
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}