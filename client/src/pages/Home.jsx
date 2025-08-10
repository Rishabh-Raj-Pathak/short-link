import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { linksApi } from "../utils/api";

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [urlInput, setUrlInput] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Scroll animation effect
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
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
      setError(err.message || "Failed to shorten URL");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 pattern-geometric">
      {/* Header */}
      <header className="relative z-20 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">ShortLink</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-600 text-sm">
                    Hello, {user?.email}
                  </span>
                  <Link to="/dashboard" className="btn-secondary">
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-800 transition-colors font-medium"
                  >
                    Login
                  </Link>
                  <Link to="/signup" className="btn-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600">
        <div className="absolute inset-0 pattern-wave opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Hero Badge */}
          <div className="fade-in-up mb-8">
            <div className="inline-flex items-center px-6 py-3 glass text-white rounded-full text-sm font-medium">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                  clipRule="evenodd"
                />
              </svg>
              Let's make with simply one click 👆
            </div>
          </div>

          {/* Main Heading */}
          <div className="fade-in-up mb-6" style={{ animationDelay: "0.2s" }}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              ALL IN ONE TOOLS
              <br />
              <span className="gradient-text-sunset">FOR YOUR LINKS</span>
            </h1>
          </div>

          {/* Subtitle */}
          <div className="fade-in-up mb-12" style={{ animationDelay: "0.4s" }}>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              On a single platform, you'll find all the tools you need to
              connect audiences worldwide, manage links and QR codes, and create
              brand relationships.
            </p>
          </div>

          {/* URL Shortener Form */}
          <div
            className="fade-in-up max-w-4xl mx-auto"
            style={{ animationDelay: "0.6s" }}
          >
            <form
              onSubmit={handleShortenUrl}
              className="flex flex-col md:flex-row gap-4 mb-8"
            >
              <div className="flex-1">
                <input
                  type="url"
                  placeholder="Paste your link here..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="input-field text-lg"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !urlInput.trim()}
                className="btn-primary text-lg px-8 whitespace-nowrap"
              >
                {isLoading ? "Shortening..." : "Shorten URL →"}
              </button>
            </form>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <p className="text-white/70 text-sm">
              Shorten your link and generate a QR code instantly.
            </p>
          </div>

          {/* Result Section */}
          {shortenedUrl && (
            <div
              className="fade-in-up mt-16 max-w-4xl mx-auto"
              style={{ animationDelay: "0.8s" }}
            >
              <div className="card">
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                  {/* Short URL Display */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Your shortened link and QR code will appear here
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                      <span className="text-purple-600 font-medium truncate mr-4">
                        {shortenedUrl}
                      </span>
                      <button
                        onClick={() => copyToClipboard(shortenedUrl)}
                        className="btn-secondary py-2 px-4 text-sm"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  {/* QR Code */}
                  {qrCodeUrl && (
                    <div className="text-center">
                      <img
                        src={qrCodeUrl}
                        alt="QR Code"
                        className="w-48 h-48 mx-auto mb-4 rounded-lg shadow-lg"
                      />
                      <button onClick={downloadQR} className="btn-primary">
                        Download PNG
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 gradient-sunset rounded-full animate-float opacity-70 blur-sm"></div>
        <div
          className="absolute top-40 right-20 w-16 h-16 gradient-ocean rounded-full animate-float opacity-70 blur-sm"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-12 h-12 gradient-purple-pink rounded-full animate-float opacity-70 blur-sm"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/3 w-8 h-8 gradient-green-blue rounded-full animate-float opacity-60 blur-sm"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute bottom-1/3 right-10 w-14 h-14 gradient-orange-pink rounded-full animate-float opacity-60 blur-sm"
          style={{ animationDelay: "4s" }}
        ></div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-gradient-purple-pink pattern-dots scroll-animate">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-8">
            {/* User Avatars */}
            <div className="flex -space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold border-4 border-white">
                A
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold border-4 border-white">
                B
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold border-4 border-white">
                C
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex star-rating">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
              <span className="text-2xl font-bold text-gray-900">4.0</span>
            </div>

            <p className="text-gray-600">from 500+ reviews (Demo data)</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-white via-blue-50 to-purple-50 pattern-hexagon scroll-animate">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-xl text-gray-600">
              Transform your long URLs into powerful, trackable links in just a
              few simple steps
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div
              className="text-center scroll-animate"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="step-indicator mx-auto mb-6">1</div>
              <div className="step-connector"></div>
              <div className="card mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Shorten the URL
                </h3>
                <p className="text-gray-600 mb-6">
                  Enter your long URL and click our shorten button to create a
                  compact, shareable link instantly.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <input
                      type="text"
                      placeholder="https://example.com/very-long-url-that-needs-shortening..."
                      className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm min-w-0"
                      readOnly
                    />
                    <button className="btn-primary py-2 px-4 text-sm whitespace-nowrap shrink-0">
                      Shorten URL
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div
              className="text-center scroll-animate"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="step-indicator mx-auto mb-6">2</div>
              <div className="step-connector"></div>
              <div className="card mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Generate QR Code
                </h3>
                <p className="text-gray-600 mb-6">
                  Automatically receive a customized QR code alongside your
                  shortened link for easy mobile sharing.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">
                        QR Code Generated!
                      </p>
                      <p className="text-purple-600 font-medium">
                        sh.rt/abc123
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                      <div
                        className="w-12 h-12 bg-black opacity-80"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cg%3e%3crect width='10' height='10' x='0' y='0' fill='black'/%3e%3crect width='10' height='10' x='20' y='0' fill='black'/%3e%3crect width='10' height='10' x='40' y='0' fill='black'/%3e%3c/g%3e%3c/svg%3e")`,
                          backgroundSize: "cover",
                        }}
                      ></div>
                    </div>
                  </div>
                  <button className="btn-primary w-full mt-3 text-sm">
                    Download PNG
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div
              className="text-center scroll-animate"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="step-indicator mx-auto mb-6">3</div>
              <div className="step-connector"></div>
              <div className="card mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  View Dashboard
                </h3>
                <p className="text-gray-600 mb-6">
                  Access your personalized dashboard to manage all your
                  shortened links and QR codes in one place.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-left">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        Your Links
                      </span>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                        3 Active
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-purple-600">sh.rt/abc123</span>
                        <span className="text-gray-500">124 clicks</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-purple-600">sh.rt/def456</span>
                        <span className="text-gray-500">856 clicks</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-purple-600">sh.rt/ghi789</span>
                        <span className="text-gray-500">432 clicks</span>
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
      <section className="py-24 bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 pattern-circuit scroll-animate">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Track <span className="gradient-text">Performance</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Monitor click analytics, geographic data, and engagement metrics
                to optimize your link performance.
              </p>

              {/* Analytics Cards */}
              <div className="card mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Analytics Overview
                  </h3>
                  <span className="text-sm text-gray-500">Last 7 days</span>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">
                      2.4k
                    </div>
                    <div className="text-sm text-gray-600">Total Clicks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">
                      89%
                    </div>
                    <div className="text-sm text-gray-600">Mobile Users</div>
                  </div>
                </div>

                {/* Simple Chart */}
                <div className="flex items-end space-x-2 h-20">
                  {[30, 45, 25, 60, 80, 55, 70].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className="lg:pl-8">
              <div className="relative">
                <div className="card max-w-md mx-auto bg-gradient-to-br from-white to-purple-50 border border-purple-100">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse-slow">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Real-time Analytics
                    </h3>
                    <p className="text-gray-600 text-sm mb-6">
                      Track your links performance instantly
                    </p>
                  </div>

                  {/* Live Stats Cards */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold">1.2k</div>
                      <div className="text-xs opacity-90">Today's Clicks</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold">87%</div>
                      <div className="text-xs opacity-90">Mobile Users</div>
                    </div>
                  </div>

                  {/* Mini Chart */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Live Activity
                      </span>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600">Live</span>
                      </div>
                    </div>
                    <div className="flex items-end space-x-1 h-16 bg-gray-50 rounded p-2">
                      {[12, 19, 8, 25, 32, 18, 28, 15, 22, 35, 29, 42].map(
                        (height, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-sm animate-pulse"
                            style={{
                              height: `${height}%`,
                              animationDelay: `${i * 0.1}s`,
                              animationDuration: "2s",
                            }}
                          ></div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Real-time Clicks Feed */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-700 mb-2">
                      Recent Clicks
                    </div>
                    {[
                      { country: "🇺🇸", time: "2s ago", device: "Desktop" },
                      { country: "🇬🇧", time: "5s ago", device: "Mobile" },
                      { country: "🇩🇪", time: "12s ago", device: "Tablet" },
                      { country: "🇯🇵", time: "18s ago", device: "Mobile" },
                    ].map((click, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs fade-in-up"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{click.country}</span>
                          <span className="text-gray-600">{click.device}</span>
                        </div>
                        <span className="text-purple-600 font-medium">
                          {click.time}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-200 transition-colors">
                      📊 Full Report
                    </button>
                    <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors">
                      📱 Export Data
                    </button>
                  </div>
                </div>

                {/* Floating Analytics Icons */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-white text-xs">📈</span>
                </div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center animate-float">
                  <span className="text-white text-xs">👀</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden scroll-animate">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "30px 30px",
            }}
          ></div>

          {/* Floating orbs */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-xl animate-float"></div>
          <div
            className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-br from-pink-400/20 to-purple-500/20 rounded-full blur-xl animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-10 right-1/3 w-14 h-14 bg-gradient-to-br from-green-400/20 to-teal-500/20 rounded-full blur-xl animate-float"
            style={{ animationDelay: "3s" }}
          ></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Main Content */}
          <div className="glass-dark rounded-3xl p-12 backdrop-blur-lg border border-white/10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Get Started Now
              <span className="inline-block ml-2 animate-bounce">🚀</span>
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join users who trust our platform for their link management needs.
            </p>

            {/* Enhanced CTA Button */}
            <div className="space-y-4">
              <Link
                to="/signup"
                className="inline-flex items-center bg-gradient-to-r from-pink-500 to-violet-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-pink-600 hover:to-violet-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg group"
              >
                <span>Create Free Account</span>
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
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

              {/* Additional info */}
              <div className="flex items-center justify-center space-x-6 text-white/70 text-sm">
                <div className="flex items-center space-x-1">
                  <span>✅</span>
                  <span>Free Forever</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>⚡</span>
                  <span>Instant Setup</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>🔒</span>
                  <span>Secure & Private</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
