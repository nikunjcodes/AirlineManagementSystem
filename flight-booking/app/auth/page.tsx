"use client";

import type React from "react";
import { authService } from "./auth";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import {
  Eye,
  EyeOff,
  Plane,
  ArrowRight,
  CheckCircle,
  XCircle,
  Lock,
  Mail,
  User,
  Shield,
} from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  // Login form state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginUsernameError, setLoginUsernameError] = useState("");
  const [loginPasswordError, setLoginPasswordError] = useState("");

  // Signup form state
  const [fullName, setFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [fullNameError, setFullNameError] = useState("");
  const [signupEmailError, setSignupEmailError] = useState("");
  const [signupPasswordError, setSignupPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Mouse position for interactive effects
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Check URL for tab parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tab = searchParams.get("tab");
    if (tab === "signup") {
      setActiveTab("signup");
    }
  }, []);

  // Validate email format
  const validateEmail = (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Check password strength
  const checkPasswordStrength = (password: string) => {
    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    return strength;
  };

  // Update password strength when password changes
  useEffect(() => {
    if (signupPassword) {
      setPasswordStrength(checkPasswordStrength(signupPassword));
    } else {
      setPasswordStrength(0);
    }
  }, [signupPassword]);

  const handleLoginUsernameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setLoginUsername(value);

    if (!value) {
      setLoginUsernameError("Username is required");
    } else if (value.length < 3) {
      setLoginUsernameError("Username must be at least 3 characters");
    } else {
      setLoginUsernameError("");
    }
  };

  const handleLoginPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setLoginPassword(value);

    if (!value) {
      setLoginPasswordError("Password is required");
    } else {
      setLoginPasswordError("");
    }
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFullName(value);

    if (!value) {
      setFullNameError("Full name is required");
    } else if (value.length < 3) {
      setFullNameError("Name must be at least 3 characters");
    } else {
      setFullNameError("");
    }
  };

  const handleSignupEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSignupEmail(value);

    if (!value) {
      setSignupEmailError("Email is required");
    } else if (!validateEmail(value)) {
      setSignupEmailError("Please enter a valid email");
    } else {
      setSignupEmailError("");
    }
  };

  const handleSignupPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setSignupPassword(value);

    if (!value) {
      setSignupPasswordError("Password is required");
    } else if (value.length < 8) {
      setSignupPasswordError("Password must be at least 8 characters");
    } else {
      setSignupPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (!value) {
      setConfirmPasswordError("Please confirm your password");
    } else if (value !== signupPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.login({
        username: loginUsername,
        password: loginPassword,
      });

      // Make sure the token is in the correct JWT format
      const token = response.token;
      if (token && token.split(".").length === 3) {
        // Verify token format
        localStorage.setItem("token", token);
        localStorage.setItem("username", loginUsername); // Store username for avatar display

        toast({
          title: "Success",
          description: "You have successfully logged in",
        });

        router.push("/");
      } else {
        throw new Error("Invalid token received from server");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    let isValid = true;

    if (!fullName) {
      setFullNameError("Full name is required");
      isValid = false;
    } else if (fullName.length < 3) {
      setFullNameError("Name must be at least 3 characters");
      isValid = false;
    }

    if (!signupEmail) {
      setSignupEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(signupEmail)) {
      setSignupEmailError("Please enter a valid email");
      isValid = false;
    }

    if (!signupPassword) {
      setSignupPasswordError("Password is required");
      isValid = false;
    } else if (signupPassword.length < 8) {
      setSignupPasswordError("Password must be at least 8 characters");
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      isValid = false;
    } else if (confirmPassword !== signupPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }

    if (!agreeTerms) {
      toast({
        title: "Error",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      isValid = false;
    }

    if (!isValid) return;

    setIsLoading(true);

    try {
      await authService.register({
        username: fullName,
        email: signupEmail,
        password: signupPassword,
      });

      toast({
        title: "Success",
        description: "Your account has been created successfully",
      });

      // Login after successful registration
      const loginResponse = await authService.login({
        username: fullName, // Use fullName as username
        password: signupPassword,
      });

      // Store both token and username
      localStorage.setItem("token", loginResponse.token);
      localStorage.setItem("username", fullName); // Store username for avatar display

      router.push("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  // Floating animation for decorative elements
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 6,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-pattern md:flex-row">
      {/* Animated background elements */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute top-0 left-0 h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 25%), radial-gradient(circle at 85% 30%, rgba(99, 102, 241, 0.08) 0%, transparent 25%)",
          }}
        ></div>

        {/* Animated orbs */}
        <motion.div
          className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
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
          className="absolute top-1/3 -left-20 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl"
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

        <motion.div
          className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl"
          animate={{
            x: [0, -20, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 9,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        ></motion.div>
      </div>

      {/* Particle effect */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-30">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-primary"
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

      {/* Left side - Form */}
      <motion.div
        className="relative z-10 flex w-full flex-col justify-center px-4 py-12 md:w-1/2 md:px-12 lg:px-20"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="mx-auto w-full max-w-md">
          <motion.div className="mb-8" variants={itemVariants}>
            <Link
              href="/"
              className="group flex items-center gap-2 text-primary transition-all duration-300 hover:text-primary/80"
            >
              <motion.div
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-all duration-300 group-hover:bg-primary/20"
                whileHover={{ rotate: 15, scale: 1.1 }}
              >
                <Plane className="h-6 w-6 transition-all duration-300 group-hover:text-primary" />
              </motion.div>
              <span className="text-xl font-bold font-poppins transition-all duration-300 group-hover:translate-x-1">
                SkyJourney
              </span>
            </Link>
            <motion.h1
              className="mt-6 text-3xl font-bold tracking-tight text-white md:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {activeTab === "login" ? "Welcome back" : "Create an account"}
            </motion.h1>
            <motion.p
              className="mt-2 text-sm text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {activeTab === "login"
                ? "Sign in to access your account and bookings"
                : "Join SkyJourney to start booking your flights"}
            </motion.p>
          </motion.div>

          <Tabs
            defaultValue="login"
            className="w-full"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <motion.div variants={itemVariants}>
              <TabsList className="mb-6 grid w-full grid-cols-2 rounded-lg bg-accent/50 p-1 backdrop-blur-sm">
                <TabsTrigger
                  value="login"
                  className="relative overflow-hidden rounded-md transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  <span className="relative z-10">Login</span>
                  {activeTab === "login" && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600"
                      layoutId="activeTab"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="relative overflow-hidden rounded-md transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  <span className="relative z-10">Sign up</span>
                  {activeTab === "signup" && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600"
                      layoutId="activeTab"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </TabsTrigger>
              </TabsList>
            </motion.div>

            <TabsContent value="login" className="mt-0">
              <motion.div
                className="relative overflow-hidden rounded-lg border border-accent/30 bg-accent/10 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-accent/50 hover:shadow-primary/5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom right, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8))",
                }}
                whileHover={{
                  boxShadow: "0 20px 40px rgba(59, 130, 246, 0.1)",
                }}
              >
                {/* Glassmorphism effect */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                  <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                  <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <motion.div
                    className="space-y-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    key="login-form"
                  >
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <div className="relative">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="username"
                            className="text-sm font-medium text-gray-300"
                          >
                            Username
                          </Label>
                          {loginUsernameError && (
                            <motion.span
                              className="text-xs text-red-400"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              {loginUsernameError}
                            </motion.span>
                          )}
                        </div>
                        <div className="relative mt-1 overflow-hidden rounded-lg transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/50">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-all duration-300 peer-focus:text-primary" />
                          <Input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            value={loginUsername}
                            onChange={handleLoginUsernameChange}
                            className={`peer h-11 rounded-lg border-accent bg-accent/50 pl-10 text-white backdrop-blur-sm transition-all duration-300 focus:border-primary focus:bg-accent/70 focus:ring-primary ${
                              loginUsernameError
                                ? "border-red-400"
                                : loginUsername
                                ? "border-green-400"
                                : ""
                            }`}
                            required
                          />
                          {loginUsername && !loginUsernameError && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 15,
                              }}
                            >
                              <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="password"
                          className="text-sm font-medium text-gray-300"
                        >
                          Password
                        </Label>
                        <div className="flex items-center space-x-1">
                          {loginPasswordError && (
                            <motion.span
                              className="text-xs text-red-400"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              {loginPasswordError}
                            </motion.span>
                          )}
                          <Link
                            href="/auth/forgot-password"
                            className="text-xs font-medium text-primary transition-all duration-300 hover:text-primary/80 hover:underline"
                          >
                            Forgot password?
                          </Link>
                        </div>
                      </div>
                      <div className="relative mt-1 overflow-hidden rounded-lg transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/50">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-all duration-300 peer-focus:text-primary" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={handleLoginPasswordChange}
                          className={`peer h-11 rounded-lg border-accent bg-accent/50 pl-10 pr-10 text-white backdrop-blur-sm transition-all duration-300 focus:border-primary focus:bg-accent/70 focus:ring-primary ${
                            loginPasswordError
                              ? "border-red-400"
                              : loginPassword
                              ? "border-green-400"
                              : ""
                          }`}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-300 hover:text-gray-300"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </motion.div>
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-2"
                    variants={itemVariants}
                  >
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setRememberMe(checked as boolean)
                      }
                      className="border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:text-white transition-all duration-300"
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remember me
                    </label>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Button
                      type="submit"
                      className="relative h-11 w-full overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
                      disabled={isLoading}
                    >
                      <span className="relative z-10">
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
                            Logging in...
                          </>
                        ) : (
                          "Login to your account"
                        )}
                      </span>
                      <motion.div
                        className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 transition-opacity duration-300"
                        whileHover={{ opacity: 1 }}
                      />
                    </Button>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="relative flex items-center justify-center"
                  >
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-700"></span>
                    </div>
                    <div className="relative bg-pattern px-4 text-sm text-gray-400">
                      Or continue with
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-2 gap-4"
                  >
                    <motion.div
                      whileHover={{
                        y: -3,
                        boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)",
                      }}
                      whileTap={{ y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 w-full rounded-lg border-accent bg-accent/50 font-medium text-white backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-accent/70"
                      >
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                          <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                        Google
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{
                        y: -3,
                        boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)",
                      }}
                      whileTap={{ y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 w-full rounded-lg border-accent bg-accent/50 font-medium text-white backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-accent/70"
                      >
                        <svg
                          className="mr-2 h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                        </svg>
                        Facebook
                      </Button>
                    </motion.div>
                  </motion.div>
                </form>
              </motion.div>

              {/* Security notice */}
              <motion.div
                className="mt-6 flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 p-3 text-xs text-gray-400 backdrop-blur-sm transition-all duration-300 hover:border-accent/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ backgroundColor: "rgba(30, 41, 59, 0.2)" }}
              >
                <Shield className="h-4 w-4 text-primary" />
                <p>
                  Your connection to this site is secure and your data is
                  encrypted.
                </p>
              </motion.div>
            </TabsContent>

            <TabsContent value="signup" className="mt-0">
              <motion.div
                className="relative overflow-hidden rounded-lg border border-accent/30 bg-accent/10 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-accent/50 hover:shadow-primary/5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom right, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8))",
                }}
                whileHover={{
                  boxShadow: "0 20px 40px rgba(59, 130, 246, 0.1)",
                }}
              >
                {/* Glassmorphism effect */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                  <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                  <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
                </div>

                <form onSubmit={handleSignup} className="space-y-6">
                  <motion.div
                    className="space-y-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    key="signup-form"
                  >
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="fullName"
                          className="text-sm font-medium text-gray-300"
                        >
                          Full Name
                        </Label>
                        {fullNameError && (
                          <motion.span
                            className="text-xs text-red-400"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {fullNameError}
                          </motion.span>
                        )}
                      </div>
                      <div className="relative mt-1 overflow-hidden rounded-lg transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/50">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-all duration-300 peer-focus:text-primary" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="John Doe"
                          value={fullName}
                          onChange={handleFullNameChange}
                          className={`peer h-11 rounded-lg border-accent bg-accent/50 pl-10 text-white backdrop-blur-sm transition-all duration-300 focus:border-primary focus:bg-accent/70 focus:ring-primary ${
                            fullNameError
                              ? "border-red-400"
                              : fullName
                              ? "border-green-400"
                              : ""
                          }`}
                          required
                        />
                        {fullName && !fullNameError && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 15,
                            }}
                          >
                            <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="signupEmail"
                          className="text-sm font-medium text-gray-300"
                        >
                          Email
                        </Label>
                        {signupEmailError && (
                          <motion.span
                            className="text-xs text-red-400"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {signupEmailError}
                          </motion.span>
                        )}
                      </div>
                      <div className="relative mt-1 overflow-hidden rounded-lg transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/50">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-all duration-300 peer-focus:text-primary" />
                        <Input
                          id="signupEmail"
                          type="email"
                          placeholder="name@example.com"
                          value={signupEmail}
                          onChange={handleSignupEmailChange}
                          className={`peer h-11 rounded-lg border-accent bg-accent/50 pl-10 text-white backdrop-blur-sm transition-all duration-300 focus:border-primary focus:bg-accent/70 focus:ring-primary ${
                            signupEmailError
                              ? "border-red-400"
                              : signupEmail
                              ? "border-green-400"
                              : ""
                          }`}
                          required
                        />
                        {signupEmail && !signupEmailError && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 15,
                            }}
                          >
                            <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="signupPassword"
                          className="text-sm font-medium text-gray-300"
                        >
                          Password
                        </Label>
                        {signupPasswordError && (
                          <motion.span
                            className="text-xs text-red-400"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {signupPasswordError}
                          </motion.span>
                        )}
                      </div>
                      <div className="relative mt-1 overflow-hidden rounded-lg transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/50">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-all duration-300 peer-focus:text-primary" />
                        <Input
                          id="signupPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={signupPassword}
                          onChange={handleSignupPasswordChange}
                          className={`peer h-11 rounded-lg border-accent bg-accent/50 pl-10 pr-10 text-white backdrop-blur-sm transition-all duration-300 focus:border-primary focus:bg-accent/70 focus:ring-primary ${
                            signupPasswordError
                              ? "border-red-400"
                              : signupPassword
                              ? "border-green-400"
                              : ""
                          }`}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-300 hover:text-gray-300"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </motion.div>
                        </button>
                      </div>

                      {/* Password strength indicator */}
                      {signupPassword && (
                        <motion.div
                          className="mt-2"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              Password strength:
                            </span>
                            <span
                              className={`text-xs font-medium ${
                                passwordStrength === 0
                                  ? "text-red-400"
                                  : passwordStrength === 1
                                  ? "text-orange-400"
                                  : passwordStrength === 2
                                  ? "text-yellow-400"
                                  : passwordStrength === 3
                                  ? "text-green-400"
                                  : "text-green-300"
                              }`}
                            >
                              {passwordStrength === 0 && "Very weak"}
                              {passwordStrength === 1 && "Weak"}
                              {passwordStrength === 2 && "Medium"}
                              {passwordStrength === 3 && "Strong"}
                              {passwordStrength === 4 && "Very strong"}
                            </span>
                          </div>
                          <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-gray-700">
                            <motion.div
                              className={`h-full ${
                                passwordStrength === 0
                                  ? "bg-red-500"
                                  : passwordStrength === 1
                                  ? "bg-orange-500"
                                  : passwordStrength === 2
                                  ? "bg-yellow-500"
                                  : passwordStrength === 3
                                  ? "bg-green-500"
                                  : "bg-green-400"
                              }`}
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(passwordStrength / 4) * 100}%`,
                              }}
                              transition={{ duration: 0.3 }}
                            ></motion.div>
                          </div>
                          <ul className="mt-2 space-y-1 text-xs text-gray-400">
                            <motion.li
                              className={`flex items-center gap-1 ${
                                signupPassword.length >= 8
                                  ? "text-green-400"
                                  : ""
                              }`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 }}
                            >
                              {signupPassword.length >= 8 ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <XCircle className="h-3 w-3 text-gray-500" />
                              )}
                              At least 8 characters
                            </motion.li>
                            <motion.li
                              className={`flex items-center gap-1 ${
                                /[A-Z]/.test(signupPassword)
                                  ? "text-green-400"
                                  : ""
                              }`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              {/[A-Z]/.test(signupPassword) ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <XCircle className="h-3 w-3 text-gray-500" />
                              )}
                              At least one uppercase letter
                            </motion.li>
                            <motion.li
                              className={`flex items-center gap-1 ${
                                /[0-9]/.test(signupPassword)
                                  ? "text-green-400"
                                  : ""
                              }`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              {/[0-9]/.test(signupPassword) ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <XCircle className="h-3 w-3 text-gray-500" />
                              )}
                              At least one number
                            </motion.li>
                            <motion.li
                              className={`flex items-center gap-1 ${
                                /[^A-Za-z0-9]/.test(signupPassword)
                                  ? "text-green-400"
                                  : ""
                              }`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 }}
                            >
                              {/[^A-Za-z0-9]/.test(signupPassword) ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <XCircle className="h-3 w-3 text-gray-500" />
                              )}
                              At least one special character
                            </motion.li>
                          </ul>
                        </motion.div>
                      )}
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="confirmPassword"
                          className="text-sm font-medium text-gray-300"
                        >
                          Confirm Password
                        </Label>
                        {confirmPasswordError && (
                          <motion.span
                            className="text-xs text-red-400"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {confirmPasswordError}
                          </motion.span>
                        )}
                      </div>
                      <div className="relative mt-1 overflow-hidden rounded-lg transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/50">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-all duration-300 peer-focus:text-primary" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={handleConfirmPasswordChange}
                          className={`peer h-11 rounded-lg border-accent bg-accent/50 pl-10 text-white backdrop-blur-sm transition-all duration-300 focus:border-primary focus:bg-accent/70 focus:ring-primary ${
                            confirmPasswordError
                              ? "border-red-400"
                              : confirmPassword &&
                                confirmPassword === signupPassword
                              ? "border-green-400"
                              : ""
                          }`}
                          required
                        />
                        {confirmPassword &&
                          confirmPassword === signupPassword && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 15,
                              }}
                            >
                              <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400" />
                            </motion.div>
                          )}
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="flex items-start space-x-2"
                    variants={itemVariants}
                  >
                    <Checkbox
                      id="terms"
                      checked={agreeTerms}
                      onCheckedChange={(checked) =>
                        setAgreeTerms(checked as boolean)
                      }
                      className="mt-1 border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:text-white transition-all duration-300"
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-gray-300 leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="font-medium text-primary transition-all duration-300 hover:text-primary/80 hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="font-medium text-primary transition-all duration-300 hover:text-primary/80 hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Button
                      type="submit"
                      className="relative h-11 w-full overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
                      disabled={isLoading}
                    >
                      <span className="relative z-10">
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
                            Creating account...
                          </>
                        ) : (
                          "Create your account"
                        )}
                      </span>
                      <motion.div
                        className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 transition-opacity duration-300"
                        whileHover={{ opacity: 1 }}
                      />
                    </Button>
                  </motion.div>
                </form>
              </motion.div>

              {/* Security notice */}
              <motion.div
                className="mt-6 flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 p-3 text-xs text-gray-400 backdrop-blur-sm transition-all duration-300 hover:border-accent/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ backgroundColor: "rgba(30, 41, 59, 0.2)" }}
              >
                <Shield className="h-4 w-4 text-primary" />
                <p>
                  Your data is protected with industry-standard encryption. We
                  never share your information with third parties.
                </p>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>

      {/* Right side - Image/Illustration */}
      <motion.div
        className="hidden w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 md:block"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
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

        <div className="relative flex h-full flex-col items-center justify-center px-8 text-white">
          <div className="max-w-md">
            <motion.div
              className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm shadow-glow"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.5,
              }}
              whileHover={{
                scale: 1.1,
                boxShadow: "0 0 30px 5px rgba(59, 130, 246, 0.5)",
              }}
            >
              <Plane className="h-8 w-8 text-white" />
            </motion.div>
            <motion.h2
              className="text-3xl font-bold leading-tight md:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Start your journey with SkyJourney today
            </motion.h2>
            <motion.p
              className="mt-4 text-lg text-blue-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              Join thousands of travelers who trust us for their flight
              bookings. Enjoy seamless booking, competitive prices, and
              exceptional service.
            </motion.p>

            <motion.div
              className="mt-8 space-y-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.8,
                  },
                },
              }}
            >
              <motion.div
                className="flex items-center gap-3"
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20"
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "rgba(59, 130, 246, 0.3)",
                  }}
                >
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
                <p className="text-blue-100">Easy and secure booking process</p>
              </motion.div>
              <motion.div
                className="flex items-center gap-3"
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20"
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "rgba(59, 130, 246, 0.3)",
                  }}
                >
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
                <p className="text-blue-100">Best prices guaranteed</p>
              </motion.div>
              <motion.div
                className="flex items-center gap-3"
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20"
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "rgba(59, 130, 246, 0.3)",
                  }}
                >
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
                <p className="text-blue-100">24/7 customer support</p>
              </motion.div>
            </motion.div>

            {/* Testimonials */}
            <motion.div
              className="mt-12 space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <h3 className="text-lg font-semibold">What our customers say</h3>

              <motion.div
                className="rounded-lg bg-white/10 p-4 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.3 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-blue-500/20">
                    <svg
                      className="h-full w-full text-white/80"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Sarah Johnson
                    </p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <motion.svg
                          key={i}
                          className="h-4 w-4 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.4 + i * 0.1 }}
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </motion.svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-blue-100">
                  "SkyJourney made booking my international flight so easy. The
                  interface is intuitive and I found a great deal. Highly
                  recommend!"
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            >
              <Link
                href="/flights"
                className="group inline-flex items-center gap-2 text-sm font-medium text-white transition-all duration-300 hover:text-blue-200"
              >
                <span>Explore available flights</span>
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
