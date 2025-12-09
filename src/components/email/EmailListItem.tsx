import { cn } from '@/lib/utils';
import { EmailThread } from '@/types/email';
import { Star, Paperclip } from 'lucide-react';
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
  const lastEmail = thread.emails[thread.emails.length - 1];
  const hasAttachments = thread.emails.some(e => e.attachments && e.attachments.length > 0);

  // Get display name (first participant that's not the current user, or sender)
  const displayName = thread.participants[0]?.name || 'Unknown';
  const participantCount = thread.participants.length;

  return (
    <div
      onClick={onSelect}
      className={cn(
        'group flex items-start gap-3 px-4 py-3 cursor-pointer border-b border-border transition-colors',
        isSelected
          ? 'bg-email-selected'
          : 'hover:bg-email-hover',
        hasUnread && 'bg-background'
      )}
    >
      {/* Star button */}
      <button
        onClick={onToggleStar}
        className={cn(
          'flex-shrink-0 mt-0.5 p-1 rounded-full transition-colors',
          thread.isStarred
            ? 'text-email-starred'
            : 'text-muted-foreground/40 hover:text-email-starred'
        )}
      >
        <Star
          className={cn('h-4 w-4', thread.isStarred && 'fill-current')}
        />
      </button>

      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium',
          hasUnread
            ? 'bg-primary/10 text-primary'
            : 'bg-muted text-muted-foreground'
        )}
      >
        {displayName.charAt(0).toUpperCase()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={cn(
                'truncate text-sm',
                hasUnread ? 'font-semibold text-foreground' : 'text-foreground'
              )}
            >
              {displayName}
            </span>
            {participantCount > 2 && (
              <span className="text-xs text-muted-foreground">
                +{participantCount - 1}
              </span>
            )}
            {thread.emails.length > 1 && (
              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {thread.emails.length}
              </span>
            )}
          </div>
          <span className="flex-shrink-0 text-xs text-muted-foreground">
            {formatDistanceToNow(thread.lastMessageAt, { addSuffix: false })}
          </span>
        </div>

        <div className="mt-0.5">
          <span
            className={cn(
              'text-sm',
              hasUnread ? 'font-medium text-foreground' : 'text-muted-foreground'
            )}
          >
            {thread.subject}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-sm text-muted-foreground truncate flex-1">
            {thread.snippet}
          </p>
          {hasAttachments && (
            <Paperclip className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          )}
        </div>
      </div>
    </div>
  );
}
