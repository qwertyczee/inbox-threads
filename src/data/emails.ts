import { Email, EmailThread, Folder, FolderType } from '@/types/email';

// Mock user
export const currentUser = {
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  avatar: undefined,
};

// Folders configuration
export const folders: Folder[] = [
  { id: 'inbox', name: 'Inbox', icon: 'Inbox' },
  { id: 'starred', name: 'Starred', icon: 'Star' },
  { id: 'sent', name: 'Sent', icon: 'Send' },
  { id: 'drafts', name: 'Drafts', icon: 'File' },
  { id: 'spam', name: 'Spam', icon: 'AlertCircle' },
  { id: 'trash', name: 'Trash', icon: 'Trash2' },
];

// Mock emails data
const mockEmails: Email[] = [
  {
    id: 'e1',
    threadId: 't1',
    from: { name: 'Sarah Chen', email: 'sarah.chen@company.com' },
    to: [{ name: currentUser.name, email: currentUser.email }],
    subject: 'Q4 Marketing Strategy Review',
    body: `Hi Alex,

I wanted to follow up on our discussion about the Q4 marketing strategy. I've attached the updated proposal with the changes we discussed.

Key highlights:
- Increased budget allocation for digital campaigns
- New influencer partnership opportunities
- Updated timeline for product launches

Let me know your thoughts when you get a chance.

Best,
Sarah`,
    bodyPreview: 'I wanted to follow up on our discussion about the Q4 marketing strategy...',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    isRead: false,
    isStarred: true,
  },
  {
    id: 'e2',
    threadId: 't1',
    from: { name: currentUser.name, email: currentUser.email },
    to: [{ name: 'Sarah Chen', email: 'sarah.chen@company.com' }],
    subject: 'Re: Q4 Marketing Strategy Review',
    body: `Thanks Sarah,

This looks great! I particularly like the influencer partnership ideas. Can we schedule a call tomorrow to discuss the budget details?

Alex`,
    bodyPreview: 'This looks great! I particularly like the influencer partnership ideas...',
    timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 min ago
    isRead: true,
    isStarred: false,
  },
  {
    id: 'e3',
    threadId: 't1',
    from: { name: 'Sarah Chen', email: 'sarah.chen@company.com' },
    to: [{ name: currentUser.name, email: currentUser.email }],
    subject: 'Re: Q4 Marketing Strategy Review',
    body: `Sounds perfect! How about 2pm? I'll send over a calendar invite.

Sarah`,
    bodyPreview: 'Sounds perfect! How about 2pm?...',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
    isRead: false,
    isStarred: false,
  },
  {
    id: 'e4',
    threadId: 't2',
    from: { name: 'Mike Rodriguez', email: 'mike.r@techstartup.io' },
    to: [{ name: currentUser.name, email: currentUser.email }],
    subject: 'Partnership Opportunity',
    body: `Hello Alex,

I hope this email finds you well. I'm reaching out because I believe there's a great opportunity for our companies to collaborate.

We've developed a new AI-powered analytics tool that could complement your existing product suite. Would you be open to a brief call to explore potential synergies?

Looking forward to hearing from you.

Best regards,
Mike Rodriguez
CEO, TechStartup.io`,
    bodyPreview: "I hope this email finds you well. I'm reaching out because I believe there's a great opportunity...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: false,
    isStarred: false,
  },
  {
    id: 'e5',
    threadId: 't3',
    from: { name: 'Emily Watson', email: 'emily.watson@design.co' },
    to: [{ name: currentUser.name, email: currentUser.email }],
    subject: 'Design Review: New Dashboard Mockups',
    body: `Hi Alex,

The design team has completed the first round of mockups for the new dashboard. I've attached the Figma links below for your review.

Please take a look and let us know if there are any changes or adjustments needed before we move to the next phase.

Thanks!
Emily`,
    bodyPreview: 'The design team has completed the first round of mockups for the new dashboard...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    isRead: true,
    isStarred: true,
  },
  {
    id: 'e6',
    threadId: 't4',
    from: { name: 'James Miller', email: 'j.miller@investors.com' },
    to: [{ name: currentUser.name, email: currentUser.email }],
    subject: 'Series B Discussion Follow-up',
    body: `Alex,

Thank you for the presentation yesterday. The team was impressed with your growth metrics and product roadmap.

We'd like to schedule a follow-up meeting to discuss terms. Please let me know your availability next week.

James Miller
Partner, Investors Capital`,
    bodyPreview: 'Thank you for the presentation yesterday. The team was impressed...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: true,
    isStarred: true,
  },
  {
    id: 'e7',
    threadId: 't5',
    from: { name: 'Newsletter', email: 'news@techweekly.com' },
    to: [{ name: currentUser.name, email: currentUser.email }],
    subject: 'This week in tech: AI breakthroughs and more',
    body: `Weekly digest of tech news...`,
    bodyPreview: 'Weekly digest of tech news...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    isRead: true,
    isStarred: false,
  },
  {
    id: 'e8',
    threadId: 't6',
    from: { name: 'Spam Bot', email: 'winner@lottery-fake.com' },
    to: [{ name: currentUser.name, email: currentUser.email }],
    subject: 'You won $1,000,000!!!',
    body: `Congratulations! You've been selected...`,
    bodyPreview: "Congratulations! You've been selected...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
    isRead: false,
    isStarred: false,
  },
  {
    id: 'e9',
    threadId: 't7',
    from: { name: currentUser.name, email: currentUser.email },
    to: [{ name: 'Team', email: 'team@company.com' }],
    subject: 'Team Offsite Planning',
    body: `Hi everyone,

I wanted to start the conversation about our upcoming team offsite. Please share your availability for the last week of November.

Thanks,
Alex`,
    bodyPreview: 'I wanted to start the conversation about our upcoming team offsite...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    isRead: true,
    isStarred: false,
  },
];

// Generate threads from emails
export const generateThreads = (): EmailThread[] => {
  const threadMap = new Map<string, Email[]>();
  
  mockEmails.forEach(email => {
    const existing = threadMap.get(email.threadId) || [];
    threadMap.set(email.threadId, [...existing, email]);
  });

  const threads: EmailThread[] = [];
  
  threadMap.forEach((emails, threadId) => {
    const sortedEmails = emails.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const lastEmail = sortedEmails[sortedEmails.length - 1];
    const firstEmail = sortedEmails[0];
    
    // Determine folder based on threadId for demo purposes
    let folder: FolderType = 'inbox';
    if (threadId === 't6') folder = 'spam';
    if (threadId === 't7') folder = 'sent';
    
    const participants = Array.from(
      new Map(
        emails.flatMap(e => [e.from, ...e.to]).map(p => [p.email, p])
      ).values()
    );

    threads.push({
      id: threadId,
      subject: firstEmail.subject.replace(/^Re: /, ''),
      participants,
      emails: sortedEmails,
      folder,
      isStarred: emails.some(e => e.isStarred),
      lastMessageAt: lastEmail.timestamp,
      snippet: lastEmail.bodyPreview,
      unreadCount: emails.filter(e => !e.isRead).length,
    });
  });

  return threads.sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
};

export const mockThreads = generateThreads();

// Helper to get folder counts
export const getFolderCounts = (threads: EmailThread[]): Record<FolderType, number> => {
  const counts: Record<FolderType, number> = {
    inbox: 0,
    sent: 0,
    drafts: 0,
    spam: 0,
    trash: 0,
    starred: 0,
  };

  threads.forEach(thread => {
    if (thread.folder !== 'trash') {
      counts[thread.folder] += thread.unreadCount;
    }
    if (thread.isStarred) {
      counts.starred += thread.unreadCount;
    }
  });

  return counts;
};
