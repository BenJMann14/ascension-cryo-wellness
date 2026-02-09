import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 rounded-2xl mb-4">
              <FileText className="w-8 h-8 text-cyan-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-slate-600">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Services</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Ascension Cryo & Wellness ("we," "us," or "our") provides mobile recovery and wellness services including but not limited to cryotherapy, compression therapy, red light therapy, and related wellness treatments.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Liability & Assumption of Risk</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                By booking and using our services, you acknowledge and agree that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>Our services are for wellness and recovery purposes and are not medical treatments</li>
                <li>You should consult with a healthcare provider before using our services if you have any medical conditions</li>
                <li>You assume all risks associated with the use of our services</li>
                <li>We are not liable for any injuries, damages, or adverse effects resulting from the use of our services</li>
                <li>You release Ascension Cryo & Wellness, its owners, employees, and contractors from any and all liability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Medical Disclaimer</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Our services are not intended to diagnose, treat, cure, or prevent any disease. They should not replace professional medical advice. You should not use our services if you:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>Are pregnant or nursing</li>
                <li>Have a pacemaker or other electronic medical device</li>
                <li>Have severe cardiovascular conditions</li>
                <li>Have cold sensitivity disorders or Raynaud's disease</li>
                <li>Have open wounds or skin conditions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Booking & Cancellation</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                All bookings require advance payment. Cancellations must be made at least 24 hours in advance for a full refund. Cancellations made within 24 hours of the appointment are non-refundable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Conduct</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                You agree to conduct yourself in a respectful manner during service appointments. We reserve the right to refuse service to anyone who is abusive, intoxicated, or behaves inappropriately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Indemnification</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                You agree to indemnify and hold harmless Ascension Cryo & Wellness from any claims, damages, or expenses arising from your use of our services or violation of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Changes to Terms</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Contact</h2>
              <p className="text-slate-600 leading-relaxed">
                If you have questions about these Terms of Service, please contact us at info@ascensioncryo.com
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}