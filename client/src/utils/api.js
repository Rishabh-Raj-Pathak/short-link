import { config } from "../config/env.js";

// Global handler for 401 responses
let handle401Redirect = null;

export const setGlobal401Handler = (handler) => {
  handle401Redirect = handler;
};

/**
 * API utility functions with credentials support for cookie-based auth
 */

const defaultOptions = {
  credentials: "include", // Important: include cookies for auth
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * Make an API request with error handling
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${config.apiBaseUrl}${endpoint}`;

  const requestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, requestOptions);

    // Handle non-JSON responses (like redirects)
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return { success: true };
    }

    const data = await response.json();

    if (!response.ok) {
      // Handle new error format { ok: false, msg: "Please log in" }
      const errorMessage =
        data.msg ||
        data.error ||
        `HTTP ${response.status}: ${response.statusText}`;

      // Handle 401 responses globally
      if (response.status === 401 && handle401Redirect) {
        handle401Redirect();
      }

      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error("API Request failed:", error);
    throw error;
  }
}

// Auth API functions
export const authApi = {
  /**
   * Sign up a new user
   */
  signup: async (email, password) => {
    return apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Log in an existing user
   */
  login: async (email, password) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Log out the current user
   */
  logout: async () => {
    return apiRequest("/auth/logout", {
      method: "POST",
    });
  },

  /**
   * Get current user info
   */
  me: async () => {
    return apiRequest("/auth/me");
  },
};

// Links API functions
export const linksApi = {
  /**
   * Shorten a URL
   */
  shorten: async (longUrl) => {
    return apiRequest("/api/shorten", {
      method: "POST",
      body: JSON.stringify({ longUrl }),
    });
  },

  /**
   * Get all links for the current user
   */
  getLinks: async (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sort) searchParams.append("sortBy", params.sort); // Support both formats
    if (params.search) searchParams.append("search", params.search);
    if (params.page) searchParams.append("page", params.page);
    if (params.limit) searchParams.append("limit", params.limit);

    const query = searchParams.toString();
    const endpoint = `/api/links${query ? `?${query}` : ""}`;

    return apiRequest(endpoint);
  },

  /**
   * Get a specific link by ID
   */
  getLink: async (linkId) => {
    return apiRequest(`/api/links/${linkId}`);
  },

  /**
   * Get analytics for a specific link
   */
  getAnalytics: async (linkId, params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.from) searchParams.append("from", params.from);
    if (params.to) searchParams.append("to", params.to);

    const query = searchParams.toString();
    const endpoint = `/api/links/${linkId}/analytics${
      query ? `?${query}` : ""
    }`;

    return apiRequest(endpoint);
  },
};

// Health check
export const healthApi = {
  check: async () => {
    return apiRequest("/health");
  },
};
