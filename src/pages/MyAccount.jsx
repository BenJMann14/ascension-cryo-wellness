import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { User, Mail, Phone, MapPin, Calendar, DollarSign, Edit2, Save, LogOut, XCircle, CalendarClock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import RescheduleModal from '@/components/booking/RescheduleModal';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MyAccount() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    default_address: '',
    default_city: '',
    default_zip: ''
  });
  const [rescheduleModal, setRescheduleModal] = useState({ open: false, booking: null });
  const [cancelDialog, setCancelDialog] = useState({ open: false, booking: null });

  // Check if user is logged in
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch {
        return null;
      }
    }
  });

  // Fetch user's bookings
  const { data: bookings = [] } = useQuery({
    queryKey: ['my-bookings', user?.email],
    queryFn: () => base44.entities.Booking.filter({ customer_email: user.email }, '-created_date'),
    enabled: !!user
  });

  // Fetch user's team passes
  const { data: teamPasses = [] } = useQuery({
    queryKey: ['my-team-passes', user?.email],
    queryFn: () => base44.entities.TeamPass.filter({ customer_email: user.email }, '-created_date'),
    enabled: !!user
  });

  // Fetch user's individual services
  const { data: individualServices = [] } = useQuery({
    queryKey: ['my-individual-services', user?.email],
    queryFn: () => base44.entities.IndividualService.filter({ customer_email: user.email }, '-created_date'),
    enabled: !!user
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        phone: user.phone || '',
        default_address: user.default_address || '',
        default_city: user.default_city || '',
        default_zip: user.default_zip || ''
      });
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['current-user']);
      toast.success('Profile updated successfully');
      setEditing(false);
    },
    onError: () => {
      toast.error('Failed to update profile');
    }
  });

  const cancelBookingMutation = useMutation({
    mutationFn: (bookingId) => base44.functions.invoke('cancelBooking', { bookingId }),
    onSuccess: (response) => {
      queryClient.invalidateQueries(['my-bookings']);
      if (response.data.refunded) {
        toast.success(`Booking cancelled and $${response.data.refundAmount} refunded`);
      } else {
        toast.success('Booking cancelled successfully');
      }
      setCancelDialog({ open: false, booking: null });
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.error || 'Failed to cancel booking';
      toast.error(errorMsg);
    }
  });

  const rescheduleBookingMutation = useMutation({
    mutationFn: ({ bookingId, newDate, newTime }) => 
      base44.functions.invoke('rescheduleBooking', { bookingId, newDate, newTime }),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-bookings']);
      toast.success('Booking rescheduled successfully');
      setRescheduleModal({ open: false, booking: null });
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.error || 'Failed to reschedule booking';
      toast.error(errorMsg);
    }
  });

  const canModifyBooking = (booking) => {
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return { canModify: false, reason: 'Booking is already ' + booking.status };
    }
    
    const appointmentDateTime = new Date(`${booking.appointment_date}T${booking.appointment_time}`);
    const now = new Date();
    const hoursUntil = (appointmentDateTime - now) / (1000 * 60 * 60);
    
    if (hoursUntil < 24) {
      return { canModify: false, reason: 'Within 24 hours of appointment', hoursUntil: Math.round(hoursUntil) };
    }
    
    return { canModify: true };
  };

  const handleLogout = async () => {
    await base44.auth.logout();
    navigate(createPageUrl('Home'));
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    navigate(createPageUrl('Home'));
    return null;
  }

  const getStatusBadge = (status) => {
    const variants = {
      confirmed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return <Badge className={variants[status] || variants.pending}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <RescheduleModal
        open={rescheduleModal.open}
        onClose={() => setRescheduleModal({ open: false, booking: null })}
        booking={rescheduleModal.booking}
        onReschedule={async (newDate, newTime) => {
          await rescheduleBookingMutation.mutateAsync({
            bookingId: rescheduleModal.booking.id,
            newDate,
            newTime
          });
        }}
      />

      <AlertDialog open={cancelDialog.open} onOpenChange={(open) => !open && setCancelDialog({ open: false, booking: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
            <AlertDialogDescription>
              {cancelDialog.booking && canModifyBooking(cancelDialog.booking).canModify ? (
                <>
                  Are you sure you want to cancel your appointment on {cancelDialog.booking.appointment_date} at {cancelDialog.booking.appointment_time}?
                  {cancelDialog.booking.payment_status === 'paid' && (
                    <div className="mt-2 text-green-600 font-medium">
                      A refund of ${cancelDialog.booking.total_amount} will be processed.
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-start gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Cannot cancel:</strong> {canModifyBooking(cancelDialog.booking || {}).reason}
                    {canModifyBooking(cancelDialog.booking || {}).hoursUntil !== undefined && (
                      <div className="mt-1 text-sm">
                        Only {canModifyBooking(cancelDialog.booking || {}).hoursUntil} hours until your appointment. Our no-cancellation policy applies.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            {cancelDialog.booking && canModifyBooking(cancelDialog.booking).canModify && (
              <AlertDialogAction
                onClick={() => cancelBookingMutation.mutate(cancelDialog.booking.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Cancel Booking
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Account</h1>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editing ? (
                  <>
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={user.email} disabled className="bg-slate-100" />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Default Address</Label>
                      <Input
                        value={formData.default_address}
                        onChange={(e) => setFormData({ ...formData, default_address: e.target.value })}
                        placeholder="123 Main St"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>City</Label>
                        <Input
                          value={formData.default_city}
                          onChange={(e) => setFormData({ ...formData, default_city: e.target.value })}
                          placeholder="San Antonio"
                        />
                      </div>
                      <div>
                        <Label>ZIP</Label>
                        <Input
                          value={formData.default_zip}
                          onChange={(e) => setFormData({ ...formData, default_zip: e.target.value })}
                          placeholder="78201"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updateProfileMutation.mutate(formData)}
                        disabled={updateProfileMutation.isPending}
                        className="flex-1"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => setEditing(false)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="font-medium">{user.full_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                      {user.default_address && (
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                          <div>
                            <div>{user.default_address}</div>
                            <div>{user.default_city}, {user.default_zip}</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <Button onClick={() => setEditing(true)} className="w-full gap-2">
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bookings History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Booking History
                </CardTitle>
                <CardDescription>
                  Your mobile recovery sessions, team passes, and event services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mobile Bookings */}
                {bookings.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sm text-slate-700 mb-2">Mobile Recovery Sessions</h3>
                    <div className="space-y-2">
                      {bookings.map((booking) => {
                        const modifyStatus = canModifyBooking(booking);
                        return (
                          <div key={booking.id} className="border rounded-lg p-3 bg-white">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="font-medium text-slate-900">
                                  {booking.appointment_date ? format(new Date(booking.appointment_date), 'MMM dd, yyyy') : 'N/A'} at {booking.appointment_time}
                                </div>
                                <div className="text-sm text-slate-600">{booking.service_address}</div>
                              </div>
                              {getStatusBadge(booking.status)}
                            </div>
                            <div className="flex items-center gap-2 text-sm mb-2">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="font-semibold text-green-600">${booking.total_amount}</span>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-600">{booking.confirmation_number}</span>
                            </div>
                            {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                              <div className="flex gap-2 mt-3 pt-3 border-t">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    if (modifyStatus.canModify) {
                                      navigate(createPageUrl('BookSession') + `?reschedule=${booking.id}`);
                                    }
                                  }}
                                  disabled={!modifyStatus.canModify}
                                  className="gap-2 flex-1"
                                >
                                  <CalendarClock className="w-4 h-4" />
                                  Reschedule
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setCancelDialog({ open: true, booking })}
                                  className="gap-2 flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Cancel
                                </Button>
                              </div>
                            )}
                            {!modifyStatus.canModify && booking.status !== 'cancelled' && booking.status !== 'completed' && (
                              <div className="mt-3 pt-3 border-t text-xs text-slate-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {modifyStatus.reason}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Team Passes */}
                {teamPasses.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sm text-slate-700 mb-2">Team Passes</h3>
                    <div className="space-y-2">
                      {teamPasses.map((pass) => (
                        <div key={pass.id} className="border rounded-lg p-3 bg-pink-50">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium text-slate-900">{pass.redemption_code}</div>
                              <div className="text-sm text-slate-600">
                                {pass.remaining_passes} of {pass.total_passes} passes remaining
                              </div>
                            </div>
                            <Badge className="bg-pink-600 text-white">${pass.purchase_amount}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Individual Services */}
                {individualServices.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sm text-slate-700 mb-2">Event Services</h3>
                    <div className="space-y-2">
                      {individualServices.map((service) => (
                        <div key={service.id} className={`border rounded-lg p-3 ${service.is_redeemed ? 'bg-slate-100' : 'bg-purple-50'}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium text-slate-900">{service.service_name}</div>
                              <div className="text-sm text-slate-600">{service.confirmation_number}</div>
                            </div>
                            <Badge className={service.is_redeemed ? 'bg-slate-600' : 'bg-purple-600'}>
                              {service.is_redeemed ? 'Used' : `$${service.price}`}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {bookings.length === 0 && teamPasses.length === 0 && individualServices.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 mb-4">No bookings yet</p>
                    <Button onClick={() => navigate(createPageUrl('BookSession'))}>
                      Book Your First Session
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}