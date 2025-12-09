import { EmailThread, FolderType } from '@/types/email';
import { EmailListItem } from './EmailListItem';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface EmailListProps {
  threads: EmailThread[];
  selectedThreadId: string | null;
  onSelectThread: (thread: EmailThread) => void;
  onToggleStar: (threadId: string) => void;
  currentFolder: FolderType;
  isLoading?: boolean;
  onRefresh?: () => void;
  onSearch?: (query: string) => void;
}

const folderTitles: Record<FolderType, string> = {
  inbox: 'Inbox',
  starred: 'Starred',
  sent: 'Sent',
  drafts: 'Drafts',
  spam: 'Spam',
  trash: 'Trash',
};

export function EmailList({
  threads,
  selectedThreadId,
  onSelectThread,
  onToggleStar,
  currentFolder,
  isLoading,
  onRefresh,
  onSearch,
}: EmailListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <div className="flex flex-col h-full bg-background border-r border-border w-full max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          {folderTitles[currentFolder]}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          disabled={isLoading}
          className="text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>
      </form>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : threads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <p className="text-sm">No emails in {folderTitles[currentFolder].toLowerCase()}</p>
          </div>
        ) : (
          threads.map((thread) => (
            <EmailListItem
              key={thread.id}
              thread={thread}
              isSelected={selectedThreadId === thread.id}
              onSelect={() => onSelectThread(thread)}
              onToggleStar={(e) => {
                e.stopPropagation();
                onToggleStar(thread.id);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
