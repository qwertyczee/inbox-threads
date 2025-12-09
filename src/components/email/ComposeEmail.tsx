import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Minus, Send, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComposeEmailProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: { to: string; subject: string; body: string }) => void;
}

export function ComposeEmail({ isOpen, onClose, onSend }: ComposeEmailProps) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    if (to && body) {
      onSend({ to, subject, body });
      setTo('');
      setSubject('');
      setBody('');
    }
  };

  const handleClose = () => {
    setTo('');
    setSubject('');
    setBody('');
    setIsMinimized(false);
    onClose();
  };

  return (
    <div
      className={cn(
        'fixed bg-card border border-border shadow-2xl z-50 flex flex-col transition-all duration-200',
        isMinimized
          ? 'bottom-0 right-4 w-72 h-12 rounded-t-lg'
          : 'bottom-4 right-4 w-[560px] rounded-lg'
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between px-4 bg-muted/50 border-b border-border cursor-pointer',
          isMinimized ? 'py-3 rounded-t-lg' : 'py-2.5'
        )}
        onClick={() => isMinimized && setIsMinimized(false)}
      >
        <span className="text-sm font-medium text-foreground">
          {subject || 'New Message'}
        </span>
        <div className="flex items-center gap-1">
          {!isMinimized && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(true)}
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
            >
              <Minus className="h-4 w-4" />
            </Button>
          )}
          {isMinimized && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(false);
              }}
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Body */}
      {!isMinimized && (
        <div className="flex flex-col flex-1 p-4 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground w-12">To</span>
            <Input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="flex-1 h-8 bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground w-12">Subject</span>
            <Input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="flex-1 h-8 bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
            />
          </div>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message..."
            className="flex-1 min-h-[200px] resize-none bg-transparent border-0 px-0 focus-visible:ring-0 text-sm"
          />
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="text-xs text-muted-foreground">
              <span className="kbd">⌘</span> + <span className="kbd">Enter</span> to send
            </div>
            <Button
              onClick={handleSend}
              disabled={!to || !body}
              size="sm"
              className="gap-2 h-8"
            >
              <Send className="h-3.5 w-3.5" />
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
