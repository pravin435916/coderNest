import express from 'express';
import Post from '../models/posts.model.js';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv'
dotenv.config()
import { fileURLToPath } from 'url';
import Notification from '../models/notification.model.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.post('/create', upload.single('imageUrl'), async (req, res) => {
  try {
    // Log the incoming data to debug
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    // Create the base postData object
    const postData = {
      createdAt: req.body.createdAt,
      createdBy: req.body.createdBy,
      content: req.body.content || '',  // Set default empty string if not provided
      code: req.body.code || '',         // Set default empty string if not provided
      hashtags: req.body.hashtags || []  // Set default empty array if not provided
    };

    // Handle image upload if present
    if (req.file && req.file.path) {
      try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path);
        postData.imageUrl = uploadResult.secure_url;
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error('Error uploading to cloudinary:', uploadError);
        return res.status(400).json({ message: 'Image upload failed' });
      }
    }

    // Create the post
    const post = await Post.create(postData);

    // Send response with created post
    res.status(201).json({
      success: true,
      data: post
    });

  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: error.message
    });
  }
});

//delete post 
router.delete('/delete/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByIdAndDelete(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // If the post has an image, delete it from Cloudinary
    if (post.imageUrl) {
      const publicId = path.basename(post.imageUrl).split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

 //edit post
 router.put('/edit/:id', upload.single('imageUrl'), async (req, res) => {
  try {
    const postId = req.params.id;
    const { content, createdAt, createdBy } = req.body;

    const updateData = {
      content,
      createdAt,
      createdBy
    };

    // Check if an image file was uploaded
    if (req.file && req.file.path) {
      const uploadedFile = req.file.path;
      const uploadResult = await cloudinary.uploader.upload(uploadedFile);
      console.log('Upload successful:', uploadResult);
      fs.unlinkSync(uploadedFile);  // Clean up the local file

      // If the post already has an image, delete the old one from Cloudinary
      const post = await Post.findById(postId);
      if (post.imageUrl) {
        const publicId = path.basename(post.imageUrl).split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      updateData.imageUrl = uploadResult.secure_url;
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, updateData, { new: true });

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error('Error editing post:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route for image upload
// router.post('/testi', upload.single('imageUrl'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No image uploaded' });
//     }
//     const uploadResult = await cloudinary.uploader.upload(req.file.path);
//     console.log('Upload successful:', uploadResult);
//     fs.unlinkSync(req.file.path);
//     res.status(200).json({ imageUrl: uploadResult.secure_url });
//   } catch (error) {
//     console.error('Upload error:', error);
//     res.status(500).json({ message: 'Image Upload Failed' });
//   }
// });

//get posts
router.get('/get' , async (req,res) => {
     try {
        const post =await Post.find()
        .populate('createdBy')
        .populate('likes')
        .sort({createdAt:-1})
        res.json(post);
        
     } catch (error) {
        res.status(500).json({msg : error});
     }
}) 
router.put('/like/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId, isLike } = req.body;

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Initialize likes array if not present
    if (!post.likes) {
      post.likes = [];
    }

    // Update likes array
    if (isLike) {
      if (!post.likes.includes(userId)) {
        post.likes.push(userId);
      }
    } else {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    }

    // Save the updated post
    const updatedPost = await post.save();

    // Find the owner (receiver) of the post
    const receiverId = post.createdBy; // Assuming `post.userId` is the ID of the post owner
    console.log("reciver",receiverId)
    const liker = await User.findById(userId); // Get the user who liked the post
    console.log("liker",liker)
    if (!liker) {
      return res.status(404).json({ message: 'Liker user not found' });
    }

    // Create a notification for the receiver
    if (isLike) {
      const notification = new Notification({
        userId: receiverId, // The receiver of the notification
        postId,
        message: `${liker.name} liked your post!`,
      });
      await notification.save();

      // Emit the notification to the receiver via Socket.io
      req.io.emit('newNotification', {
        userId: receiverId,
        message: `${liker.name} liked your post!`,
        postId,
      });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.get('/notifications/:userId', async (req, res) => {
  try {
    // const userId = mongoose.Types.ObjectId(req.params.userId);
    const notifications = await Notification.find({ userId:req.params.userId })
    .sort({ createdAt: -1 });
    console.log(req.params.userId)

    if (!notifications.length) {
      return res.status(404).json({ message: 'No notifications found' });
    }

    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});


export default router
