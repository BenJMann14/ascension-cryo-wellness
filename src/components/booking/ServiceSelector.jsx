import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Check, 
  Clock, 
  ArrowRight, 
  ArrowLeft,
  Snowflake,
  Wind,
  Sun,
  Activity,
  Sparkles,
  Heart,
  Package,
  Zap
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const services = {
  recovery: {
    title: "Recovery & Performance",
    icon: Snowflake,
    items: [
      { id: 'cryo-single', name: 'Localized Cryo (Single Area)', duration: '5-15 min', price: 75, icon: Snowflake },
      { id: 'cryo-dual', name: 'Localized Cryo (Dual Area)', duration: '10-20 min', price: 120, icon: Snowflake },
      { id: 'cryo-full', name: 'Localized Cryo (Full Protocol)', duration: '15-30 min', price: 150, icon: Snowflake },
      { id: 'compression', name: 'Compression Therapy (15 min)', duration: '15 min', price: 40, icon: Wind },
      { id: 'compression-addon', name: 'Compression Therapy (Add On)', duration: '15 min', price: 35, icon: Wind },
      { id: 'redlight', name: 'Red Light Therapy (Standalone)', duration: '15-30 min', price: 30, icon: Sun },
      { id: 'redlight-addon', name: 'Red Light Therapy (Add On)', duration: '15-30 min', price: 25, icon: Sun },
      { id: 'lymphatic', name: 'Lymphatic Therapy (Standalone)', duration: '10-15 min', price: 20, icon: Activity },
      { id: 'lymphatic-addon', name: 'Lymphatic Therapy (Add On)', duration: '10-15 min', price: 15, icon: Activity }
    ]
  },
  aesthetic: {
    title: "Aesthetic Services",
    icon: Sparkles,
    items: [
      { id: 'body-sculpt', name: 'Cryo Body Sculpting (Per Area)', duration: '30-60 min', price: 300, icon: Sparkles },
      { id: 'facial', name: 'Cryo Facial (Frotox)', duration: '20-30 min', price: 125, icon: Heart },
      { id: 'scalp', name: 'Scalp & Hair Therapy', duration: '20-30 min', price: 125, icon: Sparkles },
      { id: 'skin-health', name: 'Skin Health & Tattoo Brightening', duration: '20-30 min', price: 100, icon: Sparkles }
    ]
  },
  packages: {
    title: "Orthopedic & Sports Medicine Packages",
    icon: Package,
    items: [
      { id: 'pkg-acute', name: 'Acute Pain Relief Program', description: '3 Cryotherapy Sessions', duration: 'As needed', price: 210, savings: 15, icon: Package },
      { id: 'pkg-injury', name: 'Injury Recovery Program', description: '6 Cryotherapy Sessions', duration: 'As needed', price: 390, savings: 60, icon: Package },
      { id: 'pkg-chronic', name: 'Chronic Pain & Joint Care Program', description: '10 Cryotherapy Sessions', duration: 'As needed', price: 600, savings: 150, icon: Package },
      { id: 'pkg-sports', name: 'Sports Performance Recovery Program', description: '6 Cryo + 6 Compression Sessions', duration: 'As needed', price: 690, savings: 120, featured: true, icon: Package },
      { id: 'pkg-elite', name: 'Elite Orthopedic Recovery Program', description: '10 Cryo + 10 Compression + 5 Red Light', duration: 'As needed', price: 1050, savings: 275, featured: true, icon: Package }
    ]
  },
  aestheticPackages: {
    title: "Aesthetic Session Packages",
    icon: Heart,
    items: [
      { id: 'pkg-body-starter', name: 'Starter Sculpt', description: '3 Body Sculpting Sessions', duration: 'Per area', price: 840, savings: 60, icon: Sparkles },
      { id: 'pkg-body-transform', name: 'Transformation Sculpt', description: '6 Body Sculpting Sessions', duration: 'Per area', price: 1560, savings: 240, icon: Sparkles },
      { id: 'pkg-body-ultimate', name: 'Ultimate Sculpt', description: '10 Body Sculpting Sessions', duration: 'Per area', price: 2400, savings: 600, featured: true, icon: Sparkles },
      { id: 'pkg-facial-glow', name: 'Glow Boost', description: '3 Cryo Facial Sessions', duration: 'As needed', price: 330, savings: 45, icon: Heart },
      { id: 'pkg-facial-series', name: 'Age-Defying Series', description: '6 Cryo Facial Sessions', duration: 'As needed', price: 630, savings: 120, icon: Heart },
      { id: 'pkg-facial-signature', name: 'Signature Plan', description: '10 Cryo Facial Sessions', duration: 'As needed', price: 1000, savings: 250, featured: true, icon: Heart },
      { id: 'pkg-hair-revival', name: 'Hair Revival', description: '6 Scalp Therapy Sessions', duration: 'As needed', price: 660, savings: 90, icon: Sparkles },
      { id: 'pkg-hair-restoration', name: 'Full Restoration', description: '10 Scalp Therapy Sessions', duration: 'As needed', price: 1000, savings: 250, icon: Sparkles },
      { id: 'pkg-skin-reset', name: 'Skin Reset', description: '3 Skin Health Sessions', duration: 'As needed', price: 270, savings: 30, icon: Sparkles },
      { id: 'pkg-skin-renewal', name: 'Skin Renewal', description: '6 Skin Health Sessions', duration: 'As needed', price: 510, savings: 90, icon: Sparkles },
      { id: 'pkg-skin-optimization', name: 'Skin Optimization', description: '10 Skin Health Sessions', duration: 'As needed', price: 800, savings: 200, icon: Sparkles }
    ]
  }
};

export default function ServiceSelector({ onSubmit, onBack, currentStep = 4, totalSteps = 5, preselectedServiceId = null, initialServices = [] }) {
  const [selectedServices, setSelectedServices] = useState(initialServices);
  const [activeCategory, setActiveCategory] = useState('recovery');

  // Pre-select service if provided (only if no initial services)
  useEffect(() => {
    if (preselectedServiceId && initialServices.length === 0) {
      // Find the service in all categories
      for (const [categoryKey, category] of Object.entries(services)) {
        const service = category.items.find(s => s.id === preselectedServiceId);
        if (service) {
          setSelectedServices([service]);
          setActiveCategory(categoryKey);
          break;
        }
      }
    }
  }, [preselectedServiceId, initialServices]);

  const toggleService = (service) => {
    const exists = selectedServices.find(s => s.id === service.id);
    if (exists) {
      setSelectedServices(prev => prev.filter(s => s.id !== service.id));
    } else {
      setSelectedServices(prev => [...prev, service]);
    }
  };

  const isSelected = (id) => selectedServices.some(s => s.id === id);

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  
  const totalDuration = () => {
    let minTotal = 0;
    let maxTotal = 0;
    selectedServices.forEach(s => {
      const match = s.duration.match(/(\d+)(?:-(\d+))?/);
      if (match) {
        minTotal += parseInt(match[1]);
        maxTotal += parseInt(match[2] || match[1]);
      }
    });
    if (minTotal === maxTotal) return `${minTotal} min`;
    return `${minTotal}-${maxTotal} min`;
  };

  const handleContinue = () => {
    onSubmit(selectedServices);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-full mb-4 border-2 border-cyan-400">
          <ShoppingCart className="w-5 h-5 text-cyan-400" />
          <span className="font-bold text-white">Step {currentStep} of {totalSteps}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 uppercase tracking-wide">
          Select Your Services
        </h2>
        <p className="text-slate-600 font-medium">
          Choose the treatments you'd like to receive
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.entries(services).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all uppercase tracking-wide text-sm
              ${activeCategory === key
                ? 'bg-slate-700 text-white border-2 border-cyan-400 shadow-lg'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-2 border-transparent'
              }
            `}
          >
            <category.icon className="w-4 h-4" />
            {category.title}
          </button>
        ))}
      </div>

      {/* Service List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-3"
        >
          {services[activeCategory].items.map((service) => {
            const selected = isSelected(service.id);
            const Icon = service.icon;
            
            return (
              <div
                key={service.id}
                className={`
                  p-4 cursor-pointer transition-all rounded-xl border-2
                  ${selected 
                    ? 'bg-slate-700 border-cyan-400' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                  }
                  ${service.featured ? 'ring-2 ring-cyan-400' : ''}
                `}
                onClick={() => toggleService(service)}
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                    ${selected ? 'bg-cyan-400' : 'bg-slate-100'}
                  `}>
                    {selected ? (
                      <Check className="w-6 h-6 text-slate-900" />
                    ) : (
                      <Icon className="w-6 h-6 text-slate-500" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-bold ${selected ? 'text-white' : 'text-slate-900'}`}>
                        {service.name}
                      </h3>
                      {service.featured && (
                        <Badge className="bg-cyan-400 text-slate-900 text-xs font-bold">Best Value</Badge>
                      )}
                      {service.savings && (
                        <Badge className="bg-green-500 text-white text-xs font-bold">Save ${service.savings}</Badge>
                      )}
                    </div>
                    {service.description && (
                      <p className={`text-sm ${selected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {service.description}
                      </p>
                    )}
                    <div className={`flex items-center gap-3 mt-1 text-sm ${selected ? 'text-slate-300' : 'text-slate-500'}`}>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {service.duration}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <div className={`text-xl font-bold ${selected ? 'text-cyan-400' : 'text-slate-900'}`}>
                      ${service.price}
                    </div>
                    {selected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-xs text-cyan-400 font-bold"
                      >
                        ADDED
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Cart Summary */}
      <AnimatePresence>
        {selectedServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="p-4 bg-slate-700 sticky bottom-4 rounded-xl border-2 border-cyan-400 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <ShoppingCart className="w-5 h-5 text-cyan-400" />
                    <span className="font-bold text-white">
                      {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-300">
                    <span>Est. Duration: {totalDuration()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400 uppercase tracking-wide">Total</div>
                  <div className="text-3xl font-black text-cyan-400">${totalPrice}</div>
                </div>
              </div>

              {/* Selected items list */}
              <div className="mt-4 pt-4 border-t border-slate-600">
                <div className="flex flex-wrap gap-2">
                  {selectedServices.map(service => (
                    <div 
                      key={service.id}
                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-600 rounded-lg text-sm border border-cyan-400/30"
                    >
                      <span className="text-white font-medium">{service.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleService(service);
                        }}
                        className="text-slate-400 hover:text-red-400 transition-colors font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="order-2 sm:order-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={selectedServices.length === 0}
          className="order-1 sm:order-2 bg-slate-700 hover:bg-slate-600 text-white border-2 border-cyan-400 font-bold px-8 py-6 text-lg uppercase tracking-wide"
        >
          Continue to Payment
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}