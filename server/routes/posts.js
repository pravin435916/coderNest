import express from 'express';
import Post from '../models/posts.model.js';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv'
dotenv.config()
import { fileURLToPath } from 'url';

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
    const { content, createdAt, createdBy } = req.body;

    // Check if an image file was uploaded (optional)
    let imageUrl = '';
    if (req.file && req.file.path) {
      const uploadedFile = req.file.path;
      const uploadResult = await cloudinary.uploader.upload(uploadedFile);
      console.log('Upload successful:', uploadResult);
      fs.unlinkSync(uploadedFile);  // Clean up the local file
      imageUrl = uploadResult.secure_url;
    }

    const post = await Post.create({
      content,
      createdAt,
      imageUrl,
      createdBy
    });
     console.log(imageUrl)
    res.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
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
router.put('/like/:id' , async (req,res) => {
    try {
        const id = req.params.id;
        const data  = {
         userId:req.body.userId,
         isLike:req.body.isLike
        }
        const post = await Post.findById(id)
        if(!post.likes) {
         const updatePost = await Post.findByIdAndUpdate(id,{likes:[]},{upsert:true})
         await updatePost.save()
        }
        const updatedPost = await Post.findById(id);
        data.isLike ? updatedPost.likes.push(data.userId) : updatedPost.likes.pop(data.userId)
        const result = await updatedPost.save()
        res.json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
}) 


export default router
