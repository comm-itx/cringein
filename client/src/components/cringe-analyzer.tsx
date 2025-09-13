import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from './theme-provider';
import { ShareableResultCard } from './shareable-result-card';
import { 
  performCringeAnalysis, 
  performDecringe, 
  CringeAnalysis,
  DetectedPattern 
} from '@/lib/cringe-rules';
import { loadSettings, saveSettings, saveToHistory, loadHistory } from '@/lib/storage';
import { 
  Search, 
  Trash2, 
  Sparkles, 
  Copy, 
  Share, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  History, 
  Crown,
  Trophy,
  RotateCcw,
  ExternalLink,
  TriangleAlert,
  Play,
  X,
  Linkedin,
  Download,
  Image
} from 'lucide-react';
import html2canvas from 'html2canvas';

interface HallOfCringeExample {
  title: string;
  score: number;
  post: string;
}

const hallOfCringeExamples: HallOfCringeExample[] = [
  {
    title: "The Humble Brag Master",
    score: 95,
    post: "I usually don't post but I'm humbled to announce that I just closed the biggest deal of my career! 🚀✨\n\nStarted from the bottom, now we're here. My team isn't just employees, they're family.\n\nIt's all about mindset. Let that sink in.\n\nAgree? Thoughts?\n\n#Blessed #Journey #GameChanger"
  },
  {
    title: "The Vulnerable Flex",
    score: 88,
    post: "I'm crying as I write this... 😭\n\nThree years ago I was broke, sleeping on my friend's couch. Today I just bought my dream car. \n\nThe lesson? Mindset is everything. \n\nI wake up at 5am every day because success doesn't sleep. If you're not growing, you're dying.\n\nReach out if you want to connect! 💪\n\n#Grateful #NeverGiveUp"
  },
  {
    title: "The Dropout Hero",
    score: 92,
    post: "I dropped out of college and everyone said I'd never succeed.\n\nWell...\n\nToday I'm the CEO of a 7-figure company. 🔥\n\nSometimes you have to take the road less traveled. Sometimes you have to believe in yourself when nobody else will.\n\nEvery failure taught me something. Every rejection made me stronger.\n\nDon't let anyone tell you what you can't do.\n\nAgree? Thoughts? Let that sink in.\n\n#Blessed #Journey #Mindset"
  }
];

export default function CringeAnalyzer() {
  const [postText, setPostText] = useState('');
  const [currentAnalysis, setCurrentAnalysis] = useState<CringeAnalysis | null>(null);
  const [decringedPost, setDecringedPost] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bossMode, setBossMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showHallOfCringe, setShowHallOfCringe] = useState(false);
  const [history, setHistory] = useState<CringeAnalysis[]>([]);
  const [showShareableCard, setShowShareableCard] = useState(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const audioContextRef = useRef<AudioContext | null>(null);
  const confettiContainerRef = useRef<HTMLDivElement>(null);
  const shareableCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const settings = loadSettings();
    setSoundEnabled(settings.soundEnabled);
    setHistory(loadHistory());
  }, []);

  // Boss Mode keyboard shortcut (Ctrl/Cmd + Shift + B)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'B') {
        event.preventDefault();
        setBossMode(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const playSound = (score: number) => {
    if (!soundEnabled) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = score > 75 ? 800 : score > 50 ? 600 : 400;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const showConfetti = () => {
    if (!confettiContainerRef.current) return;
    
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b'];
    const container = confettiContainerRef.current;

    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece animate-confetti';
        confetti.style.position = 'absolute';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '0%';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.zIndex = '40';
        container.appendChild(confetti);

        setTimeout(() => {
          confetti.remove();
        }, 1000);
      }, i * 50);
    }
  };

  const analyzePost = async () => {
    if (!postText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a LinkedIn post to analyze",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      const analysis = performCringeAnalysis(postText);
      setCurrentAnalysis(analysis);
      saveToHistory(analysis);
      setHistory(prev => [analysis, ...prev.slice(0, 4)]);
      
      playSound(analysis.score);
      
      if (analysis.score >= 90) {
        showConfetti();
      }
      
      setIsAnalyzing(false);
      
      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById('results-section');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }, 1500);
  };

  const decringeCurrentPost = () => {
    if (!currentAnalysis) return;
    
    const decringed = performDecringe(currentAnalysis.originalPost);
    setDecringedPost(decringed);
    
    toast({
      title: "Success",
      description: "Post successfully decringed!",
      variant: "default"
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
        variant: "default"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const shareToTwitter = () => {
    if (!currentAnalysis) return;
    
    const score = currentAnalysis.score;
    const label = currentAnalysis.label;
    const text = `I just scored ${score}% cringe on my LinkedIn post! 😬 "${label}" - Check your posts at CringeIn.com #LinkedInCringe #CringeIn`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const clearInput = () => {
    setPostText('');
    setCurrentAnalysis(null);
    setDecringedPost(null);
    toast({
      title: "Cleared",
      description: "Input cleared",
      variant: "default"
    });
  };

  const toggleSound = () => {
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    const settings = loadSettings();
    saveSettings({ ...settings, soundEnabled: newSoundEnabled });
    
    toast({
      title: newSoundEnabled ? "Sound Enabled" : "Sound Disabled",
      description: `Sound effects ${newSoundEnabled ? 'enabled' : 'disabled'}`,
      variant: "default"
    });
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const loadExample = (example: HallOfCringeExample) => {
    setPostText(example.post);
    setShowHallOfCringe(false);
    toast({
      title: "Example Loaded",
      description: "Click Analyze to see the cringe score.",
      variant: "default"
    });
  };

  const loadFromHistory = (analysis: CringeAnalysis) => {
    setPostText(analysis.originalPost);
    setShowHistory(false);
    toast({
      title: "Loaded from History",
      description: "Post loaded successfully",
      variant: "default"
    });
  };

  const reanalyzeDecringed = () => {
    if (decringedPost) {
      setPostText(decringedPost);
      setCurrentAnalysis(null);
      setDecringedPost(null);
      analyzePost();
    }
  };

  const generateChallenge = () => {
    if (!currentAnalysis) {
      toast({
        title: "Error",
        description: "Analyze a post first to generate a challenge!",
        variant: "destructive"
      });
      return;
    }

    const score = currentAnalysis.score;
    const text = `I just scored ${score}% cringe on my LinkedIn post! 😬 Can you beat my score? Check yours at CringeIn.com #LinkedInCringe #CringeChallenge`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const generateShareableCard = () => {
    if (!currentAnalysis) {
      toast({
        title: "Error",
        description: "Analyze a post first to generate a shareable card!",
        variant: "destructive"
      });
      return;
    }

    setShowShareableCard(true);
  };

  const downloadShareableCard = async () => {
    if (!currentAnalysis || !shareableCardRef.current) {
      toast({
        title: "Error",
        description: "Unable to generate card. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingCard(true);

    try {
      const canvas = await html2canvas(shareableCardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        height: 800,
        width: 600
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `cringe-score-${currentAnalysis.score}%.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          toast({
            title: "Success!",
            description: "Shareable card downloaded successfully!",
            variant: "default"
          });
        } else {
          throw new Error('Failed to create image blob');
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error generating card:', error);
      toast({
        title: "Error", 
        description: "Failed to generate shareable card. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingCard(false);
    }
  };

  // Boss Mode - LinkedIn lookalike
  if (bossMode) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        {/* LinkedIn Header */}
        <header className="bg-[#0a66c2] text-white p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold">in</div>
              <input 
                type="text" 
                placeholder="Search" 
                className="px-3 py-1 rounded text-black w-64"
                data-testid="boss-mode-search"
              />
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <span className="hover:text-gray-200 cursor-pointer" data-testid="boss-mode-home">Home</span>
              <span className="hover:text-gray-200 cursor-pointer" data-testid="boss-mode-network">My Network</span>
              <span className="hover:text-gray-200 cursor-pointer" data-testid="boss-mode-jobs">Jobs</span>
              <span className="hover:text-gray-200 cursor-pointer" data-testid="boss-mode-messaging">Messaging</span>
              <span className="hover:text-gray-200 cursor-pointer" data-testid="boss-mode-notifications">Notifications</span>
            </div>
          </div>
        </header>

        {/* LinkedIn Feed */}
        <div className="max-w-4xl mx-auto p-6 grid grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow border p-4">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2"></div>
                <h3 className="font-semibold text-gray-900" data-testid="boss-mode-name">John Professional</h3>
                <p className="text-sm text-gray-600" data-testid="boss-mode-title">Senior Developer at TechCorp</p>
              </div>
              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Profile views</span>
                  <span className="text-[#0a66c2] font-semibold">142</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Post impressions</span>
                  <span className="text-[#0a66c2] font-semibold">1,247</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="col-span-2 space-y-4">
            {/* Create Post */}
            <div className="bg-white rounded-lg shadow border p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <button className="flex-1 text-left px-4 py-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200" data-testid="boss-mode-create-post">
                  Start a post...
                </button>
              </div>
            </div>

            {/* Sample Posts */}
            <div className="bg-white rounded-lg shadow border">
              <div className="p-4 border-b">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sarah Marketing</h4>
                    <p className="text-sm text-gray-600">Marketing Director • 2d</p>
                  </div>
                </div>
                <p className="text-gray-900" data-testid="boss-mode-post-content">
                  Excited to share our Q3 results! Our team achieved 127% of our goals. Grateful for this amazing team and their dedication. #TeamWork #Growth #Success
                </p>
              </div>
              <div className="p-4 flex justify-between text-sm text-gray-600">
                <button className="hover:text-[#0a66c2]" data-testid="boss-mode-like">👍 Like</button>
                <button className="hover:text-[#0a66c2]" data-testid="boss-mode-comment">💬 Comment</button>
                <button className="hover:text-[#0a66c2]" data-testid="boss-mode-share">↗️ Share</button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow border p-4">
              <h3 className="font-semibold text-gray-900 mb-3" data-testid="boss-mode-news-title">LinkedIn News</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-900 font-medium">Tech layoffs continue</p>
                  <p className="text-gray-600">2,847 readers</p>
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Remote work trends</p>
                  <p className="text-gray-600">1,534 readers</p>
                </div>
                <div>
                  <p className="text-gray-900 font-medium">AI adoption grows</p>
                  <p className="text-gray-600">3,921 readers</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Exit Instructions */}
        <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-2 rounded opacity-30 hover:opacity-100 transition-opacity" data-testid="boss-mode-exit-hint">
          Press Ctrl+Shift+B to exit Boss Mode
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Linkedin className="h-8 w-8" data-testid="logo-linkedin" />
            <h1 className="text-2xl font-bold" data-testid="text-app-title">CringeIn</h1>
            <span className="text-sm opacity-80 hidden sm:inline" data-testid="text-app-subtitle">LinkedIn Post Cringe Checker</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowHistory(true)}
              title="View History"
              data-testid="button-history"
            >
              <History className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowHallOfCringe(true)}
              title="Hall of Cringe"
              data-testid="button-hall-of-cringe"
            >
              <Crown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSound}
              title="Toggle Sound"
              data-testid="button-sound-toggle"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title="Toggle Dark Mode"
              data-testid="button-theme-toggle"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground" data-testid="text-hero-title">
            Is Your LinkedIn Post Cringe?
          </h2>
          <p className="text-xl text-muted-foreground mb-6" data-testid="text-hero-subtitle">
            Find out before your network does
          </p>
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4" data-testid="text-hero-description">
                Paste your LinkedIn post below and discover your cringe level. Our advanced algorithm analyzes your content for maximum second-hand embarrassment.
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <Search className="w-4 h-4 mr-2" />
                  Real-time Analysis
                </span>
                <span className="flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Decringe Feature
                </span>
                <span className="flex items-center">
                  <Share className="w-4 h-4 mr-2" />
                  Shareable Results
                </span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Input Section */}
        <section className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <label htmlFor="post-input" className="block text-sm font-medium mb-3 text-foreground flex items-center">
                <Linkedin className="w-4 h-4 mr-2" />
                Your LinkedIn Post
              </label>
              <div className="relative">
                <Textarea 
                  id="post-input"
                  placeholder="I'm humbled to announce that I just had the most vulnerable moment of my career... 🚀 Let that sink in. Agree? Thoughts? #Blessed #Journey"
                  className="min-h-40 p-4 resize-none font-serif leading-relaxed"
                  maxLength={3000}
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  data-testid="textarea-post-input"
                />
                <div className="absolute bottom-3 right-3 text-sm text-muted-foreground" data-testid="text-char-count">
                  <span className={postText.length > 2700 ? 'text-cringe-high' : postText.length > 2400 ? 'text-orange-500' : ''}>
                    {postText.length}
                  </span>/3000
                </div>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={analyzePost} 
                  disabled={isAnalyzing}
                  className="flex-1"
                  data-testid="button-analyze"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze Cringe Level
                      <Search className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={clearInput}
                  data-testid="button-clear"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Results Section */}
        {currentAnalysis && (
          <section id="results-section" className="mb-8 animate-slide-up">
            <Card>
              <CardContent className="pt-6">
                {/* Cringe Meter */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-4 text-foreground" data-testid="text-analysis-complete">
                    Cringe Analysis Complete
                  </h3>
                  <div className="relative">
                    <Progress 
                      value={currentAnalysis.score} 
                      className="h-8 mb-4"
                      data-testid="progress-cringe-meter"
                    />
                    <div className="absolute inset-0 flex items-center justify-end pr-3">
                      <span className="text-white font-bold text-sm" data-testid="text-cringe-percentage">
                        {currentAnalysis.score}%
                      </span>
                    </div>
                  </div>
                  <div className="text-6xl font-bold mb-2 animate-bounce-in text-foreground" data-testid="text-cringe-score">
                    {currentAnalysis.score}%
                  </div>
                  <div className="text-xl font-medium text-muted-foreground" data-testid="text-cringe-label">
                    {currentAnalysis.label}
                  </div>
                </div>

                {/* Cringe Breakdown */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 text-foreground flex items-center" data-testid="text-breakdown-title">
                    <TriangleAlert className="w-5 h-5 mr-2" />
                    Cringe Factors Detected
                  </h4>
                  <div className="space-y-2" data-testid="container-cringe-breakdown">
                    {currentAnalysis.detectedPatterns.length === 0 ? (
                      <div className="text-center text-muted-foreground py-4">
                        <Badge variant="secondary" className="text-green-600">
                          No major cringe patterns detected. Your post is surprisingly normal!
                        </Badge>
                      </div>
                    ) : (
                      currentAnalysis.detectedPatterns.map((pattern, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg" data-testid={`pattern-${index}`}>
                          <div className="flex items-center">
                            <TriangleAlert className="w-4 h-4 text-cringe-high mr-2" />
                            <span className="font-medium text-foreground">{pattern.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">({pattern.description})</span>
                          </div>
                          <Badge variant="destructive">{pattern.points}</Badge>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Analyzed Post Display */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 text-foreground flex items-center" data-testid="text-highlighted-title">
                    <Search className="w-5 h-5 mr-2" />
                    Your Post (Highlighted)
                  </h4>
                  <div 
                    className="p-4 bg-muted rounded-lg font-serif leading-relaxed text-foreground border-l-4 border-primary"
                    dangerouslySetInnerHTML={{ __html: currentAnalysis.highlightedPost }}
                    data-testid="text-highlighted-post"
                  />
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Button 
                    onClick={decringeCurrentPost} 
                    className="bg-cringe-low hover:bg-cringe-low/90 text-white"
                    data-testid="button-decringe"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Decringe This Post
                  </Button>
                  <Button 
                    onClick={shareToTwitter} 
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    data-testid="button-share"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Share Score
                  </Button>
                  <Button 
                    onClick={generateShareableCard}
                    disabled={isGeneratingCard}
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                    data-testid="button-generate-card"
                  >
                    {isGeneratingCard ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Image className="w-4 h-4 mr-2" />
                        Save Result Card
                      </>
                    )}
                  </Button>
                </div>

                {/* Copy Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => copyToClipboard(currentAnalysis.originalPost)}
                    data-testid="button-copy-original"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Original
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => decringedPost && copyToClipboard(decringedPost)}
                    disabled={!decringedPost}
                    data-testid="button-copy-decringed"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Decringed
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Decringe Results */}
        {decringedPost && (
          <section className="mb-8 animate-slide-up">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center" data-testid="text-decringed-title">
                  <Sparkles className="w-6 h-6 mr-2 text-cringe-low" />
                  Decringed Version
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted rounded-lg font-serif leading-relaxed text-foreground border-l-4 border-cringe-low mb-4" data-testid="text-decringed-post">
                  {decringedPost}
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>✨ Cringe level reduced significantly</span>
                  <Button variant="ghost" size="sm" onClick={reanalyzeDecringed} data-testid="button-reanalyze">
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Re-analyze
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Challenge Section */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-3 text-foreground" data-testid="text-challenge-title">
                Think You Can Do Worse?
              </h3>
              <p className="text-muted-foreground mb-4" data-testid="text-challenge-description">
                Challenge your network to beat your cringe score!
              </p>
              <Button onClick={generateChallenge} data-testid="button-challenge">
                <Trophy className="w-4 h-4 mr-2" />
                Try to Beat This Score
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* History Modal */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center" data-testid="text-history-title">
              <History className="w-5 h-5 mr-2" />
              Analysis History
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4" data-testid="container-history">
            {history.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <History className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No analysis history yet. Start checking some posts!</p>
              </div>
            ) : (
              history.map((item, index) => (
                <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => loadFromHistory(item)}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                      <Badge variant="secondary">{item.score}%</Badge>
                    </div>
                    <p className="text-foreground font-medium mb-1">{item.label}</p>
                    <p className="text-muted-foreground text-sm font-serif leading-relaxed">
                      {item.originalPost.substring(0, 100)}{item.originalPost.length > 100 ? '...' : ''}
                    </p>
                    <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-primary hover:underline">
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Load This Post
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Hall of Cringe Modal */}
      <Dialog open={showHallOfCringe} onOpenChange={setShowHallOfCringe}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center" data-testid="text-hall-title">
              <Crown className="w-5 h-5 mr-2 text-yellow-500" />
              Hall of Cringe
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4" data-testid="container-hall-of-cringe">
            {hallOfCringeExamples.map((example, index) => (
              <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => loadExample(example)}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-foreground">{example.title}</span>
                    <Badge className="bg-cringe-high text-white">{example.score}%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-serif leading-relaxed mb-2">
                    {example.post.substring(0, 120)}...
                  </p>
                  <Button variant="ghost" size="sm" className="p-0 h-auto text-primary hover:underline">
                    <Play className="w-3 h-3 mr-1" />
                    Try This Example
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Shareable Card Modal */}
      <Dialog open={showShareableCard} onOpenChange={setShowShareableCard}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center" data-testid="text-shareable-card-title">
              <Image className="w-5 h-5 mr-2" />
              Shareable Result Card Preview
            </DialogTitle>
          </DialogHeader>
          {currentAnalysis && (
            <div className="space-y-4">
              {/* Card Preview with Responsive Scaling */}
              <div className="flex justify-center">
                <div className="relative transform origin-top" style={{ scale: 'min(0.8, calc(80vw / 600px))' }}>
                  <ShareableResultCard 
                    ref={shareableCardRef}
                    analysis={currentAnalysis}
                    data-testid="shareable-result-card"
                  />
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 pt-4 border-t">
                <Button
                  onClick={downloadShareableCard}
                  disabled={isGeneratingCard}
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                  data-testid="button-download-card"
                >
                  {isGeneratingCard ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download PNG
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowShareableCard(false)}
                  data-testid="button-close-preview"
                >
                  <X className="w-4 h-4 mr-2" />
                  Close Preview
                </Button>
              </div>
              
              {/* Instructions */}
              <div className="text-center text-sm text-muted-foreground">
                <p>Your shareable result card will be downloaded as a high-quality PNG image.</p>
                <p>Perfect for sharing on social media or saving for later!</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confetti Container */}
      <div 
        ref={confettiContainerRef}
        className="fixed inset-0 pointer-events-none z-40"
        data-testid="container-confetti"
      />
    </div>
  );
}
