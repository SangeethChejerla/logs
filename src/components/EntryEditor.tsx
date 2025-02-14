'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DiaryEntry } from '@/types';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useState } from 'react';
import { toast } from 'sonner';
import EditorMenuBar from './EditorMenuBar';
interface EntryEditorProps {
  entry?: DiaryEntry;
  onSave: (entry: Partial<DiaryEntry>) => Promise<void>;
}

export default function EntryEditor({ entry, onSave }: EntryEditorProps) {
  const [title, setTitle] = useState(entry?.title || '');
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your thoughts...',
      }),
    ],
    content: entry?.content || '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px]',
      },
    },
  });

  const handleSave = async () => {
    if (!editor) return;

    setIsSaving(true);
    try {
      await onSave({
        title,
        content: editor.getHTML(),
      });
      toast.success('Entry saved successfully');
    } catch (error) {
      toast.error('Failed to save entry');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Entry title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-lg font-semibold"
      />
      <div className="border rounded-lg overflow-hidden">
        <EditorMenuBar editor={editor} />
        <div className="p-4">
          <EditorContent editor={editor} />
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Entry'}
        </Button>
      </div>
    </div>
  );
}
