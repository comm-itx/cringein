import { CringeAnalysis } from './cringe-rules';

interface AppSettings {
  soundEnabled: boolean;
  theme: 'light' | 'dark';
}

const SETTINGS_KEY = 'cringeInSettings';
const HISTORY_KEY = 'cringeInHistory';

export function loadSettings(): AppSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  
  return {
    soundEnabled: true,
    theme: 'light'
  };
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

export function loadHistory(): CringeAnalysis[] {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading history:', error);
  }
  
  return [];
}

export function saveToHistory(analysis: CringeAnalysis): void {
  try {
    const history = loadHistory();
    history.unshift({
      ...analysis,
      id: Date.now()
    } as CringeAnalysis & { id: number });
    
    // Keep only last 5
    const trimmedHistory = history.slice(0, 5);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Error saving to history:', error);
  }
}
