
import { FileText, Zap } from 'lucide-react';

interface NoteStatsProps {
  wordCount: number;
  readingTime: number;
}

export const NoteStats = ({ wordCount, readingTime }: NoteStatsProps) => {
  return (
    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <FileText className="w-4 h-4" />
        <span>{wordCount} words</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Zap className="w-4 h-4" />
        <span>{readingTime} min read</span>
      </div>
    </div>
  );
};
