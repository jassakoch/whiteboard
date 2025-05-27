import mongoose from "mongoose";
import bcrypt from "bcrypt";  // Import bcrypt

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure email is unique
       match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please use a valid email address']

    },
    password: {
      type: String,
      required: true, 
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
      // Generate a salt and hash the password
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next(); // Move on to saving the user
  });

const User = mongoose.model("User", userSchema);

export default User;
