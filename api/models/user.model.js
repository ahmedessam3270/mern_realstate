import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  // to save the date of user creation date
  { timestamps: true }
);

// Create the user model
const User = mongoose.model("User", userSchema);
export default User;
