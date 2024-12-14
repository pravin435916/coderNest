import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  bio: { 
    type: String,
  },  // bio
  links: [{ 
    type: String,
  }],  // bio
  otp: { 
    type: Number, 
    default: null 
  },  // Store OTP
  otpExpiresAt: { 
    type: Number, 
    default: null 
  },  // Store OTP expiration time in milliseconds
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who follow this user
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users this user follows
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
