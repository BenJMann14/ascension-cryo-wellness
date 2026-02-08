import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle2, Ticket, Clock, User, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function TeamPassAdmin() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPass, setSelectedPass] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [serviceType, setServiceType] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [recentRedemptions, setRecentRedemptions] = useState([]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const response = await base44.functions.invoke('searchTeamPasses', {
        searchQuery
      });
      setSearchResults(response.data.results || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const openRedeemDialog = (pass) => {
    setSelectedPass(pass);
    setServiceType('Cryo Therapy');
    setShowConfirmDialog(true);
  };

  const handleRedeem = async () => {
    if (!selectedPass) return;
    
    setIsRedeeming(true);
    try {
      const response = await base44.functions.invoke('redeemTeamPass', {
        passId: selectedPass.id,
        serviceType
      });

      if (response.data.success) {
        // Update the pass in search results
        setSearchResults(prev => 
          prev.map(p => p.id === selectedPass.id ? response.data.teamPass : p)
        );
        
        // Add to recent redemptions
        setRecentRedemptions(prev => [
          {
            ...selectedPass,
            redeemed_at: new Date().toISOString(),
            service: serviceType
          },
          ...prev.slice(0, 4)
        ]);

        setShowConfirmDialog(false);
        setSelectedPass(null);
        setSearchQuery('');
      }
    } catch (error) {
      console.error('Redemption error:', error);
      alert('Failed to redeem pass. Please try again.');
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-fuchsia-600 to-pink-600 py-6 shadow-xl">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-black text-white mb-2">Team Pass Redemption</h1>
          <p className="text-white/90 font-medium">Quick pass lookup & redemption</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by last name or code (e.g., 'Johnson' or '8472')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 pr-4 py-6 text-xl font-bold border-4 border-slate-900 rounded-2xl focus:ring-4 focus:ring-pink-500"
              autoFocus
            />
          </div>
          {isSearching && (
            <p className="text-slate-500 mt-2 ml-2">Searching...</p>
          )}
        </div>

        {/* Search Results */}
        <AnimatePresence mode="wait">
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 mb-8"
            >
              <h2 className="text-xl font-black text-slate-900 mb-4">Search Results</h2>
              {searchResults.map((pass) => (
                <motion.div
                  key={pass.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openRedeemDialog(pass)}
                  className={`bg-white rounded-2xl p-6 shadow-lg border-4 cursor-pointer ${
                    pass.remaining_passes > 0 
                      ? 'border-green-500 hover:shadow-xl' 
                      : 'border-slate-300 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-black text-slate-900">
                          {pass.customer_first_name} {pass.customer_last_name}
                        </h3>
                        {pass.remaining_passes > 0 ? (
                          <Badge className="bg-green-500 text-white font-bold">ACTIVE</Badge>
                        ) : (
                          <Badge className="bg-slate-400 text-white font-bold">USED UP</Badge>
                        )}
                      </div>
                      <p className="text-lg font-mono font-bold text-pink-600">
                        {pass.redemption_code}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-5xl font-black ${
                        pass.remaining_passes > 0 ? 'text-green-600' : 'text-slate-400'
                      }`}>
                        {pass.remaining_passes}
                      </div>
                      <p className="text-sm font-bold text-slate-500">
                        of {pass.total_passes} left
                      </p>
                    </div>
                  </div>
                  
                  {pass.remaining_passes > 0 && (
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-400 hover:to-fuchsia-500 text-white font-black text-lg py-6 rounded-xl">
                      <Zap className="w-5 h-5 mr-2" />
                      REDEEM 1 PASS
                    </Button>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {searchQuery.trim().length >= 2 && searchResults.length === 0 && !isSearching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-xl text-slate-500">No passes found matching "{searchQuery}"</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Redemptions */}
        {recentRedemptions.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Recent Redemptions
            </h2>
            <div className="space-y-2">
              {recentRedemptions.map((redemption, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-green-50 border-2 border-green-200 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-bold text-slate-900">
                          {redemption.customer_first_name} {redemption.customer_last_name}
                        </p>
                        <p className="text-sm text-slate-600">{redemption.service}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500">
                      {new Date(redemption.redeemed_at).toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {searchQuery.trim().length < 2 && searchResults.length === 0 && recentRedemptions.length === 0 && (
          <div className="text-center py-20">
            <Ticket className="w-20 h-20 text-slate-300 mx-auto mb-4" />
            <p className="text-2xl font-bold text-slate-400 mb-2">Start typing to search</p>
            <p className="text-slate-500">Enter a last name or code to find passes</p>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Redeem Pass</DialogTitle>
            <DialogDescription>
              Confirm pass redemption for {selectedPass?.customer_first_name} {selectedPass?.customer_last_name}
            </DialogDescription>
          </DialogHeader>

          {selectedPass && (
            <div className="space-y-6">
              <div className="bg-pink-50 rounded-xl p-4 border-2 border-pink-200">
                <p className="text-sm text-slate-600 mb-1">Redemption Code</p>
                <p className="text-2xl font-black text-pink-600">{selectedPass.redemption_code}</p>
              </div>

              <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                <p className="text-sm text-slate-600 mb-1">Passes Remaining</p>
                <p className="text-4xl font-black text-green-600">
                  {selectedPass.remaining_passes} → {selectedPass.remaining_passes - 1}
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Service Type
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full p-3 border-2 border-slate-300 rounded-xl font-bold"
                >
                  <option value="Cryo Therapy">Cryo Therapy</option>
                  <option value="Compression Boots">Compression Boots</option>
                  <option value="Red Light">Red Light</option>
                  <option value="Combo Treatment">Combo Treatment</option>
                </select>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 font-bold"
                  disabled={isRedeeming}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRedeem}
                  disabled={isRedeeming}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-400 hover:to-fuchsia-500 text-white font-black"
                >
                  {isRedeeming ? 'Redeeming...' : 'Confirm Redeem'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}