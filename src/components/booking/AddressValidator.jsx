import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Loader2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';

// Leon Valley, TX coordinates (approximate center of San Antonio area)
const CENTER_LAT = 29.4949;
const CENTER_LNG = -98.6183;
const MAX_DISTANCE_MILES = 60;

// Haversine formula to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Simple geocoding approximation for Texas addresses
// In production, you'd use Google Maps Geocoding API
function approximateGeocode(address) {
  // This is a simplified geocoding for demonstration
  // Real implementation would use Google Maps API
  const addressLower = address.toLowerCase();
  
  // San Antonio area coordinates
  const locations = {
    'leon valley': { lat: 29.4949, lng: -98.6183 },
    'san antonio': { lat: 29.4241, lng: -98.4936 },
    'alamo heights': { lat: 29.4841, lng: -98.4644 },
    'stone oak': { lat: 29.6135, lng: -98.4822 },
    'helotes': { lat: 29.5782, lng: -98.6897 },
    'new braunfels': { lat: 29.7030, lng: -98.1245 },
    'boerne': { lat: 29.7947, lng: -98.7319 },
    'seguin': { lat: 29.5688, lng: -97.9647 },
    'austin': { lat: 30.2672, lng: -97.7431 },
    'houston': { lat: 29.7604, lng: -95.3698 },
    'dallas': { lat: 32.7767, lng: -96.7970 },
    'laredo': { lat: 27.5064, lng: -99.5076 },
    'corpus christi': { lat: 27.8006, lng: -97.3964 },
    'converse': { lat: 29.5182, lng: -98.3161 },
    'schertz': { lat: 29.5522, lng: -98.2698 },
    'cibolo': { lat: 29.5724, lng: -98.2270 },
    'selma': { lat: 29.5846, lng: -98.3058 },
    'live oak': { lat: 29.5652, lng: -98.3361 },
    'universal city': { lat: 29.5496, lng: -98.2917 },
    'castle hills': { lat: 29.5232, lng: -98.5183 },
    'balcones heights': { lat: 29.4885, lng: -98.5500 },
    'terrell hills': { lat: 29.4749, lng: -98.4500 },
    'shavano park': { lat: 29.5824, lng: -98.5531 },
    'hollywood park': { lat: 29.5999, lng: -98.4906 },
    'fair oaks ranch': { lat: 29.7455, lng: -98.6439 },
    'garden ridge': { lat: 29.6349, lng: -98.3064 },
    'windcrest': { lat: 29.5163, lng: -98.3850 },
    'kirby': { lat: 29.4635, lng: -98.3861 },
  };

  // Check if any known location is in the address
  for (const [city, coords] of Object.entries(locations)) {
    if (addressLower.includes(city)) {
      // Add some randomness to simulate different addresses in the same city
      return {
        lat: coords.lat + (Math.random() - 0.5) * 0.05,
        lng: coords.lng + (Math.random() - 0.5) * 0.05
      };
    }
  }

  // Check for Texas zip codes (simplified)
  const zipMatch = address.match(/\b(78\d{3}|79\d{3})\b/);
  if (zipMatch) {
    const zip = zipMatch[1];
    // 78xxx zips are generally San Antonio area
    if (zip.startsWith('78')) {
      const zipNum = parseInt(zip.substring(2));
      // Approximate location based on zip
      return {
        lat: 29.4 + (zipNum % 100) * 0.01,
        lng: -98.5 + (zipNum % 50) * 0.01
      };
    }
  }

  // Default to needing manual verification
  return null;
}

export default function AddressValidator({ onValidated, initialData }) {
  const [address, setAddress] = useState(initialData?.address || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [zip, setZip] = useState(initialData?.zip || '');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  const validateAddress = async () => {
    setIsValidating(true);
    setValidationResult(null);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const fullAddress = `${address}, ${city}, TX ${zip}`;
    const coords = approximateGeocode(fullAddress);

    if (coords) {
      const distance = calculateDistance(CENTER_LAT, CENTER_LNG, coords.lat, coords.lng);
      
      if (distance <= MAX_DISTANCE_MILES) {
        // Address is valid - proceed directly
        setIsValidating(false);
        onValidated({
          address,
          city,
          zip,
          fullAddress,
          distance: Math.round(distance)
        });
        return;
      } else {
        setValidationResult({
          success: false,
          distance: Math.round(distance),
          message: `Your location is approximately ${Math.round(distance)} miles from our service area. We currently serve clients within 60 miles of Leon Valley (San Antonio area).`
        });
      }
    } else {
      // If we can't geocode, allow booking but flag for manual review
      setIsValidating(false);
      onValidated({
        address,
        city,
        zip,
        fullAddress,
        distance: null,
        needsReview: true
      });
      return;
    }

    setIsValidating(false);
  };

  const handleContinue = () => {
    onValidated({
      address,
      city,
      zip,
      fullAddress: `${address}, ${city}, TX ${zip}`,
      distance: validationResult?.distance
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 rounded-full mb-4">
          <MapPin className="w-5 h-5 text-cyan-600" />
          <span className="font-medium text-cyan-700">Step 1 of 5</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          Service Location
        </h2>
        <p className="text-slate-600">
          Enter your address to verify we service your area (within 60 miles of San Antonio)
        </p>
      </div>

      <GlassCard className="p-6 md:p-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main Street"
              className="h-12"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="San Antonio"
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code *</Label>
              <Input
                id="zip"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="78249"
                maxLength={5}
                className="h-12"
              />
            </div>
          </div>

          <p className="text-sm text-slate-500">
            * Texas addresses only. State is automatically set to TX.
          </p>
        </div>

        {/* Validation Result */}
        {validationResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-xl ${
              validationResult.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {validationResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                {validationResult.success ? (
                  <>
                    <p className="font-medium text-green-800">Great news! We service your area.</p>
                    {validationResult.distance && (
                      <p className="text-sm text-green-700 mt-1">
                        Your location is approximately {validationResult.distance} miles from our base.
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="font-medium text-red-800">Outside Service Area</p>
                    <p className="text-sm text-red-700 mt-1">{validationResult.message}</p>
                    <p className="text-sm text-red-700 mt-2">
                      For events outside our service area, please{' '}
                      <a href="/Contact" className="underline font-medium">contact us</a>{' '}
                      for custom arrangements.
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <GradientButton
            onClick={validateAddress}
            disabled={!address || !city || !zip || isValidating}
            className="w-full sm:w-auto"
            size="lg"
          >
            {isValidating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <MapPin className="w-5 h-5" />
                Verify Address
              </>
            )}
          </GradientButton>
        </div>
      </GlassCard>

      {/* Service Area Info */}
      <div className="text-center text-sm text-slate-500">
        <p>
          We serve Leon Valley, San Antonio, and surrounding areas within a 60-mile radius.
        </p>
      </div>
    </div>
  );
}