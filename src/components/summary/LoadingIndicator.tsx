
import { Loader2 } from 'lucide-react';

export const LoadingIndicator = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-3">
        <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
        <span className="text-indigo-700 font-medium">AI is analyzing your note...</span>
      </div>
      <div className="space-y-2 text-sm text-indigo-600">
        <p>• Extracting main themes and key concepts</p>
        <p>• Identifying supporting arguments and details</p>
        <p>• Analyzing conclusion and implications</p>
        <p>• Generating human-friendly summary</p>
      </div>
    </div>
  );
};
