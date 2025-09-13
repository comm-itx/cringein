import { forwardRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Linkedin, Trophy, TrendingUp } from 'lucide-react';
import { CringeAnalysis } from '@/lib/cringe-rules';

interface ShareableResultCardProps {
  analysis: CringeAnalysis;
  className?: string;
}

export const ShareableResultCard = forwardRef<HTMLDivElement, ShareableResultCardProps>(
  ({ analysis, className = '' }, ref) => {
    const getScoreColor = (score: number) => {
      if (score <= 20) return 'text-green-600';
      if (score <= 50) return 'text-yellow-600';
      if (score <= 75) return 'text-orange-600';
      return 'text-red-600';
    };

    const getScoreGradient = (score: number) => {
      if (score <= 20) return 'from-green-500 to-green-600';
      if (score <= 50) return 'from-yellow-500 to-yellow-600';
      if (score <= 75) return 'from-orange-500 to-orange-600';
      return 'from-red-500 to-red-600';
    };

    const topPatterns = analysis.detectedPatterns
      .sort((a, b) => parseInt(b.points.replace('+', '')) - parseInt(a.points.replace('+', '')))
      .slice(0, 3);

    return (
      <div 
        ref={ref}
        className={`w-[600px] h-[800px] bg-gradient-to-br from-blue-50 to-indigo-100 p-8 font-sans ${className}`}
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Linkedin className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">CringeIn</h1>
          <p className="text-lg text-gray-600">LinkedIn Post Cringe Analysis</p>
        </div>

        {/* Score Section */}
        <Card className="mb-6 border-2 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className={`text-6xl font-bold mb-4 bg-gradient-to-r ${getScoreGradient(analysis.score)} bg-clip-text text-transparent`}>
              {analysis.score}%
            </div>
            <div className="text-2xl font-semibold text-gray-700 mb-2">
              {analysis.label}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div 
                className={`h-4 rounded-full bg-gradient-to-r ${getScoreGradient(analysis.score)} transition-all duration-1000`}
                style={{ width: `${analysis.score}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Top Cringe Patterns */}
        {topPatterns.length > 0 && (
          <Card className="mb-6 border-2 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Top Cringe Patterns
              </h3>
              <div className="space-y-3">
                {topPatterns.map((pattern, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-red-600 font-bold text-sm">{index + 1}</span>
                      </div>
                      <span className="font-medium text-gray-700">{pattern.name}</span>
                    </div>
                    <Badge variant="destructive" className="text-sm">
                      {pattern.points}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Special Score Messages */}
        {analysis.score === 69 && (
          <Card className="mb-6 border-2 border-purple-300 bg-purple-50 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl">😏</div>
              <p className="text-purple-700 font-medium">Nice... but still cringe</p>
            </CardContent>
          </Card>
        )}

        {analysis.score === 100 && (
          <Card className="mb-6 border-2 border-yellow-300 bg-yellow-50 shadow-lg">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-yellow-700 font-medium">Achievement Unlocked: Maximum Cringe!</p>
            </CardContent>
          </Card>
        )}

        {analysis.score >= 90 && analysis.score !== 100 && (
          <Card className="mb-6 border-2 border-red-300 bg-red-50 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl">🔥</div>
              <p className="text-red-700 font-medium">Viral Cringe Material Detected!</p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-auto">
          <p className="text-gray-500 text-sm mb-2">Check your LinkedIn posts at</p>
          <p className="text-blue-600 font-semibold text-lg">CringeIn.com</p>
          <p className="text-gray-400 text-xs mt-2">Find out before your network does</p>
        </div>
      </div>
    );
  }
);

ShareableResultCard.displayName = 'ShareableResultCard';