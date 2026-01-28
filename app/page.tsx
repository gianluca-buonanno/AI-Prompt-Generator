'use client';

import { useState } from 'react';
import MatrixRain from './MatrixRain';
import IdeaGenerator from './IdeaGenerator';
import BlinkingCursor from './BlinkingCursor';
import ToastNotification from './ToastNotification';
import { useToast } from './useToast';

import { 
  Code2, 
  Copy, 
  Download, 
  Loader2, 
  CheckCircle, 
  ChevronDown,
  Terminal,
  Zap,
  FileCode,
  Layers,
  Sparkles
} from 'lucide-react';

type Language = 'python' | 'javascript' | 'typescript' | 'java' | 'csharp' | 'go' | 'rust' | 'php' | 'ruby' | 'swift';
type Framework = 'react' | 'vue' | 'angular' | 'nextjs' | 'django' | 'flask' | 'express' | 'spring' | 'dotnet' | 'none';
type Complexity = 'beginner' | 'intermediate' | 'advanced' | 'expert';
type CodeStyle = 'functional' | 'oop' | 'procedural' | 'mixed';

export default function Home() {
  const [projectDescription, setProjectDescription] = useState('');
  const [language, setLanguage] = useState<Language>('python');
  const [framework, setFramework] = useState<Framework>('none');
  const [complexity, setComplexity] = useState<Complexity>('intermediate');
  const [codeStyle, setCodeStyle] = useState<CodeStyle>('mixed');
  const [features, setFeatures] = useState('');
  const [constraints, setConstraints] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Toast hook
  const { toasts, addToast, removeToast } = useToast();
  
  // Accordion states
  const [basicOpen, setBasicOpen] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const languages = [
    { id: 'python' as Language, name: 'Python', icon: '🐍' },
    { id: 'javascript' as Language, name: 'JavaScript', icon: '📜' },
    { id: 'typescript' as Language, name: 'TypeScript', icon: '📘' },
    { id: 'java' as Language, name: 'Java', icon: '☕' },
    { id: 'csharp' as Language, name: 'C#', icon: '#️⃣' },
    { id: 'go' as Language, name: 'Go', icon: '🔷' },
    { id: 'rust' as Language, name: 'Rust', icon: '🦀' },
    { id: 'php' as Language, name: 'PHP', icon: '🐘' },
    { id: 'ruby' as Language, name: 'Ruby', icon: '💎' },
    { id: 'swift' as Language, name: 'Swift', icon: '🕊️' },
  ];

  const frameworks = [
    { id: 'none' as Framework, name: 'None / Vanilla', lang: 'all' },
    { id: 'react' as Framework, name: 'React', lang: 'javascript,typescript' },
    { id: 'vue' as Framework, name: 'Vue.js', lang: 'javascript,typescript' },
    { id: 'angular' as Framework, name: 'Angular', lang: 'typescript' },
    { id: 'nextjs' as Framework, name: 'Next.js', lang: 'javascript,typescript' },
    { id: 'django' as Framework, name: 'Django', lang: 'python' },
    { id: 'flask' as Framework, name: 'Flask', lang: 'python' },
    { id: 'express' as Framework, name: 'Express', lang: 'javascript,typescript' },
    { id: 'spring' as Framework, name: 'Spring', lang: 'java' },
    { id: 'dotnet' as Framework, name: '.NET', lang: 'csharp' },
  ];

  const complexityLevels = [
    { id: 'beginner' as Complexity, name: 'Beginner', desc: 'Simple, well-commented code' },
    { id: 'intermediate' as Complexity, name: 'Intermediate', desc: 'Moderate complexity, best practices' },
    { id: 'advanced' as Complexity, name: 'Advanced', desc: 'Complex patterns, optimization' },
    { id: 'expert' as Complexity, name: 'Expert', desc: 'Production-ready, scalable architecture' },
  ];

  const codeStyles = [
    { id: 'functional' as CodeStyle, name: 'Functional', icon: 'λ' },
    { id: 'oop' as CodeStyle, name: 'OOP', icon: '🏛️' },
    { id: 'procedural' as CodeStyle, name: 'Procedural', icon: '📋' },
    { id: 'mixed' as CodeStyle, name: 'Mixed', icon: '🔀' },
  ];

  // Smart detection function to determine language from tech stack
  const detectLanguage = (techStack: string[]): Language => {
    const stackStr = techStack.join(' ').toLowerCase();
    
    if (stackStr.includes('python') || stackStr.includes('django') || stackStr.includes('flask') || stackStr.includes('fastapi')) return 'python';
    if (stackStr.includes('typescript') || stackStr.includes('next.js') || stackStr.includes('angular')) return 'typescript';
    if (stackStr.includes('javascript') || stackStr.includes('react') || stackStr.includes('vue') || stackStr.includes('node')) return 'javascript';
    if (stackStr.includes('java') || stackStr.includes('spring')) return 'java';
    if (stackStr.includes('c#') || stackStr.includes('csharp') || stackStr.includes('.net') || stackStr.includes('dotnet')) return 'csharp';
    if (stackStr.includes('go') || stackStr.includes('golang')) return 'go';
    if (stackStr.includes('rust')) return 'rust';
    if (stackStr.includes('php') || stackStr.includes('laravel')) return 'php';
    if (stackStr.includes('ruby') || stackStr.includes('rails')) return 'ruby';
    if (stackStr.includes('swift') || stackStr.includes('ios')) return 'swift';
    
    return 'python'; // default
  };

  // Smart detection function to determine framework from tech stack
  const detectFramework = (techStack: string[], detectedLanguage: Language): Framework => {
    const stackStr = techStack.join(' ').toLowerCase();
    
    if (stackStr.includes('react.js') || stackStr.includes('react')) return 'react';
    if (stackStr.includes('next.js') || stackStr.includes('nextjs')) return 'nextjs';
    if (stackStr.includes('vue.js') || stackStr.includes('vue')) return 'vue';
    if (stackStr.includes('angular')) return 'angular';
    if (stackStr.includes('django')) return 'django';
    if (stackStr.includes('flask')) return 'flask';
    if (stackStr.includes('express')) return 'express';
    if (stackStr.includes('spring')) return 'spring';
    if (stackStr.includes('.net') || stackStr.includes('dotnet')) return 'dotnet';
    
    return 'none'; // default
  };

  // Smart detection function to determine code style from tech stack
  const detectCodeStyle = (techStack: string[]): CodeStyle => {
    const stackStr = techStack.join(' ').toLowerCase();
    
    if (stackStr.includes('react') || stackStr.includes('functional')) return 'functional';
    if (stackStr.includes('java') || stackStr.includes('spring') || stackStr.includes('c#') || stackStr.includes('.net')) return 'oop';
    
    return 'mixed'; // default
  };

  // Smart detection for features based on tech stack
  const detectFeatures = (techStack: string[]): string => {
    const features: string[] = [];
    const stackStr = techStack.join(' ').toLowerCase();
    
    if (stackStr.includes('api')) features.push('REST API');
    if (stackStr.includes('auth')) features.push('Authentication');
    if (stackStr.includes('database') || stackStr.includes('sql') || stackStr.includes('mongodb')) features.push('Database integration');
    if (stackStr.includes('testing') || stackStr.includes('jest') || stackStr.includes('pytest')) features.push('Unit tests');
    if (stackStr.includes('docker')) features.push('Docker containerization');
    if (stackStr.includes('redux') || stackStr.includes('state')) features.push('State management');
    if (stackStr.includes('oauth') || stackStr.includes('jwt')) features.push('OAuth/JWT authentication');
    if (stackStr.includes('websocket') || stackStr.includes('socket.io')) features.push('Real-time features');
    if (stackStr.includes('graphql')) features.push('GraphQL API');
    if (stackStr.includes('typescript')) features.push('Type safety');
    
    return features.join(', ');
  };

  const handleUseIdea = (idea: any) => {
    // Auto-fill the project description
    const description = `${idea.title}

${idea.description}

Key Requirements:
${idea.learningOutcomes.map((outcome: string) => `- ${outcome}`).join('\n')}

Tech Stack: ${idea.techStack.join(', ')}`;
    
    setProjectDescription(description);
    
    // AUTO-DETECT AND SELECT LANGUAGE
    const detectedLanguage = detectLanguage(idea.techStack);
    setLanguage(detectedLanguage);
    
    // AUTO-DETECT AND SELECT FRAMEWORK
    const detectedFramework = detectFramework(idea.techStack, detectedLanguage);
    setFramework(detectedFramework);
    
    // AUTO-DETECT AND SELECT CODE STYLE
    const detectedCodeStyle = detectCodeStyle(idea.techStack);
    setCodeStyle(detectedCodeStyle);
    
    // AUTO-DETECT AND FILL FEATURES
    const detectedFeatures = detectFeatures(idea.techStack);
    setFeatures(detectedFeatures);
    
    // Show success toast
    addToast(`✨ Project idea loaded: ${idea.title}`, 'success');
    
    // Auto-scroll to form
    setTimeout(() => {
      const formElement = document.getElementById('prompt-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleGenerate = async () => {
    if (!projectDescription.trim()) {
      setError('Please describe your project');
      return;
    }

    setLoading(true);
    setLoadingProgress(0);
    setError('');
    setGeneratedPrompt('');

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
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectDescription,
          language,
          framework,
          complexity,
          codeStyle,
          features,
          constraints,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate prompt');
      }

      const data = await response.json();
      
      setLoadingProgress(100);
      setTimeout(() => {
        setGeneratedPrompt(data.prompt);
        addToast('🎉 Prompt generated successfully!', 'success');
        
        // Auto-scroll to generated prompt
        setTimeout(() => {
          const promptElement = document.getElementById('generated-prompt');
          if (promptElement) {
            promptElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }, 300);
    } catch (err) {
      setError('Failed to generate prompt. Please try again.');
      addToast('❌ Failed to generate prompt', 'error');
      console.error('Error generating prompt:', err);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setLoading(false);
        setLoadingProgress(0);
      }, 500);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    addToast('📋 Copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPrompt = () => {
    const blob = new Blob([generatedPrompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-prompt.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('💾 Prompt downloaded!', 'success');
  };

  const availableFrameworks = frameworks.filter(f => 
    f.lang === 'all' || f.lang.includes(language)
  );

  return (
    <>
      <MatrixRain />
      <ToastNotification toasts={toasts} removeToast={removeToast} />
      
      <div className="min-h-screen relative z-10">
        <div className="max-w-5xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12 animate-slide-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-black p-2 rounded-lg">
                <Terminal className="w-12 h-12 text-green-400 glow-pulse" />
              </div>
              <h1 className="text-5xl font-bold text-green-400 glow-text flex items-center">
                AI Prompt Generator
                <BlinkingCursor />
              </h1>
            </div>
            <p className="text-green-500 text-lg">
              Transform ideas into detailed AI prompts for code generation
            </p>
            <div className="flex items-center justify-center gap-2 mt-3 text-green-600 text-sm">
              <Zap className="w-4 h-4" />
              <span>Powered by Claude Sonnet 4</span>
            </div>
          </div>

          {/* Idea Generator */}
          <IdeaGenerator onUseIdea={handleUseIdea} addToast={addToast} />

          {/* Main Form */}
          <div id="prompt-form" className="bg-black border-2 border-green-500 rounded-xl p-8 shadow-2xl glow-green hover-scale animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-6">
              <Code2 className="w-7 h-7 text-green-400 glow-pulse" />
              <h2 className="text-2xl font-bold text-green-400 glow-pulse-text">Configure Your Prompt</h2>
            </div>

            <div className="space-y-6">
              {/* Basic Settings Accordion */}
              <div className="border-2 border-green-500/50 rounded-lg overflow-hidden hover-scale">
                <button
                  onClick={() => setBasicOpen(!basicOpen)}
                  className="w-full flex items-center justify-between p-4 bg-green-950/20 hover:bg-green-950/30 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-green-400 glow-pulse" />
                    <span className="font-bold text-green-400 glow-pulse-text">Basic Settings</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-green-400 transition-transform ${basicOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {basicOpen && (
                  <div className="p-6 space-y-6 border-t-2 border-green-500/30 animate-fade-in">
                    {/* Project Description */}
                    <div>
                      <label className="block text-sm font-semibold text-green-300 mb-2">
                        Project Description *
                      </label>
                      <textarea
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        placeholder="Describe what you want to build... e.g., 'A task management web app with user authentication, real-time updates, and drag-and-drop functionality'"
                        className="w-full h-32 px-4 py-3 bg-black text-green-400 border-2 border-green-500/50 rounded-lg focus:border-green-400 focus:outline-none resize-none placeholder:text-green-700 font-mono"
                      />
                    </div>

                    {/* Language Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-green-300 mb-2">
                        Programming Language
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {languages.map((lang) => (
                          <button
                            key={lang.id}
                            onClick={() => {
                              setLanguage(lang.id);
                              // Reset framework if not compatible
                              if (!availableFrameworks.find(f => f.id === framework)) {
                                setFramework('none');
                              }
                            }}
                            className={`px-3 py-2 rounded-lg font-medium text-sm transition-all border-2 hover-scale ${
                              language === lang.id
                                ? 'bg-green-500 text-black border-green-400 shadow-lg scale-105 glow-green-strong selected-glow'
                                : 'bg-black text-green-400 border-green-700 hover:border-green-500 hover:glow-green'
                            }`}
                          >
                            <span className="mr-1">{lang.icon}</span>
                            {lang.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Framework Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-green-300 mb-2">
                        Framework / Library
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {availableFrameworks.map((fw) => (
                          <button
                            key={fw.id}
                            onClick={() => setFramework(fw.id)}
                            className={`px-3 py-2 rounded-lg font-medium text-sm transition-all border-2 hover-scale ${
                              framework === fw.id
                                ? 'bg-green-500 text-black border-green-400 shadow-lg scale-105 glow-green-strong selected-glow'
                                : 'bg-black text-green-400 border-green-700 hover:border-green-500 hover:glow-green'
                            }`}
                          >
                            {fw.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Complexity Level */}
                    <div>
                      <label className="block text-sm font-semibold text-green-300 mb-2">
                        Complexity Level
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {complexityLevels.map((level) => (
                          <button
                            key={level.id}
                            onClick={() => setComplexity(level.id)}
                            className={`p-3 rounded-lg border-2 transition-all hover-scale ${
                              complexity === level.id
                                ? 'bg-green-500 text-black border-green-400 shadow-lg scale-105 glow-green-strong selected-glow'
                                : 'bg-black text-green-400 border-green-700 hover:border-green-500 hover:glow-green'
                            }`}
                          >
                            <div className="text-left">
                              <div className="font-bold text-sm">{level.name}</div>
                              <div className="text-xs opacity-80 mt-1">{level.desc}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Advanced Settings Accordion */}
              <div className="border-2 border-green-500/50 rounded-lg overflow-hidden hover-scale">
                <button
                  onClick={() => setAdvancedOpen(!advancedOpen)}
                  className="w-full flex items-center justify-between p-4 bg-green-950/20 hover:bg-green-950/30 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-green-400 glow-pulse" />
                    <span className="font-bold text-green-400 glow-pulse-text">Advanced Settings</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-green-400 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {advancedOpen && (
                  <div className="p-6 space-y-6 border-t-2 border-green-500/30 animate-fade-in">
                    {/* Code Style */}
                    <div>
                      <label className="block text-sm font-semibold text-green-300 mb-2">
                        Code Style Paradigm
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {codeStyles.map((style) => (
                          <button
                            key={style.id}
                            onClick={() => setCodeStyle(style.id)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all border-2 hover-scale ${
                              codeStyle === style.id
                                ? 'bg-green-500 text-black border-green-400 shadow-lg scale-105 glow-green-strong selected-glow'
                                : 'bg-black text-green-400 border-green-700 hover:border-green-500 hover:glow-green'
                            }`}
                          >
                            <span className="mr-1">{style.icon}</span>
                            {style.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <label className="block text-sm font-semibold text-green-300 mb-2">
                        Specific Features (Optional)
                      </label>
                      <textarea
                        value={features}
                        onChange={(e) => setFeatures(e.target.value)}
                        placeholder="List specific features, integrations, or requirements... e.g., 'authentication, database ORM, REST API, unit tests'"
                        className="w-full h-24 px-4 py-3 bg-black text-green-400 border-2 border-green-500/50 rounded-lg focus:border-green-400 focus:outline-none resize-none placeholder:text-green-700 font-mono"
                      />
                    </div>

                    {/* Constraints */}
                    <div>
                      <label className="block text-sm font-semibold text-green-300 mb-2">
                        Constraints & Requirements (Optional)
                      </label>
                      <textarea
                        value={constraints}
                        onChange={(e) => setConstraints(e.target.value)}
                        placeholder="Any constraints, coding standards, or special requirements... e.g., 'must be async, follow PEP 8, no external dependencies'"
                        className="w-full h-24 px-4 py-3 bg-black text-green-400 border-2 border-green-500/50 rounded-lg focus:border-green-400 focus:outline-none resize-none placeholder:text-green-700 font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading || !projectDescription.trim()}
                className={`w-full bg-green-500 text-black font-bold py-5 rounded-xl hover:bg-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg border-2 border-green-400 hover-scale animate-slide-in ${!loading && projectDescription.trim() ? 'glow-pulse' : 'glow-green-strong'}`}
                style={{ animationDelay: '0.3s' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="animate-typing">
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </span>
                    Generating Your Prompt
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 glow-pulse" />
                    Generate AI-Ready Prompt
                  </>
                )}
              </button>

              {/* Loading Progress Bar */}
              {loading && (
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

              {/* Generated Prompt Display */}
              {generatedPrompt && (
                <div id="generated-prompt" className="bg-black border-2 border-green-500 rounded-xl overflow-hidden glow-green animate-slide-in">
                  <div className="px-6 py-4 bg-green-950/20 border-b-2 border-green-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileCode className="w-5 h-5 text-green-400" />
                      <h2 className="text-xl font-bold text-green-400">Your AI-Ready Prompt</h2>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-black rounded-lg hover:bg-green-400 transition text-sm font-medium border-2 border-green-400 glow-green"
                      >
                        {copied ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                      <button
                        onClick={downloadPrompt}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-black rounded-lg hover:bg-green-400 transition text-sm font-medium border-2 border-green-400 glow-green"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                  <div className="px-6 py-5 max-h-[500px] overflow-y-auto">
                    <pre className="text-green-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                      {generatedPrompt}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info Cards */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-black border-2 border-green-500 rounded-xl p-6 hover:border-green-400 transition hover-scale glow-green animate-slide-in" style={{ animationDelay: '0.4s' }}>
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-bold text-green-400 mb-2">Ultra-Detailed</h3>
              <p className="text-sm text-green-500">
                Generates comprehensive prompts with all technical specifications
              </p>
            </div>
            <div className="bg-black border-2 border-green-500 rounded-xl p-6 hover:border-green-400 transition hover-scale glow-green animate-slide-in" style={{ animationDelay: '0.5s' }}>
              <div className="text-4xl mb-3">🔧</div>
              <h3 className="font-bold text-green-400 mb-2">Multi-Language</h3>
              <p className="text-sm text-green-500">
                Support for 10+ programming languages and popular frameworks
              </p>
            </div>
            <div className="bg-black border-2 border-green-500 rounded-xl p-6 hover:border-green-400 transition hover-scale glow-green animate-slide-in" style={{ animationDelay: '0.6s' }}>
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-bold text-green-400 mb-2">AI-Optimized</h3>
              <p className="text-sm text-green-500">
                Crafted to work perfectly with Claude, GPT, Gemini, and Grok
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}