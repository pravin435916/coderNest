import express from 'express'
import User from '../models/user.model.js';
import Post from '../models/posts.model.js';
const router = express.Router();


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
router.post('/create' , async (req,res) => {
    try {
        const { content, createdAt, imageUrl,createdBy } = req.body;
        const post = await Post.create({content,createdAt,imageUrl,createdBy})
        res.json(post);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
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
