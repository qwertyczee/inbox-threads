import { Inbox } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background text-center p-8">
      <Inbox className="h-12 w-12 text-muted-foreground/30 mb-4" strokeWidth={1} />
      <h3 className="text-lg font-medium text-foreground mb-2">
        Inbox Zero
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">
        You've processed all your emails. Time to focus on what matters.
      </p>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span><span className="kbd">C</span> Compose</span>
        <span><span className="kbd">G I</span> Inbox</span>
        <span><span className="kbd">?</span> Help</span>
      </div>
    </div>
  );
}
