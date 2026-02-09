import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Calendar, 
  Search, 
  Filter, 
  RefreshCw, 
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Mail,
  Phone,
  Edit,
  Trash2,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionDialog, setActionDialog] = useState({ open: false, type: null });

  // Check if user is admin
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const authenticated = await base44.auth.isAuthenticated();
      if (!authenticated) {
        window.location.href = '/';
        return null;
      }
      const userData = await base44.auth.me();
      if (userData.role !== 'admin') {
        window.location.href = '/';
        return null;
      }
      return userData;
    }
  });

  // Fetch all bookings
  const { data: bookings = [], isLoading: bookingsLoading, refetch } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => base44.entities.Booking.list('-created_date'),
    enabled: !!user,
  });

  // Fetch team passes
  const { data: teamPasses = [], isLoading: teamPassesLoading } = useQuery({
    queryKey: ['admin-team-passes'],
    queryFn: () => base44.entities.TeamPass.list('-created_date'),
    enabled: !!user,
  });

  // Fetch individual services
  const { data: individualServices = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['admin-individual-services'],
    queryFn: () => base44.entities.IndividualService.list('-created_date'),
    enabled: !!user,
  });

  // Cancel booking mutation
  const cancelMutation = useMutation({
    mutationFn: async (bookingId) => {
      await base44.entities.Booking.update(bookingId, { status: 'cancelled' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-bookings']);
      toast.success('Booking cancelled successfully');
      setActionDialog({ open: false, type: null });
      setSelectedBooking(null);
    },
    onError: (error) => {
      toast.error('Failed to cancel booking: ' + error.message);
    }
  });

  // Update booking mutation (for reschedule)
  const updateMutation = useMutation({
    mutationFn: async ({ bookingId, data }) => {
      await base44.entities.Booking.update(bookingId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-bookings']);
      toast.success('Booking updated successfully');
      setActionDialog({ open: false, type: null });
      setSelectedBooking(null);
    },
    onError: (error) => {
      toast.error('Failed to update booking: ' + error.message);
    }
  });

  // Filtered and sorted bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        booking.customer_first_name?.toLowerCase().includes(searchLower) ||
        booking.customer_last_name?.toLowerCase().includes(searchLower) ||
        booking.customer_email?.toLowerCase().includes(searchLower) ||
        booking.confirmation_number?.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

      // Date filter
      let matchesDate = true;
      if (dateFilter !== 'all' && booking.appointment_date) {
        const appointmentDate = new Date(booking.appointment_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dateFilter === 'upcoming') {
          matchesDate = appointmentDate >= today;
        } else if (dateFilter === 'past') {
          matchesDate = appointmentDate < today;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [bookings, searchTerm, statusFilter, dateFilter]);

  // Stats
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookingRevenue = bookings.filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + (b.total_amount || 0), 0);
    const teamPassRevenue = teamPasses.filter(tp => tp.payment_status === 'paid').reduce((sum, tp) => sum + (tp.purchase_amount || 0), 0);
    const individualServiceRevenue = individualServices.filter(s => s.payment_status === 'paid').reduce((sum, s) => sum + (s.price || 0), 0);

    return {
      total: bookings.length,
      upcoming: bookings.filter(b => b.appointment_date && new Date(b.appointment_date) >= today && b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      revenue: bookingRevenue + teamPassRevenue + individualServiceRevenue,
      teamPassCount: teamPasses.length,
      individualServiceCount: individualServices.length
    };
  }, [bookings, teamPasses, individualServices]);

  const handleCancelBooking = () => {
    if (selectedBooking) {
      cancelMutation.mutate(selectedBooking.id);
    }
  };

  const handleMarkComplete = (booking) => {
    updateMutation.mutate({
      bookingId: booking.id,
      data: { status: 'completed' }
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      confirmed: { color: 'bg-green-100 text-green-700', label: 'Confirmed' },
      pending: { color: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
      completed: { color: 'bg-blue-100 text-blue-700', label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-700', label: 'Cancelled' },
      no_show: { color: 'bg-slate-100 text-slate-700', label: 'No Show' }
    };
    const variant = variants[status] || variants.pending;
    return <Badge className={variant.color}>{variant.label}</Badge>;
  };

  if (userLoading || bookingsLoading || teamPassesLoading || servicesLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-cyan-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
            <p className="text-slate-600">Manage bookings and view analytics</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              queryClient.invalidateQueries(['admin-bookings']);
              queryClient.invalidateQueries(['admin-team-passes']);
              queryClient.invalidateQueries(['admin-individual-services']);
              toast.success('Dashboard refreshed');
            }}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh All
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Mobile Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Team Passes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">{stats.teamPassCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Event Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.individualServiceCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-600">{stats.upcoming}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">${stats.revenue}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search by name, email, or confirmation #"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Team Passes Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Team Passes ({teamPasses.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teamPasses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500">No team passes yet</p>
                </div>
              ) : (
                teamPasses.map((pass) => (
                  <div key={pass.id} className="border rounded-lg p-4 bg-pink-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-slate-900">
                            {pass.customer_first_name} {pass.customer_last_name}
                          </span>
                          <Badge className="bg-pink-600 text-white font-mono">
                            {pass.redemption_code}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {pass.customer_email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {pass.customer_phone}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm font-medium text-slate-700">
                            {pass.total_passes} passes • {pass.remaining_passes} remaining
                          </span>
                          <Badge className="bg-green-600 text-white">${pass.purchase_amount}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Individual Event Services Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Individual Event Services ({individualServices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {individualServices.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500">No individual services yet</p>
                </div>
              ) : (
                individualServices.map((service) => (
                  <div key={service.id} className={`border rounded-lg p-4 ${service.is_redeemed ? 'bg-slate-100' : 'bg-purple-50'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-slate-900">
                            {service.customer_first_name} {service.customer_last_name}
                          </span>
                          <Badge className={service.is_redeemed ? 'bg-slate-600' : 'bg-purple-600'}>
                            {service.confirmation_number}
                          </Badge>
                          {service.is_redeemed && (
                            <Badge className="bg-red-600 text-white">USED</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 mb-2">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {service.customer_email}
                          </div>
                          {service.customer_phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {service.customer_phone}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium text-slate-700">
                            {service.service_name}
                          </span>
                          <Badge className="bg-green-600 text-white">${service.price}</Badge>
                          <Badge variant="outline">{service.event_type}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mobile Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Mobile Recovery Bookings ({filteredBookings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No bookings found</p>
                </div>
              ) : (
                filteredBookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-semibold text-slate-900">
                            {booking.customer_first_name} {booking.customer_last_name}
                          </span>
                          {getStatusBadge(booking.status)}
                          <Badge variant="outline" className="font-mono text-xs">
                            {booking.confirmation_number}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {booking.appointment_date ? format(new Date(booking.appointment_date), 'MMM dd, yyyy') : 'N/A'} at {booking.appointment_time || 'N/A'}
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {booking.customer_email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {booking.customer_phone}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {booking.service_address}, {booking.service_city}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-600">${booking.total_amount}</span>
                          <Badge variant="outline" className={booking.payment_status === 'paid' ? 'bg-green-50' : 'bg-yellow-50'}>
                            {booking.payment_status}
                          </Badge>
                        </div>

                        {booking.services_selected && booking.services_selected.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {booking.services_selected.map((service, idx) => (
                              <Badge key={idx} variant="outline" className="bg-cyan-50">
                                {service.service_name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex md:flex-col gap-2">
                        {booking.status === 'confirmed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkComplete(booking)}
                            className="text-green-600"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Complete
                          </Button>
                        )}
                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setActionDialog({ open: true, type: 'cancel' });
                            }}
                            className="text-red-600"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cancel Dialog */}
      <Dialog open={actionDialog.open && actionDialog.type === 'cancel'} onOpenChange={(open) => {
        if (!open) {
          setActionDialog({ open: false, type: null });
          setSelectedBooking(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking for {selectedBooking?.customer_first_name} {selectedBooking?.customer_last_name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ open: false, type: null })}>
              No, Keep Booking
            </Button>
            <Button variant="destructive" onClick={handleCancelBooking} disabled={cancelMutation.isPending}>
              {cancelMutation.isPending ? 'Cancelling...' : 'Yes, Cancel Booking'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}