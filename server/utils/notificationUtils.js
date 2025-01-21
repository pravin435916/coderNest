// utils/notificationUtils.js
import { createNotification } from '../routes/notifications.js';

export const sendNotification = async (req, type, senderId, recipientId, text, postId = null) => {
  try {
    // Create notification in database
    const notification = await createNotification(
      type,
      senderId,
      recipientId,
      text,
      postId
    );

    if (notification) {
      // Populate sender details for real-time notification
      const populatedNotification = await notification.populate('sender', 'name image');
      
      // Send real-time notification if user is connected
      if (req.io && req.connectedUsers.has(recipientId.toString())) {
        const socketId = req.connectedUsers.get(recipientId.toString());
        req.io.to(socketId).emit('notification', {
          notification: populatedNotification,
          type,
          text
        });
      }
    }

    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
    return null;
  }
};