"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnswerReveal } from "./AnswerReveal";
import { cn } from "@/lib/utils";

export interface Question {
  id: string;
  question: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  keyPoints: string[];
  fullAnswer: string;
  keywords?: string[];
}

interface QuestionCardProps {
  question: Question;
  className?: string;
}

const difficultyColors = {
  easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function QuestionCard({ question, className }: QuestionCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className={cn("transition-all", className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{question.question}</CardTitle>
        </div>
        <div className="flex gap-2 mt-2">
          <Badge className={difficultyColors[question.difficulty]} variant="outline">
            {question.difficulty}
          </Badge>
          <Badge variant="secondary">{question.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="w-full justify-between"
        >
          {expanded ? "Hide Answer" : "Show Answer"}
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {expanded && (
          <AnswerReveal
            keyPoints={question.keyPoints}
            fullAnswer={question.fullAnswer}
            keywords={question.keywords}
            className="mt-4 pt-4 border-t"
          />
        )}
      </CardContent>
    </Card>
  );
}
