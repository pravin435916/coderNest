import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { backendApi } from '../Url';

// Create the Notification Context
const NotificationContext = createContext();

// Create the Notification Provider Component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Initialize Socket.io
  const socket = io('http://localhost:5000'); // Replace with your backend URL

  // Fetch Notifications
  const fetchNotifications = async (userId) => {
    try {
      const response = await axios.get(`${backendApi}/api/post/notifications/${userId}`);
      setNotifications(response.data);
      setUnreadCount(response.data.filter((n) => !n.read).length); // Assuming `read` is a field in your notification schema
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) => ({ ...n, read: true }))
    );
    setUnreadCount(0);
  };

  // Add new notification
  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  useEffect(() => {
    // Listen for new notifications via Socket.io
    socket.on('newNotification', (message) => {
      console.log('New notification:', message);
      addNotification(message);
    });

    // Handle socket connection error
    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    // Cleanup
    return () => {
      socket.off('newNotification');
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom Hook to use the Notification Context
export const useNotifications = () => useContext(NotificationContext);
