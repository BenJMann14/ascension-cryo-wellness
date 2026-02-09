import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';
import { Button } from "@/components/ui/button";

export default function CustomerInfoForm({ addressData, onSubmit, onBack, initialData }) {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: addressData?.address || '',
    city: addressData?.city || '',
    zip: addressData?.zip || '',
    specialRequests: initialData?.specialRequests || '',
    marketingOptIn: initialData?.marketingOptIn || false,
    termsAccepted: initialData?.termsAccepted || false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-\(\)]+$/.test(formData.phone) || formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the Terms of Service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 rounded-full mb-4">
          <User className="w-5 h-5 text-cyan-600" />
          <span className="font-medium text-cyan-700">Step 3 of 5</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          Your Information
        </h2>
        <p className="text-slate-600">
          Please provide your contact details for the appointment
        </p>
      </div>

      <GlassCard className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="John"
                className={`h-12 ${errors.firstName ? 'border-red-500' : ''}`}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Doe"
                className={`h-12 ${errors.lastName ? 'border-red-500' : ''}`}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="john@example.com"
                className={`h-12 ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="(210) 555-1234"
                className={`h-12 ${errors.phone ? 'border-red-500' : ''}`}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Service Address (Pre-filled) */}
          <div className="space-y-4 p-4 bg-slate-50 rounded-xl">
            <h3 className="font-medium text-slate-900">Service Address</h3>
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="h-12"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => handleChange('zip', e.target.value)}
                  className="h-12"
                />
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests or Notes (Optional)</Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => handleChange('specialRequests', e.target.value)}
              placeholder="Any specific concerns, injuries, or requests we should know about..."
              rows={3}
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={formData.marketingOptIn}
                onCheckedChange={(checked) => handleChange('marketingOptIn', checked)}
                className="mt-1"
              />
              <span className="text-sm text-slate-600">
                Send me updates on new services, special offers, and wellness tips
              </span>
            </label>

            <label className={`flex items-start gap-3 cursor-pointer ${errors.termsAccepted ? 'text-red-500' : ''}`}>
              <Checkbox
                checked={formData.termsAccepted}
                onCheckedChange={(checked) => handleChange('termsAccepted', checked)}
                className="mt-1"
              />
              <span className="text-sm text-slate-600">
                I agree to the{' '}
                <Link to={createPageUrl('TermsOfService')} target="_blank" className="text-cyan-600 underline hover:text-cyan-700">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to={createPageUrl('PrivacyPolicy')} target="_blank" className="text-cyan-600 underline hover:text-cyan-700">
                  Privacy Policy
                </Link>{' '}
                *
              </span>
            </label>
            {errors.termsAccepted && (
              <p className="text-sm text-red-500">{errors.termsAccepted}</p>
            )}
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="order-2 sm:order-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <GradientButton
              type="submit"
              className="order-1 sm:order-2"
              size="lg"
            >
              Continue to Services
              <ArrowRight className="w-5 h-5" />
            </GradientButton>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}