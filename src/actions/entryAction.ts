// actions/entryActions.ts
'use server';

import { redis } from '@/lib/redis';
import { generateId } from '@/lib/utils';
import { DiaryEntry } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getAllEntries(): Promise<DiaryEntry[]> {
  const keys = await redis.keys('entry:*');
  if (!keys.length) return [];
  const entries = await redis.mget<DiaryEntry[]>(...keys);
  return entries
    .filter((entry): entry is DiaryEntry => entry !== null) // Ensure no nulls
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function getEntry(id: string): Promise<DiaryEntry | null> {
  const entry = await redis.get<DiaryEntry>(`entry:${id}`);
  return entry;
}

export async function createEntry(entry: Partial<DiaryEntry>): Promise<string> {
  const id = generateId();
  const newEntry: DiaryEntry = {
    id,
    title: entry.title || 'Untitled',
    content: entry.content || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await redis.set(`entry:${id}`, newEntry);
  revalidatePath('/');
  return id; // Return the new ID
}

export async function updateEntry(id: string, entry: Partial<DiaryEntry>) {
  const existingEntry = await getEntry(id);

  if (!existingEntry) {
    throw new Error('Entry not found'); // More robust error handling
  }

  const updatedEntry: DiaryEntry = {
    ...existingEntry,
    ...entry,
    updatedAt: new Date().toISOString(),
  };

  await redis.set(`entry:${id}`, updatedEntry);
  revalidatePath(`/${id}`);
  revalidatePath('/');
}

export async function deleteEntry(id: string) {
  await redis.del(`entry:${id}`);
  revalidatePath('/');
}
