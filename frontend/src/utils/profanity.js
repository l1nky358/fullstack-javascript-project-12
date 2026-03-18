const profanityList = [
  'badword',
  'swearword',
  'curse',
  'fuck',
  'shit',
  'damn',
  'hell',
  'asshole',
  'bitch',
  'crap',
  'piss',
  'dick',
  'pussy',
  'cock',
  'cunt',
  'whore',
  'slut',
  'nigger',
  'faggot',
  'retard'
];

const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Zа-яА-ЯёЁ0-9\s]/g, '')
    .trim();
};

const splitIntoWords = (text) => {
  return text.split(/\s+/).filter(word => word.length > 0);
};

export const containsProfanity = (text) => {
  if (!text || typeof text !== 'string') return false;
  
  const normalizedText = normalizeText(text);
  const words = splitIntoWords(normalizedText);
  
  return words.some(word => 
    profanityList.some(badWord => 
      word.includes(badWord.toLowerCase())
    )
  );
};

export const cleanProfanity = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  let cleanedText = text;
  const words = text.split(/(\s+)/);
  
  const processedWords = words.map(word => {
    if (word.trim().length > 0) {
      const normalizedWord = normalizeText(word);
      const isProfane = profanityList.some(badWord => 
        normalizedWord.includes(badWord.toLowerCase())
      );
      
      if (isProfane) {
        return '*'.repeat(word.length);
      }
    }
    return word;
  });
  
  return processedWords.join('');
};

export const findProfanity = (text) => {
  if (!text || typeof text !== 'string') return [];
  
  const normalizedText = normalizeText(text);
  const words = splitIntoWords(normalizedText);
  const foundWords = [];
  
  words.forEach(word => {
    profanityList.forEach(badWord => {
      if (word.includes(badWord.toLowerCase()) && !foundWords.includes(badWord)) {
        foundWords.push(badWord);
      }
    });
  });
  
  return foundWords;
};

export const isFullyProfane = (text) => {
  if (!text || typeof text !== 'string') return false;
  
  const cleaned = cleanProfanity(text);
  return cleaned === '*'.repeat(text.length);
};

export default {
  containsProfanity,
  cleanProfanity,
  findProfanity,
  isFullyProfane
};