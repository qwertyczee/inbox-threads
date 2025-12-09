import { Email } from '@/types/email';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { currentUser } from '@/data/emails';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
        isExpanded ? '' : 'hover:bg-email-hover cursor-pointer'
      )}
    >
      {/* Header */}
      <div
        onClick={() => !isExpanded && onToggleExpand()}
        className={cn(
          'flex items-start gap-3 px-4 py-3',
          !isExpanded && 'cursor-pointer'
        )}
      >
        {/* Avatar */}
        <div
          className={cn(
            'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium',
            isFromCurrentUser
              ? 'bg-primary/20 text-primary'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {email.from.name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-foreground">
                {email.from.name}
              </span>
              {isFromCurrentUser && (
                <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-medium">
                  You
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {format(email.timestamp, 'MMM d, h:mm a')}
              </span>
              {isExpanded && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExpand();
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
              )}
              {!isExpanded && (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            to {email.to.map(t => t.name || t.email).join(', ')}
          </p>

          {!isExpanded && (
            <p className="text-sm text-muted-foreground/70 mt-1 truncate">
              {email.bodyPreview}
            </p>
          )}
        </div>
      </div>

      {/* Body */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 animate-fade-in">
          <div className="pl-11">
            <div className="text-sm text-foreground leading-relaxed">
              {email.body.split('\n').map((line, i) => (
                <p key={i} className={cn('my-1.5', !line.trim() && 'my-3')}>
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
