import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isAfter, isBefore, addMonths, subMonths, setHours, setMinutes } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';

// Generate time slots from 8 AM to 6 PM (in local time, not UTC)
const generateTimeSlots = () => {
  const slots = [];
  // Use simple string generation to avoid timezone issues
  for (let hour = 8; hour <= 18; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 18) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  return slots;
};

// Format time based on user's locale preference (12h vs 24h)
const formatTimeForDisplay = (time24) => {
  const [hours, minutes] = time24.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes), 0);
  
  // Use the user's locale to determine 12/24 hour format
  return date.toLocaleTimeString([], { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: undefined // Let browser decide based on locale
  });
};

const TIME_SLOTS = generateTimeSlots();

export default function CalendarPicker({ onSelect, onBack, initialDate, initialTime, isRescheduling, originalBooking }) {
  const [currentMonth, setCurrentMonth] = useState(initialDate || new Date());
  const [selectedDate, setSelectedDate] = useState(initialDate || null);
  const [selectedTime, setSelectedTime] = useState(initialTime || null);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [unavailableTimes, setUnavailableTimes] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const minDate = addDays(new Date(), 2); // 48 hours minimum notice
  const maxDate = addDays(new Date(), 30); // 30 days in advance

  // Fetch calendar availability on mount and when month changes
  useEffect(() => {
    const fetchAvailability = async (showLoader = true) => {
      if (showLoader) setIsLoading(true);
      try {
        const startDate = startOfMonth(addMonths(currentMonth, -1));
        const endDate = endOfMonth(addMonths(currentMonth, 1));
        
        const response = await base44.functions.invoke('getCalendarAvailability', {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        });
        
        if (response.data && !response.data.error) {
          // Convert date strings to Date objects
          const dates = response.data.unavailableDates.map(dateStr => new Date(dateStr + 'T00:00:00'));
          setUnavailableDates(dates);
          setUnavailableTimes(response.data.unavailableTimes || {});
        }
      } catch (error) {
        console.error('Error fetching calendar availability:', error);
      } finally {
        if (showLoader) setIsLoading(false);
      }
    };

    // Initial fetch with loader
    fetchAvailability(true);

    // Auto-refresh every 15 seconds for 2-way sync with Google Calendar
    const interval = setInterval(() => fetchAvailability(false), 15000);

    return () => clearInterval(interval);
  }, [currentMonth]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day of week for first day (0 = Sunday)
  const startDayOfWeek = monthStart.getDay();
  const paddingDays = Array(startDayOfWeek).fill(null);

  const isDateUnavailable = (date) => {
    // Check if before min date or after max date
    if (isBefore(date, minDate) || isAfter(date, maxDate)) return true;
    // Check if in unavailable dates list
    if (unavailableDates.some(d => isSameDay(d, date))) return true;
    // Check if all time slots are blocked
    const availableTimes = getAvailableTimesForDate(date);
    return availableTimes.length === 0;
  };

  const getAvailableTimesForDate = (date) => {
    if (!date) return [];
    const dateKey = format(date, 'yyyy-MM-dd');
    const blocked = unavailableTimes[dateKey] || [];
    return TIME_SLOTS.filter(time => !blocked.includes(time));
  };

  const availableTimes = selectedDate ? getAvailableTimesForDate(selectedDate) : [];

  const handleDateSelect = (date) => {
    if (!isDateUnavailable(date)) {
      setSelectedDate(date);
      setSelectedTime(null);
    }
  };

  const handleContinue = () => {
    onSelect({
      date: selectedDate,
      time: selectedTime,
      formattedDate: format(selectedDate, 'EEEE, MMMM d, yyyy'),
      formattedTime: selectedTime
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        {isRescheduling ? (
          <>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-700">Reschedule Appointment</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Choose New Date & Time
            </h2>
            {originalBooking && (
              <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 inline-block mt-2">
                <p className="text-sm text-slate-600">
                  <strong>Current appointment:</strong> {originalBooking.appointment_date} at {originalBooking.appointment_time}
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 rounded-full mb-4">
              <CalendarIcon className="w-5 h-5 text-cyan-600" />
              <span className="font-medium text-cyan-700">Step 2 of 5</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Select Date & Time
            </h2>
            <p className="text-slate-600">
              Choose your preferred appointment date and time
            </p>
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <GlassCard className="p-6 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-cyan-600 animate-spin mx-auto mb-2" />
                <p className="text-sm text-slate-600">Loading availability...</p>
              </div>
            </div>
          )}
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              disabled={isBefore(subMonths(currentMonth, 1), startOfMonth(new Date()))}
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h3 className="text-lg font-semibold text-slate-900">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {paddingDays.map((_, i) => (
              <div key={`pad-${i}`} className="aspect-square" />
            ))}
            {daysInMonth.map(day => {
              const isUnavailable = isDateUnavailable(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentMonth);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => handleDateSelect(day)}
                  disabled={isUnavailable}
                  className={`
                    aspect-square rounded-lg text-sm font-medium transition-all
                    ${isSelected 
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg' 
                      : isUnavailable
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'text-slate-700 hover:bg-cyan-50 hover:text-cyan-700'
                    }
                  `}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded" />
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-200 rounded" />
              <span>Unavailable</span>
            </div>
          </div>
        </GlassCard>

        {/* Time Slots */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-600" />
            Available Times
          </h3>

          {selectedDate ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDate.toISOString()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className="text-slate-600 mb-4">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </p>
                <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto">
                  {availableTimes.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`
                        py-3 px-4 rounded-lg text-sm font-medium transition-all
                        ${selectedTime === time
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                          : 'bg-slate-100 text-slate-700 hover:bg-cyan-100 hover:text-cyan-700'
                        }
                      `}
                    >
                      {formatTimeForDisplay(time)}
                    </button>
                  ))}
                </div>
                {availableTimes.length === 0 && (
                  <p className="text-slate-500 text-center py-8">
                    No available times for this date. Please select another date.
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Select a date to view available times</p>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Selection Summary & Actions */}
      {selectedDate && selectedTime && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <CalendarIcon className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-cyan-600 font-medium">{formatTimeForDisplay(selectedTime)}</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        {onBack && (
          <Button
            variant="outline"
            onClick={onBack}
            className="order-2 sm:order-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
        <GradientButton
          onClick={handleContinue}
          disabled={!selectedDate || !selectedTime}
          className={`order-1 sm:order-2 ${!onBack ? 'w-full' : ''}`}
          size="lg"
        >
          {isRescheduling ? 'Confirm Reschedule' : 'Continue'}
          <ArrowRight className="w-5 h-5" />
        </GradientButton>
      </div>
    </div>
  );
}