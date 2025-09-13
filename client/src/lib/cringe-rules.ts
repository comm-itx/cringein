export interface CringeRule {
  pattern: RegExp;
  points: number;
  name: string;
  description: string;
}

export const cringeRules: CringeRule[] = [
  { 
    pattern: /agree\?\s*thoughts\?/gi, 
    points: 15, 
    name: "Agree? Thoughts?", 
    description: "The classic engagement bait ending" 
  },
  { 
    pattern: /i'm humbled to announce/gi, 
    points: 20, 
    name: "Humble Announcement", 
    description: "Fake humility before bragging" 
  },
  { 
    pattern: /let that sink in/gi, 
    points: 15, 
    name: "Let That Sink In", 
    description: "Dramatic pause for effect" 
  },
  { 
    pattern: /#blessed|#grateful|#journey/gi, 
    points: 10, 
    name: "Inspirational Hashtags", 
    description: "Generic motivation tags" 
  },
  { 
    pattern: /i usually don't post but/gi, 
    points: 10, 
    name: "Reluctant Poster", 
    description: "False modesty opener" 
  },
  { 
    pattern: /my team isn't just employees.*family/gi, 
    points: 15, 
    name: "Team Family", 
    description: "Corporate family rhetoric" 
  },
  { 
    pattern: /\n\s*\n/g, 
    points: 2, 
    name: "Dramatic Line Breaks", 
    description: "Unnecessary spacing for emphasis" 
  },
  { 
    pattern: /🚀|💪|✨|🔥|💯/g, 
    points: 5, 
    name: "Corporate Emojis", 
    description: "Overuse of motivational emojis" 
  },
  { 
    pattern: /tears.*eyes|crying|emotional/gi, 
    points: 20, 
    name: "Emotional Vulnerability", 
    description: "Fake emotional manipulation" 
  },
  { 
    pattern: /started from the bottom/gi, 
    points: 25, 
    name: "Rags to Riches Story", 
    description: "Overused success narrative" 
  },
  { 
    pattern: /game changer|paradigm shift/gi, 
    points: 12, 
    name: "Buzzword Bingo", 
    description: "Corporate jargon overload" 
  },
  { 
    pattern: /reach out|connect with me/gi, 
    points: 8, 
    name: "Networking Push", 
    description: "Shameless self-promotion" 
  },
  { 
    pattern: /dropped out.*now (ceo|founder)/gi, 
    points: 30, 
    name: "Dropout Success Story", 
    description: "The ultimate LinkedIn flex" 
  },
  { 
    pattern: /mindset.*everything/gi, 
    points: 10, 
    name: "Mindset Guru", 
    description: "Pseudo-philosophical advice" 
  },
  { 
    pattern: /fail.*learn.*succeed/gi, 
    points: 15, 
    name: "Failure Wisdom", 
    description: "Generic success formula" 
  },
  { 
    pattern: /5am.*success/gi, 
    points: 18, 
    name: "Early Bird Flex", 
    description: "Productivity culture bragging" 
  },
  {
    pattern: /pivot|disrupt|synergy|scale/gi,
    points: 8,
    name: "Startup Buzzwords",
    description: "Tech industry clichés"
  },
  {
    pattern: /10x|100x|unicorn/gi,
    points: 12,
    name: "Growth Hacking",
    description: "Exaggerated metrics"
  },
  {
    pattern: /let me tell you a story/gi,
    points: 15,
    name: "Story Opener",
    description: "Dramatic storytelling intro"
  },
  {
    pattern: /i was rejected \d+ times/gi,
    points: 25,
    name: "Rejection Count Flex",
    description: "Quantified struggle narrative"
  },
  {
    pattern: /kudos to/gi,
    points: 10,
    name: "Kudos Giver",
    description: "Performative appreciation"
  }
];

export interface CringeAnalysis {
  originalPost: string;
  score: number;
  label: string;
  detectedPatterns: DetectedPattern[];
  highlightedPost: string;
  timestamp: string;
}

export interface DetectedPattern {
  name: string;
  points: string;
  matches: number;
  description: string;
}

export function getScoreLabel(score: number): string {
  if (score === 69) return "Nice... but cringe";
  if (score === 100) return "Achievement Unlocked: Maximum Cringe";
  if (score <= 20) return "Actually Normal";
  if (score <= 50) return "Mildly Corporate";
  if (score <= 75) return "Peak LinkedIn";
  return "Viral Cringe Material";
}

export function performCringeAnalysis(text: string): CringeAnalysis {
  let totalScore = 0;
  const detectedPatterns: DetectedPattern[] = [];
  let highlightedText = text;

  cringeRules.forEach(rule => {
    const matches = text.match(rule.pattern);
    if (matches) {
      const points = rule.points * matches.length;
      totalScore += points;
      detectedPatterns.push({
        name: rule.name,
        points: `+${points}`,
        matches: matches.length,
        description: `Found ${matches.length} instance${matches.length > 1 ? 's' : ''}`
      });

      // Highlight matches in text
      highlightedText = highlightedText.replace(rule.pattern, (match) => {
        return `<span class="highlight-cringe">${match}</span>`;
      });
    }
  });

  // Custom rule: Wall of text (no paragraph breaks)
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  if (paragraphs.length === 1 && text.length > 500) {
    totalScore += 20;
    detectedPatterns.push({
      name: "Wall of Text",
      points: "+20",
      matches: 1,
      description: "No paragraph breaks in long post"
    });
  }

  // Custom rule: Too many hashtags (more than 5)
  const hashtags = text.match(/#\w+/g);
  if (hashtags && hashtags.length > 5) {
    totalScore += 15;
    detectedPatterns.push({
      name: "Hashtag Overload",
      points: "+15",
      matches: hashtags.length,
      description: `${hashtags.length} hashtags (over 5 limit)`
    });
  }

  // Custom rule: Personal tragedy to work lesson (using [\s\S] to match across newlines)
  const tragedyToWorkPattern = /(died|cancer|divorced|fired|homeless|broke|struggling|depression|anxiety|lost everything)[\s\S]*?(success|ceo|founder|promoted|grateful|blessed|lesson|growth)/gi;
  const tragedyMatches = text.match(tragedyToWorkPattern);
  if (tragedyMatches) {
    const points = 30 * tragedyMatches.length; // Consistent per-match scoring
    totalScore += points;
    detectedPatterns.push({
      name: "Tragedy to Success",
      points: `+${points}`,
      matches: tragedyMatches.length,
      description: `Found ${tragedyMatches.length} instance${tragedyMatches.length > 1 ? 's' : ''}`
    });
    
    // Highlight the pattern
    highlightedText = highlightedText.replace(tragedyToWorkPattern, (match) => {
      return `<span class="highlight-cringe">${match}</span>`;
    });
  }

  // Cap at 100%
  totalScore = Math.min(totalScore, 100);

  const label = getScoreLabel(totalScore);

  return {
    originalPost: text,
    score: totalScore,
    label: label,
    detectedPatterns: detectedPatterns,
    highlightedPost: highlightedText,
    timestamp: new Date().toISOString()
  };
}

export function performDecringe(text: string): string {
  let decringed = text;

  // Remove or replace cringe patterns
  decringed = decringed.replace(/i'm humbled to announce/gi, 'I wanted to share');
  decringed = decringed.replace(/let that sink in\.?/gi, '');
  decringed = decringed.replace(/agree\?\s*thoughts\?/gi, '');
  decringed = decringed.replace(/i usually don't post but/gi, '');
  decringed = decringed.replace(/🚀|💪|✨|🔥|💯/g, '');
  decringed = decringed.replace(/#blessed|#grateful|#journey/gi, '');
  decringed = decringed.replace(/my team isn't just employees.*family/gi, 'I work with a great team');
  decringed = decringed.replace(/\n\s*\n\s*\n/g, '\n\n');
  decringed = decringed.replace(/mindset.*everything/gi, 'perspective matters');
  decringed = decringed.replace(/game changer|paradigm shift/gi, 'improvement');
  decringed = decringed.replace(/tears.*eyes|crying|emotional/gi, 'excited');
  decringed = decringed.replace(/started from the bottom/gi, 'started my career');
  decringed = decringed.replace(/reach out|connect with me/gi, 'feel free to message me');
  decringed = decringed.replace(/dropped out.*now (ceo|founder)/gi, 'now running a company');
  decringed = decringed.replace(/fail.*learn.*succeed/gi, 'learned from experience');
  decringed = decringed.replace(/5am.*success/gi, 'early mornings help productivity');
  
  // New decringe patterns
  decringed = decringed.replace(/let me tell you a story/gi, 'Here\'s what happened');
  decringed = decringed.replace(/i was rejected \d+ times/gi, 'I faced some rejections');
  decringed = decringed.replace(/kudos to/gi, 'thanks to');
  
  // Fix tragedy to success patterns (using [\s\S] to match across newlines)
  const tragedyToWorkPattern = /(died|cancer|divorced|fired|homeless|broke|struggling|depression|anxiety|lost everything)[\s\S]*?(success|ceo|founder|promoted|grateful|blessed|lesson|growth)/gi;
  decringed = decringed.replace(tragedyToWorkPattern, 'I learned from my experiences and am grateful for where I am now');
  
  // Reduce excessive hashtags (keep only first 3)
  const hashtags = decringed.match(/#\w+/g);
  if (hashtags && hashtags.length > 3) {
    const firstThree = hashtags.slice(0, 3);
    decringed = decringed.replace(/#\w+/g, '');
    decringed += ' ' + firstThree.join(' ');
  }
  
  // Add paragraph breaks to walls of text
  if (decringed.length > 500 && !decringed.includes('\n\n')) {
    const sentences = decringed.split(/\.\s+/);
    if (sentences.length > 6) {
      const midPoint = Math.floor(sentences.length / 2);
      decringed = sentences.slice(0, midPoint).join('. ') + '.\n\n' + sentences.slice(midPoint).join('. ');
    }
  }
  
  // Clean up extra whitespace but preserve paragraph breaks
  decringed = decringed.replace(/[ \t]+/g, ' ').trim(); // Only collapse spaces and tabs, keep newlines
  decringed = decringed.replace(/\n\s*\n/g, '\n\n'); // Normalize paragraph spacing

  return decringed || 'This post was so cringe it couldn\'t be saved. Try starting over!';
}
