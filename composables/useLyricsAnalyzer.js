import { EXPLICIT_WORDS, SEXUAL_WORDS, VIOLENT_WORDS, DRUG_WORDS, LANGUAGE_PATTERNS } from '~/utils/constants';

export const useLyricsAnalyzer = () => {
  const detectLanguage = (text) => {
    for (const [lang, pattern] of Object.entries(LANGUAGE_PATTERNS)) {
      if (pattern.test(text)) return lang;
    }
    return 'english';
  };

  const findWords = (lyrics, wordList) => {
    return wordList.filter(word => 
      new RegExp(`\\b${word}\\b`).test(lyrics)
    );
  };

  const analyzeLyrics = (lyrics) => {
    if (!lyrics) return null;
    
    const lowerCaseLyrics = lyrics.toLowerCase();
    const language = detectLanguage(lyrics);
    
    // Get word lists for detected language + English
    const explicitWords = [...(EXPLICIT_WORDS[language] || []), ...EXPLICIT_WORDS.english];
    const sexualWords = [...(SEXUAL_WORDS[language] || []), ...SEXUAL_WORDS.english];
    const violentWords = [...(VIOLENT_WORDS[language] || []), ...VIOLENT_WORDS.english];
    const drugWords = [...(DRUG_WORDS[language] || []), ...DRUG_WORDS.english];
    
    // Find matching words
    const foundExplicitWords = findWords(lowerCaseLyrics, explicitWords);
    const foundSexualWords = findWords(lowerCaseLyrics, sexualWords);
    const foundViolentWords = findWords(lowerCaseLyrics, violentWords);
    const foundDrugWords = findWords(lowerCaseLyrics, drugWords);
    
    const hasExplicitContent = foundExplicitWords.length > 0;
    const hasSexualContent = foundSexualWords.length > 0;
    const hasViolentThemes = foundViolentWords.length > 0;
    const hasDrugReferences = foundDrugWords.length > 0;
    
    const is18Plus = hasExplicitContent || hasSexualContent || hasViolentThemes || hasDrugReferences;
    
    return {
      is18Plus,
      hasExplicitContent,
      hasSexualContent,
      hasViolentThemes,
      hasDrugReferences,
      foundExplicitWords,
      foundSexualWords,
      foundViolentWords,
      foundDrugWords,
      detectedLanguage: language
    };
  };

  return { analyzeLyrics };
};