import { cn } from '@/lib/utils';
import { FolderType } from '@/types/email';
import { folders } from '@/data/emails';
import { Button } from '@/components/ui/button';
import { 
  Inbox, 
  Star, 
  Send, 
  File, 
  AlertCircle, 
  Trash2, 
  Plus,
  Menu
} from 'lucide-react';

const iconMap = {
  Inbox,
  Star,
  Send,
  File,
  AlertCircle,
  Trash2,
};

interface EmailSidebarProps {
  currentFolder: FolderType;
  onFolderChange: (folder: FolderType) => void;
  folderCounts: Record<FolderType, number>;
  onCompose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function EmailSidebar({
  currentFolder,
  onFolderChange,
  folderCounts,
  onCompose,
  isCollapsed = false,
  onToggleCollapse,
}: EmailSidebarProps) {
  return (
    <aside
      className={cn(
        'flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <h1 className="text-xl font-semibold text-foreground">Mail</h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="text-muted-foreground hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-3">
        <Button
          onClick={onCompose}
          className={cn(
            'w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md',
            isCollapsed && 'px-0'
          )}
        >
          <Plus className="h-5 w-5" />
          {!isCollapsed && <span>Compose</span>}
        </Button>
      </div>

      <nav className="flex-1 px-2 py-2 space-y-1">
        {folders.map((folder) => {
          const Icon = iconMap[folder.icon as keyof typeof iconMap];
          const count = folderCounts[folder.id];
          const isActive = currentFolder === folder.id;

          return (
            <button
              key={folder.id}
              onClick={() => onFolderChange(folder.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                isCollapsed && 'justify-center px-2'
              )}
            >
              <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary')} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">{folder.name}</span>
                  {count > 0 && (
                    <span
                      className={cn(
                        'text-xs font-semibold px-2 py-0.5 rounded-full',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {count}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-muted-foreground">
            Storage: 2.4 GB of 15 GB used
          </p>
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-[16%] bg-primary rounded-full" />
          </div>
        </div>
      )}
    </aside>
  );
}
