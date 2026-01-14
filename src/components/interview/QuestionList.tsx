"use client";

import { QuestionCard, type Question } from "./QuestionCard";
import { cn } from "@/lib/utils";

interface QuestionListProps {
  questions: Question[];
  className?: string;
}

export function QuestionList({ questions, className }: QuestionListProps) {
  if (!questions.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No questions available
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {questions.map((q) => (
        <QuestionCard key={q.id} question={q} />
      ))}
    </div>
  );
}
