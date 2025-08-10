import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { linksApi } from "../utils/api";

// Dummy data for dashboard demonstration
const DUMMY_LINKS = [
  {
    id: "1",
    shortUrl: "https://short.ly/jkl012",
    longUrl:
      "https://www.social-media.com/viral-content-strategy-guide-2024-latest-trends",
    dateCreated: "2024-05-12",
    totalClicks: 543,
    performancePercent: 18,
    monthlyClicks: [
      { month: "2024-01", clicks: 45 },
      { month: "2024-02", clicks: 67 },
      { month: "2024-03", clicks: 89 },
      { month: "2024-04", clicks: 156 },
      { month: "2024-05", clicks: 186 },
      { month: "2024-06", clicks: 203 },
    ],
  },
  {
    id: "2",
    shortUrl: "https://short.ly/ghi789",
    longUrl:
      "https://www.blog.example.com/how-to-optimize-conversion-rates-for-ecommerce",
    dateCreated: "2024-04-05",
    totalClicks: 856,
    performancePercent: 29,
    monthlyClicks: [
      { month: "2024-01", clicks: 78 },
      { month: "2024-02", clicks: 112 },
      { month: "2024-03", clicks: 145 },
      { month: "2024-04", clicks: 167 },
      { month: "2024-05", clicks: 189 },
      { month: "2024-06", clicks: 165 },
    ],
  },
  {
    id: "3",
    shortUrl: "https://short.ly/abc123",
    longUrl:
      "https://www.tech-news.com/artificial-intelligence-breakthrough-2024",
    dateCreated: "2024-03-18",
    totalClicks: 1247,
    performancePercent: 42,
    monthlyClicks: [
      { month: "2024-01", clicks: 134 },
      { month: "2024-02", clicks: 189 },
      { month: "2024-03", clicks: 223 },
      { month: "2024-04", clicks: 267 },
      { month: "2024-05", clicks: 234 },
      { month: "2024-06", clicks: 200 },
    ],
  },
  {
    id: "4",
    shortUrl: "https://short.ly/def456",
    longUrl: "https://www.marketing-hub.com/email-automation-best-practices",
    dateCreated: "2024-02-22",
    totalClicks: 672,
    performancePercent: 23,
    monthlyClicks: [
      { month: "2024-01", clicks: 56 },
      { month: "2024-02", clicks: 89 },
      { month: "2024-03", clicks: 123 },
      { month: "2024-04", clicks: 145 },
      { month: "2024-05", clicks: 134 },
      { month: "2024-06", clicks: 125 },
    ],
  },
  {
    id: "5",
    shortUrl: "https://short.ly/xyz789",
    longUrl:
      "https://www.finance-today.com/cryptocurrency-investment-guide-beginners",
    dateCreated: "2024-01-15",
    totalClicks: 934,
    performancePercent: 31,
    monthlyClicks: [
      { month: "2024-01", clicks: 89 },
      { month: "2024-02", clicks: 134 },
      { month: "2024-03", clicks: 167 },
      { month: "2024-04", clicks: 178 },
      { month: "2024-05", clicks: 189 },
      { month: "2024-06", clicks: 177 },
    ],
  },
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [selectedLink, setSelectedLink] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("dateCreated");
  const [viewMode, setViewMode] = useState("monthly");
  const [dateRange, setDateRange] = useState({
    from: "2024-01",
    to: "2024-12",
  });
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch links from backend
  const fetchLinks = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await linksApi.getLinks({
        sortBy: sortBy === "totalClicks" ? "totalClicks" : "createdAt",
        search: searchTerm,
      });
      setLinks(response.links || []);
    } catch (err) {
      console.error("Failed to fetch links:", err);
      setError(err.message || "Failed to load links");
      setLinks([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch links on component mount and when sort/search changes
  useEffect(() => {
    fetchLinks();
  }, [sortBy]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchLinks();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

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
  }, [selectedLink]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      console.log("Logout successful");
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Simple notification - you could enhance with a toast library
      const button = event.target;
      const originalText = button.textContent;
      button.textContent = "Copied!";
      button.classList.add("bg-green-500");
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("bg-green-500");
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const openInNewTab = (url) => {
    window.open(url, "_blank");
  };

  const sortedLinks = [...links].sort((a, b) => {
    if (sortBy === "dateCreated") {
      return new Date(b.dateCreated) - new Date(a.dateCreated);
    } else if (sortBy === "totalClicks") {
      return b.totalClicks - a.totalClicks;
    }
    return 0;
  });

  const calculateStats = (link) => {
    const totalClicks = link.totalClicks;
    const monthlyData = link.monthlyClicks;
    const currentMonth = monthlyData[monthlyData.length - 1]?.clicks || 0;
    const previousMonth = monthlyData[monthlyData.length - 2]?.clicks || 0;
    const changePercent = previousMonth
      ? (((currentMonth - previousMonth) / previousMonth) * 100).toFixed(1)
      : 0;
    const avgMonthly = Math.round(totalClicks / monthlyData.length);
    const peakMonth = monthlyData.reduce(
      (max, month) => (month.clicks > max.clicks ? month : max),
      monthlyData[0]
    );
    const growth =
      monthlyData.length > 1
        ? (
            ((monthlyData[monthlyData.length - 1].clicks -
              monthlyData[0].clicks) /
              monthlyData[0].clicks) *
            100
          ).toFixed(1)
        : 0;

    return { changePercent, avgMonthly, peakMonth, growth };
  };

  if (selectedLink) {
    const stats = calculateStats(selectedLink);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 pattern-geometric relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/20 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-blue-200/20 rounded-full animate-float-slow"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-pink-200/20 rounded-full animate-blob"></div>
        </div>

        {/* Header */}
        <header className="relative z-20 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedLink(null)}
                  className="flex items-center space-x-3 text-gray-600 hover:text-[#8039DF] transition-all duration-300 bg-white/50 rounded-xl px-4 py-3 hover:bg-white/80 shadow-sm"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span className="font-semibold">Back to Dashboard</span>
                </button>
                <div className="h-8 w-px bg-gray-300"></div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-[#8039DF] to-[#667eea] bg-clip-text text-transparent">
                    Link Analytics
                  </h1>
                  <p className="text-sm text-gray-600 font-medium">
                    Total performance overview
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 text-sm font-medium">
                  Hello, {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-[#8039DF] transition-all duration-300 font-semibold"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Analytics View */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Link Info Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 scroll-animate mb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-3 h-8 bg-gradient-to-b from-[#8039DF] to-[#667eea] rounded-full"></div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {selectedLink.shortUrl.replace("https://", "")}
                  </h2>
                  <button
                    onClick={() => copyToClipboard(selectedLink.shortUrl)}
                    className="text-gray-400 hover:text-[#8039DF] hover:bg-purple-50 transition-all duration-300 p-2 rounded-lg"
                    title="Copy link"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => openInNewTab(selectedLink.shortUrl)}
                    className="text-gray-400 hover:text-[#8039DF] hover:bg-purple-50 transition-all duration-300 p-2 rounded-lg"
                    title="Open in new tab"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </button>
                </div>

                {/* Original URL */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Original URL
                  </label>
                  <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200/50">
                    <p className="text-gray-800 break-all font-medium">
                      {selectedLink.longUrl}
                    </p>
                  </div>
                </div>

                {/* Creation Date */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Created
                  </label>
                  <p className="text-gray-800 font-semibold text-lg">
                    {new Date(selectedLink.dateCreated).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>

              {/* QR Code */}
              <div className="lg:w-72">
                <div className="text-center bg-gradient-to-br from-white to-gray-50/50 border-2 border-gray-100/50 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-center space-x-2">
                    <svg
                      className="w-6 h-6 text-[#8039DF]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                    <span>QR Code</span>
                  </h3>
                  <div className="bg-white p-6 rounded-2xl mb-6 inline-block shadow-lg border-2 border-gray-100">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                        selectedLink.shortUrl
                      )}`}
                      alt="QR Code"
                      className="w-44 h-44"
                    />
                  </div>
                  <button className="btn-primary w-full text-sm font-semibold">
                    📱 Download PNG
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-3 h-6 bg-gradient-to-b from-[#8039DF] to-[#667eea] rounded-full mr-3"></div>
              Total performance overview
            </h3>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 scroll-animate">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-5xl font-bold text-gray-900 mb-2">
                    {selectedLink.totalClicks.toLocaleString()}
                  </p>
                  <p className="text-lg text-gray-600 font-medium">
                    Total Clicks
                  </p>
                </div>
                <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-xl">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  <span className="text-green-600 font-bold">
                    +{Math.abs(stats.changePercent)}% from last month
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  {
                    label: "Average Monthly Clicks",
                    value: stats.avgMonthly.toLocaleString(),
                    icon: "📊",
                    color: "from-purple-500 to-purple-600",
                  },
                  {
                    label: "Peak Month",
                    value: stats.peakMonth.month.slice(-3),
                    icon: "🏆",
                    color: "from-yellow-500 to-orange-500",
                  },
                  {
                    label: "Growth Rate",
                    value: `+${Math.abs(stats.growth)}%`,
                    icon: "🚀",
                    color: "from-emerald-500 to-green-600",
                  },
                  {
                    label: "Monthly View",
                    value: "Monthly",
                    icon: "📅",
                    color: "from-blue-500 to-blue-600",
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl p-5 shadow-md border border-gray-100/50 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white text-xl shadow-lg`}
                      >
                        {stat.icon}
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 scroll-animate">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                  <div className="w-3 h-6 bg-gradient-to-b from-[#8039DF] to-[#667eea] rounded-full mr-3"></div>
                  Performance Over Time
                </h3>
                <p className="text-gray-600 font-medium">Monthly View</p>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-gray-50/80 border-2 border-gray-200/50 rounded-xl focus:outline-none focus:border-[#8039DF] focus:bg-white transition-all duration-300 text-gray-900 font-medium"
                >
                  <option value="dateCreated">📅 Date Created</option>
                  <option value="totalClicks">🔥 Top Performing</option>
                </select>

                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                  className="px-4 py-3 bg-gray-50/80 border-2 border-gray-200/50 rounded-xl focus:outline-none focus:border-[#8039DF] focus:bg-white transition-all duration-300 text-gray-900 font-medium"
                >
                  <option value="monthly">📊 Monthly</option>
                  <option value="yearly">📈 Yearly</option>
                </select>
              </div>
            </div>

            {/* Enhanced Chart */}
            <div className="bg-gradient-to-br from-gray-50/80 to-white rounded-2xl p-8 border border-gray-100/50">
              <div className="flex items-end justify-between h-80 space-x-3">
                {selectedLink.monthlyClicks.map((month, index) => {
                  const maxClicks = Math.max(
                    ...selectedLink.monthlyClicks.map((m) => m.clicks)
                  );
                  const height = (month.clicks / maxClicks) * 100;

                  return (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center group cursor-pointer"
                    >
                      <div className="relative w-full">
                        {/* Enhanced Tooltip */}
                        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#8039DF] to-[#667eea] text-white text-sm rounded-xl px-4 py-3 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-20 shadow-xl">
                          <div className="font-bold">{month.month}</div>
                          <div className="text-xs opacity-90">
                            {month.clicks.toLocaleString()} clicks
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#8039DF]"></div>
                        </div>

                        {/* Enhanced Bar */}
                        <div
                          className="w-full bg-gradient-to-t from-[#8039DF] via-[#8d52e8] to-[#667eea] rounded-t-xl transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-300/50 group-hover:scale-105 min-h-[12px] relative overflow-hidden"
                          style={{ height: `${Math.max(height, 8)}%` }}
                        >
                          {/* Shimmer effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse"></div>

                          {/* Top glow */}
                          <div className="absolute top-0 left-0 right-0 h-2 bg-white/30 rounded-t-xl"></div>
                        </div>
                      </div>

                      {/* Enhanced Month Label */}
                      <span className="text-sm font-semibold text-gray-600 mt-4 group-hover:text-[#8039DF] transition-colors duration-300">
                        {month.month.slice(-3)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Chart Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200/50">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span className="font-medium">
                    Showing data from {selectedLink.monthlyClicks[0]?.month} to{" "}
                    {
                      selectedLink.monthlyClicks[
                        selectedLink.monthlyClicks.length - 1
                      ]?.month
                    }
                  </span>
                  <span className="font-semibold">
                    Peak: {stats.peakMonth.month} ({stats.peakMonth.clicks}{" "}
                    clicks)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 pattern-geometric relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-200/20 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-pink-200/20 rounded-full animate-blob"></div>
      </div>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Search and Sort Controls */}
        <div className="scroll-animate mb-8" style={{ animationDelay: "0.1s" }}>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative group">
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#8039DF] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search links..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border-2 border-gray-200/50 rounded-xl focus:outline-none focus:border-[#8039DF] focus:bg-white transition-all duration-300 text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Sort Control */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                    />
                  </svg>
                  <label className="text-sm font-semibold text-gray-700">
                    Sort by:
                  </label>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-gray-50/80 border-2 border-gray-200/50 rounded-xl focus:outline-none focus:border-[#8039DF] focus:bg-white transition-all duration-300 text-gray-900 font-medium min-w-[160px]"
                >
                  <option value="dateCreated">📅 Date Created</option>
                  <option value="totalClicks">🔥 Total Clicks</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="card scroll-animate bg-red-50 border-red-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-red-800 font-medium">Error loading links</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <button
                onClick={fetchLinks}
                className="btn-primary py-2 px-4 text-sm ml-auto"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="card scroll-animate text-center py-12">
            <div className="w-8 h-8 border-4 border-[#8039DF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your links...</p>
          </div>
        )}

        {/* Links List */}
        {!loading && !error && (
          <div className="space-y-6">
            {sortedLinks.map((link, index) => (
              <div
                key={link.id}
                className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 cursor-pointer scroll-animate"
                style={{ animationDelay: `${(index + 2) * 0.1}s` }}
                onClick={() => setSelectedLink(link)}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Link Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-xl font-bold text-[#8039DF] group-hover:text-[#667eea] transition-colors">
                          {link.shortUrl.replace("https://", "")}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(link.shortUrl);
                          }}
                          className="text-gray-400 hover:text-[#8039DF] hover:bg-purple-50 transition-all duration-300 p-2 rounded-lg group/btn"
                          title="Copy link"
                        >
                          <svg
                            className="w-5 h-5 group-hover/btn:scale-110 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openInNewTab(link.shortUrl);
                          }}
                          className="text-gray-400 hover:text-[#8039DF] hover:bg-purple-50 transition-all duration-300 p-2 rounded-lg group/btn"
                          title="Open in new tab"
                        >
                          <svg
                            className="w-5 h-5 group-hover/btn:scale-110 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-gray-900 mb-1">
                          {link.totalClicks.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 font-medium">
                          Total Clicks
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 truncate max-w-3xl bg-gray-50/50 rounded-lg px-3 py-2">
                      {link.longUrl}
                    </p>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 font-medium">
                        Created{" "}
                        {new Date(link.dateCreated).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>

                      {/* Performance Bar */}
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-semibold text-gray-700">
                          {link.performancePercent}% of target
                        </span>
                        <div className="w-32 bg-gray-200 rounded-full h-3 shadow-inner">
                          <div
                            className="bg-gradient-to-r from-[#8039DF] to-[#667eea] h-3 rounded-full transition-all duration-700 shadow-sm relative overflow-hidden"
                            style={{ width: `${link.performancePercent}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mini Chart Preview */}
                  <div className="lg:w-40 lg:border-l lg:border-gray-200/50 lg:pl-6">
                    <div className="flex items-end justify-between h-16 space-x-1 mb-3">
                      {link.monthlyClicks.slice(-6).map((month, idx) => {
                        const maxClicks = Math.max(
                          ...link.monthlyClicks.map((m) => m.clicks)
                        );
                        const height = (month.clicks / maxClicks) * 100;

                        return (
                          <div
                            key={idx}
                            className="flex-1 bg-gradient-to-t from-[#8039DF] to-[#667eea] rounded-t-lg transition-all duration-500 group-hover:shadow-lg group-hover:scale-y-110 min-h-[4px] relative overflow-hidden"
                            style={{ height: `${Math.max(height, 15)}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 group-hover:animate-pulse"></div>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-500 text-center font-medium">
                      Last 6 months trend
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && sortedLinks.length === 0 && (
          <div className="card scroll-animate text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No links found
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? `No links match "${searchTerm}"`
                : "You haven't created any short links yet"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
