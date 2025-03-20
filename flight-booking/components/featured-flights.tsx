"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, Plane, Heart, Calendar, Clock } from "lucide-react"
import { motion } from "framer-motion"

interface Flight {
  id: number
  from: string
  to: string
  departureTime: string
  arrivalTime: string
  price: number
  airline: string
  discount?: number
}

export function FeaturedFlights() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  useEffect(() => {
    // In a real app, this would fetch from your API
    // fetch('/api/flights?sort=asc&limit=3')
    setTimeout(() => {
      setFlights([
        {
          id: 1,
          from: "New York",
          to: "London",
          departureTime: "2023-06-15T08:00:00",
          arrivalTime: "2023-06-15T20:00:00",
          price: 450,
          airline: "Global Airways",
          discount: 15,
        },
        {
          id: 2,
          from: "Los Angeles",
          to: "Tokyo",
          departureTime: "2023-06-20T10:30:00",
          arrivalTime: "2023-06-21T14:30:00",
          price: 780,
          airline: "Pacific Flights",
        },
        {
          id: 3,
          from: "Chicago",
          to: "Paris",
          departureTime: "2023-06-18T14:15:00",
          arrivalTime: "2023-06-19T05:45:00",
          price: 520,
          airline: "Euro Connect",
          discount: 10,
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <Skeleton className="mb-2 h-4 w-3/4" />
                <Skeleton className="mb-4 h-6 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 p-4">
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {flights.map((flight, index) => (
        <motion.div
          key={flight.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -10 }}
        >
          <Card
            className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10"
            onMouseEnter={() => setHoveredCard(flight.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Glassmorphism effect */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
              <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
              <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
            </div>

            {/* Favorite button */}
            <motion.button
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className="h-4 w-4" />
            </motion.button>

            {/* Discount badge */}
            {flight.discount && (
              <div className="absolute left-0 top-4 z-10">
                <div className="relative flex items-center bg-gradient-to-r from-red-500 to-pink-500 py-1 pl-2 pr-3 text-xs font-bold text-white shadow-lg">
                  {flight.discount}% OFF
                  <div className="absolute -right-2 h-0 w-0 border-b-8 border-l-8 border-t-8 border-b-transparent border-l-[#ec4899] border-t-transparent"></div>
                </div>
              </div>
            )}

            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold">{flight.from}</div>
                  <motion.div
                    animate={hoveredCard === flight.id ? { x: [0, 10, 0] } : {}}
                    transition={{ duration: 1, repeat: hoveredCard === flight.id ? Number.POSITIVE_INFINITY : 0 }}
                  >
                    <Plane className="h-5 w-5 rotate-90 transform" />
                  </motion.div>
                  <div className="text-lg font-semibold">{flight.to}</div>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4 text-sm text-muted-foreground">{flight.airline}</div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold">
                      {new Date(flight.departureTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      {new Date(flight.departureTime).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-muted-foreground">
                      {Math.round(
                        (new Date(flight.arrivalTime).getTime() - new Date(flight.departureTime).getTime()) / 3600000,
                      )}
                      h
                    </div>
                    <div className="relative mt-1 h-[2px] w-16 bg-muted">
                      <motion.div
                        className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary"
                        initial={{ left: 0 }}
                        animate={hoveredCard === flight.id ? { left: "100%" } : {}}
                        transition={{ duration: 1.5, repeat: hoveredCard === flight.id ? Number.POSITIVE_INFINITY : 0 }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">Non-stop</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">
                      {new Date(flight.arrivalTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      {new Date(flight.arrivalTime).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>
                      {Math.round(
                        (new Date(flight.arrivalTime).getTime() - new Date(flight.departureTime).getTime()) / 3600000,
                      )}
                      h flight
                    </span>
                  </div>
                  <div>
                    {flight.discount ? (
                      <div className="text-right">
                        <span className="text-sm line-through text-muted-foreground">${flight.price}</span>
                        <div className="text-2xl font-bold text-primary">
                          ${Math.round(flight.price * (1 - flight.discount / 100))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-primary">${flight.price}</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/30 p-4">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                <Link href={`/flights/${flight.id}`} className="flex items-center justify-center">
                  View Details
                  <motion.div
                    animate={hoveredCard === flight.id ? { x: [0, 5, 0] } : {}}
                    transition={{ duration: 1, repeat: hoveredCard === flight.id ? Number.POSITIVE_INFINITY : 0 }}
                  >
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.div>
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

