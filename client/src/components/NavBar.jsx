import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const NavBar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { success } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      success("Logged out successfully");
      navigate("/", { replace: true });
    }
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Early return after all hooks are called
  if (!isAuthenticated) return null;

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-white/20 shadow-2xl"
            : "bg-white/80 backdrop-blur-lg border-b border-white/10 shadow-lg"
        }`}
      >
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 via-blue-50/30 to-pink-50/50 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex items-center space-x-3 group/logo">
              <Link to="/" className="flex items-center space-x-3 group/link">
                {/* Animated Logo Icon */}
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8039DF] via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover/link:shadow-2xl transition-all duration-500 group-hover/link:scale-110 group-hover/link:rotate-3">
                    {/* Logo Icon */}
                    <svg
                      className="w-7 h-7 text-white transition-transform duration-300 group-hover/link:scale-110"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {/* Pulsing Ring */}
                    <div className="absolute inset-0 border-2 border-purple-300/50 rounded-2xl animate-ping opacity-0 group-hover/link:opacity-75"></div>
                  </div>
                  {/* Floating Sparkles */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full animate-bounce opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300 animation-delay-500"></div>
                </div>

                {/* Brand Text */}
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-[#8039DF] via-purple-600 to-blue-600 bg-clip-text text-transparent group-hover/link:from-[#6B2FC7] group-hover/link:via-purple-700 group-hover/link:to-blue-700 transition-all duration-300">
                    ShortLink
                  </span>
                  <span className="text-xs text-gray-500 font-medium -mt-1 group-hover/link:text-purple-600 transition-colors duration-300">
                    Professional
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {/* Navigation Links */}
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-2xl p-2 border border-white/40 shadow-lg">
                <Link
                  to="/"
                  className={`relative px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 group/nav ${
                    isActive("/")
                      ? "text-white bg-gradient-to-r from-[#8039DF] to-blue-600 shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/80"
                  }`}
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <span>Home</span>
                  </span>
                  {isActive("/") && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-xl animate-pulse"></div>
                  )}
                </Link>

                <Link
                  to="/dashboard"
                  className={`relative px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 group/nav ${
                    isActive("/dashboard")
                      ? "text-white bg-gradient-to-r from-[#8039DF] to-blue-600 shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/80"
                  }`}
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    <span>Dashboard</span>
                  </span>
                  {isActive("/dashboard") && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-xl animate-pulse"></div>
                  )}
                </Link>
              </div>

              {/* User Section */}
              <div className="flex items-center space-x-4 ml-6">
                {/* User Avatar & Info */}
                <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/40 shadow-lg group/user">
                  {/* User Avatar */}
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#8039DF] to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover/user:shadow-xl transition-all duration-300 group-hover/user:scale-110">
                      {user?.email?.charAt(0).toUpperCase()}
                      {/* Online Status */}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="hidden lg:block">
                    <p className="text-sm font-semibold text-gray-800 group-hover/user:text-purple-600 transition-colors duration-300">
                      Welcome back!
                    </p>
                    <p className="text-xs text-gray-500 -mt-0.5 truncate max-w-32">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="relative bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-xl group/logout overflow-hidden"
                >
                  {/* Button Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover/logout:translate-x-[200%] transition-transform duration-700"></div>
                  <span className="relative z-10 flex items-center space-x-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Logout</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative w-12 h-12 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white border border-white/40 shadow-lg transition-all duration-300 hover:scale-105 group/mobile"
              >
                <div className="relative w-6 h-6 flex flex-col justify-center">
                  <span
                    className={`block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                      isMobileMenuOpen ? "rotate-45 translate-y-1" : ""
                    }`}
                  ></span>
                  <span
                    className={`block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                      isMobileMenuOpen ? "opacity-0" : "mt-1"
                    }`}
                  ></span>
                  <span
                    className={`block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                      isMobileMenuOpen ? "-rotate-45 -translate-y-1" : "mt-1"
                    }`}
                  ></span>
                </div>
                {/* Button Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-xl opacity-0 group-hover/mobile:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-white/20 shadow-2xl transition-all duration-500 ${
            isMobileMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Mobile Navigation Links */}
            <div className="space-y-3 mb-6">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isActive("/")
                    ? "text-white bg-gradient-to-r from-[#8039DF] to-blue-600 shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/80"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span>Home</span>
              </Link>

              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isActive("/dashboard")
                    ? "text-white bg-gradient-to-r from-[#8039DF] to-blue-600 shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/80"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                <span>Dashboard</span>
              </Link>
            </div>

            {/* Mobile User Section */}
            <div className="border-t border-gray-200/50 pt-6">
              {/* User Info */}
              <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#8039DF] to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {user?.email?.charAt(0).toUpperCase()}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Welcome back!</p>
                  <p className="text-sm text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-20"></div>
    </>
  );
};

export default NavBar;
