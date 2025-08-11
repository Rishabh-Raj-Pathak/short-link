import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    collection: "users",
  }
);

// Index for faster email lookups
// userSchema.index({ email: 1 });

// Static method to hash password
userSchema.statics.hashPassword = async function (password) {
  const saltRounds = 12; // Higher for better security
  return await bcrypt.hash(password, saltRounds);
};

// Instance method to verify password
userSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.passwordHash);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.passwordHash;
  return user;
};

const User = mongoose.model("User", userSchema);

export default User;
