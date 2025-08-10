import express from "express";
import mongoose from "mongoose";
import { Link } from "../models/index.js";
import { validateUrl } from "../utils/validations.js";
import { generateUniqueShortCode } from "../utils/shortCode.js";
import { requireAuth, optionalAuth } from "../middleware/auth.js";
import { BASE_URL } from "../config/env.js";

const router = express.Router();

// POST /api/shorten - Create shortened URL (Auth Required)
router.post("/shorten", requireAuth, async (req, res) => {
  try {
    const { longUrl } = req.body;

    // Validate URL
    const urlValidation = validateUrl(longUrl, BASE_URL);
    if (!urlValidation.isValid) {
      return res.status(400).json({ error: urlValidation.message });
    }

    const validatedUrl = urlValidation.url;

    // Check for existing link (dedupe policy) - user is guaranteed to be authenticated
    const existingLink = await Link.findOne({
      ownerId: req.userId,
      longUrl: validatedUrl,
    });

    if (existingLink) {
      return res.json({
        shortUrl: `${BASE_URL}/${existingLink.shortCode}`,
        shortCode: existingLink.shortCode,
        longUrl: existingLink.longUrl,
        totalClicks: existingLink.totalClicks,
        createdAt: existingLink.createdAt,
        linkId: existingLink._id,
        isExisting: true,
      });
    }

    // Generate unique short code
    const shortCode = await generateUniqueShortCode();

    // Create new link - user is guaranteed to be authenticated
    const link = new Link({
      ownerId: req.userId,
      shortCode,
      longUrl: validatedUrl,
    });

    await link.save();

    res.status(201).json({
      shortUrl: `${BASE_URL}/${shortCode}`,
      shortCode,
      longUrl: validatedUrl,
      totalClicks: 0,
      createdAt: link.createdAt,
      linkId: link._id,
      isExisting: false,
    });
  } catch (error) {
    console.error("Shorten URL error:", error);
    res.status(500).json({
      error: "Failed to shorten URL. Please try again.",
      code: "SHORTEN_FAILED",
    });
  }
});

// GET /api/links - Get user's links (authenticated only)
router.get("/links", requireAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
      search = "",
    } = req.query;

    // Validate pagination parameters
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Max 100 items per page

    // Validate sort parameters
    const validSortFields = ["createdAt", "totalClicks", "longUrl"];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    // Build query - ensure ownerId is properly converted to ObjectId
    const query = {
      ownerId: mongoose.Types.ObjectId.isValid(req.userId)
        ? new mongoose.Types.ObjectId(req.userId)
        : req.userId,
    };

    // Add search filter if provided
    if (search.trim()) {
      query.longUrl = { $regex: search.trim(), $options: "i" };
    }

    // Execute query with pagination
    const [links, totalCount] = await Promise.all([
      Link.find(query)
        .sort({ [sortField]: sortDirection })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Link.countDocuments(query),
    ]);

    // Add shortUrl to each link and format data for frontend
    const linksWithShortUrl = links.map((link) => {
      // Convert clicksByMonth Map to array for analytics
      let monthlyClicks = [];

      try {
        // Handle the clicksByMonth field carefully
        if (link.clicksByMonth && typeof link.clicksByMonth === "object") {
          if (link.clicksByMonth instanceof Map) {
            monthlyClicks = Array.from(link.clicksByMonth.entries())
              .map(([month, clicks]) => ({ month, clicks }))
              .sort((a, b) => a.month.localeCompare(b.month));
          } else if (typeof link.clicksByMonth === "object") {
            // Handle plain object (when using .lean())
            monthlyClicks = Object.entries(link.clicksByMonth)
              .map(([month, clicks]) => ({ month, clicks }))
              .sort((a, b) => a.month.localeCompare(b.month));
          }
        }
      } catch (mapError) {
        monthlyClicks = [];
      }

      // If no monthly clicks data exists, generate some dummy data for charts
      if (monthlyClicks.length === 0) {
        const currentDate = new Date();
        const months = [];

        // Generate last 6 months of data
        for (let i = 5; i >= 0; i--) {
          const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - i,
            1
          );
          const monthKey = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`;
          months.push({ month: monthKey, clicks: 0 });
        }

        monthlyClicks = months;
      }

      // Calculate performance percentage (simple metric based on total clicks)
      const maxClicks = Math.max(...links.map((l) => l.totalClicks), 1);
      const performancePercent = Math.round(
        (link.totalClicks / maxClicks) * 100
      );

      const result = {
        id: link._id,
        shortUrl: `${BASE_URL}/${link.shortCode}`,
        shortCode: link.shortCode,
        longUrl: link.longUrl,
        dateCreated: link.createdAt.toISOString().split("T")[0],
        totalClicks: link.totalClicks || 0,
        performancePercent,
        monthlyClicks,
        createdAt: link.createdAt,
      };

      return result;
    });

    res.json({
      links: linksWithShortUrl,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        pages: Math.ceil(totalCount / limitNum),
        hasNext: pageNum * limitNum < totalCount,
        hasPrev: pageNum > 1,
      },
      filters: {
        search: search.trim(),
        sortBy: sortField,
        sortOrder,
      },
    });
  } catch (error) {
    console.error("❌ Get links error:", error.message);
    console.error("❌ Error details:", error);
    res.status(500).json({
      error: "Failed to retrieve links",
      code: "GET_LINKS_FAILED",
      details: error.message,
    });
  }
});

// GET /api/links/:id - Get single link details (authenticated only)
router.get("/links/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const link = await Link.findOne({
      _id: id,
      ownerId: req.userId, // Ensure user owns this link
    });

    if (!link) {
      return res.status(404).json({
        error: "Link not found",
        code: "LINK_NOT_FOUND",
      });
    }

    // Convert clicksByMonth Map to array for analytics
    let monthlyClicks = Array.from(link.clicksByMonth?.entries() || [])
      .map(([month, clicks]) => ({ month, clicks }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // If no monthly clicks data exists, generate some dummy data for charts
    if (monthlyClicks.length === 0) {
      const currentDate = new Date();
      const months = [];

      // Generate last 6 months of data
      for (let i = 5; i >= 0; i--) {
        const date = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - i,
          1
        );
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        months.push({ month: monthKey, clicks: 0 });
      }

      monthlyClicks = months;
    }

    res.json({
      id: link._id,
      shortUrl: `${BASE_URL}/${link.shortCode}`,
      shortCode: link.shortCode,
      longUrl: link.longUrl,
      dateCreated: link.createdAt.toISOString().split("T")[0],
      totalClicks: link.totalClicks,
      monthlyClicks,
      createdAt: link.createdAt,
    });
  } catch (error) {
    console.error("Get link error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Invalid link ID",
        code: "INVALID_LINK_ID",
      });
    }

    res.status(500).json({
      error: "Failed to retrieve link",
      code: "GET_LINK_FAILED",
    });
  }
});

// GET /api/links/:id/analytics - Get link analytics (authenticated only)
router.get("/links/:id/analytics", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { from, to } = req.query;

    const link = await Link.findOne({
      _id: id,
      ownerId: req.userId, // Ensure user owns this link
    });

    if (!link) {
      return res.status(404).json({
        error: "Link not found",
        code: "LINK_NOT_FOUND",
      });
    }

    // Convert clicksByMonth Map to array of objects
    let monthlyData = Array.from(link.clicksByMonth?.entries() || []).map(
      ([month, clicks]) => ({
        month,
        clicks,
      })
    );

    // Filter by date range if provided
    if (from || to) {
      monthlyData = monthlyData.filter(({ month }) => {
        if (from && month < from) return false;
        if (to && month > to) return false;
        return true;
      });
    }

    // Sort by month
    monthlyData.sort((a, b) => a.month.localeCompare(b.month));

    res.json({
      linkId: link._id,
      shortCode: link.shortCode,
      shortUrl: `${BASE_URL}/${link.shortCode}`,
      longUrl: link.longUrl,
      totalClicks: link.totalClicks,
      createdAt: link.createdAt,
      analytics: {
        totalClicks: link.totalClicks,
        monthlyClicks: monthlyData,
        dateRange: {
          from: from || null,
          to: to || null,
        },
      },
    });
  } catch (error) {
    console.error("Get analytics error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Invalid link ID",
        code: "INVALID_LINK_ID",
      });
    }

    res.status(500).json({
      error: "Failed to retrieve analytics",
      code: "GET_ANALYTICS_FAILED",
    });
  }
});

// DELETE /api/links/:id - Delete link (authenticated only)
router.delete("/links/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const link = await Link.findOneAndDelete({
      _id: id,
      ownerId: req.userId, // Ensure user owns this link
    });

    if (!link) {
      return res.status(404).json({
        error: "Link not found",
        code: "LINK_NOT_FOUND",
      });
    }

    res.json({
      message: "Link deleted successfully",
      deletedLink: {
        id: link._id,
        shortCode: link.shortCode,
        longUrl: link.longUrl,
      },
    });
  } catch (error) {
    console.error("Delete link error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Invalid link ID",
        code: "INVALID_LINK_ID",
      });
    }

    res.status(500).json({
      error: "Failed to delete link",
      code: "DELETE_LINK_FAILED",
    });
  }
});

export default router;
