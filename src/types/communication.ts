export interface Message {
  id: string;
  channelId: string;
  senderId: string;
  content: string;
  attachments?: Attachment[];
  createdAt: Date;
  updatedAt?: Date;
  readBy: ReadReceipt[];
  replyTo?: string;
}

export interface Channel {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'department' | 'announcement';
  members: ChannelMember[];
  createdBy: string;
  createdAt: Date;
  isArchived: boolean;
  lastActivity: Date;
}

export interface ChannelMember {
  userId: string;
  role: 'admin' | 'member';
  joinedAt: Date;
  notifications: 'all' | 'mentions' | 'none';
}

export interface Attachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface ReadReceipt {
  userId: string;
  readAt: Date;
}

export interface Notification {
  id: string;
  type: 'message' | 'mention' | 'announcement' | 'system';
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  recipientId: string;
  isRead: boolean;
  createdAt: Date;
  action?: {
    type: string;
    payload: any;
  };
}
