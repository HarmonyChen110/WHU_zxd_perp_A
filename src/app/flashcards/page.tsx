"use client";

import Link from "next/link";
import { useFlashcardStore } from "@/lib/storage/flashcardStore";
import { data } from "@/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Brain, Clock, CheckCircle2, Zap } from "lucide-react";

export default function FlashcardsPage() {
  const { getDueCards, getMasteredCards } = useFlashcardStore();
  const allCardIds = data.flashcards.map((c: { id: string }) => c.id);

  const dueCards = getDueCards(allCardIds);
  const masteredCards = getMasteredCards(allCardIds);
  const learningCards = allCardIds.length - masteredCards.length;

  const categoryStats: Record<string, number> = data.flashcards.reduce((acc: Record<string, number>, card: { category: string }) => {
    acc[card.category] = (acc[card.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Brain className="w-10 h-10 text-blue-600" />
            闪卡复习系统
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            基于SM-2间隔重复算法的科学记忆工具
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                今日到期
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dueCards.length}</div>
              <CardDescription className="text-blue-100">张卡片待复习</CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                已掌握
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{masteredCards.length}</div>
              <CardDescription className="text-green-100">张卡片已掌握</CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                学习中
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{learningCards}</div>
              <CardDescription className="text-yellow-100">张卡片学习中</CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="w-4 h-4" />
                总计
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{allCardIds.length}</div>
              <CardDescription className="text-purple-100">张闪卡</CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>按类别统计</CardTitle>
              <CardDescription>各知识领域卡片分布</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(categoryStats).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <Badge variant="outline" className="capitalize">
                    {category === "molecule" && "分子"}
                    {category === "cell" && "细胞"}
                    {category === "mechanism" && "机制"}
                    {category === "paper" && "论文"}
                    {category === "interview" && "面试"}
                    {category === "disease" && "疾病"}
                    {category === "synthesis" && "综合"}
                  </Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{count} 张</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>复习建议</CardTitle>
              <CardDescription>SM-2算法优化复习时机</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">及时复习</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    在卡片到期当天复习效果最佳
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">诚实评分</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    根据实际记忆情况评分，算法才能准确安排
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">每日坚持</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    连续复习能显著提高长期记忆效果
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-1">开始今日复习</h3>
                <p className="text-blue-100">
                  {dueCards.length > 0
                    ? `有 ${dueCards.length} 张卡片等待复习`
                    : "所有卡片已复习完毕"}
                </p>
              </div>
              <Link href="/flashcards/review">
                <Button
                  size="lg"
                  variant="secondary"
                  disabled={dueCards.length === 0}
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  {dueCards.length > 0 ? "开始复习" : "已完成"}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
