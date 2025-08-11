import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Allow null for anonymous users
      default: null,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      minlength: 7,
      maxlength: 7,
      match: [
        /^[a-zA-Z0-9]{7}$/,
        "Short code must be 7 alphanumeric characters",
      ],
    },
    longUrl: {
      type: String,
      required: [true, "URL is required"],
      trim: true,
      validate: {
        validator: function (url) {
          return /^https?:\/\/.+/.test(url);
        },
        message: "URL must start with http:// or https://",
      },
    },
    totalClicks: {
      type: Number,
      default: 0,
      min: 0,
    },
    clicksByMonth: {
      type: Map,
      of: Number,
      default: new Map(),
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    collection: "links",
  }
);

// Compound indexes for efficient queries
linkSchema.index({ ownerId: 1, createdAt: -1 }); // Dashboard listing
// linkSchema.index({ shortCode: 1 }); // Fast redirect lookups
linkSchema.index({ ownerId: 1, longUrl: 1 }); // Dedupe checks

// Static method to generate month key for analytics
linkSchema.statics.getMonthKey = function (date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

// Instance method to increment click analytics
linkSchema.methods.incrementClicks = async function () {
  const monthKey = this.constructor.getMonthKey();

  // Increment total clicks
  this.totalClicks += 1;

  // Increment monthly clicks
  const currentMonthClicks = this.clicksByMonth.get(monthKey) || 0;
  this.clicksByMonth.set(monthKey, currentMonthClicks + 1);

  return await this.save();
};

// Virtual for short URL
linkSchema.virtual("shortUrl").get(function () {
  return `${process.env.BASE_URL}/${this.shortCode}`;
});

// Include virtuals in JSON output
linkSchema.set("toJSON", { virtuals: true });

const Link = mongoose.model("Link", linkSchema);

export default Link;
