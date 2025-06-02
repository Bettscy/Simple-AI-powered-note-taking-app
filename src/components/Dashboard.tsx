
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Plus, LogOut, FileText, Sparkles, Upload } from 'lucide-react';
import { NoteEditor } from './NoteEditor';
import { NotesList } from './NotesList';
import { AISummary } from './AISummary';

interface DashboardProps {
  user: { email: string; name: string } | null;
  onLogout: () => void;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  summary?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'editor' | 'summary'>('notes');

  const createNote = (title: string, content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setIsCreating(false);
    setActiveTab('summary');
  };

  const updateNote = (noteId: string, updates: Partial<Note>) => {
    setNotes(notes.map(note => 
      note.id === noteId 
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    ));
    if (selectedNote?.id === noteId) {
      setSelectedNote({ ...selectedNote, ...updates, updatedAt: new Date() });
    }
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
      setActiveTab('notes');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  NoteGenius
                </h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={() => {
                  setIsCreating(true);
                  setActiveTab('editor');
                }}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Note
              </Button>
              
              <Button
                variant="outline"
                onClick={onLogout}
                className="border-gray-300 hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Notes List */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <FileText className="w-5 h-5" />
                  Your Notes ({notes.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <NotesList
                  notes={notes}
                  selectedNote={selectedNote}
                  onSelectNote={(note) => {
                    setSelectedNote(note);
                    setIsCreating(false);
                    setActiveTab('summary');
                  }}
                  onDeleteNote={deleteNote}
                />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
              <Button
                variant={activeTab === 'notes' ? 'default' : 'outline'}
                onClick={() => setActiveTab('notes')}
                className={activeTab === 'notes' ? 'bg-indigo-500 hover:bg-indigo-600' : ''}
              >
                <FileText className="w-4 h-4 mr-2" />
                Notes
              </Button>
              
              <Button
                variant={activeTab === 'editor' ? 'default' : 'outline'}
                onClick={() => setActiveTab('editor')}
                className={activeTab === 'editor' ? 'bg-indigo-500 hover:bg-indigo-600' : ''}
              >
                <Upload className="w-4 h-4 mr-2" />
                Editor
              </Button>
              
              <Button
                variant={activeTab === 'summary' ? 'default' : 'outline'}
                onClick={() => setActiveTab('summary')}
                disabled={!selectedNote}
                className={activeTab === 'summary' ? 'bg-indigo-500 hover:bg-indigo-600' : ''}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Summary
              </Button>
            </div>

            {/* Content Area */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm min-h-[600px]">
              {activeTab === 'notes' && (
                <CardContent className="p-8">
                  <div className="text-center">
                    <Brain className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a note to view</h3>
                    <p className="text-gray-500">Choose a note from the sidebar or create a new one to get started.</p>
                  </div>
                </CardContent>
              )}
              
              {activeTab === 'editor' && (
                <NoteEditor
                  note={isCreating ? null : selectedNote}
                  onSave={createNote}
                  onUpdate={updateNote}
                  onCancel={() => {
                    setIsCreating(false);
                    setActiveTab(selectedNote ? 'summary' : 'notes');
                  }}
                />
              )}
              
              {activeTab === 'summary' && selectedNote && (
                <AISummary
                  note={selectedNote}
                  onUpdateSummary={(summary) => updateNote(selectedNote.id, { summary })}
                />
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
