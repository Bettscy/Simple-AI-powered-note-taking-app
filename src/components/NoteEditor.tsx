
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, X, Upload } from 'lucide-react';
import { Note } from './Dashboard';

interface NoteEditorProps {
  note: Note | null;
  onSave: (title: string, content: string) => void;
  onUpdate: (noteId: string, updates: Partial<Note>) => void;
  onCancel: () => void;
}

export const NoteEditor = ({ note, onSave, onUpdate, onCancel }: NoteEditorProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (note) {
      onUpdate(note.id, { title, content });
    } else {
      onSave(title, content);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setContent(text);
        if (!title.trim()) {
          setTitle(file.name.replace('.txt', ''));
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-gray-800">
            {note ? 'Edit Note' : 'Create New Note'}
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              size="sm"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Note Title
            </label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className="h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Note Content
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  Upload .txt file
                </label>
              </div>
            </div>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste or type your note content here... You can also upload a .txt file using the upload button above."
              className="min-h-[300px] border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 resize-none"
              required
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8"
              disabled={!title.trim() || !content.trim()}
            >
              <Save className="w-4 h-4 mr-2" />
              {note ? 'Update Note' : 'Save Note'}
            </Button>
          </div>
        </form>
      </CardContent>
    </>
  );
};
