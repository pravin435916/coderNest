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
  otp: { 
    type: Number, 
    default: null 
  },  // Store OTP
  otpExpiresAt: { 
    type: Number, 
    default: null 
  },  // Store OTP expiration time in milliseconds
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
