import { Email } from '@/types/email';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { currentUser } from '@/data/emails';

interface EmailMessageProps {
  email: Email;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function EmailMessage({ email, isExpanded, onToggleExpand }: EmailMessageProps) {
  const isFromCurrentUser = email.from.email === currentUser.email;

  return (
    <div
      className={cn(
        'border border-border rounded-lg bg-card transition-all',
        isExpanded ? 'shadow-sm' : 'hover:bg-email-hover cursor-pointer'
      )}
    >
      {/* Header */}
      <div
        onClick={() => !isExpanded && onToggleExpand()}
        className={cn(
          'flex items-start gap-3 p-4',
          !isExpanded && 'cursor-pointer'
        )}
      >
        {/* Avatar */}
        <div
          className={cn(
            'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium',
            isFromCurrentUser
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {email.from.name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">
                {email.from.name}
              </span>
              {isFromCurrentUser && (
                <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                  You
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {format(email.timestamp, 'MMM d, yyyy, h:mm a')}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground">
            to {email.to.map(t => t.name || t.email).join(', ')}
          </p>

          {!isExpanded && (
            <p className="text-sm text-muted-foreground mt-1 truncate">
              {email.bodyPreview}
            </p>
          )}
        </div>
      </div>

      {/* Body */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0">
          <div className="pl-[52px]">
            <div className="prose prose-sm max-w-none text-foreground">
              {email.body.split('\n').map((line, i) => (
                <p key={i} className={cn('my-2', !line.trim() && 'my-4')}>
                  {line || '\u00A0'}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
