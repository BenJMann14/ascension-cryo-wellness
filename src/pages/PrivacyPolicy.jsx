import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
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
              <Shield className="w-8 h-8 text-cyan-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-slate-600">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                When you book our services, we collect:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>Personal information (name, email, phone number)</li>
                <li>Service address and location information</li>
                <li>Payment information (processed securely through Stripe)</li>
                <li>Special requests or health-related notes you provide</li>
                <li>Booking and appointment history</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We use your information to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>Schedule and fulfill service appointments</li>
                <li>Communicate with you about your bookings</li>
                <li>Process payments securely</li>
                <li>Send service updates and confirmations</li>
                <li>Improve our services based on your feedback</li>
                <li>Send promotional materials (only if you opt in)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Information Sharing</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We do not sell your personal information. We share information only with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>Service providers necessary to operate our business (payment processing, scheduling)</li>
                <li>Law enforcement when required by law</li>
                <li>Business partners only with your explicit consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Security</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your information. Payment information is processed through Stripe and is never stored on our servers. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Your Rights</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>Access your personal information</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt out of marketing communications at any time</li>
                <li>Withdraw consent for data processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Cookies & Tracking</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We use cookies and similar technologies to improve your experience, analyze site usage, and personalize content. You can control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Children's Privacy</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Our services are not directed to children under 18. We do not knowingly collect information from minors.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Changes to This Policy</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We may update this Privacy Policy periodically. Changes will be posted on this page with an updated date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Contact Us</h2>
              <p className="text-slate-600 leading-relaxed">
                If you have questions about this Privacy Policy or wish to exercise your rights, please contact us at info@ascensioncryo.com or (210) 555-1234.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}