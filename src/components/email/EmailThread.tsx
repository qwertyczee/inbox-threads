import { useState } from 'react';
import { EmailThread as EmailThreadType } from '@/types/email';
import { EmailMessage } from './EmailMessage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Star,
  Trash2,
  Archive,
  MoreHorizontal,
  Reply,
  Send,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailThreadViewProps {
  thread: EmailThreadType;
  onBack: () => void;
  onToggleStar: () => void;
  onDelete: () => void;
  onArchive: () => void;
  onReply: (body: string) => void;
}

export function EmailThreadView({
  thread,
  onBack,
  onToggleStar,
  onDelete,
  onArchive,
  onReply,
}: EmailThreadViewProps) {
  const [expandedEmails, setExpandedEmails] = useState<Set<string>>(
    new Set([thread.emails[thread.emails.length - 1]?.id])
  );
  const [isReplying, setIsReplying] = useState(false);
  const [replyBody, setReplyBody] = useState('');

  const toggleEmailExpand = (emailId: string) => {
    setExpandedEmails((prev) => {
      const next = new Set(prev);
      if (next.has(emailId)) {
        next.delete(emailId);
      } else {
        next.add(emailId);
      }
      return next;
    });
  };

  const handleSendReply = () => {
    if (replyBody.trim()) {
      onReply(replyBody);
      setReplyBody('');
      setIsReplying(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold text-foreground truncate max-w-md">
            {thread.subject}
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleStar}
            className={cn(
              thread.isStarred
                ? 'text-email-starred'
                : 'text-muted-foreground hover:text-email-starred'
            )}
          >
            <Star className={cn('h-5 w-5', thread.isStarred && 'fill-current')} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onArchive}
            className="text-muted-foreground hover:text-foreground"
          >
            <Archive className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Thread messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {thread.emails.map((email) => (
          <EmailMessage
            key={email.id}
            email={email}
            isExpanded={expandedEmails.has(email.id)}
            onToggleExpand={() => toggleEmailExpand(email.id)}
          />
        ))}

        {/* Reply section */}
        {isReplying ? (
          <div className="border border-border rounded-lg bg-card p-4 mt-4 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Reply</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsReplying(false)}
                className="h-8 w-8 text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              placeholder="Write your reply..."
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              className="min-h-[120px] resize-none mb-3"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setIsReplying(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendReply}
                disabled={!replyBody.trim()}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setIsReplying(true)}
            className="gap-2 mt-4"
          >
            <Reply className="h-4 w-4" />
            Reply
          </Button>
        )}
      </div>
    </div>
  );
}
