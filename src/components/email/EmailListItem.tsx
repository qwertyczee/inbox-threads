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
        'group flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors border-l-2',
        isSelected
          ? 'bg-email-selected border-l-primary'
          : 'border-l-transparent hover:bg-email-hover',
        hasUnread && !isSelected && 'bg-muted/30'
      )}
    >
      {/* Star */}
      <button
        onClick={onToggleStar}
        className={cn(
          'flex-shrink-0 transition-colors',
          thread.isStarred
            ? 'text-email-starred'
            : 'text-muted-foreground/30 hover:text-email-starred'
        )}
      >
        <Star
          className={cn('h-3.5 w-3.5', thread.isStarred && 'fill-current')}
        />
      </button>

      {/* Sender */}
      <span
        className={cn(
          'flex-shrink-0 w-32 truncate text-sm',
          hasUnread ? 'font-semibold text-foreground' : 'text-muted-foreground'
        )}
      >
        {displayName}
      </span>

      {/* Subject & snippet */}
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <span
          className={cn(
            'truncate text-sm',
            hasUnread ? 'font-medium text-foreground' : 'text-muted-foreground'
          )}
        >
          {thread.subject}
        </span>
        <span className="text-muted-foreground/50">—</span>
        <span className="text-sm text-muted-foreground/60 truncate flex-1">
          {thread.snippet}
        </span>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {thread.emails.length > 1 && (
          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-medium">
            {thread.emails.length}
          </span>
        )}
        <span className="text-xs text-muted-foreground tabular-nums">
          {formatDistanceToNow(thread.lastMessageAt, { addSuffix: false })}
        </span>
      </div>
    </div>
  );
}
