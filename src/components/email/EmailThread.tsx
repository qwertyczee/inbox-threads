import { useState, useEffect, RefObject } from 'react';
import { EmailThread as EmailThreadType } from '@/types/email';
import { EmailMessage } from './EmailMessage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Star,
  Trash2,
  Archive,
  Reply,
  Send,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmailThreadViewProps {
  thread: EmailThreadType;
  onBack: () => void;
  onToggleStar: () => void;
  onDelete: () => void;
  onArchive: () => void;
  onReply: (body: string) => void;
  isReplying?: boolean;
  onToggleReply?: () => void;
  replyInputRef?: RefObject<HTMLTextAreaElement>;
}

export function EmailThreadView({
  thread,
  onBack,
  onToggleStar,
  onDelete,
  onArchive,
  onReply,
  isReplying: externalIsReplying,
  onToggleReply,
  replyInputRef,
}: EmailThreadViewProps) {
  const [expandedEmails, setExpandedEmails] = useState<Set<string>>(
    new Set([thread.emails[thread.emails.length - 1]?.id])
  );
  const [internalIsReplying, setInternalIsReplying] = useState(false);
  const [replyBody, setReplyBody] = useState('');

  const isReplying = externalIsReplying ?? internalIsReplying;
  
  const handleToggleReply = (value?: boolean) => {
    if (onToggleReply) {
      onToggleReply();
    } else {
      setInternalIsReplying(value ?? !internalIsReplying);
    }
  };

  useEffect(() => {
    if (isReplying && replyInputRef?.current) {
      replyInputRef.current.focus();
    }
  }, [isReplying, replyInputRef]);

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
      if (onToggleReply) onToggleReply();
      else setInternalIsReplying(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background flex-1">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground gap-2 h-8 px-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="kbd">Esc</span>
          </Button>
          <h2 className="text-base font-semibold text-foreground truncate max-w-xl">
            {thread.subject}
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleStar}
            className={cn(
              'h-8 w-8',
              thread.isStarred
                ? 'text-email-starred'
                : 'text-muted-foreground hover:text-email-starred'
            )}
          >
            <Star className={cn('h-4 w-4', thread.isStarred && 'fill-current')} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onArchive}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <Archive className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Thread messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-2">
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
                onClick={() => handleToggleReply(false)}
                className="h-7 w-7 text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              ref={replyInputRef}
              placeholder="Write your reply..."
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              className="min-h-[100px] resize-none mb-3 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
              autoFocus
            />
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                <span className="kbd">⌘</span> + <span className="kbd">Enter</span> to send
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleReply(false)}
                  className="h-8"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendReply}
                  disabled={!replyBody.trim()}
                  size="sm"
                  className="h-8 gap-2"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => handleToggleReply(true)}
            className="gap-2 mt-4 h-9 border-dashed border-muted-foreground/30 text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
          >
            <Reply className="h-4 w-4" />
            Reply
            <span className="kbd ml-2">R</span>
          </Button>
        )}
      </div>

      {/* Footer shortcuts */}
      <div className="flex items-center justify-center gap-6 px-6 py-3 border-t border-border text-xs text-muted-foreground">
        <span><span className="kbd">R</span> Reply</span>
        <span><span className="kbd">E</span> Archive</span>
        <span><span className="kbd">S</span> Star</span>
        <span><span className="kbd">#</span> Delete</span>
        <span><span className="kbd">Esc</span> Back</span>
      </div>
    </div>
  );
}
