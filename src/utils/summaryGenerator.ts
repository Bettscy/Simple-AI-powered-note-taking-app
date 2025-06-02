
export const generateActualSummary = (content: string): string => {
  // Enhanced text analysis following LangChain prompt principles
  const sentences = content.split(/[.!?]+/).filter(sentence => sentence.trim().length > 10);
  const words = content.toLowerCase().split(/\s+/);
  
  const wordCount = words.length;
  const sentenceCount = sentences.length;
  
  // Enhanced stop words list
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'this', 'that', 'these', 'those', 'i', 'you', 'he',
    'she', 'it', 'we', 'they', 'can', 'may', 'might', 'must', 'also', 'very', 'more', 'most',
    'some', 'any', 'all', 'each', 'every', 'when', 'where', 'why', 'how', 'what', 'which'
  ]);
  
  // Extract meaningful keywords with better frequency analysis
  const wordFreq = words
    .filter(word => word.length > 3 && !stopWords.has(word) && !/^\d+$/.test(word))
    .reduce((freq, word) => {
      freq[word] = (freq[word] || 0) + 1;
      return freq;
    }, {} as Record<string, number>);
  
  const keyWords = Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([word]) => word);
  
  // Identify sentences with high keyword density
  const rankedSentences = sentences.map(sentence => {
    const sentenceWords = sentence.toLowerCase().split(/\s+/);
    const keywordCount = sentenceWords.filter(word => keyWords.includes(word)).length;
    const score = keywordCount / sentenceWords.length;
    return { sentence: sentence.trim(), score, keywordCount };
  }).sort((a, b) => b.score - a.score);
  
  // Extract main themes and supporting details
  const mainThemes = keyWords.slice(0, 3);
  const supportingConcepts = keyWords.slice(3, 6);
  
  // Identify conclusion/outcome sentences (often at the end)
  const conclusionSentences = sentences.slice(-2).filter(s => 
    s.toLowerCase().includes('therefore') || 
    s.toLowerCase().includes('conclusion') ||
    s.toLowerCase().includes('result') ||
    s.toLowerCase().includes('finally') ||
    s.toLowerCase().includes('overall') ||
    s.toLowerCase().includes('important')
  );
  
  // Generate structured summary following LangChain prompt principles
  let summary = '';
  
  if (wordCount < 100) {
    // Brief note analysis
    summary = `This note explores ${mainThemes.slice(0, 2).join(' and ')} as ${mainThemes.length > 2 ? 'key topics' : 'the main focus'}. `;
    
    if (rankedSentences.length > 0 && rankedSentences[0].keywordCount > 0) {
      const mainPoint = rankedSentences[0].sentence;
      summary += `The primary insight is that ${mainPoint.toLowerCase().replace(/^[^a-z]*/, '')}. `;
    }
    
    if (supportingConcepts.length > 0) {
      summary += `The discussion emphasizes ${supportingConcepts.slice(0, 2).join(' and ')}.`;
    }
    
  } else if (wordCount < 400) {
    // Medium-length note analysis
    summary = `This note examines ${mainThemes.slice(0, 3).join(', ')} and their interconnections. `;
    
    // Add main argument/theme
    if (rankedSentences.length > 0) {
      const keyInsight = rankedSentences[0].sentence;
      summary += `The central argument suggests that ${keyInsight.toLowerCase().replace(/^[^a-z]*/, '').replace(/\.$/, '')}. `;
    }
    
    // Add supporting details
    if (rankedSentences.length > 1) {
      const supportingPoint = rankedSentences[1].sentence;
      summary += `Supporting this, the note highlights how ${supportingPoint.toLowerCase().replace(/^[^a-z]*/, '').replace(/\.$/, '')}. `;
    }
    
    // Add conclusion if available
    if (conclusionSentences.length > 0) {
      summary += `The key takeaway emphasizes ${conclusionSentences[0].toLowerCase().replace(/^[^a-z]*/, '').replace(/\.$/, '')}.`;
    } else if (supportingConcepts.length > 2) {
      summary += `The analysis particularly focuses on ${supportingConcepts.slice(2, 4).join(' and ')}.`;
    }
    
  } else {
    // Comprehensive note analysis
    summary = `This comprehensive note provides an in-depth analysis of ${mainThemes.slice(0, 3).join(', ')}, examining multiple perspectives and implications. `;
    
    // Main theme development
    if (rankedSentences.length > 0) {
      const primaryInsight = rankedSentences[0].sentence;
      summary += `The fundamental premise establishes that ${primaryInsight.toLowerCase().replace(/^[^a-z]*/, '').replace(/\.$/, '')}, which serves as the foundation for further exploration. `;
    }
    
    // Supporting arguments and details
    if (rankedSentences.length > 1) {
      const secondaryPoint = rankedSentences[1].sentence;
      summary += `The analysis develops this theme by demonstrating how ${secondaryPoint.toLowerCase().replace(/^[^a-z]*/, '').replace(/\.$/, '')}. `;
    }
    
    // Challenges, benefits, or implications
    const challengeWords = ['challenge', 'problem', 'issue', 'concern', 'difficulty', 'limitation'];
    const benefitWords = ['benefit', 'advantage', 'opportunity', 'improvement', 'success', 'effective'];
    
    const hasChallenges = words.some(word => challengeWords.includes(word));
    const hasBenefits = words.some(word => benefitWords.includes(word));
    
    if (hasChallenges && hasBenefits) {
      summary += `The note balances discussion of both opportunities and challenges in ${mainThemes[0]}, `;
    } else if (hasChallenges) {
      summary += `Key challenges and concerns regarding ${mainThemes[0]} are thoroughly addressed, `;
    } else if (hasBenefits) {
      summary += `The potential benefits and advantages of ${mainThemes[0]} are carefully examined, `;
    }
    
    // Conclusion and implications
    if (conclusionSentences.length > 0) {
      summary += `ultimately concluding that ${conclusionSentences[0].toLowerCase().replace(/^[^a-z]*/, '').replace(/\.$/, '')}.`;
    } else if (rankedSentences.length > 2) {
      summary += `with particular emphasis on ${supportingConcepts.slice(0, 2).join(' and ')}.`;
    }
  }
  
  // Clean up and ensure proper formatting
  summary = summary.replace(/\s+/g, ' ').trim();
  if (!summary.endsWith('.')) {
    summary += '.';
  }
  
  return summary;
};
