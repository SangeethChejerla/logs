import { getEntry } from '@/actions/entryAction';
import EntryPageClient from '@/components/EntryPageClient';
import { DiaryEntry } from '@/types';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    id: string;
  };
}
async function getData(id: string): Promise<DiaryEntry | null> {
  const entry = await getEntry(id);
  return entry;
}
export default async function EntryPage({ params }: PageProps) {
  const { id } = params;

  const entry = await getData(id);

  if (!entry) {
    notFound(); // Handle the case where the entry doesn't exist
  }

  return <EntryPageClient entry={entry} />; // Pass the fetched entry to the Client Component
}
