import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { useGlobalAuth } from "./hooks/useGlobalAuth";

// Import pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

// Import components
import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./components/NavBar";

// App wrapper to use hooks inside Router context
const AppContent = () => {
  useGlobalAuth(); // Set up global 401 handling

  return (
    <div className="App">
      <NavBar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

// Simple 404 component
const NotFound = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <p className="text-xl text-gray-600 mt-4">Page not found</p>
      <div className="mt-8">
        <Link
          to="/"
          className="bg-[#8039DF] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#6B2FC7] transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  </div>
);

export default App;
