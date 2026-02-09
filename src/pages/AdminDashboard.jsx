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
import RevenueChart from '@/components/admin/RevenueChart';
import { motion } from 'framer-motion';
import TeamPassDetailsModal from '@/components/admin/TeamPassDetailsModal';

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionDialog, setActionDialog] = useState({ open: false, type: null });
  const [activeView, setActiveView] = useState('all'); // 'all', 'mobile', 'teampass', 'individual', 'upcoming', 'completed', 'revenue'
  const [selectedTeamPass, setSelectedTeamPass] = useState(null);
  const [teamPassModalOpen, setTeamPassModalOpen] = useState(false);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (loginEmail === 'admin' && loginPassword === 'admin') {
      setIsAdminLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials');
    }
  };

  // Fetch all bookings
  const { data: bookings = [], isLoading: bookingsLoading, refetch } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => base44.entities.Booking.list('-created_date'),
    enabled: isAdminLoggedIn,
  });

  // Fetch team passes
  const { data: teamPasses = [], isLoading: teamPassesLoading } = useQuery({
    queryKey: ['admin-team-passes'],
    queryFn: () => base44.entities.TeamPass.list('-created_date'),
    enabled: isAdminLoggedIn,
  });

  // Fetch individual services
  const { data: individualServices = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['admin-individual-services'],
    queryFn: () => base44.entities.IndividualService.list('-created_date'),
    enabled: isAdminLoggedIn,
  });

  // Refund mutation
  const refundMutation = useMutation({
    mutationFn: async ({ entityType, entityId }) => {
      const response = await base44.functions.invoke('processRefund', { entityType, entityId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-bookings']);
      queryClient.invalidateQueries(['admin-team-passes']);
      queryClient.invalidateQueries(['admin-individual-services']);
      toast.success('Refund processed successfully');
      setActionDialog({ open: false, type: null });
      setSelectedBooking(null);
    },
    onError: (error) => {
      toast.error('Failed to process refund: ' + error.message);
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

      // Active view filter
      let matchesView = true;
      if (activeView === 'upcoming') {
        const appointmentDate = booking.appointment_date ? new Date(booking.appointment_date) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        matchesView = appointmentDate && appointmentDate >= today && booking.status === 'confirmed';
      } else if (activeView === 'completed') {
        matchesView = booking.status === 'completed';
      }

      return matchesSearch && matchesStatus && matchesDate && matchesView;
    });
  }, [bookings, searchTerm, statusFilter, dateFilter, activeView]);

  // Filtered team passes
  const filteredTeamPasses = useMemo(() => {
    return teamPasses.filter(pass => {
      const searchLower = searchTerm.toLowerCase();
      return !searchTerm || 
        pass.customer_first_name?.toLowerCase().includes(searchLower) ||
        pass.customer_last_name?.toLowerCase().includes(searchLower) ||
        pass.customer_email?.toLowerCase().includes(searchLower) ||
        pass.redemption_code?.toLowerCase().includes(searchLower);
    });
  }, [teamPasses, searchTerm]);

  // Filtered individual services
  const filteredIndividualServices = useMemo(() => {
    return individualServices.filter(service => {
      const searchLower = searchTerm.toLowerCase();
      return !searchTerm || 
        service.customer_first_name?.toLowerCase().includes(searchLower) ||
        service.customer_last_name?.toLowerCase().includes(searchLower) ||
        service.customer_email?.toLowerCase().includes(searchLower) ||
        service.confirmation_number?.toLowerCase().includes(searchLower);
    });
  }, [individualServices, searchTerm]);

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

  const handleRefund = () => {
    if (selectedBooking) {
      refundMutation.mutate({
        entityType: selectedBooking.entityType,
        entityId: selectedBooking.id
      });
    }
  };

  const handleMarkComplete = (booking) => {
    updateMutation.mutate({
      bookingId: booking.id,
      data: { status: 'completed' }
    });
  };

  // Mark individual service as used
  const markServiceUsedMutation = useMutation({
    mutationFn: async (serviceId) => {
      await base44.entities.IndividualService.update(serviceId, {
        is_redeemed: true,
        redeemed_at: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-individual-services']);
      toast.success('Service marked as used');
    },
    onError: (error) => {
      toast.error('Failed to update service: ' + error.message);
    }
  });

  // Mark team pass ticket as used
  const markTeamPassTicketUsedMutation = useMutation({
    mutationFn: async ({ passId, ticketId }) => {
      const pass = teamPasses.find(p => p.id === passId);
      if (!pass) throw new Error('Team pass not found');

      const updatedTickets = pass.individual_tickets.map(ticket => 
        ticket.ticket_id === ticketId 
          ? { ...ticket, is_used: true, used_at: new Date().toISOString(), used_by: 'admin' }
          : ticket
      );

      const usedCount = updatedTickets.filter(t => t.is_used).length;
      const remainingPasses = pass.total_passes - usedCount;

      await base44.entities.TeamPass.update(passId, {
        individual_tickets: updatedTickets,
        remaining_passes: remainingPasses,
        redemption_history: [
          ...(pass.redemption_history || []),
          {
            redeemed_at: new Date().toISOString(),
            redeemed_by: 'admin',
            service_type: 'Manual redemption'
          }
        ]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-team-passes']);
      toast.success('Ticket marked as used');
    },
    onError: (error) => {
      toast.error('Failed to mark ticket as used: ' + error.message);
    }
  });

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

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-slate-900">Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Email</label>
                <Input
                  type="text"
                  placeholder="admin"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Password</label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              {loginError && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                  {loginError}
                </div>
              )}
              <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (bookingsLoading || teamPassesLoading || servicesLoading) {
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
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={async () => {
                try {
                  await base44.functions.invoke('migrateTeamPassTickets', {});
                  queryClient.invalidateQueries(['admin-team-passes']);
                  toast.success('Team passes migrated successfully');
                } catch (error) {
                  toast.error('Migration failed: ' + error.message);
                }
              }}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Fix Team Passes
            </Button>
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
        </div>

        {/* Active Filter Indicator */}
        {activeView !== 'all' && (
          <div className="mb-4">
            <Button
              variant="outline"
              onClick={() => setActiveView('all')}
              className="gap-2"
            >
              <XCircle className="w-4 h-4" />
              Clear Filter - View All
            </Button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              className={`cursor-pointer transition-all ${activeView === 'mobile' ? 'ring-2 ring-cyan-500 bg-cyan-50' : 'hover:shadow-lg'}`}
              onClick={() => setActiveView(activeView === 'mobile' ? 'all' : 'mobile')}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Mobile Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              className={`cursor-pointer transition-all ${activeView === 'teampass' ? 'ring-2 ring-pink-500 bg-pink-50' : 'hover:shadow-lg'}`}
              onClick={() => setActiveView(activeView === 'teampass' ? 'all' : 'teampass')}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Team Passes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-pink-600">{stats.teamPassCount}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              className={`cursor-pointer transition-all ${activeView === 'individual' ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:shadow-lg'}`}
              onClick={() => setActiveView(activeView === 'individual' ? 'all' : 'individual')}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Event Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.individualServiceCount}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              className={`cursor-pointer transition-all ${activeView === 'upcoming' ? 'ring-2 ring-cyan-500 bg-cyan-50' : 'hover:shadow-lg'}`}
              onClick={() => setActiveView(activeView === 'upcoming' ? 'all' : 'upcoming')}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Upcoming</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-cyan-600">{stats.upcoming}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              className={`cursor-pointer transition-all ${activeView === 'completed' ? 'ring-2 ring-green-500 bg-green-50' : 'hover:shadow-lg'}`}
              onClick={() => setActiveView(activeView === 'completed' ? 'all' : 'completed')}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              className={`cursor-pointer transition-all ${activeView === 'revenue' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-lg'}`}
              onClick={() => setActiveView(activeView === 'revenue' ? 'all' : 'revenue')}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">${stats.revenue}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Revenue Chart */}
        {activeView === 'revenue' && (
          <div className="mb-6">
            <RevenueChart />
          </div>
        )}

        {/* Filters */}
        {activeView !== 'revenue' && (
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
        )}

        {/* Team Passes Section */}
        {(activeView === 'all' || activeView === 'teampass') && (
          <Card className="mb-6">
          <CardHeader>
            <CardTitle>Team Passes ({filteredTeamPasses.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredTeamPasses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500">No team passes found</p>
                </div>
              ) : (
                filteredTeamPasses.map((pass) => (
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
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedTeamPass(pass);
                            setTeamPassModalOpen(true);
                          }}
                          className="text-cyan-600"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          View Tickets
                        </Button>
                        {pass.payment_status === 'paid' && pass.remaining_passes === pass.total_passes && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedBooking({ ...pass, entityType: 'TeamPass' });
                              setActionDialog({ open: true, type: 'refund' });
                            }}
                            className="text-red-600"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Refund
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
        )}

        {/* Individual Event Services Section */}
        {(activeView === 'all' || activeView === 'individual') && (
          <Card className="mb-6">
          <CardHeader>
            <CardTitle>Individual Event Services ({filteredIndividualServices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredIndividualServices.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500">No individual services found</p>
                </div>
              ) : (
                filteredIndividualServices.map((service) => (
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
                      <div className="flex flex-col gap-2">
                        {!service.is_redeemed && service.payment_status === 'paid' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markServiceUsedMutation.mutate(service.id)}
                            className="text-green-600"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark Used
                          </Button>
                        )}
                        {service.payment_status === 'paid' && !service.is_redeemed && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedBooking({ ...service, entityType: 'IndividualService' });
                              setActionDialog({ open: true, type: 'refund' });
                            }}
                            className="text-red-600"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Refund
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
        )}

        {/* Mobile Bookings Table */}
        {(activeView === 'all' || activeView === 'mobile' || activeView === 'upcoming' || activeView === 'completed') && (
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
                        {booking.status !== 'cancelled' && booking.status !== 'completed' && booking.payment_status === 'paid' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedBooking({ ...booking, entityType: 'Booking' });
                              setActionDialog({ open: true, type: 'refund' });
                            }}
                            className="text-red-600"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Refund & Cancel
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
        )}
      </div>

      {/* Team Pass Details Modal */}
      <TeamPassDetailsModal
        pass={selectedTeamPass}
        open={teamPassModalOpen}
        onClose={() => {
          setTeamPassModalOpen(false);
          setSelectedTeamPass(null);
        }}
        onMarkTicketUsed={(passId, ticketId) => {
          markTeamPassTicketUsedMutation.mutate({ passId, ticketId });
        }}
      />

      {/* Refund Dialog */}
      <Dialog open={actionDialog.open && actionDialog.type === 'refund'} onOpenChange={(open) => {
        if (!open) {
          setActionDialog({ open: false, type: null });
          setSelectedBooking(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refund and Cancel</DialogTitle>
            <DialogDescription>
              Are you sure you want to process a refund and cancel for {selectedBooking?.customer_first_name} {selectedBooking?.customer_last_name}? This will refund their payment through Stripe.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ open: false, type: null })}>
              No, Keep It
            </Button>
            <Button variant="destructive" onClick={handleRefund} disabled={refundMutation.isPending}>
              {refundMutation.isPending ? 'Processing...' : 'Yes, Refund & Cancel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}