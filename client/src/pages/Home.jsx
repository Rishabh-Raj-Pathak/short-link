import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { linksApi } from "../utils/api";

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { error: showErrorToast, success } = useToast();
  const [urlInput, setUrlInput] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  // Scroll animation effect
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(".scroll-animate");
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleShortenUrl = async (e) => {
    e.preventDefault();

    if (!urlInput.trim()) {
      setError("Please enter a URL");
      return;
    }

    // Basic URL validation
    if (!urlInput.match(/^https?:\/\/.+/)) {
      setError("Please enter a valid URL starting with http:// or https://");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await linksApi.shorten(urlInput);
      setShortenedUrl(result.shortUrl);
      setQrCodeUrl(
        `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
          result.shortUrl
        )}`
      );
      // Clear input after successful shortening
      setUrlInput("");
    } catch (err) {
      // Global 401 handler will take care of session expiry
      setError(err.message || "Failed to shorten URL");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      // Failed to copy
    }
  };

  const downloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a");
      link.href = qrCodeUrl;
      link.download = "qr-code.png";
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-white font-sf-pro relative overflow-hidden">
      {/* Animated Background Layers */}
      <div className="fixed inset-0 -z-10">
        {/* Primary Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"></div>

        {/* Animated Gradient Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-400/20 to-pink-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>

        {/* Floating Geometric Shapes */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 border-2 border-purple-300/30 rotate-45 animate-float-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full animate-float-reverse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-8 h-8 bg-gradient-to-br from-pink-400/30 to-yellow-400/30 transform rotate-12 animate-pulse-slow"></div>
        <div className="absolute top-1/2 right-1/3 w-6 h-20 bg-gradient-to-b from-purple-300/20 to-transparent transform rotate-45 animate-float"></div>

        {/* Dynamic Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
            `,
              backgroundSize: "50px 50px",
              animation: "grid-move 20s linear infinite",
            }}
          ></div>
        </div>

        {/* Sparkle Effects */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-yellow-400 rounded-full animate-twinkle"></div>
        <div className="absolute top-32 right-32 w-1 h-1 bg-pink-400 rounded-full animate-twinkle animation-delay-1000"></div>
        <div className="absolute bottom-40 left-40 w-1.5 h-1.5 bg-blue-400 rounded-full animate-twinkle animation-delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-1 h-1 bg-purple-400 rounded-full animate-twinkle animation-delay-3000"></div>
      </div>

      {/* HERO SECTION */}
      {/* Hero Section - Restyled like CTA */}
      <section className="relative pt-16 pb-20 overflow-hidden bg-gradient-to-br from-[#8039DF] via-purple-700 to-blue-600">
        {/* Spectacular Background Effects (mirroring CTA) */}
        <div className="absolute inset-0">
          {/* Animated Gradient Mesh */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-yellow-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          {/* Moving Particles */}
          <div className="absolute inset-0">
            {[...Array(25)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 8}s`,
                  animation: "twinkle 4s infinite ease-in-out",
                }}
              ></div>
            ))}
          </div>

          {/* Dynamic Grid */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
                backgroundSize: "40px 40px",
                animation: "grid-move 15s linear infinite",
              }}
            ></div>
          </div>

          {/* Floating Geometric Shapes */}
          <div className="absolute top-20 left-20 w-16 h-16 border-2 border-white/20 rotate-45 animate-float-slow"></div>
          <div className="absolute bottom-20 right-20 w-12 h-12 bg-white/10 rounded-full animate-float-reverse"></div>
          <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-white/15 transform rotate-12 animate-pulse-slow"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            {/* Badge (inverted for dark bg) */}
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full text-sm font-semibold mb-8 animate-fade-in shadow-2xl hover:shadow-3xl transition-all group/badge">
              <span className="mr-2 text-lg group-hover/badge:animate-bounce">
                🔗
              </span>
              <span className="text-white/90">
                Let's make with simply one click 👆
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 animate-fade-in-up relative">
              <span className="relative inline-block">
                ALL IN ONE TOOLS
                {/* Text Glow Effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#C6A4FF] via-white to-[#A2C3FF] bg-clip-text text-transparent relative">
                FOR YOUR LINKS
                {/* Animated Underline (kept) */}
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8039DF] to-blue-300 transform scale-x-0 origin-left transition-transform duration-700 delay-500 animate-fade-in"></span>
              </span>
            </h1>

            {/* Subtitle */}
            <div className="relative">
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-12 animate-fade-in-up relative z-10">
                On a single platform, you'll find all the tools you need to
                connect audiences{" "}
                <span className="text-white font-semibold underline decoration-white/40 underline-offset-4">
                  worldwide
                </span>
                , manage links and QR codes, and create brand relationships.
              </p>

              {/* Floating Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-white/10 rounded-full animate-float opacity-60"></div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-white/10 rounded-full animate-float-reverse opacity-60"></div>
              <div className="absolute top-1/2 -left-8 w-4 h-4 bg-white/10 rounded-full animate-pulse-slow opacity-60"></div>
              <div className="absolute top-0 right-8 w-3 h-3 bg-white/10 rounded-full animate-twinkle opacity-60"></div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
            {/* Left Side - URL Form (content/logic unchanged) */}
            <div className="animate-fade-in-left group">
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 transition-all duration-500 hover:shadow-3xl hover:scale-[1.02]">
                {/* Glowing Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                <div className="relative z-10">
                  <form onSubmit={handleShortenUrl} className="space-y-6">
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="Paste your link here..."
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="w-full px-6 py-4 border-2 border-white/30 rounded-2xl text-gray-900 placeholder-gray-600 focus:ring-4 focus:ring-white/50 focus:border-white/60 transition-all text-lg bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm"
                        disabled={isLoading}
                      />
                      {/* Input Glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    <button
                      type="submit"
                      disabled={
                        isLoading || !urlInput.trim() || !isAuthenticated
                      }
                      className="relative w-full bg-gradient-to-r from-[#8039DF] via-purple-600 to-blue-600 hover:from-[#6B2FC7] hover:via-purple-700 hover:to-blue-700 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group/btn overflow-hidden shadow-lg border-2 border-white/30"
                    >
                      {/* Button Background Enhancement */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#8039DF] via-purple-600 to-blue-600 rounded-2xl z-0 pointer-events-none"></div>
                      {/* Button Shine */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/60 via-white/70 to-blue-400/60 opacity-80 transform -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[200%] transition-transform duration-700 pointer-events-none blur-[1px] z-10"></div>
                      <span className="relative z-20">
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                            Shortening...
                          </span>
                        ) : !isAuthenticated ? (
                          "Please Log In to Shorten URLs"
                        ) : (
                          "Shorten URL →"
                        )}
                      </span>
                    </button>
                  </form>

                  {error && (
                    <div className="mt-4 p-4 bg-red-100/95 border border-red-300/80 text-red-800 rounded-xl text-sm font-medium shadow-lg backdrop-blur-sm">
                      {error}
                    </div>
                  )}

                  {/* Result Display */}
                  {shortenedUrl && (
                    <div className="mt-8 p-6 bg-white/15 border border-white/30 rounded-xl animate-fade-in shadow-lg backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <p className="text-sm text-white/90 mb-1 font-medium">
                            Your shortened link:
                          </p>
                          <p className="text-white font-bold text-lg break-all">
                            {shortenedUrl}
                          </p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(shortenedUrl)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all shadow-md ${
                            copySuccess
                              ? "bg-green-200/95 text-green-800 border border-green-300"
                              : "bg-white/25 hover:bg-white/35 text-white border border-white/30"
                          }`}
                        >
                          {copySuccess ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>
                  )}

                  <p className="text-white/90 text-sm mt-6 text-center font-medium">
                    Shorten your link and generate a QR code instantly.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - QR Code Display (content/logic unchanged) */}
            <div className="animate-fade-in-right group">
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center transition-all duration-500 hover:shadow-3xl hover:scale-[1.02]">
                {/* Magical Glow Border */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                <div className="relative z-10">
                  {shortenedUrl && qrCodeUrl ? (
                    <div className="animate-fade-in">
                      {/* QR Code */}
                      <div className="relative w-48 h-48 mx-auto mb-6 group/qr">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-2xl animate-pulse"></div>
                        <div className="relative bg-white rounded-2xl shadow-2xl p-4 border-2 border-white/50 backdrop-blur-sm group-hover/qr:shadow-3xl transition-all duration-300">
                          <img
                            src={qrCodeUrl}
                            alt="QR Code"
                            className="w-full h-full object-contain transition-transform duration-300 group-hover/qr:scale-105"
                          />
                          {/* QR Sparkles */}
                          <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping animation-delay-1000"></div>
                        </div>
                      </div>

                      {/* URL Display */}
                      <div className="mb-4 p-4 bg-white/15 rounded-xl border border-white/30 shadow-lg backdrop-blur-sm">
                        <p className="text-sm text-white/90 mb-1 font-medium">
                          Your shortened link:
                        </p>
                        <p className="font-bold text-lg break-all text-white">
                          {shortenedUrl}
                        </p>
                      </div>

                      <p className="text-sm text-white/90 mb-6 flex items-center justify-center font-medium">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></span>
                        Created just now
                      </p>

                      <button
                        onClick={downloadQR}
                        className="relative bg-gradient-to-r from-[#8039DF] via-purple-600 to-blue-600 hover:from-[#6B2FC7] hover:via-purple-700 hover:to-blue-700 text-white py-3 px-8 rounded-2xl font-bold transition-all duration-300 transform hover:scale-[1.05] hover:shadow-2xl group/download overflow-hidden"
                      >
                        {/* Download Button Shine */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover/download:translate-x-[200%] transition-transform duration-700"></div>
                        <span className="relative z-10 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Download PNG
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      {/* Placeholder */}
                      <div className="relative w-32 h-32 mx-auto mb-6 group/placeholder">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/10 rounded-2xl animate-pulse"></div>
                        <div className="relative bg-white/10 rounded-2xl shadow-lg flex items-center justify-center h-full border-2 border-dashed border-white/30 backdrop-blur-sm">
                          <svg
                            className="w-16 h-16 text-white/70 group-hover/placeholder:scale-110 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M12 4v1m6 11a6 6 0 11-12 0v-1m6 0V9a6.002 6.002 0 016 6.001z"
                            />
                          </svg>
                        </div>
                      </div>
                      <p className="font-medium text-white/90 text-lg">
                        Your shortened link and QR code will appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-20 text-center animate-fade-in-up">
            <div className="flex items-center justify-center space-x-8">
              {/* User Avatars */}
              <div className="flex -space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white/40">
                  A
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white/40">
                  B
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white/40">
                  C
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-300">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xl">
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="text-2xl font-bold text-white">4.0</span>
              </div>

              <p className="text-white/80">from 500+ reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 bg-gray-50 scroll-animate overflow-hidden">
        {/* Enhanced Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30"></div>
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-purple-200/40 to-pink-200/40 rounded-full blur-xl animate-float-slow"></div>
          <div className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-br from-blue-200/40 to-cyan-200/40 rounded-full blur-xl animate-float-reverse"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-gradient-to-br from-yellow-200/40 to-orange-200/40 rounded-full blur-lg animate-pulse-slow"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 relative z-10">
              How It{" "}
              <span className="bg-gradient-to-r from-[#8039DF] to-blue-600 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto relative z-10">
              Transform your long URLs into powerful, trackable links in just a
              few simple steps
            </p>
          </div>

          {/* Timeline Steps */}
          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-20 left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#8039DF] via-purple-500 to-blue-600 rounded-full opacity-30"></div>

            <div className="space-y-20 lg:space-y-32">
              {/* Step 1 */}
              <div className="relative">
                <div className="lg:grid lg:grid-cols-2 lg:gap-24 items-center">
                  <div className="lg:text-right scroll-animate animate-fade-in-left">
                    <div className="inline-flex lg:hidden items-center justify-center w-16 h-16 bg-gradient-to-br from-[#8039DF] to-blue-600 text-white rounded-full font-bold text-xl mb-8 shadow-lg group/mobile-num">
                      <div className="relative">
                        <span className="transition-transform group-hover/mobile-num:scale-110 duration-300">
                          1
                        </span>
                        <div
                          className="absolute inset-0 border-2 border-purple-300/50 rounded-full animate-spin opacity-50"
                          style={{ animationDuration: "4s" }}
                        ></div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-[#101010] mb-4">
                      Shorten the URL
                    </h3>
                    <p className="text-gray-600 mb-6 lg:mb-0">
                      Enter your long URL and click our shorten button to create
                      a compact, shareable link instantly.
                    </p>
                  </div>

                  {/* Step Indicator - Desktop Only */}
                  <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center w-20 h-20 bg-gradient-to-br from-[#8039DF] to-blue-600 text-white rounded-full font-bold text-2xl z-10 shadow-2xl group/step-num">
                    <div className="relative">
                      <span className="transition-transform group-hover/step-num:scale-125 duration-300">
                        1
                      </span>
                      {/* Pulse Ring */}
                      <div className="absolute inset-0 border-4 border-white/50 rounded-full animate-ping opacity-0 group-hover/step-num:opacity-75"></div>
                      {/* Rotating Ring */}
                      <div
                        className="absolute inset-0 border-2 border-purple-300/50 rounded-full animate-spin"
                        style={{ animationDuration: "4s" }}
                      ></div>
                    </div>
                  </div>

                  <div className="scroll-animate animate-fade-in-right group/step">
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50 transition-all duration-500 hover:shadow-3xl hover:scale-[1.03] group-hover/step:bg-white/95">
                      {/* Step Card Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover/step:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative z-10">
                        <div className="space-y-4">
                          <input
                            type="text"
                            placeholder="https://example.com/very-long-url-that-needs-shortening..."
                            className="w-full px-4 py-3 border-2 border-gray-200/50 rounded-xl text-gray-600 text-sm bg-white/70 transition-all hover:border-purple-300/50"
                            readOnly
                          />
                          <button className="w-full bg-gradient-to-r from-[#8039DF] to-blue-600 text-white py-3 px-6 rounded-xl font-bold transition-all hover:scale-[1.02] hover:shadow-lg">
                            Shorten URL
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="lg:grid lg:grid-cols-2 lg:gap-24 items-center">
                  <div className="lg:order-2 scroll-animate animate-fade-in-right">
                    <div className="inline-flex lg:hidden items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full font-bold text-xl mb-8 shadow-lg group/mobile-num">
                      <div className="relative">
                        <span className="transition-transform group-hover/mobile-num:scale-110 duration-300">
                          2
                        </span>
                        <div
                          className="absolute inset-0 border-2 border-blue-300/50 rounded-full animate-spin opacity-50"
                          style={{
                            animationDuration: "3s",
                            animationDirection: "reverse",
                          }}
                        ></div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-[#101010] mb-4">
                      Generate QR Code
                    </h3>
                    <p className="text-gray-600 mb-6 lg:mb-0">
                      Automatically receive a customized QR code alongside your
                      shortened link for easy mobile sharing.
                    </p>
                  </div>

                  {/* Step Indicator - Desktop Only */}
                  <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full font-bold text-2xl z-10 shadow-2xl group/step-num">
                    <div className="relative">
                      <span className="transition-transform group-hover/step-num:scale-125 duration-300">
                        2
                      </span>
                      {/* Pulse Ring */}
                      <div className="absolute inset-0 border-4 border-white/50 rounded-full animate-ping opacity-0 group-hover/step-num:opacity-75"></div>
                      {/* Rotating Ring */}
                      <div
                        className="absolute inset-0 border-2 border-blue-300/50 rounded-full animate-spin"
                        style={{
                          animationDuration: "3s",
                          animationDirection: "reverse",
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="lg:order-1 scroll-animate animate-fade-in-left group/step">
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50 transition-all duration-500 hover:shadow-3xl hover:scale-[1.03] group-hover/step:bg-white/95">
                      {/* Step Card Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover/step:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex-1">
                            <p className="text-sm text-gray-600 mb-1 font-medium">
                              QR Code Generated!
                            </p>
                            <p className="text-[#8039DF] font-bold text-lg">
                              sh.rt/abc123
                            </p>
                          </div>
                          <div className="relative w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center shadow-lg group-hover/step:shadow-xl transition-all">
                            <div className="w-16 h-16 bg-black opacity-90 rounded-lg grid grid-cols-3 gap-0.5 p-1">
                              {[...Array(9)].map((_, i) => (
                                <div
                                  key={i}
                                  className="bg-white rounded-sm"
                                ></div>
                              ))}
                            </div>
                            {/* QR Code Sparkle */}
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                          </div>
                        </div>
                        <button className="w-full bg-gradient-to-r from-[#8039DF] to-blue-600 text-white py-3 px-6 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] hover:shadow-lg">
                          Download PNG
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="lg:grid lg:grid-cols-2 lg:gap-24 items-center">
                  <div className="lg:text-right scroll-animate animate-fade-in-left">
                    <div className="inline-flex lg:hidden items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-full font-bold text-xl mb-8 shadow-lg group/mobile-num">
                      <div className="relative">
                        <span className="transition-transform group-hover/mobile-num:scale-110 duration-300">
                          3
                        </span>
                        <div
                          className="absolute inset-0 border-2 border-pink-300/50 rounded-full animate-spin opacity-50"
                          style={{ animationDuration: "5s" }}
                        ></div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-[#101010] mb-4">
                      View Dashboard
                    </h3>
                    <p className="text-gray-600 mb-6 lg:mb-0">
                      Access your personalized dashboard to manage all your
                      shortened links and QR codes in one place.
                    </p>
                  </div>

                  {/* Step Indicator - Desktop Only */}
                  <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-full font-bold text-2xl z-10 shadow-2xl group/step-num">
                    <div className="relative">
                      <span className="transition-transform group-hover/step-num:scale-125 duration-300">
                        3
                      </span>
                      {/* Pulse Ring */}
                      <div className="absolute inset-0 border-4 border-white/50 rounded-full animate-ping opacity-0 group-hover/step-num:opacity-75"></div>
                      {/* Rotating Ring */}
                      <div
                        className="absolute inset-0 border-2 border-pink-300/50 rounded-full animate-spin"
                        style={{ animationDuration: "5s" }}
                      ></div>
                    </div>
                  </div>

                  <div className="scroll-animate animate-fade-in-right group/step">
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50 transition-all duration-500 hover:shadow-3xl hover:scale-[1.03] group-hover/step:bg-white/95">
                      {/* Step Card Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover/step:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                          <span className="text-lg font-bold text-gray-900">
                            Your Links
                          </span>
                          <span className="text-xs text-green-600 bg-green-100 px-3 py-2 rounded-full font-semibold border border-green-200">
                            3 Active
                          </span>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100/50">
                            <span className="text-[#8039DF] font-bold">
                              sh.rt/abc123
                            </span>
                            <span className="text-gray-600 font-medium">
                              1.2k clicks
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100/50">
                            <span className="text-[#8039DF] font-bold">
                              sh.rt/def456
                            </span>
                            <span className="text-gray-600 font-medium">
                              856 clicks
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100/50">
                            <span className="text-[#8039DF] font-bold">
                              sh.rt/ghi789
                            </span>
                            <span className="text-gray-600 font-medium">
                              432 clicks
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="py-24 bg-white scroll-animate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="animate-fade-in-left">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#8039DF] to-blue-600 rounded-full mb-8">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>

              <h2 className="text-4xl font-bold text-[#101010] mb-6">
                Track{" "}
                <span className="bg-gradient-to-r from-[#8039DF] to-blue-600 bg-clip-text text-transparent">
                  Performance
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Monitor click analytics, geographic data, and engagement metrics
                to optimize your link performance.
              </p>
            </div>

            {/* Right Content - Analytics Card */}
            <div className="animate-fade-in-right">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    Analytics Overview
                  </h3>
                  <span className="text-sm text-gray-500">Last 7 days</span>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-[#8039DF] mb-2">
                      2.4k
                    </div>
                    <div className="text-sm text-gray-600">Total Clicks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-[#8039DF] mb-2">
                      89%
                    </div>
                    <div className="text-sm text-gray-600">Mobile Users</div>
                  </div>
                </div>

                {/* Chart */}
                <div className="flex items-end justify-between h-32 mb-6">
                  {[40, 60, 35, 80, 95, 70, 85].map((height, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-t from-[#8039DF] to-blue-500 rounded-t-lg transition-all duration-500 hover:from-[#6B2FC7] hover:to-blue-600"
                      style={{
                        height: `${height}%`,
                        width: "12%",
                        animationDelay: `${i * 0.1}s`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-[#8039DF] via-purple-700 to-blue-600 overflow-hidden scroll-animate">
        {/* Spectacular Background Effects */}
        <div className="absolute inset-0">
          {/* Animated Gradient Mesh */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-yellow-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          {/* Moving Particles */}
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 8}s`,
                  animation: "twinkle 4s infinite ease-in-out",
                }}
              ></div>
            ))}
          </div>

          {/* Dynamic Grid */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
                animation: "grid-move 15s linear infinite",
              }}
            ></div>
          </div>

          {/* Floating Geometric Shapes */}
          <div className="absolute top-20 left-20 w-16 h-16 border-2 border-white/20 rotate-45 animate-float-slow"></div>
          <div className="absolute bottom-20 right-20 w-12 h-12 bg-white/10 rounded-full animate-float-reverse"></div>
          <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-white/15 transform rotate-12 animate-pulse-slow"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Get Started Now →
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Join thousands of users who trust our platform for their link
            management needs.
          </p>

          <div className="group/cta">
            <Link
              to="/signup"
              className="relative inline-flex items-center bg-white text-[#8039DF] px-12 py-6 rounded-2xl font-bold text-xl transition-all transform hover:scale-110 shadow-2xl hover:shadow-3xl group-hover/cta:shadow-glow overflow-hidden"
            >
              {/* Button Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-50 to-white"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-100/50 to-transparent opacity-0 group-hover/cta:opacity-100 transition-opacity duration-500"></div>

              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover/cta:translate-x-[200%] transition-transform duration-1000"></div>

              <span className="relative z-10 mr-3">Create Free Account</span>
              <svg
                className="relative z-10 w-6 h-6 transition-transform group-hover/cta:translate-x-2 duration-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>

            {/* Button Glow Ring */}
            <div className="absolute inset-0 border-2 border-white/30 rounded-2xl opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300 animate-pulse"></div>
          </div>

          {/* Feature Badges */}
          <div className="flex items-center justify-center space-x-8 mt-8 text-white/80 text-sm">
            <div className="flex items-center space-x-2 group/badge">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover/badge:bg-white/30 transition-colors">
                <span className="text-xs">✅</span>
              </div>
              <span className="group-hover/badge:text-white transition-colors">
                Free Forever
              </span>
            </div>
            <div className="flex items-center space-x-2 group/badge">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover/badge:bg-white/30 transition-colors">
                <span className="text-xs">⚡</span>
              </div>
              <span className="group-hover/badge:text-white transition-colors">
                Instant Setup
              </span>
            </div>
            <div className="flex items-center space-x-2 group/badge">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover/badge:bg-white/30 transition-colors">
                <span className="text-xs">🔒</span>
              </div>
              <span className="group-hover/badge:text-white transition-colors">
                Secure & Private
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
