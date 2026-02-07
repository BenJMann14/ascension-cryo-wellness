import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Snowflake, 
  Wind, 
  Sun, 
  Activity,
  Sparkles,
  Package,
  Zap,
  Calendar,
  Check,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const tabs = [
  { id: 'individual', label: 'Individual Services', icon: Sparkles },
  { id: 'packages', label: 'Packages & Combos', icon: Package },
  { id: 'events', label: 'Event Pricing', icon: Calendar }
];

const individualServices = {
  recovery: [
    { name: 'Localized Cryo (Single Area)', duration: '5-15 min', price: 75, addon: null },
    { name: 'Localized Cryo (Dual Area)', duration: '10-20 min', price: 120, addon: null },
    { name: 'Localized Cryo (Full Protocol)', duration: '15-30 min', price: 150, addon: null },
    { name: 'Compression Therapy', duration: '15 min', price: 40, addon: 35 },
    { name: 'Red Light Therapy', duration: '15-30 min', price: 30, addon: 25 },
    { name: 'Vibration Plate', duration: '10-15 min', price: 20, addon: 15 }
  ],
  aesthetic: [
    { name: 'Cryo Body Sculpting', duration: '30-60 min/area', price: 300, addon: null },
    { name: 'Cryo Facial (Frotox)', duration: '20-30 min', price: 125, addon: null },
    { name: 'Scalp & Hair Therapy', duration: '20-30 min', price: 125, addon: null }
  ]
};

const packages = [
  { 
    name: 'Rapid Relief Package', 
    sessions: 3, 
    service: 'Localized Cryotherapy',
    regular: 225, 
    price: 210, 
    savings: 15,
    duration: 'Valid for 60 days',
    description: 'Perfect for acute pain and short-term recovery needs'
  },
  { 
    name: 'Injury Recovery Package', 
    sessions: 6, 
    service: 'Localized Cryotherapy',
    regular: 450, 
    price: 390, 
    savings: 60,
    duration: 'Valid for 90 days',
    description: 'Ideal for chronic pain and ongoing injury recovery'
  },
  { 
    name: 'Elite Recovery Package', 
    sessions: 10, 
    service: 'Localized Cryotherapy',
    regular: 750, 
    price: 600, 
    savings: 150,
    duration: 'Valid for 6 months',
    description: 'Best value for serious athletes and long-term optimization',
    featured: true
  }
];

const combos = [
  { 
    name: 'Recovery Express', 
    services: ['Cryotherapy', 'Vibration Plate'],
    regular: 75, 
    price: 65, 
    savings: 10,
    duration: '~20 minutes',
    description: 'Quick recovery between training sessions'
  },
  { 
    name: 'Athlete Reset', 
    services: ['Cryotherapy', 'Compression Therapy'],
    regular: 95, 
    price: 80, 
    savings: 15,
    duration: '~30 minutes',
    description: 'Post-competition recovery'
  },
  { 
    name: 'Performance Boost', 
    services: ['Cryotherapy', 'Red Light Therapy'],
    regular: 85, 
    price: 75, 
    savings: 10,
    duration: '~30 minutes',
    description: 'Tissue healing and inflammation reduction'
  },
  { 
    name: 'Full Recovery Stack', 
    services: ['Cryotherapy', 'Compression', 'Red Light'],
    regular: 130, 
    price: 110, 
    savings: 20,
    duration: '~45-60 minutes',
    description: 'Comprehensive recovery protocol',
    featured: true
  },
  { 
    name: 'Ultimate Lymphatic Flush', 
    services: ['Cryotherapy', 'Vibration', 'Red Light'],
    regular: 105, 
    price: 90, 
    savings: 15,
    duration: '~40 minutes',
    description: 'Detoxification and full-body recovery'
  }
];

const eventPricing = {
  single: [
    { name: 'Localized Cryotherapy', price: 50, regular: 75 },
    { name: 'Compression Therapy', price: 40, regular: 40 },
    { name: 'Red Light Therapy', price: 30, regular: 30 },
    { name: 'Vibration Plate', price: 20, regular: 20 }
  ],
  combos: [
    { name: 'Recovery Express', services: ['Cryo', 'Vibration'], price: 65, savings: 10 },
    { name: 'Athlete Reset', services: ['Cryo', 'Compression'], price: 80, savings: 15 },
    { name: 'Full Recovery Stack', services: ['Cryo', 'Compression', 'Red Light'], price: 110, savings: 20 }
  ],
  passes: [
    { name: '3 Cryo Sessions', price: 135, savings: 15 },
    { name: 'Unlimited Day Pass', price: 180, description: 'All services, all day' },
    { name: 'Team Pack (10 Sessions)', price: 450, savings: 50, description: 'Shareable among team members' }
  ]
};

const faqs = [
  {
    question: "Do you accept insurance?",
    answer: "Currently, we do not accept insurance as our services are classified as wellness modalities, not medical treatments. We provide invoices that you can submit to your HSA/FSA if applicable."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, Apple Pay, Google Pay, PayPal, and cryptocurrency through Coinbase Commerce."
  },
  {
    question: "Can I buy now and schedule later?",
    answer: "Yes! Packages are valid for the specified duration (60 days to 6 months depending on the package). You can purchase and schedule sessions at your convenience within that timeframe."
  },
  {
    question: "Do you travel outside San Antonio?",
    answer: "We serve individual clients within a 60-mile radius of Leon Valley/San Antonio. For events outside this area, please contact us for custom travel arrangements and pricing."
  },
  {
    question: "What is your cancellation policy?",
    answer: "Full refunds are available for cancellations made 24+ hours before your scheduled appointment. Cancellations within 24 hours may be subject to a cancellation fee."
  }
];

export default function Pricing() {
  const [activeTab, setActiveTab] = useState('individual');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50/50 to-white" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium mb-4">
              Transparent Pricing
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              No Hidden Fees. No Surprises.
            </h1>
            <p className="text-xl text-slate-600">
              Simple, straightforward pricing for all our recovery and aesthetic services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="sticky top-20 z-30 bg-white/95 backdrop-blur-xl border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {activeTab === 'individual' && (
              <motion.div
                key="individual"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                {/* Recovery Services */}
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Snowflake className="w-6 h-6 text-cyan-500" />
                    Recovery & Performance
                  </h2>
                  <GlassCard className="overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-50 border-b">
                            <th className="text-left p-4 font-semibold text-slate-700">Service</th>
                            <th className="text-left p-4 font-semibold text-slate-700">Duration</th>
                            <th className="text-right p-4 font-semibold text-slate-700">Price</th>
                            <th className="text-right p-4 font-semibold text-slate-700">Add-On Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {individualServices.recovery.map((service, i) => (
                            <tr key={i} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                              <td className="p-4 font-medium text-slate-900">{service.name}</td>
                              <td className="p-4 text-slate-600">{service.duration}</td>
                              <td className="p-4 text-right font-bold text-cyan-600">${service.price}</td>
                              <td className="p-4 text-right text-slate-600">
                                {service.addon ? `$${service.addon}` : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </GlassCard>
                </div>

                {/* Aesthetic Services */}
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-pink-500" />
                    Aesthetic Services
                  </h2>
                  <GlassCard className="overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-50 border-b">
                            <th className="text-left p-4 font-semibold text-slate-700">Service</th>
                            <th className="text-left p-4 font-semibold text-slate-700">Duration</th>
                            <th className="text-right p-4 font-semibold text-slate-700">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {individualServices.aesthetic.map((service, i) => (
                            <tr key={i} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                              <td className="p-4 font-medium text-slate-900">{service.name}</td>
                              <td className="p-4 text-slate-600">{service.duration}</td>
                              <td className="p-4 text-right font-bold text-pink-600">${service.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            )}

            {activeTab === 'packages' && (
              <motion.div
                key="packages"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                {/* Recovery Packages */}
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Package className="w-6 h-6 text-cyan-500" />
                    Recovery Packages
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {packages.map((pkg, i) => (
                      <GlassCard 
                        key={i} 
                        className={`p-6 relative ${pkg.featured ? 'ring-2 ring-cyan-500' : ''}`}
                      >
                        {pkg.featured && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-full">
                            BEST VALUE
                          </div>
                        )}
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
                          <p className="text-sm text-slate-600 mb-4">{pkg.description}</p>
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-4xl font-bold text-cyan-600">${pkg.price}</span>
                            <span className="text-sm text-slate-400 line-through">${pkg.regular}</span>
                          </div>
                          <div className="mt-2 inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            Save ${pkg.savings}
                          </div>
                        </div>
                        <ul className="space-y-3 mb-6">
                          <li className="flex items-center gap-2 text-slate-600">
                            <Check className="w-5 h-5 text-cyan-500" />
                            {pkg.sessions} {pkg.service} Sessions
                          </li>
                          <li className="flex items-center gap-2 text-slate-600">
                            <Check className="w-5 h-5 text-cyan-500" />
                            {pkg.duration}
                          </li>
                        </ul>
                        <Link to={createPageUrl('BookSession') + '?service=' + (
                          pkg.name === 'Rapid Relief Package' ? 'pkg-rapid' :
                          pkg.name === 'Injury Recovery Package' ? 'pkg-injury' :
                          'pkg-elite'
                        )}>
                          <GradientButton className="w-full" variant={pkg.featured ? 'primary' : 'outline'}>
                            Select Package
                          </GradientButton>
                        </Link>
                      </GlassCard>
                    ))}
                  </div>
                </div>

                {/* Performance Combos */}
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Zap className="w-6 h-6 text-amber-500" />
                    Performance Combos
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {combos.map((combo, i) => (
                      <GlassCard 
                        key={i} 
                        className={`p-6 ${combo.featured ? 'ring-2 ring-amber-500' : ''}`}
                      >
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{combo.name}</h3>
                        <p className="text-sm text-slate-600 mb-4">{combo.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {combo.services.map((service, j) => (
                            <span key={j} className="px-2 py-1 bg-slate-100 rounded-lg text-xs text-slate-600">
                              {service}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-amber-600">${combo.price}</span>
                            <span className="text-sm text-slate-400 line-through ml-2">${combo.regular}</span>
                          </div>
                          <span className="text-xs text-green-600 font-medium">Save ${combo.savings}</span>
                        </div>
                        <div className="text-sm text-slate-500 mt-2 mb-4">{combo.duration}</div>
                        <Link to={createPageUrl('BookSession') + '?service=' + (
                          combo.name === 'Recovery Express' ? 'combo-express' :
                          combo.name === 'Athlete Reset' ? 'combo-reset' :
                          combo.name === 'Performance Boost' ? 'combo-boost' :
                          combo.name === 'Full Recovery Stack' ? 'combo-full' :
                          'combo-lymph'
                        )}>
                          <GradientButton className="w-full" variant={combo.featured ? 'primary' : 'outline'} size="sm">
                            Book Now
                          </GradientButton>
                        </Link>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'events' && (
              <motion.div
                key="events"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="text-center mb-8">
                  <p className="text-lg text-slate-600">
                    Special rates for tournaments, competitions, and team events
                  </p>
                </div>

                {/* Event Single Services */}
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Event Single Services</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {eventPricing.single.map((service, i) => (
                      <GlassCard key={i} className="p-5 text-center">
                        <h3 className="font-semibold text-slate-900 mb-2">{service.name}</h3>
                        <div className="text-3xl font-bold text-cyan-600">${service.price}</div>
                        {service.price < service.regular && (
                          <div className="text-sm text-slate-400 line-through">${service.regular}</div>
                        )}
                      </GlassCard>
                    ))}
                  </div>
                </div>

                {/* Event Combos */}
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Event Combo Bundles</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {eventPricing.combos.map((combo, i) => (
                      <GlassCard key={i} className="p-6">
                        <h3 className="font-bold text-slate-900 mb-3">{combo.name}</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {combo.services.map((service, j) => (
                            <span key={j} className="px-2 py-1 bg-cyan-50 text-cyan-700 rounded text-xs">
                              {service}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-cyan-600">${combo.price}</span>
                          <span className="text-sm text-green-600 font-medium">Save ${combo.savings}</span>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </div>

                {/* Event Passes */}
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Event Passes</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {eventPricing.passes.map((pass, i) => (
                      <GlassCard key={i} className="p-6">
                        <h3 className="font-bold text-slate-900 mb-2">{pass.name}</h3>
                        {pass.description && (
                          <p className="text-sm text-slate-600 mb-4">{pass.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-cyan-600">${pass.price}</span>
                          {pass.savings && (
                            <span className="text-sm text-green-600 font-medium">Save ${pass.savings}</span>
                          )}
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </div>

                {/* Event CTA */}
                <GlassCard className="p-8 text-center bg-gradient-to-r from-cyan-50 to-blue-50">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Planning a Tournament or Team Event?</h3>
                  <p className="text-slate-600 mb-6">Contact us for custom event pricing and packages tailored to your needs.</p>
                  <Link to={createPageUrl('Contact')}>
                    <GradientButton size="lg">
                      Contact Us for Custom Event Pricing
                      <ArrowRight className="w-5 h-5" />
                    </GradientButton>
                  </Link>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium mb-4">
              <HelpCircle className="w-4 h-4" />
              FAQ
            </span>
            <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
          </div>
          
          <GlassCard className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-cyan-600">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </GlassCard>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-gradient-to-r from-cyan-500 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Recovery Journey?
          </h2>
          <p className="text-xl text-cyan-100 mb-8">
            Book your first session and experience the Ascension difference.
          </p>
          <Link to={createPageUrl('BookSession')}>
            <GradientButton variant="dark" size="lg">
              Book Your Session
              <ArrowRight className="w-5 h-5" />
            </GradientButton>
          </Link>
        </div>
      </section>
    </div>
  );
}