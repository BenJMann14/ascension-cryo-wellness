import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin,
  ArrowLeft,
  CheckCircle2,
  Shield
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';
import { Button } from "@/components/ui/button";

export default function EventCustomerForm({ onSubmit, onBack }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    waiverAccepted: false,
    marketingOptIn: false
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
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zip.trim()) newErrors.zip = 'ZIP code is required';
    if (!formData.waiverAccepted) newErrors.waiver = 'You must accept the waiver to continue';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit({
      customerData: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        marketingOptIn: formData.marketingOptIn
      },
      addressData: {
        address: formData.address,
        city: formData.city,
        zip: formData.zip,
        fullAddress: `${formData.address}, ${formData.city}, TX ${formData.zip}`
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 rounded-full mb-4">
          <User className="w-5 h-5 text-cyan-600" />
          <span className="font-medium text-cyan-700">Step 2 of 3</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          Your Information
        </h2>
        <p className="text-slate-600">
          We'll use this to confirm your session
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <GlassCard className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Details</h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="John"
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && (
                <p className="text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Doe"
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && (
                <p className="text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <Label htmlFor="email">Email *</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="john@example.com"
                className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <div className="relative">
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="(210) 555-0123"
                className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
              />
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-600" />
            Event Location
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="123 Main St"
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="San Antonio"
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && (
                  <p className="text-sm text-red-600">{errors.city}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code *</Label>
                <Input
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => handleChange('zip', e.target.value)}
                  placeholder="78201"
                  className={errors.zip ? 'border-red-500' : ''}
                />
                {errors.zip && (
                  <p className="text-sm text-red-600">{errors.zip}</p>
                )}
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-600" />
            Liability Waiver
          </h3>
          
          <div className="bg-slate-50 rounded-lg p-4 mb-4 text-sm text-slate-700 max-h-40 overflow-y-auto">
            <p className="font-semibold mb-2">Assumption of Risk and Release of Liability</p>
            <p className="mb-2">
              I understand that cryotherapy, compression therapy, and related recovery treatments involve certain risks, 
              including but not limited to cold sensitivity, skin irritation, and in rare cases, frostbite or other injuries.
            </p>
            <p className="mb-2">
              I confirm that I am in good health and have no medical conditions that would prevent me from safely 
              receiving these treatments. I have disclosed any relevant medical history to the service provider.
            </p>
            <p className="mb-2">
              I voluntarily assume all risks associated with these treatments and release Ascension Cryo & Wellness, 
              its owners, operators, and staff from any and all liability for injuries or damages that may occur.
            </p>
            <p>
              I understand the costs associated with these treatments and agree to pay the stated fees.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="waiver"
              checked={formData.waiverAccepted}
              onCheckedChange={(checked) => handleChange('waiverAccepted', checked)}
              className={errors.waiver ? 'border-red-500' : ''}
            />
            <label htmlFor="waiver" className="text-sm text-slate-700 leading-relaxed cursor-pointer">
              I have read and agree to the liability waiver. I confirm that I have no injuries or medical conditions 
              that would prevent me from safely receiving these treatments. *
            </label>
          </div>
          {errors.waiver && (
            <p className="text-sm text-red-600 mt-2">{errors.waiver}</p>
          )}
        </GlassCard>

        <GlassCard className="p-6 mb-6">
          <div className="flex items-start gap-3">
            <Checkbox
              id="marketing"
              checked={formData.marketingOptIn}
              onCheckedChange={(checked) => handleChange('marketingOptIn', checked)}
            />
            <label htmlFor="marketing" className="text-sm text-slate-700 leading-relaxed cursor-pointer">
              Send me special offers and recovery tips (optional)
            </label>
          </div>
        </GlassCard>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <GradientButton type="submit" className="flex-1">
            Continue to Payment
            <CheckCircle2 className="w-5 h-5 ml-2" />
          </GradientButton>
        </div>
      </form>
    </div>
  );
}