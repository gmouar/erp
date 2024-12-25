import api from './api';
import io from 'socket.io-client';

let socket;

const connectSocket = (userId) => {
  // Initialize socket connection
  socket = io(process.env.REACT_APP_API_URL, {
    query: { userId }
  });

  // Set up event listeners
  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const communicationService = {
  // Messages
  async getMessages(chatId) {
    try {
      const response = await api.get(`/messages/${chatId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  async sendMessage(chatId, message) {
    try {
      const response = await api.post(`/messages/${chatId}`, message);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Channels
  async getChannels() {
    try {
      const response = await api.get('/channels');
      return response.data;
    } catch (error) {
      console.error('Error fetching channels:', error);
      throw error;
    }
  },

  async createChannel(channelData) {
    try {
      const response = await api.post('/channels', channelData);
      return response.data;
    } catch (error) {
      console.error('Error creating channel:', error);
      throw error;
    }
  },

  async updateChannel(channelId, channelData) {
    try {
      const response = await api.put(`/channels/${channelId}`, channelData);
      return response.data;
    } catch (error) {
      console.error('Error updating channel:', error);
      throw error;
    }
  },

  async deleteChannel(channelId) {
    try {
      const response = await api.delete(`/channels/${channelId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting channel:', error);
      throw error;
    }
  },

  // Notifications
  async getNotifications() {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  async markNotificationAsRead(notificationId) {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  async deleteNotification(notificationId) {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Announcements
  async getAnnouncements() {
    try {
      const response = await api.get('/announcements');
      return response.data;
    } catch (error) {
      console.error('Error fetching announcements:', error);
      throw error;
    }
  },

  async createAnnouncement(announcementData) {
    try {
      const response = await api.post('/announcements', announcementData);
      return response.data;
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  },

  async updateAnnouncement(announcementId, announcementData) {
    try {
      const response = await api.put(`/announcements/${announcementId}`, announcementData);
      return response.data;
    } catch (error) {
      console.error('Error updating announcement:', error);
      throw error;
    }
  },

  async deleteAnnouncement(announcementId) {
    try {
      const response = await api.delete(`/announcements/${announcementId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw error;
    }
  },

  // File handling
  async uploadFile(file, chatId) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post(`/messages/${chatId}/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Real-time communication
  connectToSocket(userId) {
    return connectSocket(userId);
  },

  disconnectFromSocket() {
    disconnectSocket();
  },

  // Message events
  onNewMessage(callback) {
    if (socket) {
      socket.on('new_message', callback);
    }
  },

  // Channel events
  onChannelUpdate(callback) {
    if (socket) {
      socket.on('channel_update', callback);
    }
  },

  // Notification events
  onNewNotification(callback) {
    if (socket) {
      socket.on('new_notification', callback);
    }
  },

  // Announcement events
  onNewAnnouncement(callback) {
    if (socket) {
      socket.on('new_announcement', callback);
    }
  },

  // User presence
  updateUserPresence(status) {
    if (socket) {
      socket.emit('update_presence', status);
    }
  },

  onUserPresenceUpdate(callback) {
    if (socket) {
      socket.on('presence_update', callback);
    }
  }
};

export default communicationService;
