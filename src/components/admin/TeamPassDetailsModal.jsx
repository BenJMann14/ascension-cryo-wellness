import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function TeamPassDetailsModal({ pass, open, onClose, onMarkTicketUsed }) {
  const [loadingTicketId, setLoadingTicketId] = useState(null);

  if (!pass) return null;

  const handleMarkUsed = async (ticketId) => {
    setLoadingTicketId(ticketId);
    await onMarkTicketUsed(pass.id, ticketId);
    setLoadingTicketId(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Team Pass Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pass Info */}
          <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg text-slate-900">
                  {pass.customer_first_name} {pass.customer_last_name}
                </h3>
                <p className="text-sm text-slate-600">{pass.customer_email}</p>
                <p className="text-sm text-slate-600">{pass.customer_phone}</p>
              </div>
              <Badge className="bg-pink-600 text-white font-mono text-base px-3 py-1">
                {pass.redemption_code}
              </Badge>
            </div>
            <div className="flex gap-4 text-sm">
              <div>
                <span className="text-slate-600">Total Passes: </span>
                <span className="font-semibold">{pass.total_passes}</span>
              </div>
              <div>
                <span className="text-slate-600">Remaining: </span>
                <span className="font-semibold text-green-600">{pass.remaining_passes}</span>
              </div>
              <div>
                <span className="text-slate-600">Used: </span>
                <span className="font-semibold text-slate-700">
                  {pass.total_passes - pass.remaining_passes}
                </span>
              </div>
            </div>
          </div>

          {/* Individual Tickets */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Individual Tickets</h4>
            <div className="space-y-2">
              {pass.individual_tickets && pass.individual_tickets.length > 0 ? (
                pass.individual_tickets.map((ticket) => (
                  <div
                    key={ticket.ticket_id}
                    className={`border rounded-lg p-3 flex items-center justify-between ${
                      ticket.is_used ? 'bg-slate-50 border-slate-300' : 'bg-white border-green-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {ticket.is_used ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400" />
                      )}
                      <div>
                        <div className="font-medium text-slate-900">
                          Ticket #{ticket.ticket_number}
                        </div>
                        {ticket.is_used && (
                          <div className="text-xs text-slate-600 flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3" />
                            Used on {format(new Date(ticket.used_at), 'MMM dd, yyyy')}
                            {ticket.service_type && ` • ${ticket.service_type}`}
                          </div>
                        )}
                      </div>
                    </div>
                    {!ticket.is_used && (
                      <Button
                        size="sm"
                        onClick={() => handleMarkUsed(ticket.ticket_id)}
                        disabled={loadingTicketId === ticket.ticket_id}
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
                      >
                        {loadingTicketId === ticket.ticket_id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            Marking...
                          </>
                        ) : (
                          'Mark as Used'
                        )}
                      </Button>
                    )}
                    {ticket.is_used && (
                      <Badge className="bg-slate-600 text-white">USED</Badge>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-4">No tickets found</p>
              )}
            </div>
          </div>

          {/* Redemption History */}
          {pass.redemption_history && pass.redemption_history.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Redemption History</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {pass.redemption_history.map((redemption, idx) => (
                  <div key={idx} className="text-sm bg-slate-50 rounded p-2 border">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <span>{format(new Date(redemption.redeemed_at), 'MMM dd, yyyy h:mm a')}</span>
                    </div>
                    {redemption.service_type && (
                      <div className="text-slate-600 ml-6">Service: {redemption.service_type}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}