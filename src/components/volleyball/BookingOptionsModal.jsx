import React from 'react';
import { motion } from 'framer-motion';
import { X, Users, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BookingOptionsModal({ isOpen, onClose, onSelectTeamPass, onSelectIndividual }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border-8 border-slate-900"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-fuchsia-600 p-6 relative rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-3xl font-black text-white">Choose Booking Type</h2>
          <p className="text-white/90 font-medium mt-2">Select the best option for you</p>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Individual Session */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSelectIndividual}
              className="bg-white border-4 border-slate-900 rounded-2xl p-8 text-left shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Individual Session</h3>
              <p className="text-slate-600 mb-4">
                Book a single recovery session
              </p>
              <div className="bg-yellow-400 text-slate-900 font-black text-sm px-4 py-2 rounded-lg inline-block">
                ⚡ Quick & Easy
              </div>
            </motion.button>

            {/* Team Passes */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSelectTeamPass}
              className="bg-white border-4 border-slate-900 rounded-2xl p-8 text-left shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-fuchsia-600 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Team Passes</h3>
              <p className="text-slate-600 mb-4">
                Buy 3, 6, 9, or 12 passes at discounted rates
              </p>
              <div className="bg-green-100 text-green-900 font-bold text-sm px-4 py-2 rounded-lg inline-block">
                💰 SAVE UP TO $240
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}