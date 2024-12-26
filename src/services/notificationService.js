import { createService } from '../utils/serviceFactory';
import { db } from '../config/firebase';

const notificationsCollection = createService('notifications');

class NotificationService {
  async sendNotification({ userId, type, message, priority = 'medium', title = '' }) {
    try {
      const notification = {
        recipientId: userId,
        type,
        content: message,
        title: title || this._generateTitle(type),
        priority,
        isRead: false,
        createdAt: new Date()
      };

      await notificationsCollection.create(notification);
      this._triggerNotificationEvent(notification);

      return notification;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  async markAsRead(notificationId) {
    return notificationsCollection.update(notificationId, {
      isRead: true
    });
  }

  async getUserNotifications(userId) {
    return notificationsCollection.query(
      ref => ref.where('recipientId', '==', userId)
        .orderBy('createdAt', 'desc')
    );
  }

  async deleteNotification(notificationId) {
    return notificationsCollection.delete(notificationId);
  }

  // Changed from private to regular method with underscore prefix
  _generateTitle(type) {
    const titles = {
      'application_received': 'Application Received',
      'application_status': 'Application Status Update',
      'interview_scheduled': 'Interview Scheduled',
      'message': 'New Message',
      'mention': 'New Mention',
      'announcement': 'New Announcement',
      'system': 'System Notification'
    };

    return titles[type] || 'Notification';
  }

  // Changed from private to regular method with underscore prefix
  _triggerNotificationEvent(notification) {
    // Dispatch custom event for real-time updates
    const event = new CustomEvent('notification', { detail: notification });
    window.dispatchEvent(event);

    // If we have a service worker, send push notification
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      // TODO: Implement push notification logic
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;

export const sendNotification = async (notificationData) => {
  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...notificationData,
        timestamp: new Date().toISOString(),
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('Notification sending failed:', error);
    throw error;
  }
};
