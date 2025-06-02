
import { Button } from '@/components/ui/button';
import { Trash2, FileText, Calendar } from 'lucide-react';
import { Note } from './Dashboard';

interface NotesListProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
}

export const NotesList = ({ notes, selectedNote, onSelectNote, onDeleteNote }: NotesListProps) => {
  if (notes.length === 0) {
    return (
      <div className="p-6 text-center">
        <FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500">No notes yet</p>
        <p className="text-sm text-gray-400">Create your first note to get started</p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-h-96 overflow-y-auto">
      {notes.map((note) => (
        <div
          key={note.id}
          className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
            selectedNote?.id === note.id ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : ''
          }`}
          onClick={() => onSelectNote(note)}
        >
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-800 truncate mb-1">
                {note.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {note.content.substring(0, 100)}...
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                {formatDate(note.createdAt)}
              </div>
              {note.summary && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700">
                    ✨ Summarized
                  </span>
                </div>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteNote(note.id);
              }}
              className="text-gray-400 hover:text-red-500 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
