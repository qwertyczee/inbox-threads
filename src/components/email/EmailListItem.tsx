import { cn } from '@/lib/utils';
import { EmailThread } from '@/types/email';
import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface EmailListItemProps {
  thread: EmailThread;
  isSelected: boolean;
  onSelect: () => void;
  onToggleStar: (e: React.MouseEvent) => void;
}

export function EmailListItem({
  thread,
  isSelected,
  onSelect,
  onToggleStar,
}: EmailListItemProps) {
  const hasUnread = thread.unreadCount > 0;
  const displayName = thread.participants[0]?.name || 'Unknown';

  return (
    <div
      onClick={onSelect}
      className={cn(
        'group flex items-center gap-2 px-3 py-2 cursor-pointer border-b border-border/50 transition-colors',
        isSelected
          ? 'bg-primary/10'
          : 'hover:bg-muted/50',
        hasUnread && 'bg-primary/5'
      )}
    >
      {/* Star button */}
      <button
        onClick={onToggleStar}
        className={cn(
          'flex-shrink-0 p-0.5 transition-colors',
          thread.isStarred
            ? 'text-email-starred'
            : 'text-muted-foreground/30 hover:text-email-starred'
        )}
      >
        <Star
          className={cn('h-3.5 w-3.5', thread.isStarred && 'fill-current')}
        />
      </button>

      {/* Content - single line */}
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <span
          className={cn(
            'flex-shrink-0 text-sm truncate max-w-[120px]',
            hasUnread ? 'font-semibold text-foreground' : 'text-muted-foreground'
          )}
        >
          {displayName}
        </span>
        
        {thread.emails.length > 1 && (
          <span className="flex-shrink-0 text-[10px] text-muted-foreground bg-muted px-1 rounded">
            {thread.emails.length}
          </span>
        )}

        <span className="text-muted-foreground/50 flex-shrink-0">·</span>
        
        <span
          className={cn(
            'text-sm truncate',
            hasUnread ? 'font-medium text-foreground' : 'text-muted-foreground'
          )}
        >
          {thread.subject}
        </span>
      </div>

      <span className="flex-shrink-0 text-[11px] text-muted-foreground">
        {formatDistanceToNow(thread.lastMessageAt, { addSuffix: false })}
      </span>
    </div>
  );
}
