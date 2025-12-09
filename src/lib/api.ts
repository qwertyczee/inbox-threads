/**
 * API Layer for Email Application
 * 
 * This file contains all API calls for the email application.
 * Currently using mock data, but structured for easy migration to real API.
 * 
 * To switch to real API:
 * 1. Uncomment the axios import
 * 2. Uncomment the axios calls
 * 3. Comment out or remove the mock data returns
 */

// import axios from 'axios';

import { EmailThread, FolderType, ComposeEmailData, Email } from '@/types/email';
import { mockThreads, getFolderCounts, currentUser } from '@/data/emails';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

// Simulated delay for more realistic behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store for mutations (simulating a database)
let threadsStore = [...mockThreads];

/**
 * Fetch all email threads for a specific folder
 */
export async function getThreads(folder: FolderType): Promise<EmailThread[]> {
  await delay(300);

  // Real API call:
  // const response = await axios.get(`${API_BASE_URL}/threads`, {
  //   params: { folder }
  // });
  // return response.data;

  // Mock implementation:
  if (folder === 'starred') {
    return threadsStore.filter(t => t.isStarred && t.folder !== 'trash');
  }
  return threadsStore.filter(t => t.folder === folder);
}

/**
 * Get a single thread by ID
 */
export async function getThread(threadId: string): Promise<EmailThread | null> {
  await delay(200);

  // Real API call:
  // const response = await axios.get(`${API_BASE_URL}/threads/${threadId}`);
  // return response.data;

  // Mock implementation:
  return threadsStore.find(t => t.id === threadId) || null;
}

/**
 * Get folder counts (unread counts)
 */
export async function getFolderCountsApi(): Promise<Record<FolderType, number>> {
  await delay(100);

  // Real API call:
  // const response = await axios.get(`${API_BASE_URL}/folders/counts`);
  // return response.data;

  // Mock implementation:
  return getFolderCounts(threadsStore);
}

/**
 * Mark a thread as read
 */
export async function markThreadAsRead(threadId: string): Promise<void> {
  await delay(100);

  // Real API call:
  // await axios.patch(`${API_BASE_URL}/threads/${threadId}/read`);

  // Mock implementation:
  threadsStore = threadsStore.map(t => {
    if (t.id === threadId) {
      return {
        ...t,
        unreadCount: 0,
        emails: t.emails.map(e => ({ ...e, isRead: true })),
      };
    }
    return t;
  });
}

/**
 * Toggle star on a thread
 */
export async function toggleThreadStar(threadId: string): Promise<EmailThread> {
  await delay(100);

  // Real API call:
  // const response = await axios.patch(`${API_BASE_URL}/threads/${threadId}/star`);
  // return response.data;

  // Mock implementation:
  let updatedThread: EmailThread | null = null;
  threadsStore = threadsStore.map(t => {
    if (t.id === threadId) {
      updatedThread = { ...t, isStarred: !t.isStarred };
      return updatedThread;
    }
    return t;
  });
  
  if (!updatedThread) throw new Error('Thread not found');
  return updatedThread;
}

/**
 * Move thread to a folder (e.g., trash, spam)
 */
export async function moveThreadToFolder(threadId: string, folder: FolderType): Promise<void> {
  await delay(150);

  // Real API call:
  // await axios.patch(`${API_BASE_URL}/threads/${threadId}/move`, { folder });

  // Mock implementation:
  threadsStore = threadsStore.map(t => {
    if (t.id === threadId) {
      return { ...t, folder };
    }
    return t;
  });
}

/**
 * Delete thread permanently
 */
export async function deleteThread(threadId: string): Promise<void> {
  await delay(150);

  // Real API call:
  // await axios.delete(`${API_BASE_URL}/threads/${threadId}`);

  // Mock implementation:
  threadsStore = threadsStore.filter(t => t.id !== threadId);
}

/**
 * Send a new email or reply to a thread
 */
export async function sendEmail(data: ComposeEmailData): Promise<EmailThread> {
  await delay(500);

  // Real API call:
  // const response = await axios.post(`${API_BASE_URL}/emails/send`, data);
  // return response.data;

  // Mock implementation:
  const newEmail: Email = {
    id: `e${Date.now()}`,
    threadId: data.replyToThreadId || `t${Date.now()}`,
    from: { name: currentUser.name, email: currentUser.email },
    to: [{ name: data.to, email: data.to }],
    subject: data.subject,
    body: data.body,
    bodyPreview: data.body.substring(0, 100) + '...',
    timestamp: new Date(),
    isRead: true,
    isStarred: false,
  };

  if (data.replyToThreadId) {
    // Add to existing thread
    threadsStore = threadsStore.map(t => {
      if (t.id === data.replyToThreadId) {
        return {
          ...t,
          emails: [...t.emails, newEmail],
          lastMessageAt: new Date(),
          snippet: newEmail.bodyPreview,
        };
      }
      return t;
    });
    return threadsStore.find(t => t.id === data.replyToThreadId)!;
  } else {
    // Create new thread
    const newThread: EmailThread = {
      id: newEmail.threadId,
      subject: data.subject,
      participants: [
        { name: currentUser.name, email: currentUser.email },
        { name: data.to, email: data.to },
      ],
      emails: [newEmail],
      folder: 'sent',
      isStarred: false,
      lastMessageAt: new Date(),
      snippet: newEmail.bodyPreview,
      unreadCount: 0,
    };
    threadsStore = [newThread, ...threadsStore];
    return newThread;
  }
}

/**
 * Search threads
 */
export async function searchThreads(query: string): Promise<EmailThread[]> {
  await delay(200);

  // Real API call:
  // const response = await axios.get(`${API_BASE_URL}/threads/search`, {
  //   params: { q: query }
  // });
  // return response.data;

  // Mock implementation:
  const lowerQuery = query.toLowerCase();
  return threadsStore.filter(t => 
    t.subject.toLowerCase().includes(lowerQuery) ||
    t.snippet.toLowerCase().includes(lowerQuery) ||
    t.participants.some(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.email.toLowerCase().includes(lowerQuery)
    )
  );
}
