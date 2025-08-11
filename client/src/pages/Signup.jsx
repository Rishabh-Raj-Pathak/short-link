import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const { signup, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // If there's a returnTo parameter, go there, otherwise go to dashboard
      const destination =
        returnTo && returnTo !== "/signup" ? returnTo : "/dashboard";
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, navigate, returnTo]);

  // Clear errors when component mounts or form changes
  useEffect(() => {
    clearError();
    setLocalError("");
  }, [clearError, formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    // Normalize email
    const normalizedEmail = formData.email.trim().toLowerCase();

    // Basic validation - check each field individually for specific messages
    if (!formData.email.trim()) {
      setLocalError("Please enter your email.");
      return false;
    }

    if (!normalizedEmail.includes("@")) {
      setLocalError("Invalid email address.");
      return false;
    }

    if (!formData.password) {
      setLocalError("Password must be at least 6 characters.");
      return false;
    }

    if (formData.password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return false;
    }

    if (!formData.confirmPassword) {
      setLocalError("Please confirm your password.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setLocalError("");

    try {
      // Use normalized email for API call
      const normalizedEmail = formData.email.trim().toLowerCase();
      const result = await signup(normalizedEmail, formData.password);

      if (result.success) {
        // Navigate to returnTo destination or dashboard
        const destination =
          returnTo && returnTo !== "/signup" ? returnTo : "/dashboard";
        navigate(destination, { replace: true });
      } else {
        setLocalError(result.error);
      }
    } catch (err) {
      setLocalError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-gray-600">
            Sign up to start shortening URLs and tracking analytics
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-field"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="input-field"
                placeholder="Create a password (min. 6 characters)"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="input-field"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          </div>

          {displayError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {displayError}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </div>

          <div className="text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:text-blue-500 transition-colors"
            >
              Sign in here
            </Link>
          </div>

          <div className="text-center">
            <Link
              to="/"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
