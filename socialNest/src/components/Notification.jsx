import React, { useContext, useEffect } from 'react';
import { useNotifications } from '../context/NotificationProvider';
import { UserContext } from '../context/UserProvider';

const Notification = () => {
   const user = useContext(UserContext);
  const { notifications, fetchNotifications } = useNotifications();

  useEffect(() => {
    fetchNotifications(user._id); // Fetch notifications for the logged-in user
  }, [user._id, fetchNotifications]);

  return (
    <div className="p-4">
      <h2>Notifications</h2>
      <span>{notifications.length}</span>
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <div key={index} className="py-2 border-b">
            {notification.message}
          </div>
        ))
      ) : (
        <p>No notifications available</p>
      )}
    </div>
  );
};

export default Notification;
