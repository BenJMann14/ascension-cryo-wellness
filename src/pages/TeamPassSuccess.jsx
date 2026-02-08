import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { CheckCircle2, Ticket, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

export default function TeamPassSuccess() {
  const [teamPass, setTeamPass] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      fetchTeamPass(sessionId);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, []);

  const fetchTeamPass = async (sessionId) => {
    try {
      const response = await base44.functions.invoke('completeTeamPassPurchase', { sessionId });
      if (response.data.teamPass) {
        setTeamPass(response.data.teamPass);
      }
    } catch (error) {
      console.error('Error fetching team pass:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = () => {
    if (teamPass) {
      navigator.clipboard.writeText(teamPass.redemption_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold">Loading your passes...</p>
        </div>
      </div>
    );
  }

  if (!teamPass) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-slate-600">Unable to load pass information.</p>
          <Link to={createPageUrl('VolleyballRecovery')}>
            <Button className="mt-4">Return to Volleyball Recovery</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-fuchsia-600 to-pink-600 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
          >
            <CheckCircle2 className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-5xl font-black text-white mb-3">PASSES SECURED! 🎉</h1>
          <p className="text-2xl text-white/90 font-bold">Your team is ready to recover</p>
        </motion.div>

        {/* Main Pass Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-8 shadow-2xl border-8 border-slate-900 mb-6"
        >
          <div className="text-center mb-8">
            <Ticket className="w-16 h-16 text-pink-600 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-slate-900 mb-6">Your Redemption Code</h2>
            
            <div className="bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-2xl p-8 mb-6 border-4 border-yellow-500 shadow-lg">
              <div className="text-6xl font-black text-slate-900 mb-2 tracking-wider">
                {teamPass.redemption_code}
              </div>
              <Button
                onClick={copyCode}
                variant="outline"
                className="mt-4 font-bold border-2 border-slate-900"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>

            <div className="bg-green-100 rounded-2xl p-6 border-4 border-green-500">
              <div className="text-6xl font-black text-green-600 mb-2">
                {teamPass.total_passes}
              </div>
              <div className="text-xl font-bold text-slate-700">Passes Available</div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200 mb-6">
            <h3 className="font-black text-slate-900 mb-3 text-lg">📧 Check Your Email!</h3>
            <p className="text-slate-700 font-medium">
              We've sent a confirmation email to <strong>{teamPass.customer_email}</strong> with all the details and a screenshot-friendly version of your code.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-black text-slate-900 text-lg">How to Use Your Passes:</h3>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-black">1</span>
                <span className="text-slate-700 font-medium pt-1">Find our booth at the volleyball tournament</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-black">2</span>
                <span className="text-slate-700 font-medium pt-1">Show your code or just say your last name</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-black">3</span>
                <span className="text-slate-700 font-medium pt-1">We'll redeem a pass and get you recovering quickly!</span>
              </li>
            </ol>
          </div>

          <div className="mt-6 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
            <p className="text-sm font-bold text-purple-900">
              💡 <strong>Pro Tip:</strong> Screenshot this page or save the code in your phone for quick access at the tournament!
            </p>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center"
        >
          <p className="text-white font-bold mb-4">
            ✓ Passes can be shared among teammates<br/>
            ✓ Valid for tournament weekend<br/>
            ✓ Any service combination allowed
          </p>
          <Link to={createPageUrl('VolleyballRecovery')}>
            <Button variant="outline" className="bg-white hover:bg-slate-100 text-slate-900 font-black border-4 border-slate-900">
              Back to Tournament Info
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}