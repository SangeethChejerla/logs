import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DiaryEntry } from '@/types';
import { format } from 'date-fns';
import { Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface EntryListProps {
  entries: DiaryEntry[];
  onDelete: (id: string) => Promise<void>;
  onNew: () => void;
}

export default function EntryList({
  entries,
  onDelete,
  onNew,
}: EntryListProps) {
  if (!Array.isArray(entries)) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Entries</CardTitle>
        <Button size="sm" onClick={onNew}>
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-2">
            {entries.length > 0 ? (
              entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100"
                >
                  <Link href={`/${entry.id}`} className="flex-1 cursor-pointer">
                    <h3 className="font-medium">{entry.title || 'Untitled'}</h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(entry.createdAt), 'PPP')}
                    </p>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      onDelete(entry.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No entries yet. Create your first entry!
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
