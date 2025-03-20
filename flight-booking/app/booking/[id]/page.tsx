"use client";

import type React from "react";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronLeft, CreditCard, Plane } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  flightService,
  type Flight,
  type Schedule,
} from "../../flights/flights";
import { ticketService } from "../../services/ticket";

export default function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [currentSchedule, setCurrentSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    nationality: "",
    passportNumber: "",
  });

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        setLoading(true);
        const [flightData, scheduleData] = await Promise.all([
          flightService.getFlightById(id),
          flightService.getFlightSchedules(id),
        ]);

        setFlight(flightData);
        if (scheduleData && scheduleData.length > 0) {
          setCurrentSchedule(scheduleData[0]); // Get the first available schedule
        }
      } catch (error) {
        console.error("Error fetching flight details:", error);
        toast({
          title: "Error",
          description: "Failed to load flight details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFlightDetails();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flight || !currentSchedule) return;

    setIsSubmitting(true);

    try {
      // Check if user is logged in
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to book tickets",
          variant: "destructive",
        });
        router.push("/auth"); // Redirect to login page
        return;
      }

      const ticketData = {
        flightId: flight.id,
        scheduleId: currentSchedule.id,
        passengerName: `${formData.firstName} ${formData.lastName}`,
        price: flight.price,
      };

      await ticketService.createTicket(ticketData);

      toast({
        title: "Booking Successful!",
        description: "Your ticket has been booked successfully.",
      });

      router.push("/tickets");
    } catch (error) {
      console.error("Booking error:", error);
      const errorMessage =
        error instanceof Error &&
        error.message === "No authentication token found. Please log in."
          ? "Please log in to book tickets"
          : "There was an error processing your booking. Please try again.";

      toast({
        title: "Booking Failed",
        description: errorMessage,
        variant: "destructive",
      });

      if (
        error instanceof Error &&
        error.message === "No authentication token found. Please log in."
      ) {
        router.push("/auth");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/3 rounded bg-muted"></div>
          <div className="h-64 rounded bg-muted"></div>
          <div className="h-32 rounded bg-muted"></div>
        </div>
      </div>
    );
  }

  if (!flight || !currentSchedule) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Flight not found</h1>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/flights")}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Flights
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" className="mb-6" onClick={() => router.back()}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <h1 className="mb-8 text-3xl font-bold">Book Your Flight</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Flight Details</CardTitle>
                <CardDescription>
                  Review your flight information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-muted/30 p-4">
                  <div className="flex items-center gap-4">
                    <Plane className="h-8 w-8 text-primary" />
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        {flight.airlineName} - Flight #{flight.id}
                      </div>
                      <div className="text-xl font-bold">
                        {flight.departureCity} to {flight.arrivalCity}
                      </div>
                      <div className="text-sm">
                        {new Date(
                          currentSchedule.departureTime
                        ).toLocaleDateString()}{" "}
                        •{" "}
                        {new Date(
                          currentSchedule.departureTime
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {new Date(
                          currentSchedule.arrivalTime
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Passenger Information</CardTitle>
                <CardDescription>
                  Enter details for all passengers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Passenger 1 (Primary Contact)</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        required
                        value={formData.dob}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input
                        id="nationality"
                        required
                        value={formData.nationality}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passportNumber">Passport Number</Label>
                    <Input
                      id="passportNumber"
                      required
                      value={formData.passportNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Terms and Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox id="terms" required />
                    <div>
                      <Label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the terms and conditions
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        By checking this box, you agree to our Terms of Service
                        and Privacy Policy.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Complete Booking"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Price Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Base Fare</span>
                <span>Rs {flight.price}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Fees</span>
                <span>Rs 45</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span>Rs 15</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>Rs {flight.price + 45 + 15}</span>
              </div>
              <div className="text-center text-xs text-muted-foreground">
                Price shown is per person
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
