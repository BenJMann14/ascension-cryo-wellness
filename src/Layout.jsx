import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook,
  Snowflake,
  Calendar
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: 'Home', page: 'Home' },
  { name: 'Services', page: 'Services' },
  { name: 'Pricing', page: 'Pricing' },
  { name: 'About', page: 'About' },
  { name: 'Contact', page: 'Contact' },
  { name: 'Admin', page: 'AdminDashboard', adminOnly: true },
];

export default function Layout({ children, currentPageName }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  const isHomePage = currentPageName === 'Home';

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || !isHomePage
            ? 'bg-white/95 backdrop-blur-xl shadow-sm' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Snowflake className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className={`text-xl font-bold tracking-wide ${isScrolled || !isHomePage ? 'text-slate-900' : 'text-slate-900'}`}>
                  Ascension Cryo & Wellness
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.filter(link => !link.adminOnly).map((link) => (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  className={`text-sm font-medium transition-colors relative group ${
                    currentPageName === link.page
                      ? 'text-cyan-600'
                      : isScrolled || !isHomePage
                        ? 'text-slate-700 hover:text-cyan-600'
                        : 'text-slate-700 hover:text-cyan-600'
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-500 transform origin-left transition-transform ${
                    currentPageName === link.page ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <Link to={createPageUrl('BookSession')}>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 rounded-xl shadow-lg shadow-cyan-500/25">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Now
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-900" />
              ) : (
                <Menu className="w-6 h-6 text-slate-900" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t"
            >
              <div className="px-4 py-6 space-y-4">
                {navLinks.filter(link => !link.adminOnly).map((link) => (
                  <Link
                    key={link.page}
                    to={createPageUrl(link.page)}
                    className={`block text-lg font-medium py-2 ${
                      currentPageName === link.page
                        ? 'text-cyan-600'
                        : 'text-slate-700'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link to={createPageUrl('BookSession')} className="block pt-4">
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-6 rounded-xl">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Your Session
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className={currentPageName === 'Home' ? '' : 'pt-20'}>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Snowflake className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">Ascension</span>
                  <span className="text-xs text-slate-400 block mt-0.5">Cryo & Wellness</span>
                </div>
              </div>
              <p className="text-slate-400 mb-4 text-sm leading-relaxed">
                Elite mobile recovery services for athletes and high-performers in San Antonio.
              </p>
              <p className="text-cyan-400 font-semibold">Train. Recover. Ascend.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.page}>
                    <Link 
                      to={createPageUrl(link.page)}
                      className="text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link 
                    to={createPageUrl('BookSession')}
                    className="text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                  >
                    Book a Session
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Services</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li>Localized Cryotherapy</li>
                <li>Compression Therapy</li>
                <li>Red Light Therapy</li>
                <li>Vibration Therapy</li>
                <li>Cryo Facials</li>
                <li>Body Sculpting</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li>
                  <a href="mailto:info@ascensioncryo.com" className="flex items-center gap-3 text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                    <Mail className="w-4 h-4" />
                    info@ascensioncryo.com
                  </a>
                </li>
                <li>
                  <a href="tel:+12105551234" className="flex items-center gap-3 text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                    <Phone className="w-4 h-4" />
                    (210) 555-1234
                  </a>
                </li>
              </ul>
              <div className="flex gap-4 mt-6">
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-cyan-600 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-cyan-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Ascension Cryo & Wellness. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}