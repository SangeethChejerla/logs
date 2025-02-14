// app/[id]/EntryPageClient.tsx (Client Component)
'use client';

import { getEntry, updateEntry } from '@/actions/entryActions'; // Import server actions
import EntryEditor from '@/components/EntryEditor';
import { DiaryEntry } from '@/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface EntryPageClientProps {
  entry: DiaryEntry;
}

export default function EntryPageClient({
  entry: initialEntry,
}: EntryPageClientProps) {
  const [entry, setEntry] = useState<DiaryEntry>(initialEntry);
  useEffect(() => {
    const getData = async () => {
      const serverEntry = await getEntry(initialEntry.id);
      if (serverEntry) {
        setEntry(serverEntry);
      }
    };
    getData();
  }, [initialEntry.id]);

  const handleSave = async (updatedEntry: Partial<DiaryEntry>) => {
    try {
      await updateEntry(entry.id, updatedEntry); // Call the server action
      const serverEntry = await getEntry(entry.id); //refetch
      if (serverEntry) {
        setEntry(serverEntry);
      }

      toast.success('Entry updated successfully');
    } catch (error) {
      toast.error(
        'Failed to update entry: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <EntryEditor entry={entry} onSave={handleSave} />
    </div>
  );
}
