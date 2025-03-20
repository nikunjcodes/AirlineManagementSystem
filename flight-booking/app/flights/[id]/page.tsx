"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Plane,
  Clock,
  Calendar,
  Info,
  Luggage,
  Coffee,
  Wifi,
  ChevronLeft,
} from "lucide-react";
import { flightService, type Flight, type Schedule } from "../flights";
import { calculateDuration } from "../flights";

export default function FlightDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        setLoading(true);
        const [flightData, scheduleData] = await Promise.all([
          flightService.getFlightById(id),
          flightService.getFlightSchedules(id),
        ]);

        setFlight(flightData);
        setSchedules(scheduleData);
      } catch (error) {
        console.error("Error fetching flight details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlightDetails();
  }, [id]);

  const handleBooking = () => {
    router.push(`/booking/${id}`);
  };

  // Get the current schedule for the flight
  const currentSchedule = schedules[0]; // Assuming the first schedule is current

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

  if (!flight) {
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
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => router.push("/flights")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Flights
      </Button>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Flight #{flight.id}</div>
                  <CardTitle className="text-2xl">
                    {flight.departureCity} to {flight.arrivalCity}
                  </CardTitle>
                </div>
                <Badge variant="outline" className="border-white text-white">
                  {flight.airlineName}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="text-center md:text-left">
                  <div className="text-3xl font-bold">
                    {currentSchedule &&
                      new Date(
                        currentSchedule.departureTime
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </div>
                  <div className="text-lg font-medium">
                    {flight.departureCity}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(
                      currentSchedule?.departureTime
                    ).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-sm text-muted-foreground">
                    {currentSchedule &&
                      calculateDuration(
                        currentSchedule.departureTime,
                        currentSchedule.arrivalTime
                      )}
                  </div>
                  <div className="my-2 h-[2px] w-24 bg-muted md:w-32">
                    <div className="relative">
                      <Plane className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-90 transform text-primary" />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">Non-stop</div>
                </div>

                <div className="text-center md:text-right">
                  <div className="text-3xl font-bold">
                    {currentSchedule &&
                      new Date(currentSchedule.arrivalTime).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                  </div>
                  <div className="text-lg font-medium">
                    {flight.arrivalCity}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(
                      currentSchedule?.arrivalTime
                    ).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <Tabs defaultValue="details">
                <TabsList className="mb-4 grid w-full grid-cols-2">
                  <TabsTrigger value="details">Flight Details</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Plane className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Flight Number</div>
                        <div>{flight.flightNumber}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Date</div>
                        <div>
                          {currentSchedule &&
                            new Date(
                              currentSchedule.departureTime
                            ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Luggage className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">
                          Available Seats
                        </div>
                        <div>{flight.availableSeats} seats</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-4">
                    <div className="flex items-start gap-2">
                      <Info className="mt-0.5 h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Flight Information</div>
                        <p className="text-sm text-muted-foreground">
                          This flight is operated by {flight.airlineName}.
                          Please arrive at the airport at least 2 hours before
                          the scheduled departure time.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="schedule">
                  <div className="space-y-2">
                    {schedules.map((schedule, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="font-medium">
                          {new Date(
                            schedule.departureTime
                          ).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-4">
                          <div>
                            {new Date(
                              schedule.departureTime
                            ).toLocaleTimeString()}{" "}
                            -
                            {new Date(
                              schedule.arrivalTime
                            ).toLocaleTimeString()}
                          </div>
                          <Badge
                            variant={
                              schedule.flightStatus === "ON_TIME"
                                ? "outline"
                                : "destructive"
                            }
                          >
                            {schedule.flightStatus}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
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
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>Rs {flight.price + 45}</span>
              </div>
              <Button className="mt-4 w-full" onClick={handleBooking}>
                Book Now
              </Button>
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
