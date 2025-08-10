import { customAlphabet } from "nanoid";
import { Link } from "../models/index.js";

// Generate a unique 7-character short code
export const generateShortCode = () => {
  // Use nanoid with custom alphabet (base62: a-z, A-Z, 0-9)
  const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const nanoid = customAlphabet(alphabet, 7);
  return nanoid();
};

// Generate unique short code with collision detection
export const generateUniqueShortCode = async (maxRetries = 5) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const shortCode = generateShortCode();

    // Check if this code already exists in database
    const existingLink = await Link.findOne({ shortCode });

    if (!existingLink) {
      return shortCode;
    }

    console.log(
      `Short code collision detected: ${shortCode}, retrying... (${
        attempt + 1
      }/${maxRetries})`
    );
  }

  throw new Error(
    "Unable to generate unique short code after multiple attempts"
  );
};

// Validate short code format
export const isValidShortCode = (shortCode) => {
  if (!shortCode || typeof shortCode !== "string") {
    return false;
  }

  // Must be exactly 7 characters, alphanumeric only
  return /^[a-zA-Z0-9]{7}$/.test(shortCode);
};
