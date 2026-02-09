import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Snowflake, 
  Wind, 
  Sun, 
  Activity,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  ArrowRight,
  Check,
  Scan
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';

const recoveryServices = [
  {
    id: 'cryo',
    icon: Snowflake,
    title: "Localized Cryotherapy",
    description: "Localized cryotherapy uses a handheld device to deliver ultra-cold CO₂ therapy directly to targeted areas of your body. This rapid temperature drop (to -10°F) reduces inflammation, blocks pain signals, increases oxygen flow and circulation, and accelerates tissue healing.",
    howItWorks: "Using a mobile CO₂ delivery system, Martin applies concentrated cold therapy precisely where you need it most. The extreme cold triggers your body's natural healing response, flooding the area with oxygen-rich blood and reducing inflammatory markers.",
    benefits: [
      "Rapid inflammation reduction",
      "Acute and chronic pain relief",
      "Faster sports injury recovery",
      "Reduced post-workout soreness",
      "Joint inflammation management",
      "Migraine relief",
      "Improved circulation and oxygen flow"
    ],
    idealFor: [
      "Sports injuries (sprains, strains, tears)",
      "Chronic pain conditions",
      "Post-workout recovery",
      "Joint inflammation (knees, shoulders, elbows)",
      "Tendonitis and bursitis",
      "Acute injury management",
      "Migraine and headache relief"
    ],
    duration: "5-15 minutes",
    pricing: [
      { name: "Single Area", price: 75 },
      { name: "Dual Area", price: 120 },
      { name: "Full Orthopedic Protocol", price: 150 }
    ],
    color: "cyan"
  },
  {
    id: 'compression',
    icon: Scan,
    title: "Compression Therapy (Normatec)",
    description: "Dynamic pneumatic compression therapy using Normatec technology improves blood flow, flushes metabolic waste, and speeds recovery by enhancing lymphatic and venous circulation. Available for legs, hips, and arms.",
    howItWorks: "You relax while Normatec compression attachments deliver sequential compression massage to your legs, hips, or arms. This mimics natural muscle contractions, pushing blood and lymphatic fluid through your system, removing waste products and reducing swelling.",
    benefits: [
      "Faster muscle recovery after training",
      "Reduced swelling and inflammation",
      "Improved mobility and flexibility",
      "Lactic acid removal",
      "Enhanced circulation",
      "Post-event recovery acceleration"
    ],
    idealFor: [
      "Post-workout recovery",
      "Marathon and endurance athletes",
      "Leg day recovery",
      "Travel recovery (long flights/drives)",
      "Reducing muscle soreness",
      "Pre-competition warm-up"
    ],
    duration: "15-30 minutes",
    pricing: [
      { name: "15-Minute Session", price: 40 },
      { name: "Add-On (with other service)", price: 35 }
    ],
    color: "blue"
  },
  {
    id: 'redlight',
    icon: Sun,
    title: "Red Light Therapy",
    description: "Red and near-infrared light therapy penetrates deep into tissue to stimulate mitochondrial activity, enhance cellular repair, and support muscle recovery, longevity, and overall wellness.",
    howItWorks: "Specific wavelengths of red and near-infrared light penetrate your skin and are absorbed by mitochondria (your cells' energy factories). This stimulates ATP production, enhances cellular repair, and triggers anti-inflammatory responses throughout your body.",
    benefits: [
      "Accelerated tissue healing",
      "Reduced inflammation",
      "Improved cellular energy production",
      "Enhanced muscle recovery",
      "Skin health and collagen production",
      "Joint support and pain relief",
      "Longevity and anti-aging benefits"
    ],
    idealFor: [
      "Muscle recovery",
      "Chronic pain management",
      "Skin health and anti-aging",
      "Joint inflammation",
      "Wound healing",
      "Overall longevity and wellness optimization",
      "Biohackers and health enthusiasts"
    ],
    duration: "15-30 minutes",
    pricing: [
      { name: "Session", price: 30 },
      { name: "Add-On (with other service)", price: 25 }
    ],
    color: "amber"
  },
  {
    id: 'vibration',
    icon: Activity,
    title: "Vibration Plate Therapy",
    description: "Whole-body vibration therapy activates muscles and stimulates lymphatic drainage, helping remove toxins while priming your body for recovery or performance. This passive exercise modality complements other recovery treatments perfectly.",
    howItWorks: "Stand on the vibration plate while it delivers rapid, controlled vibrations throughout your body. These vibrations cause involuntary muscle contractions, activate your lymphatic system, and stimulate your nervous system—all while you remain stationary.",
    benefits: [
      "Lymphatic detoxification",
      "Muscle activation without exertion",
      "Nervous system stimulation",
      "Improved circulation",
      "Enhanced bone density",
      "Balance and stability improvement",
      "Pre-workout warm-up"
    ],
    idealFor: [
      "Lymphatic system support",
      "Pre-recovery warm-up",
      "Complementing compression therapy",
      "Low-impact muscle activation",
      "Detoxification protocols",
      "Mobility and balance training"
    ],
    duration: "10-15 minutes",
    pricing: [
      { name: "Session", price: 20 },
      { name: "Add-On (with other service)", price: 15 }
    ],
    color: "purple"
  }
];

// Custom icon components for aesthetic services
const JawlineIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8 2 5 5 5 9c0 3 1 5 2 7 1 2 2 4 5 6 3-2 4-4 5-6 1-2 2-4 2-7 0-4-3-7-7-7z" />
    <path d="M9 11c1 1 2 1.5 3 1.5s2-.5 3-1.5" />
  </svg>
);

const WrinklesIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="10" r="7" />
    <path d="M8 8.5c0 0 1-0.5 2 0" />
    <path d="M14 8.5c0 0 1-0.5 2 0" />
    <path d="M9 13c1.5 1 3.5 1 5 0" />
    <path d="M7 6c-0.5-1.5-1-3-1-3" />
    <path d="M17 6c0.5-1.5 1-3 1-3" />
    <path d="M5 10c-1.5 0-3-0.5-3-0.5" />
    <path d="M19 10c1.5 0 3-0.5 3-0.5" />
  </svg>
);

const HairIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2c-3 0-6 2-6 6 0 2 0 4 1 6 0.5 1 1 2 1.5 3" />
    <path d="M12 2c3 0 6 2 6 6 0 2 0 4-1 6-0.5 1-1 2-1.5 3" />
    <path d="M8.5 17c-0.5 1-1 2.5-1 4h9c0-1.5-0.5-3-1-4" />
    <path d="M9 7c0 0 1-1 3-1s3 1 3 1" />
    <path d="M9 10c0 0 1.5 1 3 1s3-1 3-1" />
    <path d="M10 13c0 0 1 0.5 2 0.5s2-0.5 2-0.5" />
  </svg>
);

const aestheticServices = [
  {
    id: 'bodysculpt',
    icon: JawlineIcon,
    title: "Cryo Body Sculpting",
    description: "Cryo body sculpting targets stubborn fat cells through controlled cold exposure, causing fat cell destruction (cryolipolysis) while simultaneously tightening the skin—without surgery, needles, or downtime.",
    howItWorks: "Targeted cryotherapy is applied to specific body areas (abdomen, thighs, arms, flanks). The extreme cold freezes fat cells beneath the skin without damaging surrounding tissue. Your body naturally processes and eliminates these dead fat cells over the following weeks.",
    benefits: [
      "Non-surgical fat reduction",
      "Skin tightening",
      "Body contouring",
      "No downtime",
      "Natural-looking results",
      "Targeted problem areas"
    ],
    idealFor: [
      "Stubborn fat deposits",
      "Body contouring",
      "Post-weight loss sculpting",
      "Defining muscle definition",
      "Areas resistant to diet and exercise"
    ],
    duration: "30-60 minutes per area",
    results: "Visible results in 3-4 weeks, optimal results in 8-12 weeks",
    pricing: [
      { name: "Per Area Treatment", price: 300 }
    ],
    color: "rose"
  },
  {
    id: 'facial',
    icon: WrinklesIcon,
    title: "Cryo Facial (Frotox)",
    description: "A non-invasive facial cryotherapy treatment designed to tighten skin, reduce wrinkles and fine lines, improve circulation, and redefine facial contours. This \"frozen Botox\" treatment stimulates collagen production without needles or toxins.",
    howItWorks: "Concentrated cold therapy is applied to your face, causing blood vessels to constrict and then rapidly dilate. This increases circulation, tightens pores, stimulates collagen production, and creates an immediate tightening and lifting effect.",
    benefits: [
      "Immediate skin tightening",
      "Reduced fine lines and wrinkles",
      "Improved skin tone and texture",
      "Reduced pore size",
      "Enhanced facial contours and definition",
      "Natural glow and radiance",
      "Reduced under-eye puffiness"
    ],
    idealFor: [
      "Fine lines and wrinkles",
      "Sagging skin",
      "Under-eye bags and puffiness",
      "Jawline definition",
      "Uneven skin tone",
      "Large pores"
    ],
    duration: "20-30 minutes",
    pricing: [
      { name: "Per Session", price: 125 }
    ],
    color: "pink"
  },
  {
    id: 'scalp',
    icon: HairIcon,
    title: "Scalp & Hair Cryotherapy",
    description: "Scalp cryotherapy stimulates blood flow and activates hair follicles to support hair growth, reduce hair loss, and improve overall scalp health.",
    howItWorks: "Targeted cold therapy is applied to your scalp, increasing blood flow and oxygen delivery to hair follicles. This stimulates dormant follicles, strengthens existing hair, and creates optimal conditions for hair growth.",
    benefits: [
      "Stimulated hair growth",
      "Reduced hair loss",
      "Improved scalp health",
      "Increased follicle activity",
      "Stronger, healthier hair",
      "Reduced scalp inflammation"
    ],
    idealFor: [
      "Hair thinning or loss",
      "Scalp health optimization",
      "Supporting hair growth protocols",
      "Improving hair density and strength"
    ],
    duration: "20-30 minutes",
    pricing: [
      { name: "Per Session", price: 125 }
    ],
    color: "purple"
  },
];

function ServiceCard({ service, isExpanded, onToggle }) {
  const colorClasses = {
    cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200', gradient: 'from-cyan-500 to-cyan-600' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', gradient: 'from-blue-500 to-blue-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', gradient: 'from-amber-500 to-orange-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', gradient: 'from-purple-500 to-violet-600' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', gradient: 'from-rose-500 to-pink-600' },
    pink: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200', gradient: 'from-pink-500 to-rose-600' }
  };

  const colors = colorClasses[service.color];
  const Icon = service.icon;

  return (
    <GlassCard className="overflow-hidden">
      <div 
        className="p-6 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 ${colors.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-7 h-7 ${colors.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-bold text-slate-900">{service.title}</h3>
              <button className={`p-2 rounded-lg ${colors.bg} ${colors.text}`}>
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
            <p className={`text-slate-600 mt-2 ${isExpanded ? '' : 'line-clamp-2'}`}>{service.description}</p>
            
            {/* Quick info */}
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                <span>{service.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>From ${Math.min(...service.pricing.map(p => p.price))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className={`px-6 pb-6 pt-2 border-t ${colors.border}`}>
              {/* How it works */}
              <div className="mb-6">
                <h4 className="font-semibold text-slate-900 mb-2">How It Works</h4>
                <p className="text-slate-600 leading-relaxed">{service.howItWorks}</p>
              </div>

              {/* Benefits & Ideal For */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Benefits</h4>
                  <ul className="space-y-2">
                    {service.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <Check className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-0.5`} />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Ideal For</h4>
                  <ul className="space-y-2">
                    {service.idealFor.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <Check className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-0.5`} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Results timeline if exists */}
              {service.results && (
                <div className={`${colors.bg} rounded-xl p-4 mb-6`}>
                  <p className={`text-sm font-medium ${colors.text}`}>
                    Results: {service.results}
                  </p>
                </div>
              )}

              {/* Pricing */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Pricing</h4>
                <div className="flex flex-wrap gap-3 mb-6">
                  {service.pricing.map((price, i) => (
                    <div key={i} className={`px-4 py-3 ${colors.bg} rounded-xl`}>
                      <span className="text-sm text-slate-600">{price.name}</span>
                      <span className={`ml-2 font-bold ${colors.text}`}>${price.price}</span>
                    </div>
                  ))}
                </div>
                
                {/* Book Now Button */}
                <Link to={`${createPageUrl('BookSession')}?service=${service.id}`}>
                  <GradientButton className={`w-full bg-gradient-to-r ${colors.gradient}`}>
                    Book This Service
                    <ArrowRight className="w-5 h-5" />
                  </GradientButton>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

export default function Services() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('recovery');
  const [expandedService, setExpandedService] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const expandParam = urlParams.get('expand');
    if (expandParam) {
      setExpandedService(expandParam);
      // Set the correct tab based on the service
      if (['cryo', 'compression', 'redlight', 'vibration'].includes(expandParam)) {
        setActiveTab('recovery');
      } else if (['bodysculpt', 'facial', 'scalp'].includes(expandParam)) {
        setActiveTab('aesthetic');
      }
      // Scroll to services section after a brief delay
      setTimeout(() => {
        const element = document.getElementById('services-list');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location.search]);

  const toggleService = (id) => {
    setExpandedService(expandedService === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
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
              Our Services
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              Advanced Recovery & Aesthetic Services
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Science-backed modalities delivered with precision and care. 
              From rapid athletic recovery to aesthetic treatments—all mobile, all convenient.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="sticky top-20 z-30 bg-white/95 backdrop-blur-xl border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('recovery')}
              className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === 'recovery'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Recovery & Performance
            </button>
            <button
              onClick={() => setActiveTab('aesthetic')}
              className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === 'aesthetic'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/25'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Aesthetic Treatments
            </button>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              id="services-list"
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {(activeTab === 'recovery' ? recoveryServices : aestheticServices).map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isExpanded={expandedService === service.id}
                  onToggle={() => toggleService(service.id)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-cyan-500 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Experience Next-Level Recovery?
          </h2>
          <p className="text-xl text-cyan-100 mb-8">
            Book your session today and feel the Ascension difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('BookSession')}>
              <GradientButton variant="dark" size="lg">
                Book Your Session
                <ArrowRight className="w-5 h-5" />
              </GradientButton>
            </Link>
            <Link to={createPageUrl('Contact')}>
              <GradientButton variant="secondary" size="lg" className="text-white border-white/30 hover:bg-white/20">
                Contact for Event Pricing
              </GradientButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}