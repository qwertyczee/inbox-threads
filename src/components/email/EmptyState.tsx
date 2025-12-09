import { Mail } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-muted/20 text-center p-8">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Mail className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">
        Select an email to read
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Choose an email from the list on the left to view its contents and continue the conversation.
      </p>
    </div>
  );
}
