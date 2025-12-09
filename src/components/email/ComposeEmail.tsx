import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send, X, Paperclip, Minimize2, Maximize2 } from 'lucide-react';
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
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!to.trim() || !subject.trim() || !body.trim()) return;
    
    setIsSending(true);
    await onSend({ to, subject, body });
    setIsSending(false);
    
    // Reset form
    setTo('');
    setSubject('');
    setBody('');
  };

  const handleClose = () => {
    setTo('');
    setSubject('');
    setBody('');
    setIsMinimized(false);
    onClose();
  };

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-0 right-6 z-50 animate-slide-in">
        <div
          className="bg-card border border-border rounded-t-lg shadow-lg w-72 cursor-pointer"
          onClick={() => setIsMinimized(false)}
        >
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground rounded-t-lg">
            <span className="font-medium text-sm truncate">
              {subject || 'New Message'}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(false);
                }}
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0">
        <DialogHeader className="px-4 py-3 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-medium">New Message</DialogTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
                onClick={() => setIsMinimized(true)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="p-4 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Label htmlFor="to" className="w-16 text-sm text-muted-foreground">
                To
              </Label>
              <Input
                id="to"
                type="email"
                placeholder="recipient@example.com"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="flex-1 border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
              />
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="subject" className="w-16 text-sm text-muted-foreground">
                Subject
              </Label>
              <Input
                id="subject"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="flex-1 border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
              />
            </div>
          </div>

          <Textarea
            placeholder="Compose your email..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-[200px] resize-none border-0 focus-visible:ring-0 p-0"
          />
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSend}
              disabled={!to.trim() || !subject.trim() || !body.trim() || isSending}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {isSending ? 'Sending...' : 'Send'}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
