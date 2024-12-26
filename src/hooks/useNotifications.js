import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      // This would be replaced with actual API call
      const mockNotifications = [
        {
          id: '1',
          type: 'message',
          title: 'New Message',
          content: 'You have a new message from HR',
          priority: 'medium',
          recipientId: user?.id,
          isRead: false,
          createdAt: new Date(),
          action: {
            type: 'navigate',
            payload: '/communication'
          }
        },
        {
          id: '2',
          type: 'announcement',
          title: 'System Update',
          content: 'System maintenance scheduled for tonight',
          priority: 'high',
          recipientId: user?.id,
          isRead: false,
          createdAt: new Date(),
          action: {
            type: 'modal',
            payload: 'maintenance-details'
          }
        }
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      // This would be replaced with actual API call
      setNotifications(notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // This would be replaced with actual API call
      setNotifications(notifications.map(notification => ({
        ...notification,
        isRead: true
      })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const clearNotification = async (notificationId) => {
    try {
      // This would be replaced with actual API call
      const updatedNotifications = notifications.filter(
        notification => notification.id !== notificationId
      );
      setNotifications(updatedNotifications);
      setUnreadCount(updatedNotifications.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Error clearing notification:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    refreshNotifications: fetchNotifications
  };
};

export default useNotifications;
