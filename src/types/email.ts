export interface Email {
  id: string;
  threadId: string;
  from: {
    name: string;
    email: string;
    avatar?: string;
  };
  to: {
    name: string;
    email: string;
  }[];
  subject: string;
  body: string;
  bodyPreview: string;
  timestamp: Date;
  isRead: boolean;
  isStarred: boolean;
  attachments?: {
    id: string;
    name: string;
    size: number;
    type: string;
  }[];
}

export interface EmailThread {
  id: string;
  subject: string;
  participants: {
    name: string;
    email: string;
    avatar?: string;
  }[];
  emails: Email[];
  folder: FolderType;
  isStarred: boolean;
  lastMessageAt: Date;
  snippet: string;
  unreadCount: number;
}

export type FolderType = 'inbox' | 'sent' | 'drafts' | 'spam' | 'trash' | 'starred';

export interface Folder {
  id: FolderType;
  name: string;
  icon: string;
  count?: number;
}

export interface ComposeEmailData {
  to: string;
  subject: string;
  body: string;
  replyToThreadId?: string;
}
