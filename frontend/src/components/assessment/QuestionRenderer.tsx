"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AssessmentQuestion, AssessmentAnswer } from "@/types/assessment";

interface QuestionRendererProps {
  question: AssessmentQuestion;
  onAnswer: (answer: AssessmentAnswer) => void;
}

function getDefaultAnswer(question: AssessmentQuestion): AssessmentAnswer {
  switch (question.type) {
    case "slider":
      return (question.default as number | undefined) ?? question.min ?? 1;
    case "multi_select":
      return [];
    case "skill_selector":
      return {};
    default:
      return (question.default as string | undefined) ?? "";
  }
}

export function QuestionRenderer({ question, onAnswer }: QuestionRendererProps) {
  const [answer, setAnswer] = useState<AssessmentAnswer>(getDefaultAnswer(question));

  useEffect(() => {
    setAnswer(getDefaultAnswer(question));
  }, [question]);

  const handleSubmit = () => {
    if (question.required && (!answer || (Array.isArray(answer) && answer.length === 0))) {
      return;
    }
    onAnswer(answer);
  };

  // Get question category for styling
  const category = (question as any).category || "general";
  const categoryColors: Record<string, string> = {
    personality: "from-purple-500 to-pink-500",
    work_style: "from-cyan-500 to-blue-500",
    communication: "from-green-500 to-emerald-500",
    values: "from-yellow-500 to-orange-500",
    preferences: "from-indigo-500 to-purple-500",
    skills: "from-red-500 to-pink-500",
    general: "from-gray-500 to-gray-600"
  };
  const categoryColor = categoryColors[category] || categoryColors.general;

  const renderQuestionInput = () => {
    switch (question.type) {
      case "multi_select":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {question.options?.map((option, index) => {
              const isSelected = Array.isArray(answer) && answer.includes(option);
              return (
                <motion.button
                  key={index}
                  type="button"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className={cn(
                    "w-full flex items-center space-x-4 p-5 rounded-xl border-4 cursor-pointer transition-all duration-200 shadow-lg text-left",
                    "focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-offset-2",
                    isSelected
                      ? "bg-cyan-400 text-black border-black shadow-2xl scale-[1.02]"
                      : "bg-white text-black border-black hover:bg-gray-50 hover:border-gray-400 active:scale-[0.98]"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const currentAnswer = Array.isArray(answer) ? answer : [];
                    if (currentAnswer.includes(option)) {
                      setAnswer(currentAnswer.filter(item => item !== option));
                    } else {
                      setAnswer([...currentAnswer, option]);
                    }
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <div className="flex-shrink-0">
                    <div
                      className={cn(
                        "h-6 w-6 rounded border-2 border-black flex items-center justify-center transition-all duration-200",
                        isSelected
                          ? "bg-black"
                          : "bg-white"
                      )}
                    >
                      {isSelected && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-4 h-4 text-cyan-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </motion.svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-base font-bold leading-snug block">
                      {option}
                    </span>
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="flex-shrink-0 w-8 h-8 bg-black text-cyan-400 rounded-full flex items-center justify-center text-lg font-black border-2 border-black"
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        );

      case "single_choice":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Select 
              value={typeof answer === "string" ? answer : ""} 
              onValueChange={setAnswer}
            >
              <SelectTrigger className="bg-white border-2 border-gray-300 hover:border-blue-500 transition-colors">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        );

      case "skill_selector":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {question.skills?.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor={`skill-${index}`} className="text-sm font-medium flex items-center space-x-2">
                  <span>{skill}</span>
                  {(answer as Record<string, string>)[skill] && (answer as Record<string, string>)[skill] !== "None" && (
                    <Badge variant="secondary" className="text-xs">
                      {(answer as Record<string, string>)[skill]}
                    </Badge>
                  )}
                </Label>
                <Select
                  value={(answer as Record<string, string>)[skill] || "None"}
                  onValueChange={(value) => {
                    setAnswer({
                      ...(answer as Record<string, string>),
                      [skill]: value
                    });
                  }}
                >
                  <SelectTrigger className="bg-white border-2 border-gray-300 hover:border-blue-500 transition-colors">
                    <SelectValue placeholder="Select proficiency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">Not Selected</SelectItem>
                    {question.proficiency_levels?.map((level, levelIndex) => (
                      <SelectItem key={levelIndex} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            ))}
          </motion.div>
        );

      case "text_input":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Textarea
              value={answer as string}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={question.placeholder || "Enter your answer..."}
              className="min-h-[120px] border-2 border-gray-300 focus:border-blue-500 transition-colors resize-none"
              rows={4}
            />
            <div className="text-xs text-gray-500 mt-1">
              {(answer as string)?.length || 0} characters
            </div>
          </motion.div>
        );

      case "slider":
        const questionWithLabels = question as any;
        const labels = questionWithLabels.labels || {};
        const minLabel = labels[String(question.min || 1)] || String(question.min || 1);
        const maxLabel = labels[String(question.max || 10)] || String(question.max || 10);
        const isHoursQuestion = question.question.toLowerCase().includes("hour");
        
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 font-medium font-mono">{minLabel}</span>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-cyan-400 to-purple-400 text-black px-4 py-2 rounded-full font-black text-lg border-2 border-black"
              >
                {isHoursQuestion ? `${String(answer)}h/day` : String(answer)}
              </motion.div>
              <span className="text-sm text-gray-600 font-medium font-mono">{maxLabel}</span>
            </div>
            <Slider
              value={[answer as number]}
              onValueChange={(value) => setAnswer(value[0])}
              min={question.min || 1}
              max={question.max || 10}
              step={1}
              className="w-full h-3"
            />
            {Object.keys(labels).length > 0 && (
              <div className="flex justify-between text-xs text-gray-500 font-mono mt-2">
                <span>{minLabel}</span>
                <span>{maxLabel}</span>
              </div>
            )}
          </motion.div>
        );

      default:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Input
              value={answer as string}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer..."
              className="border-2 border-gray-300 focus:border-blue-500 transition-colors"
            />
          </motion.div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Question Header with Category Badge */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              {(question as any).category && (
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 border-black",
                  `bg-gradient-to-r ${categoryColor} text-white`
                )}>
                  {(question as any).category.replace("_", " ")}
                </span>
              )}
              {question.required && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs font-black rounded border-2 border-black">
                  REQUIRED
                </span>
              )}
            </div>
            <h3 className="text-2xl font-black text-black leading-tight tracking-tight">
              {question.question}
            </h3>
          </div>
        </div>
        {question.required && (
          <p className="text-sm font-mono text-gray-600">This question is required to continue</p>
        )}
      </div>
      
      {/* Question Input */}
      <div className="pt-2">
        {renderQuestionInput()}
      </div>
      
      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          onClick={handleSubmit}
          disabled={question.required && (!answer || (Array.isArray(answer) && answer.length === 0))}
          className={cn(
            "w-full py-6 text-lg font-black border-4 border-black shadow-lg transition-all",
            question.required && (!answer || (Array.isArray(answer) && answer.length === 0))
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-cyan-400 to-purple-400 text-black hover:shadow-2xl hover:scale-[1.02]"
          )}
        >
          {question.required && (!answer || (Array.isArray(answer) && answer.length === 0))
            ? "Please answer to continue"
            : "Continue →"}
        </Button>
      </motion.div>
    </div>
  );
}
