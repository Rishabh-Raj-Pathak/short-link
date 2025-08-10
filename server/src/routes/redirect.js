import express from "express";
import { Link } from "../models/index.js";
import { isValidShortCode } from "../utils/shortCode.js";

const router = express.Router();

// GET /:shortCode - Redirect to original URL and track analytics
router.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Validate short code format
    if (!isValidShortCode(shortCode)) {
      return res.status(404).json({
        error: "Invalid short code format",
        code: "INVALID_SHORT_CODE",
      });
    }

    // Find the link
    const link = await Link.findOne({ shortCode });

    if (!link) {
      return res.status(404).json({
        error: "Short link not found",
        code: "LINK_NOT_FOUND",
      });
    }

    // Increment analytics atomically
    try {
      await link.incrementClicks();
      console.log(`📊 Click recorded for ${shortCode} -> ${link.longUrl}`);
    } catch (analyticsError) {
      // Don't fail the redirect if analytics update fails
      console.error("Analytics update failed:", analyticsError);
    }

    // Perform redirect (HTTP 302)
    res.redirect(302, link.longUrl);
  } catch (error) {
    console.error("Redirect error:", error);

    // Return JSON error for API consistency
    res.status(500).json({
      error: "Redirect failed",
      code: "REDIRECT_FAILED",
    });
  }
});

export default router;
