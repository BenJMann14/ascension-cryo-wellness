import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { 
  Truck, 
  Heart, 
  Target, 
  Snowflake,
  ArrowRight,
  Flame,
  Shield,
  Users
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';

const values = [
  {
    icon: Truck,
    title: "Mobile Convenience",
    description: "We come to you—at home, at the gym, or at your event. Elite recovery without the commute."
  },
  {
    icon: Heart,
    title: "Personalized Service",
    description: "One-on-one attention ensuring every treatment is tailored to your specific needs and goals."
  },
  {
    icon: Target,
    title: "Athlete-Tested Methods",
    description: "The same recovery modalities trusted by professional athletes and Olympians worldwide."
  },
  {
    icon: Shield,
    title: "Drug-Free & Natural",
    description: "Non-invasive wellness solutions that work with your body's natural healing processes."
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50/50 to-white" />
        <motion.div 
          className="absolute top-20 right-20 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Photos */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative order-1 lg:order-1"
            >
              {/* Main photo - firefighter */}
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl max-w-md mx-auto">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697aae0c4062dd0f1716e345/1c83d737d_IMG_8052.jpg" 
                  alt="Martin Tomlin - Firefighter"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Secondary photo - family */}
              <motion.div 
                className="absolute -bottom-8 -left-8 w-40 h-40 rounded-2xl overflow-hidden shadow-2xl border-4 border-white hidden lg:block"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697aae0c4062dd0f1716e345/dacbf80ae_IMG_8053.jpg" 
                  alt="Martin with family"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              {/* Floating badge */}
              <motion.div 
                className="absolute top-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-cyan-100"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-2">
                  <Snowflake className="w-5 h-5 text-cyan-500" />
                  <span className="font-semibold text-slate-900">Recovery Specialist</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-2"
            >
              <span className="inline-block px-4 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium mb-4">
                About Ascension
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Meet Martin Tomlin
              </h1>
              <p className="text-xl text-cyan-600 font-medium mb-6">
                Founder & Recovery Specialist
              </p>
              <div className="prose prose-lg text-slate-600 space-y-4">
                <p>
                  Martin Tomlin is a dedicated San Antonio firefighter, husband, and father who founded 
                  Ascension Cryo & Wellness to bring elite recovery solutions directly to athletes 
                  and high-performers in the San Antonio area.
                </p>
                <p>
                  After years of experiencing the physical demands of firefighting—48-hour shifts, 
                  intense physical exertion, and the need for rapid recovery—Martin discovered the 
                  transformative power of cryotherapy and modern recovery modalities. What started 
                  as a personal quest for better recovery evolved into a mission to make these 
                  elite-level treatments accessible to everyone.
                </p>
                <p>
                  Drawing from his firsthand experience as both an athlete and first responder, 
                  Martin understands the importance of efficient, effective recovery. His passion 
                  lies in helping others optimize their performance, reduce pain, and extend their 
                  active years through drug-free, non-invasive wellness solutions.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard className="p-8 md:p-12 bg-gradient-to-br from-cyan-50 to-blue-50">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                  <Target className="w-5 h-5 text-cyan-600" />
                  <span className="font-semibold text-slate-900">Our Mission</span>
                </div>
              </div>
              <p className="text-lg md:text-xl text-slate-700 text-center leading-relaxed">
                To bring elite-level recovery and wellness services directly to athletes, 
                high-performers, and anyone seeking to optimize their health—making 
                professional-grade treatments accessible, convenient, and personalized.
              </p>
              <div className="mt-8 text-center">
                <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Train. Recover. Ascend.
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* The Ascension Difference */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium mb-4">
              Why Ascension?
            </span>
            <h2 className="text-4xl font-bold text-white mb-4">The Ascension Difference</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              What sets us apart in the world of recovery and wellness.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="h-full p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-slate-400">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium mb-4">
              The Vision
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Building the Future of Wellness
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Ascension Cryo & Wellness is more than a mobile recovery service—it's the foundation 
              for a comprehensive wellness and longevity center. Our vision includes expanding to 
              include advanced treatments like IV therapy, peptides, and regenerative medicine, 
              all while maintaining the personalized, convenient approach that defines Ascension.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Users className="w-8 h-8 text-cyan-500" />
              <span className="text-slate-700">
                Join us on the journey to optimal health and performance.
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-500 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Elevate Your Recovery?
            </h2>
            <p className="text-xl text-cyan-100 mb-8">
              Experience personalized, professional recovery services delivered directly to you.
            </p>
            <Link to={createPageUrl('BookSession')}>
              <GradientButton variant="dark" size="lg">
                Book Your Session
                <ArrowRight className="w-5 h-5" />
              </GradientButton>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}