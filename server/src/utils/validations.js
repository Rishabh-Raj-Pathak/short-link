// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== "string" || email.trim() === "") {
    return { isValid: false, message: "Please enter your email." };
  }
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, message: "Invalid email address." };
  }
  return { isValid: true };
};

// Password validation
export const validatePassword = (password) => {
  if (!password || typeof password !== "string" || password.trim() === "") {
    return { isValid: false, message: "Please enter your password." };
  }
  if (password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters.",
    };
  }
  if (password.length > 128) {
    return {
      isValid: false,
      message: "Password must be less than 128 characters",
    };
  }
  return { isValid: true };
};

// URL validation with loop prevention
export const validateUrl = (url, baseUrl = process.env.BASE_URL) => {
  if (!url || typeof url !== "string") {
    return { isValid: false, message: "URL is required" };
  }

  const trimmedUrl = url.trim();

  // Check if URL starts with http:// or https://
  if (!trimmedUrl.match(/^https?:\/\/.+/)) {
    return {
      isValid: false,
      message: "URL must start with http:// or https://",
    };
  }

  // Prevent redirect loops - reject URLs that start with our BASE_URL
  if (baseUrl && trimmedUrl.startsWith(baseUrl)) {
    return {
      isValid: false,
      message: "Cannot shorten URLs from this domain to prevent redirect loops",
    };
  }

  try {
    const parsedUrl = new URL(trimmedUrl);

    // Additional security: reject localhost URLs in production
    if (
      process.env.NODE_ENV === "production" &&
      (parsedUrl.hostname === "localhost" || parsedUrl.hostname === "127.0.0.1")
    ) {
      return {
        isValid: false,
        message: "Cannot shorten localhost URLs",
      };
    }

    return { isValid: true, url: trimmedUrl };
  } catch (error) {
    return { isValid: false, message: "Please enter a valid URL" };
  }
};
