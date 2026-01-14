"use client";

import { cn } from "@/lib/utils";

interface AnswerRevealProps {
  keyPoints: string[];
  fullAnswer: string;
  keywords?: string[];
  className?: string;
}

function highlightKeywords(text: string, keywords: string[]): React.ReactNode {
  if (!keywords.length) return text;
  const regex = new RegExp(`(${keywords.join("|")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    keywords.some((k) => k.toLowerCase() === part.toLowerCase()) ? (
      <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function AnswerReveal({
  keyPoints,
  fullAnswer,
  keywords = [],
  className,
}: AnswerRevealProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <h4 className="text-sm font-semibold mb-2">Key Points</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          {keyPoints.map((point, i) => (
            <li key={i}>{highlightKeywords(point, keywords)}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-sm font-semibold mb-2">Full Answer</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {highlightKeywords(fullAnswer, keywords)}
        </p>
      </div>
    </div>
  );
}
