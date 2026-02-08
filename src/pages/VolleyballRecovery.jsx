import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Snowflake, 
  Wind, 
  Sun, 
  Zap,
  Users,
  Check,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TeamPassPurchase from '@/components/volleyball/TeamPassPurchase';
import IndividualServicePurchase from '@/components/volleyball/IndividualServicePurchase';

const services = [
  {
    icon: Snowflake,
    name: 'Cryo Therapy',
    description: 'Rapid inflammation reduction',
    price: 50,
    featured: true
  },
  {
    icon: Wind,
    name: 'Compression Boots',
    description: 'Leg recovery between matches',
    duration: '15 min',
    price: 40,
    featured: true
  }
];

const teamPasses = [
  {
    passes: 3,
    price: 135,
    perPass: 45,
    savings: 15,
    popular: false,
    description: '3 × 15-min compression sessions'
  },
  {
    passes: 6,
    price: 240,
    perPass: 40,
    savings: 60,
    popular: true,
    description: '6 × 15-min compression sessions'
  },
  {
    passes: 9,
    price: 315,
    perPass: 35,
    savings: 135,
    popular: false,
    description: '9 × 15-min compression sessions'
  },
  {
    passes: 12,
    price: 360,
    perPass: 30,
    savings: 240,
    popular: false,
    description: '12 × 15-min compression sessions'
  }
];

export default function VolleyballRecovery() {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setShowServiceModal(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Vibrant Header Bar */}
      <div className="h-3 bg-gradient-to-r from-pink-500 via-blue-500 to-yellow-400" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-fuchsia-600 to-pink-600">
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full" 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                 backgroundSize: '60px 60px'
               }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
              TOURNAMENT
              <br />
              <span className="text-yellow-300">RECOVERY</span>
            </h1>
            <p className="text-2xl md:text-3xl text-white/90 font-bold mb-8">
              Quick Recovery Between Matches
            </p>
            <Button size="lg" className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black text-lg px-8 py-6 rounded-2xl shadow-2xl">
              BOOK NOW
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Individual Services */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-green-400 hover:bg-green-400 text-slate-900 text-lg px-6 py-2 font-black mb-4">
              RECOVERY SERVICES
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Quick Sessions Between Matches
            </h2>
            <p className="text-xl text-slate-600">
              Individual treatments available at our booth
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {services.map((service, idx) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => handleServiceClick(service)}
                className={`relative bg-white rounded-3xl p-8 shadow-xl border-4 cursor-pointer ${
                  service.featured ? 'border-pink-500' : 'border-slate-300'
                } ${service.featured ? 'md:col-span-1' : 'md:col-span-1'}`}
              >
                {service.featured && (
                  <div className="absolute -top-3 -right-3">
                    <Badge className="bg-yellow-400 hover:bg-yellow-400 text-slate-900 font-black text-xs px-3 py-1">
                      ⭐ TOP PICK
                    </Badge>
                  </div>
                )}
                <div className={`absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br ${
                  service.featured ? 'from-pink-500 to-fuchsia-600' : 'from-blue-400 to-cyan-500'
                } rounded-2xl rotate-12 flex items-center justify-center shadow-lg`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="mb-6 mt-4">
                  <h3 className="text-2xl font-black text-slate-900 mb-2">{service.name}</h3>
                  <p className="text-slate-600 font-medium">{service.description}</p>
                </div>
                
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className={`text-4xl font-black ${service.featured ? 'text-pink-600' : 'text-slate-700'}`}>
                      ${service.price}
                    </span>
                  </div>
                  {service.duration && (
                    <span className="text-sm font-bold text-slate-500">{service.duration}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Passes - Featured Section */}
      <section className="py-24 bg-gradient-to-br from-yellow-400 via-yellow-300 to-green-400 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full" 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                 backgroundSize: '80px 80px'
               }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-3xl font-black text-2xl mb-6 shadow-2xl"
            >
              <Users className="w-8 h-8" />
              TEAM PASS DEALS
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">
              Share With Your Team!
            </h2>
            <p className="text-2xl font-bold text-slate-800">
              Buy passes for multiple players and SAVE BIG
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamPasses.map((pass, idx) => (
              <motion.div
                key={pass.passes}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, rotate: pass.popular ? 0 : 2 }}
                className={`relative rounded-3xl p-8 ${
                  pass.popular 
                    ? 'bg-gradient-to-br from-pink-600 to-fuchsia-700 shadow-2xl ring-8 ring-white transform scale-105' 
                    : 'bg-white shadow-xl border-4 border-slate-900'
                }`}
              >
                {pass.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-green-400 hover:bg-green-400 text-slate-900 font-black text-sm px-4 py-1 shadow-lg">
                      🔥 MOST POPULAR
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`text-7xl font-black mb-2 ${pass.popular ? 'text-yellow-300' : 'text-pink-600'}`}>
                    {pass.passes}
                  </div>
                  <div className={`text-xl font-black ${pass.popular ? 'text-white' : 'text-slate-900'}`}>
                    PASSES
                  </div>
                  <div className={`text-sm font-medium mt-2 ${pass.popular ? 'text-white/80' : 'text-slate-600'}`}>
                    {pass.description}
                  </div>
                </div>

                <div className={`text-center mb-6 pb-6 border-b-4 ${pass.popular ? 'border-white/30' : 'border-slate-200'}`}>
                  <div className={`text-5xl font-black mb-1 ${pass.popular ? 'text-white' : 'text-slate-900'}`}>
                    ${pass.price}
                  </div>
                  <div className={`text-lg font-bold ${pass.popular ? 'text-yellow-200' : 'text-slate-600'}`}>
                    ${pass.perPass} per pass
                  </div>
                </div>

                <div className={`text-center mb-6 ${pass.popular ? 'text-yellow-300' : 'text-green-600'}`}>
                  <Sparkles className="w-6 h-6 inline-block mr-2" />
                  <span className="text-xl font-black">
                    SAVE ${pass.savings}
                  </span>
                </div>

                <Button 
                  onClick={() => setShowPurchaseModal(true)}
                  className={`w-full font-black text-lg py-6 rounded-2xl ${
                    pass.popular 
                      ? 'bg-yellow-400 hover:bg-yellow-300 text-slate-900' 
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  GET {pass.passes} PASSES
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg font-bold text-slate-900 bg-white/80 inline-block px-8 py-4 rounded-2xl shadow-lg">
              Team passes can be shared among any players
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 font-medium">
              Quick & easy recovery between matches
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '1', title: 'Find Our Booth', desc: 'Look for our bright booth at the tournament venue' },
              { num: '2', title: 'Pick Your Service', desc: 'Choose individual treatment or use your team pass' },
              { num: '3', title: 'Quick Recovery', desc: '15 min sessions between your matches' }
            ].map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="relative"
              >
                <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-slate-900 text-center">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-pink-500 to-fuchsia-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-lg">
                    {step.num}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3 mt-4">{step.title}</h3>
                  <p className="text-slate-600 font-medium text-lg">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full" 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                 backgroundSize: '60px 60px'
               }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Ready to Recover<br />Like a Pro?
            </h2>
            <p className="text-2xl text-white/90 font-bold">
              Visit our booth at your next tournament
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer Bar */}
      <div className="h-3 bg-gradient-to-r from-pink-500 via-blue-500 to-yellow-400" />

      {/* Purchase Modals */}
      <TeamPassPurchase 
        isOpen={showPurchaseModal} 
        onClose={() => setShowPurchaseModal(false)} 
      />
      <IndividualServicePurchase
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        service={selectedService}
      />
    </div>
  );
}