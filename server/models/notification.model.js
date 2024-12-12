import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    message: String,
    createdAt: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
