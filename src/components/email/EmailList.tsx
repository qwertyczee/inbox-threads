import { EmailThread, FolderType } from '@/types/email';
import { EmailListItem } from './EmailListItem';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState, RefObject, useEffect, useRef } from 'react';

export interface EmailListProps {
  threads: EmailThread[];
  selectedThreadId: string | null;
  onSelectThread: (thread: EmailThread) => void;
  onToggleStar: (threadId: string) => void;
  currentFolder: FolderType;
  isLoading?: boolean;
  onRefresh?: () => void;
  onSearch?: (query: string) => void;
  selectedIndex?: number;
  searchInputRef?: RefObject<HTMLInputElement>;
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
  onSearch,
  selectedIndex = 0,
  searchInputRef,
}: EmailListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll selected item into view
  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <div className="flex flex-col h-full bg-background border-r border-border flex-1">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">
          {folderTitles[currentFolder]}
        </h2>
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </form>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="kbd">/</span>
          <span>to search</span>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
              Loading...
            </div>
          </div>
        ) : threads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <p className="text-sm">No emails</p>
            <p className="text-xs mt-1">Press <span className="kbd">C</span> to compose</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {threads.map((thread, index) => (
              <div 
                key={thread.id} 
                ref={(el) => (itemRefs.current[index] = el)}
                className="relative group"
              >
                <EmailListItem
                  thread={thread}
                  isSelected={selectedThreadId === thread.id || index === selectedIndex}
                  onSelect={() => onSelectThread(thread)}
                  onToggleStar={(e) => {
                    e.stopPropagation();
                    onToggleStar(thread.id);
                  }}
                />
                {/* Row shortcut hint */}
                <span className="absolute right-3 top-1/2 -translate-y-1/2 kbd opacity-0 group-hover:opacity-100 transition-opacity">
                  {index + 1 <= 9 ? index + 1 : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer shortcuts */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span><span className="kbd">J</span> next</span>
          <span><span className="kbd">K</span> prev</span>
          <span><span className="kbd">O</span> open</span>
        </div>
        <div className="flex items-center gap-3">
          <span><span className="kbd">E</span> archive</span>
          <span><span className="kbd">#</span> delete</span>
        </div>
      </div>
    </div>
  );
}
