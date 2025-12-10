import { useState, useEffect, useCallback, useRef } from 'react';
import { EmailSidebar } from '@/components/email/EmailSidebar';
import { EmailList } from '@/components/email/EmailList';
import { EmailThreadView } from '@/components/email/EmailThread';
import { ComposeEmail } from '@/components/email/ComposeEmail';
import { EmptyState } from '@/components/email/EmptyState';
import { EmailThread, FolderType } from '@/types/email';
import {
  getThreads,
  getFolderCountsApi,
  markThreadAsRead,
  toggleThreadStar,
  moveThreadToFolder,
  sendEmail,
  searchThreads,
} from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';

const Index = () => {
  const [currentFolder, setCurrentFolder] = useState<FolderType>('inbox');
  const [threads, setThreads] = useState<EmailThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<EmailThread | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [folderCounts, setFolderCounts] = useState<Record<FolderType, number>>({
    inbox: 0,
    sent: 0,
    drafts: 0,
    spam: 0,
    trash: 0,
    starred: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);

  // Fetch threads and counts
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [threadsData, countsData] = await Promise.all([
        getThreads(currentFolder),
        getFolderCountsApi(),
      ]);
      setThreads(threadsData);
      setFolderCounts(countsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch emails',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentFolder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset selected index when threads change
  useEffect(() => {
    setSelectedIndex(0);
  }, [threads]);

  // Handle folder change
  const handleFolderChange = (folder: FolderType) => {
    setCurrentFolder(folder);
    setSelectedThread(null);
    setSelectedIndex(0);
  };

  // Handle thread selection
  const handleSelectThread = async (thread: EmailThread) => {
    setSelectedThread(thread);
    setIsReplying(false);
    const index = threads.findIndex((t) => t.id === thread.id);
    if (index !== -1) setSelectedIndex(index);
    
    if (thread.unreadCount > 0) {
      await markThreadAsRead(thread.id);
      setThreads((prev) =>
        prev.map((t) =>
          t.id === thread.id
            ? { ...t, unreadCount: 0, emails: t.emails.map((e) => ({ ...e, isRead: true })) }
            : t
        )
      );
      setFolderCounts((prev) => ({
        ...prev,
        [currentFolder]: Math.max(0, prev[currentFolder] - thread.unreadCount),
      }));
    }
  };

  // Handle star toggle
  const handleToggleStar = async (threadId: string) => {
    try {
      const updatedThread = await toggleThreadStar(threadId);
      setThreads((prev) =>
        prev.map((t) => (t.id === threadId ? updatedThread : t))
      );
      if (selectedThread?.id === threadId) {
        setSelectedThread(updatedThread);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update star',
        variant: 'destructive',
      });
    }
  };

  // Handle delete (move to trash)
  const handleDelete = async () => {
    if (!selectedThread) return;
    try {
      await moveThreadToFolder(selectedThread.id, 'trash');
      setThreads((prev) => prev.filter((t) => t.id !== selectedThread.id));
      setSelectedThread(null);
      toast({
        title: 'Moved to Trash',
        description: 'Email has been moved to trash',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete email',
        variant: 'destructive',
      });
    }
  };

  // Handle archive
  const handleArchive = async () => {
    if (!selectedThread) return;
    setThreads((prev) => prev.filter((t) => t.id !== selectedThread.id));
    setSelectedThread(null);
    toast({
      title: 'Archived',
      description: 'Email has been archived',
    });
  };

  // Handle reply
  const handleReply = async (body: string) => {
    if (!selectedThread) return;
    try {
      const lastEmail = selectedThread.emails[selectedThread.emails.length - 1];
      const recipient = lastEmail.from.email;
      
      await sendEmail({
        to: recipient,
        subject: `Re: ${selectedThread.subject}`,
        body,
        replyToThreadId: selectedThread.id,
      });
      
      const updatedThreads = await getThreads(currentFolder);
      setThreads(updatedThreads);
      const updated = updatedThreads.find((t) => t.id === selectedThread.id);
      if (updated) setSelectedThread(updated);
      setIsReplying(false);
      
      toast({
        title: 'Reply sent',
        description: 'Your reply has been sent successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send reply',
        variant: 'destructive',
      });
    }
  };

  // Handle compose
  const handleSendEmail = async (data: { to: string; subject: string; body: string }) => {
    try {
      await sendEmail(data);
      setIsComposeOpen(false);
      toast({
        title: 'Email sent',
        description: 'Your email has been sent successfully',
      });
      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send email',
        variant: 'destructive',
      });
    }
  };

  // Handle search
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      fetchData();
      return;
    }
    setIsLoading(true);
    try {
      const results = await searchThreads(query);
      setThreads(results);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Search failed',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onNavigateNext: () => {
      if (selectedThread) return;
      setSelectedIndex((prev) => Math.min(prev + 1, threads.length - 1));
    },
    onNavigatePrev: () => {
      if (selectedThread) return;
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    },
    onCompose: () => setIsComposeOpen(true),
    onReply: () => {
      if (selectedThread) {
        setIsReplying(true);
        setTimeout(() => replyInputRef.current?.focus(), 100);
      }
    },
    onArchive: handleArchive,
    onDelete: handleDelete,
    onEscape: () => {
      if (isComposeOpen) {
        setIsComposeOpen(false);
      } else if (isReplying) {
        setIsReplying(false);
      } else if (selectedThread) {
        setSelectedThread(null);
      }
    },
    onOpenThread: () => {
      if (threads[selectedIndex]) {
        handleSelectThread(threads[selectedIndex]);
      }
    },
    onGoToInbox: () => handleFolderChange('inbox'),
    onSearch: () => searchInputRef.current?.focus(),
    isComposeOpen,
    hasSelectedThread: !!selectedThread,
  });

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <EmailSidebar
        currentFolder={currentFolder}
        onFolderChange={handleFolderChange}
        folderCounts={folderCounts}
        onCompose={() => setIsComposeOpen(true)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main content */}
      {selectedThread ? (
        <EmailThreadView
          thread={selectedThread}
          onBack={() => setSelectedThread(null)}
          onToggleStar={() => handleToggleStar(selectedThread.id)}
          onDelete={handleDelete}
          onArchive={handleArchive}
          onReply={handleReply}
          isReplying={isReplying}
          onToggleReply={() => setIsReplying(!isReplying)}
          replyInputRef={replyInputRef}
        />
      ) : (
        <EmailList
          threads={threads}
          selectedThreadId={null}
          onSelectThread={handleSelectThread}
          onToggleStar={handleToggleStar}
          currentFolder={currentFolder}
          isLoading={isLoading}
          onRefresh={fetchData}
          onSearch={handleSearch}
          selectedIndex={selectedIndex}
          searchInputRef={searchInputRef}
        />
      )}

      {/* Compose Modal */}
      <ComposeEmail
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onSend={handleSendEmail}
      />
    </div>
  );
};

export default Index;
