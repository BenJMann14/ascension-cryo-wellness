import React, { useState } from 'react';
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
      { id: 'compression', name: 'Compression Therapy', duration: '15 min', price: 40, icon: Wind },
      { id: 'redlight', name: 'Red Light Therapy', duration: '15-30 min', price: 30, icon: Sun },
      { id: 'vibration', name: 'Vibration Plate', duration: '10-15 min', price: 20, icon: Activity }
    ]
  },
  aesthetic: {
    title: "Aesthetic Services",
    icon: Sparkles,
    items: [
      { id: 'body-sculpt', name: 'Cryo Body Sculpting', duration: '30-60 min/area', price: 300, icon: Sparkles },
      { id: 'facial', name: 'Cryo Facial (Frotox)', duration: '20-30 min', price: 125, icon: Heart },
      { id: 'scalp', name: 'Scalp & Hair Therapy', duration: '20-30 min', price: 125, icon: Sparkles },
      { id: 'scalp', name: 'Scalp & Hair Therapy', duration: '20-30 min', price: 125, icon: Sparkles }
    ]
  },
  packages: {
    title: "Recovery Packages",
    icon: Package,
    items: [
      { id: 'pkg-rapid', name: 'Rapid Relief Package', description: '3 Cryo Sessions', duration: '60 days validity', price: 210, savings: 15, icon: Package },
      { id: 'pkg-injury', name: 'Injury Recovery Package', description: '6 Cryo Sessions', duration: '90 days validity', price: 390, savings: 60, icon: Package },
      { id: 'pkg-elite', name: 'Elite Recovery Package', description: '10 Cryo Sessions', duration: '6 months validity', price: 600, savings: 150, featured: true, icon: Package }
    ]
  },
  combos: {
    title: "Performance Combos",
    icon: Zap,
    items: [
      { id: 'combo-express', name: 'Recovery Express', description: 'Cryo + Vibration', duration: '~20 min', price: 65, savings: 10, icon: Zap },
      { id: 'combo-reset', name: 'Athlete Reset', description: 'Cryo + Compression', duration: '~30 min', price: 80, savings: 15, icon: Zap },
      { id: 'combo-boost', name: 'Performance Boost', description: 'Cryo + Red Light', duration: '~30 min', price: 75, savings: 10, icon: Zap },
      { id: 'combo-full', name: 'Full Recovery Stack', description: 'Cryo + Compression + Red Light', duration: '~45-60 min', price: 110, savings: 20, featured: true, icon: Zap },
      { id: 'combo-lymph', name: 'Ultimate Lymphatic Flush', description: 'Cryo + Vibration + Red Light', duration: '~40 min', price: 90, savings: 15, icon: Zap }
    ]
  }
};

export default function ServiceSelector({ onSubmit, onBack }) {
  const [selectedServices, setSelectedServices] = useState([]);
  const [activeCategory, setActiveCategory] = useState('recovery');

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
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 rounded-full mb-4">
          <ShoppingCart className="w-5 h-5 text-cyan-600" />
          <span className="font-medium text-cyan-700">Step 4 of 5</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          Select Your Services
        </h2>
        <p className="text-slate-600">
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
              flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all
              ${activeCategory === key
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
              <GlassCard
                key={service.id}
                className={`p-4 cursor-pointer transition-all ${
                  selected ? 'ring-2 ring-cyan-500 bg-cyan-50/50' : ''
                } ${service.featured ? 'border-2 border-amber-300' : ''}`}
                onClick={() => toggleService(service)}
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                    ${selected ? 'bg-gradient-to-br from-cyan-500 to-blue-600' : 'bg-slate-100'}
                  `}>
                    {selected ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : (
                      <Icon className="w-6 h-6 text-slate-500" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-900">{service.name}</h3>
                      {service.featured && (
                        <Badge className="bg-amber-100 text-amber-700 text-xs">Best Value</Badge>
                      )}
                      {service.savings && (
                        <Badge className="bg-green-100 text-green-700 text-xs">Save ${service.savings}</Badge>
                      )}
                    </div>
                    {service.description && (
                      <p className="text-sm text-slate-500">{service.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {service.duration}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <div className="text-xl font-bold text-slate-900">${service.price}</div>
                    {selected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-xs text-cyan-600 font-medium"
                      >
                        Added
                      </motion.div>
                    )}
                  </div>
                </div>
              </GlassCard>
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
            <GlassCard className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 sticky bottom-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <ShoppingCart className="w-5 h-5 text-cyan-600" />
                    <span className="font-medium text-slate-700">
                      {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span>Est. Duration: {totalDuration()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500">Total</div>
                  <div className="text-2xl font-bold text-cyan-600">${totalPrice}</div>
                </div>
              </div>

              {/* Selected items list */}
              <div className="mt-4 pt-4 border-t border-cyan-200">
                <div className="flex flex-wrap gap-2">
                  {selectedServices.map(service => (
                    <div 
                      key={service.id}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg text-sm"
                    >
                      <span className="text-slate-700">{service.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleService(service);
                        }}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
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
        <GradientButton
          onClick={handleContinue}
          disabled={selectedServices.length === 0}
          className="order-1 sm:order-2"
          size="lg"
        >
          Continue to Payment
          <ArrowRight className="w-5 h-5" />
        </GradientButton>
      </div>
    </div>
  );
}