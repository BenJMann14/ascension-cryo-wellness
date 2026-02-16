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
    { name: 'Lymphatic Therapy', duration: '10-15 min', price: 20, addon: 15 }
  ],
  aesthetic: [
    { name: 'Cryo Body Sculpting', duration: '30-60 min/area', price: 300, addon: null },
    { name: 'Cryo Facial (Frotox)', duration: '20-30 min', price: 125, addon: null },
    { name: 'Scalp & Hair Therapy', duration: '20-30 min', price: 125, addon: null },
    { name: 'Skin Health & Tattoo Brightening', duration: '20-30 min', price: 100, addon: null }
  ]
};

const packages = [
  { 
    name: 'Acute Pain Relief Program', 
    sessions: 3, 
    service: 'Cryotherapy',
    regular: 225, 
    price: 210, 
    savings: 15,
    duration: 'Pain relief, injury recovery',
    description: '3 Cryotherapy Sessions'
  },
  { 
    name: 'Injury Recovery Program', 
    sessions: 6, 
    service: 'Cryotherapy',
    regular: 450, 
    price: 390, 
    savings: 60,
    duration: 'Pain relief, injury recovery, performance longevity',
    description: '6 Cryotherapy Sessions'
  },
  { 
    name: 'Chronic Pain & Joint Care Program', 
    sessions: 10, 
    service: 'Cryotherapy',
    regular: 750, 
    price: 600, 
    savings: 150,
    duration: 'Pain relief, injury recovery, performance longevity',
    description: '10 Cryotherapy Sessions'
  },
  { 
    name: 'Sports Performance Recovery Program', 
    sessions: '6 + 6', 
    service: 'Cryo + Compression',
    regular: 810, 
    price: 690, 
    savings: 120,
    duration: 'Pain relief, injury recovery, performance longevity',
    description: '6 Cryo + 6 Compression Sessions',
    featured: true
  },
  { 
    name: 'Elite Orthopedic Recovery Program', 
    sessions: '10 + 10 + 5', 
    service: 'Cryo + Compression + Red Light',
    regular: 1325, 
    price: 1050, 
    savings: 275,
    duration: 'Pain relief, injury recovery, performance longevity',
    description: '10 Cryo + 10 Compression + 5 Red Light Sessions',
    featured: true
  }
];

const aestheticPackages = {
  bodySculpt: [
    { name: 'Starter Sculpt', sessions: 3, regular: 900, price: 840, savings: 60 },
    { name: 'Transformation Sculpt', sessions: 6, regular: 1800, price: 1560, savings: 240, featured: true },
    { name: 'Ultimate Sculpt', sessions: 10, regular: 3000, price: 2400, savings: 600 }
  ],
  facial: [
    { name: 'Glow Boost', sessions: 3, regular: 375, price: 330, savings: 45 },
    { name: 'Age-Defying Series', sessions: 6, regular: 750, price: 630, savings: 120 },
    { name: 'Signature Plan', sessions: 10, regular: 1250, price: 1000, savings: 250, featured: true }
  ],
  scalp: [
    { name: 'Hair Revival', sessions: 6, regular: 750, price: 660, savings: 90 },
    { name: 'Full Restoration', sessions: 10, regular: 1250, price: 1000, savings: 250 }
  ],
  skin: [
    { name: 'Skin Reset', sessions: 3, regular: 300, price: 270, savings: 30 },
    { name: 'Skin Renewal', sessions: 6, regular: 600, price: 510, savings: 90 },
    { name: 'Skin Optimization', sessions: 10, regular: 1000, price: 800, savings: 200 }
  ]
};

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
                    <Sparkles className="w-6 h-6 text-rose-500" />
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
                              <td className="p-4 text-right font-bold text-rose-600">${service.price}</td>
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
                            {pkg.description}
                          </li>
                          <li className="flex items-center gap-2 text-slate-600 text-sm">
                            <Check className="w-4 h-4 text-cyan-500" />
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

                {/* Aesthetic Session Packages */}
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-rose-500" />
                    Aesthetic Session Packages
                  </h2>
                  <p className="text-slate-600 mb-6">Best results achieved with consistency - save more with packages</p>

                  {/* Body Sculpting Packages */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Cryo Body Sculpting (per area)</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      {aestheticPackages.bodySculpt.map((pkg, i) => (
                        <GlassCard key={i} className={`p-6 ${pkg.featured ? 'ring-2 ring-rose-500' : ''}`}>
                          {pkg.featured && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-bold rounded-full">
                              MOST POPULAR
                            </div>
                          )}
                          <h4 className="text-xl font-bold text-slate-900 mb-2">{pkg.name}</h4>
                          <p className="text-sm text-slate-600 mb-4">{pkg.sessions} Cryotherapy Sessions</p>
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-3xl font-bold text-rose-600">${pkg.price}</span>
                            <span className="text-sm text-slate-400 line-through">${pkg.regular}</span>
                          </div>
                          <div className="mb-4 inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            Save ${pkg.savings}
                          </div>
                          <Link to={createPageUrl('BookSession')}>
                            <GradientButton className="w-full" variant={pkg.featured ? 'primary' : 'outline'}>
                              Select Package
                            </GradientButton>
                          </Link>
                        </GlassCard>
                      ))}
                    </div>
                  </div>

                  {/* Facial Packages */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Cryo Facial (Frotox)</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      {aestheticPackages.facial.map((pkg, i) => (
                        <GlassCard key={i} className={`p-6 ${pkg.featured ? 'ring-2 ring-pink-500' : ''}`}>
                          {pkg.featured && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs font-bold rounded-full">
                              BEST VALUE
                            </div>
                          )}
                          <h4 className="text-xl font-bold text-slate-900 mb-2">{pkg.name}</h4>
                          <p className="text-sm text-slate-600 mb-4">{pkg.sessions} Cryotherapy Sessions</p>
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-3xl font-bold text-pink-600">${pkg.price}</span>
                            <span className="text-sm text-slate-400 line-through">${pkg.regular}</span>
                          </div>
                          <div className="mb-4 inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            Save ${pkg.savings}
                          </div>
                          <Link to={createPageUrl('BookSession')}>
                            <GradientButton className="w-full" variant={pkg.featured ? 'primary' : 'outline'}>
                              Select Package
                            </GradientButton>
                          </Link>
                        </GlassCard>
                      ))}
                    </div>
                  </div>

                  {/* Scalp Packages */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Scalp & Hair Restoration</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {aestheticPackages.scalp.map((pkg, i) => (
                        <GlassCard key={i} className="p-6">
                          <h4 className="text-xl font-bold text-slate-900 mb-2">{pkg.name}</h4>
                          <p className="text-sm text-slate-600 mb-4">{pkg.sessions} Cryotherapy Sessions</p>
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-3xl font-bold text-purple-600">${pkg.price}</span>
                            <span className="text-sm text-slate-400 line-through">${pkg.regular}</span>
                          </div>
                          <div className="mb-4 inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            Save ${pkg.savings}
                          </div>
                          <Link to={createPageUrl('BookSession')}>
                            <GradientButton className="w-full" variant="outline">
                              Select Package
                            </GradientButton>
                          </Link>
                        </GlassCard>
                      ))}
                    </div>
                  </div>

                  {/* Skin Health Packages */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Skin Health Therapy</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      {aestheticPackages.skin.map((pkg, i) => (
                        <GlassCard key={i} className="p-6">
                          <h4 className="text-xl font-bold text-slate-900 mb-2">{pkg.name}</h4>
                          <p className="text-sm text-slate-600 mb-4">{pkg.sessions} Cryotherapy Sessions</p>
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-3xl font-bold text-cyan-600">${pkg.price}</span>
                            <span className="text-sm text-slate-400 line-through">${pkg.regular}</span>
                          </div>
                          <div className="mb-4 inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            Save ${pkg.savings}
                          </div>
                          <Link to={createPageUrl('BookSession')}>
                            <GradientButton className="w-full" variant="outline">
                              Select Package
                            </GradientButton>
                          </Link>
                        </GlassCard>
                      ))}
                    </div>
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
                      <GlassCard key={i} className="p-5 text-center flex flex-col">
                        <h3 className="font-semibold text-slate-900 mb-3">{service.name}</h3>
                        <div className="text-3xl font-bold text-cyan-600 mb-1">${service.price}</div>
                        <div className="h-5 mb-3">
                          {service.price < service.regular && (
                            <div className="text-sm text-slate-400 line-through">${service.regular}</div>
                          )}
                        </div>
                        <Link to={createPageUrl('EventBooking')} className="mt-auto">
                          <GradientButton className="w-full" size="sm" variant="outline">
                            Book Event
                          </GradientButton>
                        </Link>
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
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-cyan-600">${combo.price}</span>
                          <span className="text-sm text-green-600 font-medium">Save ${combo.savings}</span>
                        </div>
                        <Link to={createPageUrl('EventBooking')}>
                          <GradientButton className="w-full" size="sm" variant="outline">
                            Book Event
                          </GradientButton>
                        </Link>
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
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-cyan-600">${pass.price}</span>
                          {pass.savings && (
                            <span className="text-sm text-green-600 font-medium">Save ${pass.savings}</span>
                          )}
                        </div>
                        <Link to={createPageUrl('EventBooking')}>
                          <GradientButton className="w-full" size="sm" variant="outline">
                            Book Event
                          </GradientButton>
                        </Link>
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