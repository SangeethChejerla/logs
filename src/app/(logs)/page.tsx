// app/page.tsx
'use client';

import { createEntry, deleteEntry, getAllEntries } from '@/actions/entryAction';
import EntryEditor from '@/components/EntryEditor';
import EntryList from '@/components/EntryList';
import { DiaryEntry } from '@/types';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Home() {
  const [isCreating, setIsCreating] = useState(false);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    const getEntries = async () => {
      const serverEntries = await getAllEntries();
      setEntries(serverEntries);
    };
    getEntries();
  }, []);

  const handleCreate = async (entry: Partial<DiaryEntry>) => {
    try {
      const newId = await createEntry(entry); // Call the server action
      const serverEntries = await getAllEntries(); //update enteries
      setEntries(serverEntries);
      setIsCreating(false);
      redirect(`/${newId}`);
    } catch (error) {
      toast.error('Failed to create entry');
      console.error(error); // Log the error for debugging
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEntry(id); // Call the server action
      const serverEntries = await getAllEntries(); //update enteries
      setEntries(serverEntries);
      toast.success('Entry deleted successfully');
    } catch (error) {
      toast.error('Failed to delete entry');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        {isCreating ? (
          <EntryEditor onSave={handleCreate} />
        ) : (
          <div className="flex justify-center h-[500px] items-center">
            Click "New" to create an entry.
          </div>
        )}
      </div>
      <div>
        <EntryList
          entries={entries}
          onDelete={handleDelete}
          onNew={() => setIsCreating(true)}
        />
      </div>
    </div>
  );
}
