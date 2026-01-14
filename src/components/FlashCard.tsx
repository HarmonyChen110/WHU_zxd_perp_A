"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RotateCw, Lightbulb } from "lucide-react";

export interface FlashcardData {
  id: string;
  question: string;
  answer: string;
  category: string;
  keyPoints?: string[];
  mnemonic?: string;
  tags?: string[];
}

interface FlashCardProps {
  card: FlashcardData;
  showAnswer?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function FlashCard({ card, showAnswer: controlledShow, onToggle, className }: FlashCardProps) {
  const [internalShow, setInternalShow] = useState(false);
  const showAnswer = controlledShow !== undefined ? controlledShow : internalShow;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalShow(!internalShow);
    }
  };

  const categoryColors: Record<string, string> = {
    molecule: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    cell: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    mechanism: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    paper: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    interview: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    disease: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    synthesis: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
  };

  return (
    <motion.div
      className={`perspective-1000 ${className}`}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="min-h-[400px] cursor-pointer hover:shadow-xl transition-shadow duration-300"
        onClick={handleToggle}
      >
        <CardContent className="p-6 h-full">
          <div className="flex items-center justify-between mb-4">
            <Badge className={categoryColors[card.category] || "bg-gray-100 text-gray-800"}>
              {card.category}
            </Badge>
            {onToggle === undefined && (
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <RotateCw className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="min-h-[300px] flex flex-col">
            {!showAnswer ? (
              <>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  问题
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed flex-1">
                  {card.question}
                </p>
                {card.tags && card.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {card.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  点击查看答案
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, rotateY: -90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                  答案
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4">
                  {card.answer}
                </p>

                {card.keyPoints && card.keyPoints.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      关键点
                    </h4>
                    <ul className="space-y-1">
                      {card.keyPoints.map((point, i) => (
                        <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                          <span className="text-blue-500">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {card.mnemonic && (
                  <div className="mt-auto p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-1 text-sm">
                      💡 记忆技巧
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      {card.mnemonic}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
