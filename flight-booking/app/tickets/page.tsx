"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plane, Calendar, Clock, Download, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ticketService } from "../services/ticket";

interface Ticket {
  id: number;
  userId: number;
  flightId: number;
  scheduleId: number;
  passengerName: string;
  seatNumber: string | null;
  price: number;
  status: string;
  bookingTime: string;
  lastUpdated: string;
  flight?: {
    id: number;
    airlineName: string;
    departureCity: string;
    arrivalCity: string;
  };
  schedule?: {
    id: number;
    departureTime: string;
    arrivalTime: string;
  };
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await ticketService.getMyTickets();
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        toast({
          title: "Error",
          description: "Failed to load tickets. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const cancelTicket = async (ticketId: number) => {
    try {
      await ticketService.cancelTicket(ticketId.toString());

      // Update local state
      setTickets(
        tickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, status: "CANCELLED" } : ticket
        )
      );

      toast({
        title: "Ticket Cancelled",
        description: "Your ticket has been cancelled successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel ticket. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">My Tickets</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded bg-muted"></div>
          ))}
        </div>
      </div>
    );
  }

  const upcomingTickets = tickets.filter(
    (ticket) => ticket.status === "BOOKED"
  );
  const completedTickets = tickets.filter(
    (ticket) => ticket.status === "COMPLETED"
  );
  const cancelledTickets = tickets.filter(
    (ticket) => ticket.status === "CANCELLED"
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Tickets</h1>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            Upcoming
            {upcomingTickets.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {upcomingTickets.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingTickets.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <h3 className="text-lg font-medium">No upcoming tickets</h3>
              <p className="mt-2 text-muted-foreground">
                You don't have any upcoming flights. Book a flight to get
                started.
              </p>
              <Button asChild className="mt-4">
                <Link href="/flights">Browse Flights</Link>
              </Button>
            </div>
          ) : (
            upcomingTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onCancel={() => cancelTicket(ticket.id)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedTickets.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <h3 className="text-lg font-medium">No completed tickets</h3>
              <p className="mt-2 text-muted-foreground">
                You don't have any completed flights yet.
              </p>
            </div>
          ) : (
            completedTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                showCancelButton={false}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledTickets.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <h3 className="text-lg font-medium">No cancelled tickets</h3>
              <p className="mt-2 text-muted-foreground">
                You don't have any cancelled flights.
              </p>
            </div>
          ) : (
            cancelledTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                showCancelButton={false}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface TicketCardProps {
  ticket: Ticket;
  onCancel?: () => void;
  showCancelButton?: boolean;
}

function TicketCard({
  ticket,
  onCancel,
  showCancelButton = true,
}: TicketCardProps) {
  if (!ticket.flight || !ticket.schedule) return null;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Ticket ID: {ticket.id}</div>
            <CardTitle className="text-xl">
              {ticket.flight.departureCity} to {ticket.flight.arrivalCity}
            </CardTitle>
          </div>
          <Badge
            variant={
              ticket.status === "BOOKED"
                ? "outline"
                : ticket.status === "COMPLETED"
                ? "secondary"
                : "destructive"
            }
            className={
              ticket.status === "BOOKED" ? "border-white text-white" : ""
            }
          >
            {ticket.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Airline</div>
                <div>{ticket.flight.airlineName}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Date</div>
                <div>
                  {new Date(ticket.schedule.departureTime).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Departure</div>
                <div>
                  {new Date(ticket.schedule.departureTime).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Arrival</div>
                <div>
                  {new Date(ticket.schedule.arrivalTime).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-muted/50 p-4">
          <div className="text-sm font-medium">Passenger</div>
          <div>{ticket.passengerName}</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2 border-t bg-muted/30 p-4">
        <Button variant="outline" size="sm" className="gap-1">
          <Download className="h-4 w-4" />
          Download Ticket
        </Button>

        {showCancelButton && ticket.status === "BOOKED" && onCancel && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                Cancel Ticket
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Ticket</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel this ticket? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No, Keep Ticket</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onCancel}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Yes, Cancel Ticket
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <Button asChild size="sm">
          <Link href={`/flights/${ticket.flightId}`}>View Flight Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
