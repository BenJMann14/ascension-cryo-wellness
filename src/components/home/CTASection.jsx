import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, CheckCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import GradientButton from '../ui/GradientButton';

export default function CTASection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, this would save to a mailing list
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section className="py-24 bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-600 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.1),transparent_50%)]" />
      
      {/* Floating shapes */}
      <motion.div 
        className="absolute top-20 left-20 w-20 h-20 bg-white/10 rounded-2xl rotate-12"
        animate={{ y: [0, -20, 0], rotate: [12, 20, 12] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-20 right-20 w-32 h-32 bg-white/10 rounded-full"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Elevate Your Recovery?
          </h2>
          <p className="text-xl text-cyan-100 mb-10 max-w-2xl mx-auto">
            Join athletes and high-performers who've transformed their recovery routine. 
            Sign up for exclusive offers and wellness tips.
          </p>

          {/* Email signup form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 rounded-xl bg-white/95 border-0 text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>
              <GradientButton type="submit" variant="dark" size="lg" className="h-14">
                Subscribe
                <ArrowRight className="w-5 h-5" />
              </GradientButton>
            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 text-white mb-8"
            >
              <CheckCircle className="w-6 h-6" />
              <span className="text-lg font-medium">You're on the list! Check your inbox soon.</span>
            </motion.div>
          )}

          <p className="text-sm text-cyan-200">
            No spam, ever. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}