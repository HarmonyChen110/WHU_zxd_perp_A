"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFlashcardStore } from "@/lib/storage/flashcardStore";
import { data } from "@/data";
import { FlashCard } from "@/components/FlashCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, CheckCircle2, XCircle } from "lucide-react";

export default function FlashcardReviewPage() {
  const router = useRouter();
  const { reviewCard, getDueCards } = useFlashcardStore();
  const allCardIds = data.flashcards.map((c: { id: string }) => c.id);

  const [dueCards, setDueCards] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [stats, setStats] = useState({ correct: 0, wrong: 0, total: 0 });

  useEffect(() => {
    const due = getDueCards(allCardIds);
    if (due.length === 0) {
      setCompleted(true);
    } else {
      setDueCards(due);
    }
  }, [getDueCards, allCardIds]);

  const currentCardId = dueCards[currentIndex];
  const currentCard = data.flashcards.find((c: { id: string }) => c.id === currentCardId);
  const progress = ((currentIndex + 1) / dueCards.length) * 100;

  const handleRate = (rating: number) => {
    if (currentCardId) {
      reviewCard(currentCardId, rating);
      setStats((prev) => ({
        ...prev,
        total: prev.total + 1,
        correct: rating >= 3 ? prev.correct + 1 : prev.correct,
        wrong: rating < 3 ? prev.wrong + 1 : prev.wrong,
      }));
    }

    setShowAnswer(false);
    if (currentIndex + 1 < dueCards.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    const due = getDueCards(allCardIds);
    setDueCards(due);
    setCurrentIndex(0);
    setShowAnswer(false);
    setCompleted(false);
    setStats({ correct: 0, wrong: 0, total: 0 });
  };

  if (completed && stats.total > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Link href="/flashcards">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
          </Link>

          <Card className="overflow-hidden">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  复习完成！
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  本次复习了 {stats.total} 张卡片
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.correct}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">记住了</div>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{stats.wrong}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">需加强</div>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Link href="/flashcards">
                  <Button variant="outline">返回首页</Button>
                </Link>
                <Button onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  再复习一轮
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Link href="/flashcards">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
          </Link>

          <Card className="mt-8">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                暂无待复习卡片
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                所有卡片都已按时复习，继续保持！
              </p>
              <Link href="/flashcards">
                <Button>返回闪卡首页</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <Link href="/flashcards">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
          </Link>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {currentIndex + 1} / {dueCards.length}
          </div>
        </div>

        <div className="mb-6">
          <Progress value={progress} className="h-2" />
        </div>

        <FlashCard
          card={currentCard}
          showAnswer={showAnswer}
          onToggle={() => setShowAnswer(!showAnswer)}
        />

        {!showAnswer ? (
          <div className="mt-6 text-center">
            <Button
              size="lg"
              className="w-full max-w-xs"
              onClick={() => setShowAnswer(true)}
            >
              显示答案
            </Button>
          </div>
        ) : (
          <div className="mt-6">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
              根据记忆情况评分
            </p>
            <div className="grid grid-cols-5 gap-2 max-w-lg mx-auto">
              <Button
                variant="outline"
                className="flex-col gap-1 h-auto py-3"
                onClick={() => handleRate(1)}
              >
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-xs">完全忘记</span>
              </Button>
              <Button
                variant="outline"
                className="flex-col gap-1 h-auto py-3"
                onClick={() => handleRate(2)}
              >
                <span className="text-lg">😕</span>
                <span className="text-xs">有印象</span>
              </Button>
              <Button
                variant="outline"
                className="flex-col gap-1 h-auto py-3"
                onClick={() => handleRate(3)}
              >
                <span className="text-lg">🤔</span>
                <span className="text-xs">困难</span>
              </Button>
              <Button
                variant="outline"
                className="flex-col gap-1 h-auto py-3"
                onClick={() => handleRate(4)}
              >
                <span className="text-lg">😊</span>
                <span className="text-xs">轻松</span>
              </Button>
              <Button
                variant="outline"
                className="flex-col gap-1 h-auto py-3 border-green-500 text-green-600 hover:bg-green-50"
                onClick={() => handleRate(5)}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-xs">完美</span>
              </Button>
            </div>
            <p className="text-center text-xs text-gray-500 mt-4">
              1=完全忘记 2=错误但有印象 3=困难回忆 4=轻松回忆 5=完美记忆
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
