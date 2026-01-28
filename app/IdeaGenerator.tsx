'use client';

import React, { useState } from 'react';
import { Lightbulb, Sparkles, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

interface ProjectIdea {
  title: string;
  description: string;
  techStack: string[];
  learningOutcomes: string[];
  difficulty: string;
  estimatedTime: string;
}

interface IdeaGeneratorProps {
  onUseIdea?: (idea: ProjectIdea) => void;
  addToast?: (message: string, type: 'success' | 'info' | 'error') => void;
}

export default function IdeaGenerator({ onUseIdea, addToast }: IdeaGeneratorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [interests, setInterests] = useState('');
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');
  const [projectType, setProjectType] = useState<string>('Surprise Me');
  const [timeCommitment, setTimeCommitment] = useState<'Weekend' | 'One Week' | 'One Month' | 'Long-term'>('One Week');
  const [generatedIdeas, setGeneratedIdeas] = useState<ProjectIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previousTitles, setPreviousTitles] = useState<string[]>([]);

  const skillLevels = [
    { value: 'Beginner', label: 'Beginner', description: 'Just starting out' },
    { value: 'Intermediate', label: 'Intermediate', description: 'Some experience' },
    { value: 'Advanced', label: 'Advanced', description: 'Strong foundation' },
    { value: 'Expert', label: 'Expert', description: 'Professional level' },
  ];

  const projectTypes = [
    { value: 'Web App', icon: '🌐', label: 'Web App' },
    { value: 'Mobile App', icon: '📱', label: 'Mobile App' },
    { value: 'Desktop App', icon: '💻', label: 'Desktop App' },
    { value: 'AI/ML', icon: '🤖', label: 'AI/ML' },
    { value: 'Game', icon: '🎮', label: 'Game' },
    { value: 'CLI Tool', icon: '⌨️', label: 'CLI Tool' },
    { value: 'API/Backend', icon: '🔌', label: 'API/Backend' },
    { value: 'Surprise Me', icon: '✨', label: 'Surprise Me' },
  ];

  const timeCommitments = [
    { value: 'Weekend', label: 'Weekend', description: '2-3 days' },
    { value: 'One Week', label: 'One Week', description: '5-7 days' },
    { value: 'One Month', label: 'One Month', description: '2-4 weeks' },
    { value: 'Long-term', label: 'Long-term', description: '1+ months' },
  ];

  const generateIdeas = async () => {
    setIsGenerating(true);
    setLoadingProgress(0);
    setError(null);
    setGeneratedIdeas([]);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interests: interests || 'general software development',
          skillLevel,
          projectType: projectType === 'Surprise Me' ? 'any' : projectType,
          timeCommitment,
          previousTitles, // Send previously generated titles
          seed: Date.now(), // Add timestamp for uniqueness
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate ideas');
      }

      const data = await response.json();
      
      // Store the new titles for future generations
      const newTitles = data.ideas.map((idea: ProjectIdea) => idea.title);
      setPreviousTitles(prev => [...prev, ...newTitles]);
      
      setLoadingProgress(100);
      setTimeout(() => {
        setGeneratedIdeas(data.ideas);
        // Show success toast
        if (addToast) {
          addToast('🎉 Project ideas generated successfully!', 'success');
        }
      }, 300);
    } catch (err) {
      setError('Failed to generate project ideas. Please try again.');
      // Show error toast
      if (addToast) {
        addToast('❌ Failed to generate ideas', 'error');
      }
      console.error('Error generating ideas:', err);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsGenerating(false);
        setLoadingProgress(0);
      }, 500);
    }
  };

  return (
    <div className="mb-8 animate-slide-in">
      <div className="bg-black border-2 border-green-500 rounded-xl overflow-hidden hover-scale glow-green">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-6 hover:bg-green-950/20 transition"
        >
          <div className="flex items-center gap-3">
            <Lightbulb 
              className="w-6 h-6 text-green-400 glow-pulse"
            />
            <h2 className="text-2xl font-bold text-green-400 glow-pulse-text">
              Project Idea Generator
            </h2>
          </div>
          <ChevronDown className={`w-6 h-6 text-green-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {isExpanded && (
          <div className="px-6 py-4 space-y-5 border-t-2 border-green-500/30 animate-fade-in">
            <div>
              <label className="block text-sm font-semibold text-green-300 mb-2">
                What interests you? (Optional)
              </label>
              <textarea
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="e.g., 'finance apps, social media, data visualization, automation tools' or leave blank for general ideas"
                className="w-full px-4 py-3 bg-black text-green-400 border-2 border-green-500/50 rounded-lg focus:border-green-400 focus:outline-none resize-none placeholder:text-green-700 font-mono text-sm"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-green-300 mb-2">
                Your Skill Level
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {skillLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setSkillLevel(level.value as any)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      skillLevel === level.value
                        ? 'bg-green-500 text-black border-green-400 shadow-lg scale-105 glow-green-strong selected-glow'
                        : 'bg-black text-green-400 border-green-700 hover:border-green-500'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-bold text-sm">{level.label}</div>
                      <div className="text-xs opacity-80 mt-1">{level.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-green-300 mb-2">
                Project Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {projectTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setProjectType(type.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      projectType === type.value
                        ? 'bg-green-500 text-black border-green-400 shadow-lg scale-105 glow-green-strong selected-glow'
                        : 'bg-black text-green-400 border-green-700 hover:border-green-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{type.icon}</span>
                      <span className="font-semibold text-sm">{type.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-green-300 mb-2">
                Time Commitment
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {timeCommitments.map((time) => (
                  <button
                    key={time.value}
                    onClick={() => setTimeCommitment(time.value as any)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      timeCommitment === time.value
                        ? 'bg-green-500 text-black border-green-400 shadow-lg scale-105 glow-green-strong selected-glow'
                        : 'bg-black text-green-400 border-green-700 hover:border-green-500'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-bold text-sm">{time.label}</div>
                      <div className="text-xs opacity-80 mt-1">{time.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateIdeas}
              disabled={isGenerating}
              className="w-full bg-green-500 text-black font-bold py-5 rounded-xl hover:bg-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg border-2 border-green-400 glow-green-strong"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="animate-typing">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                  Generating Ideas
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Generate Project Ideas
                </>
              )}
            </button>

            {/* Loading Progress Bar */}
            {isGenerating && (
              <div className="w-full h-3 bg-black border-2 border-green-500 rounded-full overflow-hidden animate-fade-in">
                <div 
                  className="h-full bg-green-500 transition-all duration-300 ease-out loading-bar"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            )}

            {error && (
              <div className="bg-red-900/30 border-2 border-red-500 text-red-300 px-5 py-4 rounded-xl animate-slide-in">
                {error}
              </div>
            )}

            {generatedIdeas.length > 0 && (
              <div className="space-y-4 animate-slide-in">
                <h3 className="text-xl font-bold text-green-400 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Your Personalized Project Ideas
                </h3>
                <div className="space-y-4">
                  {generatedIdeas.map((idea, index) => (
                    <div
                      key={index}
                      className="p-5 bg-black border-2 border-green-500/50 rounded-xl hover:border-green-400 transition-all hover-scale"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-bold text-green-400">
                          {idea.title}
                        </h4>
                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs rounded-lg border border-green-500/30 font-bold">
                            {idea.difficulty}
                          </span>
                          <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs rounded-lg border border-green-500/30 font-bold">
                            {idea.estimatedTime}
                          </span>
                        </div>
                      </div>
                      <p className="text-green-300 text-sm mb-4 leading-relaxed">
                        {idea.description}
                      </p>
                      <div className="mb-4">
                        <div className="text-xs font-bold text-green-400 mb-2">Tech Stack:</div>
                        <div className="flex flex-wrap gap-2">
                          {idea.techStack.map((tech, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-black text-green-400 text-xs rounded-lg border border-green-600 font-mono"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="text-xs font-bold text-green-400 mb-2">Learning Outcomes:</div>
                        <ul className="list-disc list-inside text-green-300 text-xs space-y-1">
                          {idea.learningOutcomes.map((outcome, i) => (
                            <li key={i}>{outcome}</li>
                          ))}
                        </ul>
                      </div>
                      {onUseIdea && (
                        <button
                          onClick={() => onUseIdea(idea)}
                          className="w-full mt-3 px-4 py-3 bg-green-500 text-black text-sm font-bold rounded-lg border-2 border-green-400 hover:bg-green-400 transition-all glow-green"
                        >
                          Use This Idea →
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}