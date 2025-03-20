"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Plane, ArrowLeft, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSubmitted(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  return (
    <div className="flex min-h-screen flex-col bg-pattern font-sans text-white">
      <motion.div
        className="container-custom flex flex-1 flex-col justify-center py-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="mx-auto w-full max-w-md">
          <motion.div className="mb-8" variants={itemVariants}>
            <Link href="/" className="flex items-center gap-2 text-primary">
              <Plane className="h-6 w-6" />
              <span className="text-xl font-bold font-poppins">SkyJourney</span>
            </Link>

            <Link
              href="/auth"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>

            {!isSubmitted ? (
              <motion.div variants={itemVariants}>
                <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">Forgot your password?</h2>
                <p className="mt-2 text-sm text-gray-400">No worries, we'll send you reset instructions.</p>
              </motion.div>
            ) : (
              <motion.h2 className="mt-6 text-3xl font-bold tracking-tight text-white" variants={itemVariants}>
                Check your email
              </motion.h2>
            )}
          </motion.div>

          {!isSubmitted ? (
            <motion.div
              className="glass-effect rounded-lg p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 rounded-lg border-accent bg-accent/50 text-white focus:border-primary focus:ring-primary"
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    className="h-11 w-full rounded-lg bg-primary font-medium hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="mr-2 h-4 w-4 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      "Reset password"
                    )}
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              className="glass-effect rounded-lg p-6 shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <div className="flex flex-col items-center text-center">
                <motion.div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-900/50 shadow-glow"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.2 }}
                >
                  <CheckCircle className="h-7 w-7 text-green-400" />
                </motion.div>
                <motion.p
                  className="mb-4 text-sm text-gray-300"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  We have sent a password reset link to <strong>{email}</strong>
                </motion.p>
                <motion.p
                  className="text-xs text-gray-400"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Didn't receive the email? Check your spam folder or{" "}
                  <button
                    type="button"
                    className="font-medium text-primary hover:text-primary/80 transition-colors"
                    onClick={() => setIsSubmitted(false)}
                  >
                    try another email address
                  </button>
                </motion.p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

