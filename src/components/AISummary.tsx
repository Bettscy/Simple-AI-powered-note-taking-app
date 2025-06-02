
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2, Brain } from 'lucide-react';
import { Note } from './Dashboard';
import { generateActualSummary } from '@/utils/summaryGenerator';
import { NoteStats } from './summary/NoteStats';
import { LoadingIndicator } from './summary/LoadingIndicator';
import { SummaryDisplay } from './summary/SummaryDisplay';

interface AISummaryProps {
  note: Note;
  onUpdateSummary: (summary: string) => void;
}

export const AISummary = ({ note, onUpdateSummary }: AISummaryProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
    
    // Generate enhanced summary following LangChain principles
    const summary = generateActualSummary(note.content);
    
    onUpdateSummary(summary);
    setIsGenerating(false);
  };

  const wordCount = note.content.split(' ').filter(word => word.length > 0).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Brain className="w-5 h-5 text-indigo-500" />
          AI Summary
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <NoteStats wordCount={wordCount} readingTime={readingTime} />

        {/* Original Note Preview */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">{note.title}</h3>
          <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {note.content.substring(0, 300)}
              {note.content.length > 300 && '...'}
            </p>
          </div>
        </div>

        {/* AI Summary Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              AI-Generated Summary
            </h4>
            
            {!note.summary && (
              <Button
                onClick={generateSummary}
                disabled={isGenerating}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Summary
                  </>
                )}
              </Button>
            )}
          </div>

          {isGenerating && <LoadingIndicator />}

          <SummaryDisplay
            summary={note.summary}
            isGenerating={isGenerating}
            onGenerate={generateSummary}
          />
        </div>
      </CardContent>
    </>
  );
};
