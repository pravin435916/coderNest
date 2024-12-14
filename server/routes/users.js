import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import Post from '../models/posts.model.js';
import nodemailer from 'nodemailer'; // For sending OTPs

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
    const { name, image, email, bio, links } = req.body;
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


// Follow a user
// router.put('/follow/:id', async (req, res) => {
//   try {
//     const userId = req.body.userId; // ID of the logged-in user
//     const followId = req.params.id; // ID of the user to follow
//     console.log("user",userId)
//     console.log(followId)

//     if (userId === followId) {
//       return res.status(400).json({ message: 'You cannot follow yourself.' });
//     }

//     const user = await User.findById(userId);
//     const userToFollow = await User.findById(followId);

//     if (!user || !userToFollow) {
//       return res.status(404).json({ message: 'User not found.' });
//     }

//     if (!user.following.includes(followId)) {
//       user.following.push(followId);
//       userToFollow.followers.push(userId);
//       await user.save();
//       await userToFollow.save();
//       return res.status(200).json({ message: 'Followed successfully.' });
//     } else {
//       return res.status(400).json({ message: 'Already following this user.' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error.' });
//   }
// });
router.put('/follow/:id', async (req, res) => {
  try {
    const userId = req.body.userId; // ID of the logged-in user
    const followId = req.params.id; // ID of the user to follow

    if (userId === followId) {
      return res.status(400).json({ message: 'You cannot follow yourself.' });
    }

    // Use $addToSet to prevent duplicate entries
    const userUpdate = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { following: followId } },
      { new: true } // Return the updated document
    );

    const followUserUpdate = await User.findByIdAndUpdate(
      followId,
      { $addToSet: { followers: userId } },
      { new: true }
    );

    if (!userUpdate || !followUserUpdate) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Emit a real-time notification to the followed user (if using Socket.IO)
    if (req.io) {
      req.io.emit('followNotification', {
        userId: followId,
        message: `${userUpdate.name} started following you.`,
      });
    }

    return res.status(200).json({
      message: 'Followed successfully.',
      user: userUpdate,
      followedUser: followUserUpdate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Unfollow a user
router.put('/unfollow/:id', async (req, res) => {
  try {
    const userId = req.body.userId; // ID of the logged-in user
    const unfollowId = req.params.id; // ID of the user to unfollow

    if (userId === unfollowId) {
      return res.status(400).json({ message: 'You cannot unfollow yourself.' });
    }

    // Remove the unfollowed user from the following list of the logged-in user
    const userUpdate = await User.findByIdAndUpdate(
      userId,
      { $pull: { following: unfollowId } },
      { new: true } // Return the updated document
    );

    // Remove the logged-in user from the followers list of the user being unfollowed
    const unfollowUserUpdate = await User.findByIdAndUpdate(
      unfollowId,
      { $pull: { followers: userId } },
      { new: true }
    );

    if (!userUpdate || !unfollowUserUpdate) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Emit a real-time notification to the user who was unfollowed (optional)
    if (req.io) {
      req.io.emit('unfollowNotification', {
        userId: unfollowId,
        message: `${userUpdate.name} unfollowed you.`,
      });
    }

    return res.status(200).json({
      message: 'Unfollowed successfully.',
      user: userUpdate,
      unfollowedUser: unfollowUserUpdate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Check if current user follows a target user
router.get('/follow-status/:targetUserId', async (req, res) => {
  try {
    const userId = req.query.userId; // Get the current user ID from query parameters
    const targetUserId = req.params.targetUserId; // Get the target user ID from the URL params

    if (!userId || !targetUserId) {
      return res.status(400).json({ message: 'User IDs are required.' });
    }

    // Fetch the current user and check if they are following the target user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isFollowing = user.following.includes(targetUserId);

    return res.status(200).json({ isFollowing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/followed', async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user is authenticated
    const user = await User.findById(userId).populate('following');
    res.json({ followedUsers: user.following });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});


// Get followers and following
router.get('/:id/followers-following', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('followers following', 'name email');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({
      followers: user.followers,
      following: user.following,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});
export default router;
