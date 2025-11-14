"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MessageBubble } from "./MessageBubble";
import { QuestionRenderer } from "./QuestionRenderer";
import { TypingIndicator } from "./TypingIndicator";
import { PersonalityInsightCard } from "./PersonalityInsightCard";
import { ProgressTracker } from "./ProgressTracker";
import { AssessmentQuestion, AssessmentAnswer } from "@/types/assessment";
import { ArrowLeft, RotateCcw, Sparkles, CheckCircle2 } from "lucide-react";

interface ChatbotContainerProps {
  userId: string;
  onAssessmentComplete: (answers: Record<string, any>) => void;
}

export function ChatbotContainer({ userId, onAssessmentComplete }: ChatbotContainerProps) {
  const [messages, setMessages] = useState<Array<{
    id: string;
    type: "user" | "bot";
    content: string | AssessmentQuestion;
    timestamp: Date;
  }>>([]);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, AssessmentAnswer>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [personalityInsights, setPersonalityInsights] = useState<Array<{
    type: "personality" | "work_style" | "culture_fit" | "skill" | "trajectory";
    title: string;
    description: string;
    traits?: Array<{ trait: string; score: number }>;
  }>>([]);
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  // Load assessment questions on mount
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      
      // Start assessment first
      const startResponse = await fetch('/api/assessments/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
      
      if (!startResponse.ok) {
        console.warn('Failed to start assessment, using fallback');
        // Fallback to mock questions if backend fails
        await loadMockQuestions();
        return;
      }
      
      const startData = await startResponse.json();
      const assessmentId = startData.assessment_id;
      setAnswers(prev => ({ ...prev, assessment_id: assessmentId }));
      
      // Fetch real questions from backend
      const questionsResponse = await fetch('/api/assessments/questions');
      if (!questionsResponse.ok) {
        console.warn('Failed to fetch questions, using fallback');
        await loadMockQuestions();
        return;
      }
      
      const questionsData = await questionsResponse.json();
      const backendQuestions = questionsData.questions || [];
      
      // Map backend questions to frontend format
      const mappedQuestions: AssessmentQuestion[] = backendQuestions.map((q: any) => {
        const baseQuestion: any = {
          id: q.id,
          type: q.type,
          question: q.question,
          required: q.required !== false,
        };
        
        if (q.options) baseQuestion.options = q.options;
        if (q.skills) baseQuestion.skills = q.skills;
        if (q.proficiency_levels) baseQuestion.proficiency_levels = q.proficiency_levels;
        if (q.min !== undefined) baseQuestion.min = q.min;
        if (q.max !== undefined) baseQuestion.max = q.max;
        if (q.default !== undefined) baseQuestion.default = q.default;
        if (q.placeholder) baseQuestion.placeholder = q.placeholder;
        
        return baseQuestion;
      });
      
      setQuestions(mappedQuestions);
      
      // Show first question with enhanced intro
      setIsTyping(true);
      setTimeout(() => {
        setMessages([{
          id: "1",
          type: "bot",
          content: "🤖 ALRIGHT LISTEN UP. This isn't your typical assessment. We're going deep. I'm going to ask you questions about your personality, your vibes, your preferences - not just what skills you have. Be honest. No one's judging.",
          timestamp: new Date()
        }, {
          id: "2",
          type: "bot",
          content: "This will take about 15-20 minutes, but it's worth it. I'll find you jobs that actually match who you are, not just what you can code. Ready?",
          timestamp: new Date()
        }, {
          id: "3", 
          type: "bot",
          content: mappedQuestions[0],
          timestamp: new Date()
        }]);
        setIsTyping(false);
      }, 2000);
      
      // Track assessment start
      try {
        const { track } = await import("../../lib/analytics");
        if (userId && typeof userId === 'string') {
          track({ 
            type: "assessment_start", 
            userId: userId as string, 
            assessment_id: typeof assessmentId === 'string' || typeof assessmentId === 'number' ? assessmentId : undefined 
          });
        }
      } catch (trackError) {
        // Silently fail tracking
        console.debug('Failed to track assessment start:', trackError);
      }
      
    } catch (error) {
      console.error('Failed to load questions:', error);
      // Fallback to mock questions
      await loadMockQuestions();
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadMockQuestions = async () => {
    // Fallback mock questions with fun tone
    const mockQuestions: AssessmentQuestion[] = [
      {
        id: "career_interests",
        type: "multi_select",
        question: "What kind of code bullshit are you into? Pick your poison.",
        required: true,
        options: [
          "Frontend (Making pixels dance)",
          "Backend (Database wizardry)", 
          "Full Stack (Gluten-free development)",
          "DevOps (Herding digital cats)",
          "Data Science (Excel on steroids)",
          "Mobile (Tiny screen nightmares)",
          "UI/UX (Making pretty rectangles)",
          "Product Management (Corporate babysitting)"
        ]
      },
      {
        id: "experience_level",
        type: "single_choice",
        question: "How long have you been surviving in this industry?",
        required: true,
        options: [
          "Baby Dev (Just learned Git exists)",
          "Mid-tier Coder (Impostor syndrome expert)", 
          "Senior Dev (Forgets how to print('Hello World'))",
          "Lead (Meetings about meetings)"
        ]
      },
      {
        id: "technical_skills",
        type: "skill_selector",
        question: "Rate your bullshit tolerance... I mean, technical skills:",
        required: true,
        skills: ["JavaScript", "Python", "React", "Node.js", "TypeScript", "SQL"],
        proficiency_levels: ["WTF is this?", "I can Google it", "Actually useful", "Wizard level"]
      },
      {
        id: "time_availability",
        type: "slider",
        question: "How many hours per day can you sacrifice to escape unemployment?",
        required: true,
        min: 1,
        max: 10,
        default: 5
      },
      {
        id: "career_goals",
        type: "text_input",
        question: "What's your master plan for world domination... I mean, career goals?",
        required: false,
        placeholder: "Don't worry, we won't judge your absurd ambitions..."
      }
    ];
    
    setQuestions(mockQuestions);
    
    // Show first question
    setIsTyping(true);
    setTimeout(() => {
      setMessages([{
        id: "1",
        type: "bot",
        content: "🤖 ALRIGHT LISTEN UP. Let's find you a job that doesn't completely suck. No corporate bullshit, I promise.",
        timestamp: new Date()
      }, {
        id: "2", 
        type: "bot",
        content: mockQuestions[0],
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1500);
  };

  // startAssessment is now called from loadQuestions

  const handleAnswer = async (questionId: string, answer: AssessmentAnswer) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      content: formatAnswerDisplay(answer, questions[currentQuestionIndex]),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Use intelligent API endpoint
      const response = await fetch('/api/assessments/intelligent-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          question_id: questionId,
          answer: answer
        })
      });
      
      if (!response.ok) {
        // If API fails (404, 500, etc.), fall back to mock flow
        console.warn(`API request failed with status ${response.status}, falling back to mock flow`);
        throw new Error(`Request failed with status ${response.status}`);
      }
      
      const result = await response.json();
      
      // Process intelligent response
      setTimeout(() => {
        const messagesToAdd: Array<{
          id: string;
          type: "user" | "bot";
          content: string | AssessmentQuestion;
          timestamp: Date;
        }> = [];
        
        // Add real-time personality insights if available
        if (result.personality_analysis) {
          const personality = result.personality_analysis;
          
          // Add personality insights
          if (personality.insights && personality.insights.length > 0) {
            personality.insights.forEach((insight: string, index: number) => {
              setTimeout(() => {
                setMessages(prev => [...prev, {
                  id: `personality-${Date.now() + index}`,
                  type: "bot" as const,
                  content: insight,
                  timestamp: new Date()
                }]);
              }, index * 400);
            });
          }
          
          // Add personality profile card after a few answers
          if (personality.personality_profile && Object.keys(answers).length >= 3) {
            setTimeout(() => {
              const profile = personality.personality_profile;
              // Add insight card
              setPersonalityInsights(prev => [...prev, {
                type: "personality" as const,
                title: `Your Personality: ${profile.type}`,
                description: profile.summary || `Based on your responses, you're showing strong ${profile.type} traits. This helps us understand how you work best and what environments suit you.`,
                traits: profile.top_traits?.slice(0, 3) || []
              }]);
              
              // Also add as message
              const profileMessage = `🧠 **PERSONALITY INSIGHT**\n\nYou're showing strong ${profile.type} traits. This is helping us understand your work style and find the perfect match for you.`;
              
              setMessages(prev => [...prev, {
                id: `profile-${Date.now()}`,
                type: "bot" as const,
                content: profileMessage,
                timestamp: new Date()
              }]);
            }, 2000);
          }
        }
        
        // Add skill insights if available
        if (result.skill_insights && result.skill_insights.length > 0) {
          result.skill_insights.forEach((insight: string, index: number) => {
            setTimeout(() => {
              setMessages(prev => [...prev, {
                id: `skill-${Date.now() + index}`,
                type: "bot" as const,
                content: `💡 ${insight}`,
                timestamp: new Date()
              }]);
            }, index * 500);
          });
        }
        
        // Add trajectory analysis if available
        if (result.trajectory_analysis) {
          const analysis = result.trajectory_analysis;
          const trajectoryMessage = `📊 CAREER TRAJECTORY ANALYSIS: ${analysis.trajectory_score}/100\n\n${analysis.insights.join('\n\n')}`;
          
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: `trajectory-${Date.now()}`,
              type: "bot" as const,
              content: trajectoryMessage,
              timestamp: new Date()
            }]);
          }, 1500);
        }
        
        // Handle follow-up questions
        if (result.followup_question) {
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: (Date.now() + 200).toString(),
              type: "bot" as const,
              content: result.followup_question,
              timestamp: new Date()
            }]);
            setIsTyping(false);
          }, 2000);
          return;
        }
        
        // Handle standard next question
        if (result.next_standard_question) {
          const nextQuestion = result.next_standard_question;
          
          // Add answer acknowledgment if available (shows we're listening)
          if (result.answer_acknowledgment) {
            messagesToAdd.push({
              id: `ack-${Date.now()}`,
              type: "bot" as const,
              content: result.answer_acknowledgment,
              timestamp: new Date()
            });
          }
          
          // Add encouragement message if available
          if (result.encouragement_message) {
            messagesToAdd.push({
              id: `encourage-${Date.now()}`,
              type: "bot" as const,
              content: result.encouragement_message,
              timestamp: new Date()
            });
          }
          
          // Add contextual message before next question (from backend)
          if (result.contextual_message) {
            messagesToAdd.push({
              id: `context-${Date.now()}`,
              type: "bot" as const,
              content: result.contextual_message,
              timestamp: new Date()
            });
          }
          
          // Add the actual question
          messagesToAdd.push({
            id: (Date.now() + 1).toString(),
            type: "bot" as const,
            content: nextQuestion,
            timestamp: new Date()
          });
          
          setCurrentQuestionIndex(prev => prev + 1);
          setMessages(prev => [...prev, ...messagesToAdd]);
        }
        
        // Handle assessment completion
        if (result.assessment_complete) {
          setTimeout(async () => {
            await completeAssessment();
          }, 1000);
          return;
        }
        
        setIsTyping(false);
      }, 1500);
      
    } catch (error) {
      // Gracefully fall back to mock flow if API fails (404, network error, etc.)
      console.warn('Intelligent answer API unavailable, using mock flow:', error);
      
      setTimeout(async () => {
        const nextIndex = currentQuestionIndex + 1;
        
        if (nextIndex >= questions.length) {
          await completeAssessment();
        } else {
          setCurrentQuestionIndex(nextIndex);
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            type: "bot" as const,
            content: questions[nextIndex],
            timestamp: new Date()
          }]);
        }
        
        setIsTyping(false);
      }, 1000);
    }
  };

  const saveAnswer = async (questionId: string, answer: AssessmentAnswer) => {
    try {
      // Mock API call
      console.log('Saving answer:', questionId, answer);
    } catch (error) {
      console.error('Failed to save answer:', error);
    }
  };

  const completeAssessment = async () => {
    try {
      // Complete assessment with backend
      const response = await fetch('/api/assessments/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          all_answers: answers
        }),
      });
      
      let assessmentId = answers?.assessment_id || 'demo';
      
      if (response.ok) {
        const data = await response.json();
        assessmentId = data.assessment_id || assessmentId;
      } else {
        console.warn('Failed to complete assessment with backend, continuing anyway');
      }
      
      // Show completion message
      const completionMessage = {
        id: Date.now().toString(),
        type: "bot" as const,
        content: "💀 WELL LOOK AT YOU. Assessment complete. I've survived your responses and now I'm supposed to find you a job that pays actual money. Let's do this before you lose all hope.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, completionMessage]);
      setIsComplete(true);
      
      // Track assessment completion
      try {
        const { track } = await import("../../lib/analytics");
        if (userId && typeof userId === 'string') {
          track({ 
            type: "assessment_complete", 
            userId: userId as string, 
            assessment_id: typeof assessmentId === 'string' || typeof assessmentId === 'number' ? assessmentId : undefined 
          });
        }
      } catch (trackError) {
        // Silently fail tracking
        console.debug('Failed to track assessment complete:', trackError);
      }
      
      // Call onAssessmentComplete callback
      if (onAssessmentComplete) {
        onAssessmentComplete({ ...answers, assessment_id: assessmentId });
      }
      
      // Redirect to results page after a short delay
      setTimeout(() => {
        window.location.href = `/results?assessment_id=${assessmentId}`;
      }, 3000);
    } catch (error) {
      console.error('Failed to complete assessment:', error);
      // Still redirect even if API fails
      setTimeout(() => {
        window.location.href = `/results?assessment_id=${answers?.assessment_id || 'demo'}`;
      }, 3000);
    }
  };

  const formatAnswerDisplay = (answer: AssessmentAnswer, question: AssessmentQuestion): string => {
    switch (question.type) {
      case "multi_select":
        return Array.isArray(answer) ? `Selected: ${answer.join(", ")}` : String(answer);
      case "single_choice":
        return String(answer);
      case "text_input":
        return String(answer);
      case "slider":
        return `${answer} hours per day`;
      case "skill_selector":
        if (typeof answer === 'object' && answer !== null) {
          const skills = Object.entries(answer)
            .filter(([_, proficiency]) => proficiency !== 'None')
            .map(([skill, proficiency]) => `${skill} (${proficiency})`);
          return skills.length > 0 ? `Skills: ${skills.join(", ")}` : "No skills selected";
        }
        return String(answer);
      default:
        return String(answer);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // Remove the last bot question and user answer
      setMessages(prev => prev.slice(0, -2));
    }
  };

  const restartAssessment = () => {
    setMessages([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsComplete(false);
    loadQuestions();
  };

  const progress = ((currentQuestionIndex) / questions.length) * 100;

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto h-[600px] flex items-center justify-center" role="status" aria-live="polite" aria-label="Loading assessment">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
        <span className="sr-only">Loading assessment</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full max-w-4xl mx-auto flex flex-col shadow-2xl border-4 border-black bg-white overflow-hidden">
      {/* Header */}
      <div className="bg-black text-cyan-400 p-4 border-b-4 border-cyan-400 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="font-black text-xl flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-400 text-black rounded-full flex items-center justify-center font-black text-lg">
              🤖
            </div>
            CAREER TORTURE CHAMBER
          </div>
          {!isComplete && currentQuestionIndex > 0 && (
            <button
              onClick={goToPreviousQuestion}
              className="bg-cyan-400 text-black px-4 py-2 font-black border-2 border-black hover:bg-white transition-colors"
            >
              ← BACK
            </button>
          )}
        </div>
        
        <div className="mt-3 bg-black/20 p-2 border-2 border-cyan-400">
          <div className="flex justify-between font-mono text-sm">
            <span>TORTURE SESSION {currentQuestionIndex + 1}/{questions.length}</span>
            <span>{Math.round(progress)}% DONE WITH THIS BULLSHIT</span>
          </div>
          <div className="w-full bg-black/40 h-2 mt-2 border border-cyan-400">
            <div 
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 p-6 bg-gradient-to-b from-white via-gray-50 to-white min-h-0">
          <AnimatePresence>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </AnimatePresence>
          
          {/* Personality Insight Cards */}
          <AnimatePresence>
            {personalityInsights.map((insight, index) => (
              <PersonalityInsightCard
                key={`insight-${index}`}
                insight={insight}
                onDismiss={() => setPersonalityInsights(prev => prev.filter((_, i) => i !== index))}
              />
            ))}
          </AnimatePresence>
          
          <AnimatePresence>
            {isTyping && <TypingIndicator />}
          </AnimatePresence>
        </div>
        
        {!isComplete && currentQuestionIndex < questions.length && !isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="border-t-4 border-black bg-white p-8 flex-shrink-0 overflow-y-auto max-h-[50%] shadow-2xl"
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="font-mono text-xs text-gray-500 uppercase tracking-wider">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>
              <QuestionRenderer
                question={questions[currentQuestionIndex]}
                onAnswer={(answer: AssessmentAnswer) => handleAnswer(questions[currentQuestionIndex].id, answer)}
              />
            </div>
          </motion.div>
        )}
        
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border-t-4 border-black bg-gradient-to-br from-green-50 to-emerald-50 p-8 flex-shrink-0"
          >
            <div className="text-center space-y-6 max-w-2xl mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="text-7xl"
              >
                ✨
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-black text-black"
              >
                Assessment Complete!
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-mono text-gray-700 text-lg leading-relaxed"
              >
                We've analyzed your personality, work style, and preferences. Your personalized career profile is ready.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-4 justify-center pt-4"
              >
                <motion.button
                  onClick={() => window.location.href = `/results?assessment_id=${answers?.assessment_id || 'demo'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-cyan-400 to-purple-400 text-black px-8 py-4 font-black border-4 border-black hover:shadow-2xl transition-all text-lg"
                >
                  VIEW MY RESULTS →
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
