"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ArrowUpDown, Plane, Clock, Calendar } from "lucide-react";
import { flightService, type Flight } from "../flights/flights";

export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        const data = await flightService.getAllFlights(sortOrder);
        setFlights(data);
      } catch (error) {
        console.error("Error fetching flights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Available Flights</h1>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
          <h2 className="text-xl font-semibold">Filters</h2>

          <div className="space-y-2">
            <Label htmlFor="airline">Airline</Label>
            <Select>
              <SelectTrigger id="airline">
                <SelectValue placeholder="All Airlines" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Airlines</SelectItem>
                <SelectItem value="global">Global Airways</SelectItem>
                <SelectItem value="pacific">Pacific Flights</SelectItem>
                <SelectItem value="euro">Euro Connect</SelectItem>
                <SelectItem value="iberia">Iberia Express</SelectItem>
                <SelectItem value="oceanic">Oceanic Air</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Price Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input type="number" placeholder="Min" min="0" />
              <Input type="number" placeholder="Max" min="0" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stops">Stops</Label>
            <Select>
              <SelectTrigger id="stops">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="nonstop">Non-stop only</SelectItem>
                <SelectItem value="1stop">1 stop max</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full">Apply Filters</Button>
        </div>

        <div className="md:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {flights.length} flights found
            </div>
            <Button variant="outline" onClick={toggleSortOrder}>
              Sort by Price
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-24 w-full bg-muted"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {flights.map((flight) => (
                <Link href={`/flights/${flight.id}`} key={flight.id}>
                  <Card className="transition-all hover:shadow-md">
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-4">
                        <div className="flex flex-col justify-center">
                          <div className="text-sm font-medium text-muted-foreground">
                            {flight.airlineName}
                          </div>
                          <div className="mt-1 flex items-center">
                            <Plane className="mr-2 h-4 w-4" />
                            <span className="font-medium">
                              Flight #{flight.flightNumber}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col justify-center md:col-span-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-lg font-bold">
                                {flight.departureCity}
                              </div>
                            </div>

                            <div className="mx-4 flex flex-col items-center">
                              <div className="text-xs text-muted-foreground">
                                Direct Flight
                              </div>
                              <div className="relative mt-1 h-[2px] w-16 bg-muted">
                                <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary"></div>
                              </div>
                            </div>

                            <div>
                              <div className="text-lg font-bold">
                                {flight.arrivalCity}
                              </div>
                            </div>
                          </div>

                          <div className="mt-2 flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-1 h-4 w-4" />
                            <span>
                              Available Seats: {flight.availableSeats}
                            </span>
                            <Clock className="ml-4 mr-1 h-4 w-4" />
                            <span>Non-stop</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-center">
                          <div className="text-2xl font-bold text-primary">
                            Rs {flight.price}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            per person
                          </div>
                          <Button className="mt-2" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
