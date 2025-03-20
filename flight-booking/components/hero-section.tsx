"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function HeroSection() {
  // Mouse position for interactive effects
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Track mouse position for parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 py-20 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        ></motion.div>
        <motion.div
          className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        ></motion.div>
      </div>

      {/* Particle effect */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-30">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
              scale: [0, Math.random() + 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="mb-4 text-4xl font-bold leading-tight font-poppins md:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <motion.span
                className="inline-block"
                whileHover={{
                  scale: 1.05,
                  color: "#ffffff",
                  textShadow: "0 0 15px rgba(255, 255, 255, 0.5)",
                }}
              >
                Book
              </motion.span>{" "}
              <motion.span
                className="inline-block"
                whileHover={{
                  scale: 1.05,
                  color: "#ffffff",
                  textShadow: "0 0 15px rgba(255, 255, 255, 0.5)",
                }}
              >
                Your
              </motion.span>{" "}
              <motion.span
                className="inline-block"
                whileHover={{
                  scale: 1.05,
                  color: "#ffffff",
                  textShadow: "0 0 15px rgba(255, 255, 255, 0.5)",
                }}
              >
                Next
              </motion.span>{" "}
              <motion.span
                className="inline-block bg-gradient-to-r from-blue-200 to-indigo-100 bg-clip-text text-transparent"
                whileHover={{
                  scale: 1.05,
                  textShadow: "0 0 15px rgba(255, 255, 255, 0.5)",
                }}
              >
                Adventure
              </motion.span>
            </motion.h1>
            <motion.p
              className="mb-8 text-lg md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Discover amazing destinations and book your flights with ease. Enjoy competitive prices and exceptional
              service.
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div
                whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)" }}
                whileTap={{ y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="relative overflow-hidden bg-white text-blue-600 transition-all duration-300 hover:bg-gray-100"
                >
                  <Link href="/flights">
                    <span className="relative z-10">Browse Flights</span>
                    <motion.span
                      className="absolute inset-0 -z-10 bg-gradient-to-r from-gray-100 to-white opacity-0 transition-opacity duration-300"
                      whileHover={{ opacity: 1 }}
                    />
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)" }}
                whileTap={{ y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="relative overflow-hidden border-white text-white transition-all duration-300 hover:bg-white/10"
                >
                  <Link href="#search">
                    <span className="relative z-10">Search Now</span>
                    <motion.span
                      className="absolute inset-0 -z-10 bg-white/20 opacity-0 transition-opacity duration-300"
                      whileHover={{ opacity: 1 }}
                    />
                  </Link>
                </Button>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} whileTap={{ y: 0 }} transition={{ duration: 0.2 }}>
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="text-white transition-all duration-300 hover:bg-white/10"
                >
                  <Link href="/auth">Sign In</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
          <motion.div
            className="hidden items-center justify-center md:flex"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="relative h-80 w-80">
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 3,
                  ease: "easeInOut",
                }}
                style={{
                  x: mousePosition.x ? (mousePosition.x - window.innerWidth / 2) / 50 : 0,
                  y: mousePosition.y ? (mousePosition.y - window.innerHeight / 2) / 50 : 0,
                }}
              >
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="200"
                  height="200"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white/80"
                  whileHover={{
                    scale: 1.1,
                    filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))",
                  }}
                >
                  <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                </motion.svg>
              </motion.div>
              <motion.div
                className="absolute inset-0 rounded-full border-b-4 border-t-4 border-white opacity-20"
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 15,
                  ease: "linear",
                }}
              ></motion.div>

              {/* Animated orbit elements */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: -360 }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 20,
                  ease: "linear",
                }}
              >
                <motion.div
                  className="absolute top-0 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-blue-300"
                  whileHover={{ scale: 1.5, backgroundColor: "#93c5fd" }}
                ></motion.div>
              </motion.div>

              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 25,
                  ease: "linear",
                }}
              >
                <motion.div
                  className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-indigo-300"
                  whileHover={{ scale: 1.5, backgroundColor: "#a5b4fc" }}
                ></motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path
            fill="#0f172a"
            fillOpacity="1"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,181.3C960,181,1056,203,1152,197.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  )
}

