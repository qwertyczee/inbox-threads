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
  PenSquare,
} from 'lucide-react';

const iconMap = {
  Inbox,
  Star,
  Send,
  File,
  AlertCircle,
  Trash2,
};

const shortcuts: Record<FolderType, string> = {
  inbox: 'G I',
  starred: 'G S',
  sent: 'G T',
  drafts: 'G D',
  spam: 'G !',
  trash: 'G #',
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
}: EmailSidebarProps) {
  return (
    <aside
      className={cn(
        'flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-150',
        isCollapsed ? 'w-14' : 'w-56'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5">
        {!isCollapsed && (
          <span className="text-base font-semibold tracking-tight text-foreground">
            Supermail
          </span>
        )}
      </div>

      {/* Compose button */}
      <div className="px-3 pb-4">
        <Button
          onClick={onCompose}
          className={cn(
            'w-full gap-2 h-9 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm',
            isCollapsed && 'px-0'
          )}
        >
          <PenSquare className="h-4 w-4" />
          {!isCollapsed && <span>Compose</span>}
          {!isCollapsed && <span className="kbd ml-auto">C</span>}
        </Button>
      </div>

      {/* Folders */}
      <nav className="flex-1 px-2 space-y-0.5">
        {folders.map((folder) => {
          const Icon = iconMap[folder.icon as keyof typeof iconMap];
          const count = folderCounts[folder.id];
          const isActive = currentFolder === folder.id;

          return (
            <button
              key={folder.id}
              onClick={() => onFolderChange(folder.id)}
              className={cn(
                'group w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-email-selected text-foreground'
                  : 'text-muted-foreground hover:bg-email-hover hover:text-foreground',
                isCollapsed && 'justify-center px-2'
              )}
            >
              <Icon className={cn('h-4 w-4 flex-shrink-0', isActive && 'text-primary')} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left font-medium">{folder.name}</span>
                  {count > 0 && (
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {count}
                    </span>
                  )}
                  <span className="kbd opacity-0 group-hover:opacity-100 transition-opacity text-[9px]">
                    {shortcuts[folder.id].split(' ').map((k, i) => (
                      <span key={i}>{k}</span>
                    ))}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="kbd">?</span>
            <span>Keyboard shortcuts</span>
          </div>
        </div>
      )}
    </aside>
  );
}
