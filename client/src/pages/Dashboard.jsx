import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { linksApi } from "../utils/api";

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
        sort: sortBy === "totalClicks" ? "totalClicks" : "createdAt",
        search: searchTerm,
      });
      setLinks(response.links || []);
    } catch (err) {
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 pattern-geometric">
        {/* Header */}
        <header className="relative z-20 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedLink(null)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
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
                  <span>Back to Dashboard</span>
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <h1 className="text-xl font-bold text-gray-900">
                  Link Analytics
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 text-sm">
                  Hello, {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-800 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Analytics View */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Link Info Section */}
          <div className="card scroll-animate mb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Link Overview
                </h2>

                {/* Short URL */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short URL
                  </label>
                  <div className="flex items-center bg-gray-50 rounded-lg p-4">
                    <span className="text-[#8039DF] font-semibold text-lg flex-1 mr-4">
                      {selectedLink.shortUrl}
                    </span>
                    <button
                      onClick={() => copyToClipboard(selectedLink.shortUrl)}
                      className="btn-secondary py-2 px-4 text-sm mr-2"
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={() => openInNewTab(selectedLink.shortUrl)}
                      className="btn-primary py-2 px-4 text-sm"
                    >
                      🔗 Open
                    </button>
                  </div>
                </div>

                {/* Original URL */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original URL
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-800 break-all">
                      {selectedLink.longUrl}
                    </p>
                  </div>
                </div>

                {/* Creation Date */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Created
                  </label>
                  <p className="text-gray-800">
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
              <div className="lg:w-64">
                <div className="text-center bg-white border-2 border-gray-100 rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    QR Code
                  </h3>
                  <div className="bg-white p-4 rounded-lg mb-4 inline-block shadow-sm border">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                        selectedLink.shortUrl
                      )}`}
                      alt="QR Code"
                      className="w-40 h-40"
                    />
                  </div>
                  <button className="btn-primary w-full text-sm">
                    📱 Download PNG
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {[
              {
                label: "Total Clicks",
                value: selectedLink.totalClicks.toLocaleString(),
                icon: "👆",
                color: "bg-blue-500",
              },
              {
                label: "% Change",
                value: `${stats.changePercent > 0 ? "+" : ""}${
                  stats.changePercent
                }%`,
                icon: "📈",
                color: stats.changePercent >= 0 ? "bg-green-500" : "bg-red-500",
              },
              {
                label: "Avg Monthly",
                value: stats.avgMonthly.toLocaleString(),
                icon: "📊",
                color: "bg-purple-500",
              },
              {
                label: "Peak Month",
                value: stats.peakMonth.month.slice(-2),
                icon: "🏆",
                color: "bg-yellow-500",
              },
              {
                label: "Growth Rate",
                value: `${stats.growth > 0 ? "+" : ""}${stats.growth}%`,
                icon: "🚀",
                color: stats.growth >= 0 ? "bg-emerald-500" : "bg-orange-500",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="card scroll-animate hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center text-white text-xl mr-4`}
                  >
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chart Section */}
          <div className="card scroll-animate">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 lg:mb-0">
                Performance Over Time
              </h3>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field text-sm py-2"
                >
                  <option value="dateCreated">Date Created</option>
                  <option value="totalClicks">Top Performing</option>
                </select>

                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                  className="input-field text-sm py-2"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            {/* Simple Chart */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-end justify-between h-64 space-x-2">
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
                      <div className="relative">
                        {/* Tooltip */}
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                          {month.month}: {month.clicks} clicks
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                        </div>

                        {/* Bar */}
                        <div
                          className="w-full bg-gradient-to-t from-[#8039DF] to-[#667eea] rounded-t-lg transition-all duration-300 group-hover:shadow-lg group-hover:scale-105 min-h-[8px]"
                          style={{ height: `${Math.max(height, 5)}%` }}
                        ></div>
                      </div>

                      {/* Month Label */}
                      <span className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-center">
                        {month.month.slice(-2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 text-sm">
                Hello, {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="scroll-animate mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Links</h2>
          <p className="text-gray-600">
            Manage and track performance of your shortened URLs
          </p>
        </div>

        {/* Search and Sort Controls */}
        <div
          className="card scroll-animate mb-8"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
                  className="input-field pl-10 text-sm"
                />
              </div>
            </div>

            {/* Sort Control */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field text-sm py-2 min-w-[140px]"
              >
                <option value="dateCreated">Date Created</option>
                <option value="totalClicks">Total Clicks</option>
              </select>
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
          <div className="space-y-4">
            {sortedLinks.map((link, index) => (
              <div
                key={link.id}
                className="card scroll-animate hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                onClick={() => setSelectedLink(link)}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Link Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-bold text-[#8039DF] group-hover:text-[#667eea] transition-colors">
                          {link.shortUrl.replace("https://", "")}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(link.shortUrl);
                          }}
                          className="text-gray-400 hover:text-[#8039DF] transition-colors p-1"
                          title="Copy link"
                        >
                          <svg
                            className="w-4 h-4"
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
                          className="text-gray-400 hover:text-[#8039DF] transition-colors p-1"
                          title="Open in new tab"
                        >
                          <svg
                            className="w-4 h-4"
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
                        <p className="text-2xl font-bold text-gray-900">
                          {link.totalClicks.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">Total Clicks</p>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 truncate max-w-2xl">
                      {link.longUrl}
                    </p>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        Created{" "}
                        {new Date(link.dateCreated).toLocaleDateString()}
                      </p>

                      {/* Performance Bar */}
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600">
                          Performance
                        </span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-[#8039DF] to-[#667eea] h-2 rounded-full transition-all duration-500"
                            style={{ width: `${link.performancePercent}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {link.performancePercent}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mini Chart Preview */}
                  <div className="lg:w-32">
                    <div className="flex items-end justify-between h-12 space-x-1">
                      {link.monthlyClicks.slice(-6).map((month, idx) => {
                        const maxClicks = Math.max(
                          ...link.monthlyClicks.map((m) => m.clicks)
                        );
                        const height = (month.clicks / maxClicks) * 100;

                        return (
                          <div
                            key={idx}
                            className="flex-1 bg-gradient-to-t from-[#8039DF] to-[#667eea] rounded-t transition-all duration-300 group-hover:shadow-md min-h-[2px]"
                            style={{ height: `${Math.max(height, 10)}%` }}
                          ></div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Last 6 months
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
