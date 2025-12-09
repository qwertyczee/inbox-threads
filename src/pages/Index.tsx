import { useState, useEffect, useCallback } from 'react';
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

const Index = () => {
  const [currentFolder, setCurrentFolder] = useState<FolderType>('inbox');
  const [threads, setThreads] = useState<EmailThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<EmailThread | null>(null);
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

  // Handle folder change
  const handleFolderChange = (folder: FolderType) => {
    setCurrentFolder(folder);
    setSelectedThread(null);
  };

  // Handle thread selection
  const handleSelectThread = async (thread: EmailThread) => {
    setSelectedThread(thread);
    if (thread.unreadCount > 0) {
      await markThreadAsRead(thread.id);
      // Update local state
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

  // Handle archive (for demo, we'll just show a toast)
  const handleArchive = async () => {
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
      
      // Refresh the thread
      const updatedThreads = await getThreads(currentFolder);
      setThreads(updatedThreads);
      const updated = updatedThreads.find((t) => t.id === selectedThread.id);
      if (updated) setSelectedThread(updated);
      
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

      {/* Email List */}
      <EmailList
        threads={threads}
        selectedThreadId={selectedThread?.id || null}
        onSelectThread={handleSelectThread}
        onToggleStar={handleToggleStar}
        currentFolder={currentFolder}
        isLoading={isLoading}
        onRefresh={fetchData}
        onSearch={handleSearch}
      />

      {/* Email Thread View or Empty State */}
      <div className="flex-1 flex">
        {selectedThread ? (
          <EmailThreadView
            thread={selectedThread}
            onBack={() => setSelectedThread(null)}
            onToggleStar={() => handleToggleStar(selectedThread.id)}
            onDelete={handleDelete}
            onArchive={handleArchive}
            onReply={handleReply}
          />
        ) : (
          <EmptyState />
        )}
      </div>

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
