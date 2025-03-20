"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SearchFlights } from "@/components/search-flights";
import { FeaturedFlights } from "@/components/featured-flights";
import { HeroSection } from "@/components/hero-section";
import { Button } from "@/components/ui/button";
import {
  Plane,
  LogIn,
  UserPlus,
  CheckCircle,
  Globe,
  CreditCard,
  Clock,
  Users,
  Phone,
  User,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Home() {
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      if (token && username) {
        setUser({ username });
      } else {
        setUser(null);
      }
    };

    // Check initially
    checkAuth();

    // Add event listener for storage changes
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container-custom h-16 flex items-center justify-between border-b border-accent/50">
        <Link href="/" className="flex items-center justify-center">
          <Plane className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold font-poppins">
            SkyJourney
          </span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href="#features"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="#destinations"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Destinations
          </Link>
          <Link
            href="#about"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            About
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            FAQ
          </Link>
          {!user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="gap-1 hover:text-primary hover:bg-accent/50"
              >
                <Link href="/auth">
                  <LogIn className="h-4 w-4 mr-1" />
                  Sign In
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="gap-1 bg-primary hover:bg-primary/90 transition-colors"
              >
                <Link href="/auth?tab=signup">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Sign Up
                </Link>
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center">
                  <Plane className="mr-2 h-4 w-4" />
                  <span>My Bookings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center text-red-500 focus:text-red-500"
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("username");
                    setUser(null);
                    window.location.reload(); // Force a refresh
                  }}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </header>
      <main className="flex-1">
        <HeroSection />

        {/* Search section */}
        <section id="search" className="container-custom py-12">
          <motion.div
            className="glass-effect rounded-lg p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="mb-6 text-2xl font-bold font-poppins">
              Find Your Flight
            </h2>
            <SearchFlights />
          </motion.div>
        </section>

        {/* Featured flights section */}
        <section id="destinations" className="container-custom py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex flex-col md:flex-row md:items-end justify-between"
          >
            <div>
              <span className="text-sm font-medium text-primary">
                Explore the world
              </span>
              <h2 className="text-3xl font-bold font-poppins">
                Featured Destinations
              </h2>
              <p className="mt-2 text-gray-400 max-w-2xl">
                Discover our most popular flight routes with exclusive deals and
                competitive prices.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-accent/50 p-1">
                  <TabsTrigger value="all" className="text-xs">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="domestic" className="text-xs">
                    Domestic
                  </TabsTrigger>
                  <TabsTrigger value="international" className="text-xs">
                    International
                  </TabsTrigger>
                  <TabsTrigger value="deals" className="text-xs">
                    Best Deals
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </motion.div>
          <FeaturedFlights />
        </section>

        {/* Features section */}
        <section id="features" className="bg-accent/30 py-16">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <span className="text-sm font-medium text-primary">
                Why choose us
              </span>
              <h2 className="mt-2 text-3xl font-bold font-poppins">
                The SkyJourney Advantage
              </h2>
              <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
                Experience the difference with our premium flight booking
                service designed with travelers in mind.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <motion.div
                className="glass-effect rounded-lg p-6 text-center shadow-lg transition-transform hover:scale-105 duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-glow">
                  <CreditCard className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold font-poppins">
                  Best Price Guarantee
                </h3>
                <p className="text-muted-foreground">
                  We offer competitive prices on all flights with no hidden
                  fees. Find a lower price? We'll match it.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>No booking fees</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Price match guarantee</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Transparent pricing</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                className="glass-effect rounded-lg p-6 text-center shadow-lg transition-transform hover:scale-105 duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-glow">
                  <Clock className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold font-poppins">
                  24/7 Support
                </h3>
                <p className="text-muted-foreground">
                  Our customer service team is available around the clock to
                  assist you with any questions or issues.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Live chat support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Phone support in 15+ languages</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Emergency travel assistance</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                className="glass-effect rounded-lg p-6 text-center shadow-lg transition-transform hover:scale-105 duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-glow">
                  <Globe className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold font-poppins">
                  Global Coverage
                </h3>
                <p className="text-muted-foreground">
                  Access flights to over 200 countries and territories worldwide
                  with our extensive airline partnerships.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>500+ airlines worldwide</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Exclusive airline deals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>International flight specialists</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials section */}
        <section className="py-16 bg-pattern">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <span className="text-sm font-medium text-primary">
                Testimonials
              </span>
              <h2 className="mt-2 text-3xl font-bold font-poppins">
                What Our Customers Say
              </h2>
              <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
                Don't just take our word for it. Here's what travelers have to
                say about their experience with SkyJourney.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  name: "Sarah Johnson",
                  location: "New York, USA",
                  rating: 5,
                  text: "SkyJourney made booking my international flight so easy. The interface is intuitive and I found a great deal. Highly recommend!",
                },
                {
                  name: "Michael Chen",
                  location: "Toronto, Canada",
                  rating: 5,
                  text: "I've been using SkyJourney for all my business trips. Their 24/7 support has been invaluable when I've had last-minute changes.",
                },
                {
                  name: "Emma Rodriguez",
                  location: "London, UK",
                  rating: 4,
                  text: "Great service and competitive prices. The app is easy to use and I love getting notifications about price drops for my favorite routes.",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="glass-effect rounded-lg p-6 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 overflow-hidden rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-gray-400">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating
                            ? "text-yellow-400"
                            : "text-gray-600"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-300">{testimonial.text}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-10 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 transition-colors"
              >
                <Link href="/auth?tab=signup">
                  Join thousands of happy travelers
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* FAQ section */}
        <section id="faq" className="py-16">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <span className="text-sm font-medium text-primary">FAQ</span>
              <h2 className="mt-2 text-3xl font-bold font-poppins">
                Frequently Asked Questions
              </h2>
              <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
                Find answers to common questions about booking flights with
                SkyJourney.
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {[
                  {
                    question: "How do I book a flight on SkyJourney?",
                    answer:
                      "Booking a flight on SkyJourney is simple. Enter your departure and arrival cities, travel dates, and number of passengers in our search form. Browse the available options, select your preferred flight, and follow the checkout process to complete your booking.",
                  },
                  {
                    question: "Can I cancel or change my flight booking?",
                    answer:
                      "Yes, you can cancel or change your flight booking, subject to the airline's policies. Log in to your account, go to 'My Bookings', select the flight you want to modify, and follow the instructions. Note that fees may apply depending on the airline and fare type.",
                  },
                  {
                    question: "How can I get the best deals on flights?",
                    answer:
                      "To get the best deals, we recommend booking 3-4 months in advance for international flights and 1-2 months for domestic flights. Use our price alerts feature to be notified when prices drop for your desired route. Being flexible with your travel dates can also help you find better deals.",
                  },
                  {
                    question: "Is my payment information secure?",
                    answer:
                      "Absolutely. We use industry-standard encryption and security protocols to protect your payment information. We are PCI DSS compliant and never store your full credit card details on our servers.",
                  },
                  {
                    question: "What if my flight is delayed or cancelled?",
                    answer:
                      "If your flight is delayed or cancelled, we'll notify you immediately via email and SMS. Our 24/7 customer support team is available to help you with rebooking options or refunds according to the airline's policies.",
                  },
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <AccordionItem
                      value={`item-${index}`}
                      className="glass-effect rounded-lg border border-accent/50"
                    >
                      <AccordionTrigger className="px-6 py-4 text-left font-medium hover:text-primary transition-colors">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4 text-gray-400">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>

            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <p className="text-gray-400 mb-4">Still have questions?</p>
              <Button
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 transition-colors"
              >
                <Link href="#" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-16 bg-gradient-blue">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold font-poppins text-white md:text-4xl">
                Ready to Start Your Journey?
              </h2>
              <p className="mt-4 text-blue-100 max-w-2xl mx-auto">
                Join thousands of travelers who trust SkyJourney for their
                flight bookings. Sign up today and get exclusive access to
                special deals and promotions.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 transition-colors"
                >
                  <Link href="/auth?tab=signup">Create an Account</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10 transition-colors"
                >
                  <Link href="#search">Search Flights</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <footer className="bg-accent/30 py-12 border-t border-accent/50">
        <div className="container-custom">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center gap-2 text-primary">
                <Plane className="h-6 w-6" />
                <span className="text-xl font-bold font-poppins">
                  SkyJourney
                </span>
              </Link>
              <p className="mt-4 text-sm text-gray-400">
                Making air travel accessible, affordable, and enjoyable for
                everyone.
              </p>
              <div className="mt-4 flex space-x-4">
                {["facebook", "twitter", "instagram", "linkedin"].map(
                  (social) => (
                    <Link
                      key={social}
                      href="#"
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      <span className="sr-only">{social}</span>
                      <div className="h-8 w-8 rounded-full bg-accent/50 flex items-center justify-center">
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d={
                              social === "facebook"
                                ? "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                : social === "twitter"
                                ? "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
                                : social === "instagram"
                                ? "M12 2a10 10 0 00-3.16 19.5c.5.08.66-.22.66-.48v-1.7c-2.67.6-3.23-1.13-3.23-1.13-.44-1.1-1.08-1.4-1.08-1.4-.88-.6.07-.6.07-.6.97.07 1.48 1 1.48 1 .86 1.47 2.26 1.04 2.8.8.09-.62.35-1.04.63-1.28-2.2-.25-4.51-1.1-4.51-4.9 0-1.08.39-1.97 1.03-2.67-.1-.25-.45-1.26.1-2.64 0 0 .84-.27 2.75 1.02a9.58 9.58 0 015 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.58 1.03 2.67 0 3.81-2.32 4.64-4.53 4.89.36.31.68.92.68 1.85V21c0 .27.16.58.67.5A10 10 0 0012 2z"
                                : "M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
                            }
                          />
                        </svg>
                      </div>
                    </Link>
                  )
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
                Company
              </h3>
              <ul className="mt-4 space-y-2">
                {["About Us", "Careers", "Press", "Blog", "Partners"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="text-sm text-gray-400 hover:text-primary transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
                Support
              </h3>
              <ul className="mt-4 space-y-2">
                {[
                  "Help Center",
                  "Contact Us",
                  "FAQs",
                  "Booking Guide",
                  "Cancellation Policy",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-gray-400 hover:text-primary transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
                Legal
              </h3>
              <ul className="mt-4 space-y-2">
                {[
                  "Terms of Service",
                  "Privacy Policy",
                  "Cookie Policy",
                  "Accessibility",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-gray-400 hover:text-primary transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-accent/50 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} SkyJourney. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <img
                src="/placeholder.svg?height=24&width=38"
                alt="Visa"
                className="h-6"
              />
              <img
                src="/placeholder.svg?height=24&width=38"
                alt="Mastercard"
                className="h-6"
              />
              <img
                src="/placeholder.svg?height=24&width=38"
                alt="American Express"
                className="h-6"
              />
              <img
                src="/placeholder.svg?height=24&width=38"
                alt="PayPal"
                className="h-6"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
