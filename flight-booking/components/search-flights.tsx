"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CalendarIcon, Plane, MapPin, Users, Search, Sparkles } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { motion, AnimatePresence } from "framer-motion"

export function SearchFlights() {
  const router = useRouter()
  const [tripType, setTripType] = useState("roundtrip")
  const [departureDate, setDepartureDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [passengers, setPassengers] = useState("1")
  const [travelClass, setTravelClass] = useState("economy")
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeField, setActiveField] = useState<string | null>(null)

  // Popular destinations for suggestions
  const popularDestinations = [
    { code: "NYC", name: "New York", country: "United States" },
    { code: "LON", name: "London", country: "United Kingdom" },
    { code: "PAR", name: "Paris", country: "France" },
    { code: "TYO", name: "Tokyo", country: "Japan" },
    { code: "SYD", name: "Sydney", country: "Australia" },
    { code: "ROM", name: "Rome", country: "Italy" },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!from || !to || !departureDate || (tripType === "roundtrip" && !returnDate)) {
      // Show validation errors
      return
    }

    setIsSearching(true)

    // Simulate API call
    setTimeout(() => {
      router.push("/flights")
      setIsSearching(false)
    }, 1500)
  }

  // Handle focus for showing suggestions
  const handleFocus = (field: string) => {
    setActiveField(field)
    setShowSuggestions(true)
  }

  // Handle blur for hiding suggestions
  const handleBlur = () => {
    // Small delay to allow clicking on suggestions
    setTimeout(() => {
      setShowSuggestions(false)
      setActiveField(null)
    }, 200)
  }

  // Select a suggestion
  const handleSelectSuggestion = (destination: { code: string; name: string; country: string }) => {
    if (activeField === "from") {
      setFrom(`${destination.name} (${destination.code})`)
    } else if (activeField === "to") {
      setTo(`${destination.name} (${destination.code})`)
    }
    setShowSuggestions(false)
  }

  // Swap from and to locations
  const handleSwapLocations = () => {
    const tempFrom = from
    setFrom(to)
    setTo(tempFrom)
  }

  return (
    <form onSubmit={handleSearch} id="search" className="relative">
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-lg opacity-30">
        <motion.div
          className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/20 blur-3xl"
          animate={{
            x: [0, 10, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        ></motion.div>

        <motion.div
          className="absolute top-1/3 -left-20 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl"
          animate={{
            x: [0, 15, 0],
            y: [0, 10, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        ></motion.div>
      </div>

      <div className="mb-4">
        <RadioGroup
          defaultValue="roundtrip"
          className="flex flex-wrap gap-4"
          onValueChange={setTripType}
          value={tripType}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="roundtrip" id="roundtrip" className="border-primary text-primary" />
            <Label htmlFor="roundtrip" className="cursor-pointer transition-colors duration-200 hover:text-primary">
              Round Trip
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="oneway" id="oneway" className="border-primary text-primary" />
            <Label htmlFor="oneway" className="cursor-pointer transition-colors duration-200 hover:text-primary">
              One Way
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="multicity" id="multicity" className="border-primary text-primary" />
            <Label htmlFor="multicity" className="cursor-pointer transition-colors duration-200 hover:text-primary">
              Multi-City
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="relative mb-6 grid gap-4 md:grid-cols-2">
        <div className="relative space-y-2">
          <Label htmlFor="from" className="text-sm font-medium">
            From
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MapPin className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              id="from"
              placeholder="City or Airport"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              onFocus={() => handleFocus("from")}
              onBlur={handleBlur}
              className="pl-10 pr-10 transition-all duration-300 focus:border-primary focus:ring-primary hover:border-gray-400"
              required
            />
            {from && (
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                onClick={() => setFrom("")}
              >
                <span className="sr-only">Clear</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Location suggestions */}
          <AnimatePresence>
            {showSuggestions && activeField === "from" && (
              <motion.div
                className="absolute z-10 mt-1 w-full rounded-md border border-gray-700 bg-accent/80 p-2 shadow-lg backdrop-blur-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-2 flex items-center justify-between border-b border-gray-700 pb-1">
                  <span className="text-xs font-medium text-gray-400">Popular destinations</span>
                  <Sparkles className="h-3 w-3 text-primary" />
                </div>
                <ul className="max-h-48 overflow-auto">
                  {popularDestinations.map((destination) => (
                    <motion.li
                      key={destination.code}
                      className="cursor-pointer rounded-md p-2 hover:bg-accent"
                      onClick={() => handleSelectSuggestion(destination)}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center">
                        <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <Plane className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {destination.name} ({destination.code})
                          </div>
                          <div className="text-xs text-gray-400">{destination.country}</div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Swap button */}
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 md:block">
          <motion.button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20"
            onClick={handleSwapLocations}
            whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
            </svg>
          </motion.button>
        </div>

        <div className="relative space-y-2">
          <Label htmlFor="to" className="text-sm font-medium">
            To
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MapPin className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              id="to"
              placeholder="City or Airport"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              onFocus={() => handleFocus("to")}
              onBlur={handleBlur}
              className="pl-10 pr-10 transition-all duration-300 focus:border-primary focus:ring-primary hover:border-gray-400"
              required
            />
            {to && (
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                onClick={() => setTo("")}
              >
                <span className="sr-only">Clear</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Location suggestions */}
          <AnimatePresence>
            {showSuggestions && activeField === "to" && (
              <motion.div
                className="absolute z-10 mt-1 w-full rounded-md border border-gray-700 bg-accent/80 p-2 shadow-lg backdrop-blur-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-2 flex items-center justify-between border-b border-gray-700 pb-1">
                  <span className="text-xs font-medium text-gray-400">Popular destinations</span>
                  <Sparkles className="h-3 w-3 text-primary" />
                </div>
                <ul className="max-h-48 overflow-auto">
                  {popularDestinations.map((destination) => (
                    <motion.li
                      key={destination.code}
                      className="cursor-pointer rounded-md p-2 hover:bg-accent"
                      onClick={() => handleSelectSuggestion(destination)}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center">
                        <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <Plane className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {destination.name} ({destination.code})
                          </div>
                          <div className="text-xs text-gray-400">{destination.country}</div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="departure" className="text-sm font-medium">
            Departure Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal transition-all duration-300 hover:border-primary focus:border-primary focus:ring-primary",
                  !departureDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {departureDate ? format(departureDate, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={departureDate}
                onSelect={setDepartureDate}
                initialFocus
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
        </div>

        {tripType === "roundtrip" && (
          <div className="space-y-2">
            <Label htmlFor="return" className="text-sm font-medium">
              Return Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal transition-all duration-300 hover:border-primary focus:border-primary focus:ring-primary",
                    !returnDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {returnDate ? format(returnDate, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  initialFocus
                  disabled={(date) => (departureDate ? date < departureDate : false)}
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="passengers" className="text-sm font-medium">
            Passengers
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Users className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              id="passengers"
              type="number"
              min="1"
              max="10"
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
              className="pl-10 transition-all duration-300 focus:border-primary focus:ring-primary hover:border-gray-400"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="class" className="text-sm font-medium">
            Class
          </Label>
          <select
            id="class"
            value={travelClass}
            onChange={(e) => setTravelClass(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:border-gray-400"
          >
            <option value="economy">Economy</option>
            <option value="premium">Premium Economy</option>
            <option value="business">Business</option>
            <option value="first">First Class</option>
          </select>
        </div>
      </div>

      <motion.div
        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          type="submit"
          className="relative h-12 w-full overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300"
          disabled={isSearching}
        >
          <span className="relative z-10 flex items-center justify-center">
            {isSearching ? (
              <>
                <svg
                  className="mr-2 h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Searching Flights...
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                Search Flights
              </>
            )}
          </span>
          <motion.div
            className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 transition-opacity duration-300"
            whileHover={{ opacity: 1 }}
          />
        </Button>
      </motion.div>
    </form>
  )
}

