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

  const renderQuestionInput = () => {
    switch (question.type) {
      case "multi_select":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
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
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 font-medium">{question.min || 1} hour</span>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold text-lg"
              >
                {String(answer)}h/day
              </motion.div>
              <span className="text-sm text-gray-600 font-medium">{question.max || 10} hours</span>
            </div>
            <Slider
              value={[answer as number]}
              onValueChange={(value) => setAnswer(value[0])}
              min={question.min || 1}
              max={question.max || 10}
              step={1}
              className="w-full h-3"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Minimal</span>
              <span>Moderate</span>
              <span>Intensive</span>
            </div>
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {renderQuestionInput()}
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <Button 
          onClick={handleSubmit}
          disabled={question.required && (!answer || (Array.isArray(answer) && answer.length === 0))}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {question.type === "slider" ? "Continue" : 
           question.type === "text_input" ? "Submit Answer" :
           question.type === "skill_selector" ? "Continue" :
           question.type === "single_choice" ? "Continue" : "Next"}
        </Button>
        
        {question.required && (!answer || (Array.isArray(answer) && answer.length === 0)) && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-500 text-center mt-2"
          >
            This question is required. Please provide an answer.
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}
