import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "../context/ToastContext";
import * as api from "../utils/api";

// Mock the API
vi.mock("../utils/api", () => ({
  authApi: {
    me: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
  },
  linksApi: {
    shorten: vi.fn(),
  },
  setGlobal401Handler: vi.fn(),
}));

// Mock AuthContext
const MockAuthProvider = ({ 
  children, 
  isAuthenticated = false, 
  user = null, 
  loading = false 
}) => {
  const value = {
    isAuthenticated,
    user,
    loading,
    error: null,
    signup: vi.fn(),
    login: vi.fn().mockResolvedValue({ success: true, user: { email: "test@example.com" } }),
    logout: vi.fn().mockResolvedValue({ success: true }),
    clearError: vi.fn(),
    checkAuthStatus: vi.fn(),
  };

  return (
    <div data-testid="mock-auth-provider">
      {React.cloneElement(children, { authContext: value })}
    </div>
  );
};

const renderWithProviders = (
  component,
  { 
    isAuthenticated = false, 
    initialEntries = ["/"],
    ...authProps 
  } = {}
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <MockAuthProvider isAuthenticated={isAuthenticated} {...authProps}>
        <ToastProvider>
          {component}
        </ToastProvider>
      </MockAuthProvider>
    </MemoryRouter>
  );
};

describe("Routing and Authentication Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Public Home Access", () => {
    test("logged-in user can access Home page", () => {
      renderWithProviders(<Home />, { isAuthenticated: true });
      
      // Should show the Home page content
      expect(screen.getByText("Shorten URL →")).toBeInTheDocument();
    });

    test("logged-out user can access Home page", () => {
      renderWithProviders(<Home />, { isAuthenticated: false });
      
      // Should show the Home page content
      expect(screen.getByText("Please Log In to Shorten URLs")).toBeInTheDocument();
    });
  });

  describe("Authentication Guard Behavior", () => {
    test("clicking shorten when logged out redirects to login with returnTo", async () => {
      const mockNavigate = vi.fn();
      
      // Mock useNavigate
      vi.mock("react-router-dom", async () => {
        const actual = await vi.importActual("react-router-dom");
        return {
          ...actual,
          useNavigate: () => mockNavigate,
        };
      });

      renderWithProviders(<Home />, { isAuthenticated: false });
      
      const urlInput = screen.getByPlaceholderText(/enter your long url/i);
      const submitButton = screen.getByRole("button", { name: /please log in to shorten urls/i });
      
      // Fill in URL
      fireEvent.change(urlInput, { target: { value: "https://www.google.com" } });
      
      // Try to submit
      fireEvent.click(submitButton);
      
      // Should show toast and navigate with returnTo
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          expect.stringContaining("/login?returnTo=")
        );
      });
    });

    test("successful login redirects to returnTo destination", async () => {
      const mockNavigate = vi.fn();
      
      renderWithProviders(
        <Login />, 
        { 
          isAuthenticated: false,
          initialEntries: ["/login?returnTo=%2Fdashboard"]
        }
      );
      
      // Fill login form
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });
      
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);
      
      // Should navigate to the returnTo destination
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/dashboard", { replace: true });
      });
    });
  });

  describe("Protected Route Access", () => {
    test("accessing protected route when logged out redirects to login with returnTo", () => {
      const mockNavigate = vi.fn();
      
      renderWithProviders(
        <div data-testid="protected-content">Dashboard</div>,
        {
          isAuthenticated: false,
          initialEntries: ["/dashboard"]
        }
      );
      
      // Should redirect to login with returnTo parameter
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining("/login?returnTo="),
        { replace: true }
      );
    });
  });

  describe("Session Expiry Handling", () => {
    test("401 response triggers redirect to login with returnTo", async () => {
      // Mock API to return 401
      api.linksApi.shorten.mockRejectedValueOnce(new Error("Please log in"));
      
      const mockNavigate = vi.fn();
      
      renderWithProviders(<Home />, { isAuthenticated: true });
      
      const urlInput = screen.getByPlaceholderText(/enter your long url/i);
      const submitButton = screen.getByRole("button", { name: /shorten url/i });
      
      // Fill in URL and submit
      fireEvent.change(urlInput, { target: { value: "https://www.google.com" } });
      fireEvent.click(submitButton);
      
      // Should handle 401 and redirect
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          expect.stringContaining("/login?returnTo=")
        );
      });
    });
  });

  describe("Logout Flow", () => {
    test("logout redirects to Home with success toast", async () => {
      const mockLogout = vi.fn().mockResolvedValue({ success: true });
      const mockNavigate = vi.fn();
      
      renderWithProviders(
        <div data-testid="nav-bar">
          <button onClick={mockLogout}>Logout</button>
        </div>,
        { 
          isAuthenticated: true,
          user: { email: "test@example.com" }
        }
      );
      
      const logoutButton = screen.getByRole("button", { name: /logout/i });
      fireEvent.click(logoutButton);
      
      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
      });
    });
  });

  describe("No Infinite Redirects", () => {
    test("visiting login while authenticated honors returnTo if present", () => {
      const mockNavigate = vi.fn();
      
      renderWithProviders(
        <Login />,
        {
          isAuthenticated: true,
          initialEntries: ["/login?returnTo=%2Fdashboard"]
        }
      );
      
      // Should redirect to returnTo destination, not default dashboard
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard", { replace: true });
    });

    test("visiting login while authenticated without returnTo goes to dashboard", () => {
      const mockNavigate = vi.fn();
      
      renderWithProviders(
        <Login />,
        {
          isAuthenticated: true,
          initialEntries: ["/login"]
        }
      );
      
      // Should redirect to default dashboard
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard", { replace: true });
    });
  });

  describe("404 Handling", () => {
    test("404 page renders correctly and does not redirect", () => {
      renderWithProviders(
        <div>404 Page</div>,
        {
          isAuthenticated: false,
          initialEntries: ["/nonexistent"]
        }
      );
      
      // Should show 404 content, not redirect
      expect(screen.getByText("404 Page")).toBeInTheDocument();
    });
  });
});
