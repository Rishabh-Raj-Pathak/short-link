import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import Home from "../pages/Home";
import { AuthProvider } from "../context/AuthContext";
import * as api from "../utils/api";

// Mock the API
vi.mock("../utils/api", () => ({
  linksApi: {
    shorten: vi.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock AuthContext
const MockAuthProvider = ({
  children,
  isAuthenticated = false,
  user = null,
}) => {
  const value = {
    isAuthenticated,
    user,
    loading: false,
    error: null,
    signup: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    clearError: vi.fn(),
    checkAuthStatus: vi.fn(),
  };

  return (
    <div data-testid="mock-auth-provider">
      {React.cloneElement(children, { authContext: value })}
    </div>
  );
};

const renderWithAuth = (isAuthenticated = false) => {
  return render(
    <BrowserRouter>
      <MockAuthProvider isAuthenticated={isAuthenticated}>
        <Home />
      </MockAuthProvider>
    </BrowserRouter>
  );
};

describe("Home Page Authentication Gating", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  describe("When user is NOT authenticated", () => {
    test("submit button should be disabled", () => {
      renderWithAuth(false);

      const submitButton = screen.getByRole("button", {
        name: /please log in to shorten urls/i,
      });
      expect(submitButton).toBeDisabled();
    });

    test("button text should indicate login required", () => {
      renderWithAuth(false);

      expect(
        screen.getByText("Please Log In to Shorten URLs")
      ).toBeInTheDocument();
    });

         test("clicking submit should not call API and should redirect to login with returnTo", async () => {
       renderWithAuth(false);

       const urlInput = screen.getByPlaceholderText(/enter your long url/i);
       const submitButton = screen.getByRole("button", {
         name: /please log in to shorten urls/i,
       });

       // Fill in URL
       fireEvent.change(urlInput, {
         target: { value: "https://www.google.com" },
       });

       // Try to submit (button should be disabled, but let's test the form handler)
       fireEvent.click(submitButton);

       // Should redirect to login with returnTo parameter
       await waitFor(() => {
         expect(mockNavigate).toHaveBeenCalledWith(
           expect.stringContaining("/login?returnTo=")
         );
       });

       // API should not be called
       expect(api.linksApi.shorten).not.toHaveBeenCalled();
     });
  });

  describe("When user IS authenticated", () => {
    test("submit button should be enabled with valid URL", () => {
      renderWithAuth(true);

      const urlInput = screen.getByPlaceholderText(/enter your long url/i);
      fireEvent.change(urlInput, {
        target: { value: "https://www.google.com" },
      });

      const submitButton = screen.getByRole("button", { name: /shorten url/i });
      expect(submitButton).not.toBeDisabled();
    });

    test('button text should show "Shorten URL"', () => {
      renderWithAuth(true);

      expect(screen.getByText("Shorten URL →")).toBeInTheDocument();
    });

    test("successful URL shortening should work", async () => {
      api.linksApi.shorten.mockResolvedValueOnce({
        shortUrl: "http://localhost:5000/abc1234",
        shortCode: "abc1234",
        longUrl: "https://www.google.com",
      });

      renderWithAuth(true);

      const urlInput = screen.getByPlaceholderText(/enter your long url/i);
      const submitButton = screen.getByRole("button", { name: /shorten url/i });

      // Fill in URL and submit
      fireEvent.change(urlInput, {
        target: { value: "https://www.google.com" },
      });
      fireEvent.click(submitButton);

      // API should be called
      await waitFor(() => {
        expect(api.linksApi.shorten).toHaveBeenCalledWith(
          "https://www.google.com"
        );
      });
    });

         test("401 error should be handled by global handler", async () => {
       api.linksApi.shorten.mockRejectedValueOnce(new Error("Please log in"));

       renderWithAuth(true);

       const urlInput = screen.getByPlaceholderText(/enter your long url/i);
       const submitButton = screen.getByRole("button", { name: /shorten url/i });

       // Fill in URL and submit
       fireEvent.change(urlInput, {
         target: { value: "https://www.google.com" },
       });
       fireEvent.click(submitButton);

       // Error should be shown in the form
       await waitFor(() => {
         expect(screen.getByText("Please log in")).toBeInTheDocument();
       });

       // Note: Global 401 handler would handle the redirect in a real scenario
     });
  });

  describe("URL Validation", () => {
    test("should still validate URL format when authenticated", async () => {
      renderWithAuth(true);

      const urlInput = screen.getByPlaceholderText(/enter your long url/i);
      const submitButton = screen.getByRole("button", { name: /shorten url/i });

      // Try invalid URL
      fireEvent.change(urlInput, { target: { value: "invalid-url" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/please enter a valid url starting with http/i)
        ).toBeInTheDocument();
      });

      // API should not be called
      expect(api.linksApi.shorten).not.toHaveBeenCalled();
    });
  });
});
