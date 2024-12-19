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
  }, 
  links: [{ 
    type: String,
  }],
  otp: { 
    type: Number, 
    default: null 
  }, 
  otpExpiresAt: { 
    type: Number, 
    default: null 
  }, 
  followers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }], 
  following: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }], 
  codingProfiles: {
    leetcode: { 
      username: { type: String, default: null },
      score: { type: Number, default: 0 },
      totalSolved: { type: Number, default: 0 },
    }, // LeetCode username
    codechef: {
      username: { type: String, default: null },
      currentRating: { type: Number, default: 0 },
      highestRating: { type: Number, default: 0 },
      stars: { type: String, default: null },
      }, // CodeChef username
    gfg: { 
      username: { type: String, default: null },
      score: { type: Number, default: 0 },
    },      // GeeksforGeeks username
    hackerrank: { 
      username: { type: String, default: null },
      score: { type: Number, default: 0 },
     } // HackerRank username
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
