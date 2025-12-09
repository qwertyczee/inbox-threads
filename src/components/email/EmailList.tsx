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
    <div className="flex flex-col h-full bg-background border-r border-border w-72">
      {/* Header with search */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="search"
              placeholder={`Search ${folderTitles[currentFolder].toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 h-8 text-sm bg-muted/50 border-0 focus-visible:ring-1"
            />
          </div>
        </form>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          disabled={isLoading}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-20">
            <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : threads.length === 0 ? (
          <div className="flex items-center justify-center h-20 text-muted-foreground">
            <p className="text-xs">No emails</p>
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
