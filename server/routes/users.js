import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import Post from '../models/posts.model.js';
import nodemailer from 'nodemailer'; // For sending OTPs
import { fetchLeetCodeStats } from '../utils/leetcodeUtils.js';
import { fetchCodeChefStats } from '../utils/codechefUtils.js';
import { fetchCodeforcesStats } from '../utils/codeforcesUtils.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'PRAV2004';
const OTP_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes

// Utility: Send OTP email
const sendOTPEmail = async (email, otp) => {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'eudora82@ethereal.email',
//         pass: 'uF1bKxmgeXWTNVEDP1'
//     }
// });
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

  const mailOptions = {
    from: 'pravinnandankar03@gmail.com',
    to: email,
    subject: 'Your Multi-Factor Authentication OTP',
    text: `Your OTP for login is: ${otp}. It will expire in 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { name, image, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, image, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'User created successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Login route with MFA
// Login route with MFA
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Generate OTP for MFA
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    user.otp = otp;
    const otpExpirationTime = Date.now() + OTP_EXPIRATION_TIME;
    console.log('OTP Expiration Time (Generated):', otpExpirationTime); // Log the expiration time
    user.otpExpiresAt = otpExpirationTime;

    // Save OTP and expiration time to the user model
    await user.save();

    await sendOTPEmail(user.email, otp);
    res.json({ message: 'OTP sent to your email for verification' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Verify OTP and login
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or OTP' });
    if (isNaN(user.otpExpiresAt)) {
      return res.status(400).json({ message: 'OTP expiration time is invalid' });
    }

    if (user.otp !== parseInt(otp) || Date.now() > user.otpExpiresAt) {
      console.log('Time Difference:', user.otpExpiresAt - Date.now()); // Should be <= 0 if expired
      console.log("OTP has expired or is incorrect");
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Clear OTP and generate JWT
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Middleware: Token verification
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

// Get user posts
router.get('/user-posts', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const posts = await Post.find({ createdBy: userId }).sort({ createdAt: -1 });
    if (!posts.length) return res.status(404).json({ message: 'No posts found' });
    res.json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get user profile by ID
router.get('/userpro/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get logged-in user info
router.get('/user-info', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/update-profile', verifyToken, async (req, res) => {
  try {
    const { name, image, email, bio, links, codingProfiles } = req.body;
    const updatedFields = {};

    // Only include fields that are provided in the request
    if (name !== undefined) updatedFields.name = name;
    if (image !== undefined) updatedFields.image = image;
    if (email !== undefined) {
      // Check if new email already exists
      if (email !== (await User.findById(req.userId)).email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already exists' });
        }
      }
      updatedFields.email = email;
    }
    if (bio !== undefined) updatedFields.bio = bio;
    if (links !== undefined) updatedFields.links = links;

    // Validate and update coding profiles
    if (codingProfiles !== undefined) {
      updatedFields.codingProfiles = {};
      const allowedProfiles = ['leetcode', 'codechef', 'gfg', 'hackerrank','codeforces'];
       // Handle LeetCode
       if (codingProfiles.leetcode?.username) {
        console.log('Fetching LeetCode stats for:', codingProfiles.leetcode.username);
        const leetcodeStats = await fetchLeetCodeStats(codingProfiles.leetcode.username);
        console.log('leetcodeStats: ', leetcodeStats);
        
        if (leetcodeStats) {
          updatedFields.codingProfiles.leetcode = {
            username: codingProfiles.leetcode.username,
            score: leetcodeStats.score,
            totalSolved:leetcodeStats.totalSolved
          }
        } 
        else {
          updatedFields.codingProfiles.leetcode = {
            username: codingProfiles.leetcode.username,
            score: 0
          };
        }
      }

      // Handle other profiles with the new structure
      if (codingProfiles.codechef?.username) {
        const codechefStats = await fetchCodeChefStats(codingProfiles.codechef.username);
        console.log('codechefStats: ', codechefStats);
        
        if (codechefStats) {
          updatedFields.codingProfiles.codechef = {
            username: codingProfiles.codechef.username,
            currentRating: codechefStats.currentRating,
            highestRating: codechefStats.highestRating,
            stars: codechefStats.stars,
          }
        } 
        else {
          updatedFields.codingProfiles.codechef = {
            username: codingProfiles.codechef.username,
          };
        }
      }
      //codeforces
      if (codingProfiles.codeforces?.username) {
        const codeforcesStats = await fetchCodeforcesStats(codingProfiles.codeforces.username);
        console.log('codeforcesStats: ', codeforcesStats);
        
        if (codeforcesStats) {
          updatedFields.codingProfiles.codeforces = {
            username: codingProfiles.codeforces.username,
            rating: codeforcesStats.rating,
            maxRating: codeforcesStats.maxRating,
            rank: codeforcesStats.rank,
          }
        } 
        else {
          updatedFields.codingProfiles.codeforces = {
            username: codingProfiles.codeforces.username,
            rating: 0
          };
        }
      }
      
      if (codingProfiles.gfg?.username) {
        updatedFields.codingProfiles.gfg = {
          username: codingProfiles.gfg.username,
          score: 0
        };
      }
      
      if (codingProfiles.hackerrank?.username) {
        updatedFields.codingProfiles.hackerrank = {
          username: codingProfiles.hackerrank.username,
          score: 0
        };
      }

    console.log('Updated fields:', updatedFields);

      // Only include valid coding profiles from the request
      // allowedProfiles.forEach(profile => {
      //   if (codingProfiles[profile] !== undefined) {
      //     updatedFields.codingProfiles[profile] = codingProfiles[profile];
      //   }
      // });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updatedFields },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.post('/follow/:userId', verifyToken, async (req, res) => {
  try {
    if (req.userId === req.params.userId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const userToFollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.userId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already following
    if (currentUser.following.includes(req.params.userId)) {
      return res.status(400).json({ message: 'You are already following this user' });
    }

    // Add to following and followers lists
    await User.findByIdAndUpdate(req.userId, {
      $push: { following: req.params.userId }
    });

    await User.findByIdAndUpdate(req.params.userId, {
      $push: { followers: req.userId }
    });

    // Send real-time notification using Socket.IO
    const notification = {
      type: 'follow',
      message: `${currentUser.name} started following you`,
      from: req.userId,
      to: req.params.userId,
      timestamp: new Date()
    };

    // If user is connected, emit the notification
    if (req.io) {
      req.io.to(req.params.userId).emit('notification', notification);
    }

    res.json({ message: 'Successfully followed user' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Unfollow a user
router.post('/unfollow/:userId', verifyToken, async (req, res) => {
  try {
    if (req.userId === req.params.userId) {
      return res.status(400).json({ message: 'You cannot unfollow yourself' });
    }

    const userToUnfollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.userId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if not following
    if (!currentUser.following.includes(req.params.userId)) {
      return res.status(400).json({ message: 'You are not following this user' });
    }

    // Remove from following and followers lists
    await User.findByIdAndUpdate(req.userId, {
      $pull: { following: req.params.userId }
    });

    await User.findByIdAndUpdate(req.params.userId, {
      $pull: { followers: req.userId }
    });

    res.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get user's followers
router.get('/followers', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('followers', 'name image');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ followers: user.followers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get user's following
router.get('/following', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('following', 'name image');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ following: user.following });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


export default router;
