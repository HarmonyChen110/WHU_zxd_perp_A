"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnswerReveal } from "@/components/interview/AnswerReveal";
import { Star, Shuffle, ChevronDown, ChevronUp } from "lucide-react";
import { interviewData } from "@/data";

interface Question {
  id: string;
  question: string;
  category: string;
  answer: {
    keyPoints: string[];
    fullAnswer: string;
    keywords: string[];
  };
  difficulty: number;
  priority: string;
  relatedModules?: string[];
  tags?: string[];
}

const categoryLabels: Record<string, string> = {
  basic: "基础概念",
  mechanism: "机制原理",
  research: "研究成果",
  technique: "实验技术",
  disease: "疾病知识",
  paper: "论文细节",
  synthesis: "综合理解",
  application: "应用思考",
  personal: "个人问题",
};

const difficultyLabels: Record<number, string> = {
  1: "入门",
  2: "简单",
  3: "中等",
  4: "困难",
  5: "挑战",
};

const difficultyColors: Record<number, string> = {
  1: "bg-blue-100 text-blue-800",
  2: "bg-green-100 text-green-800",
  3: "bg-yellow-100 text-yellow-800",
  4: "bg-orange-100 text-orange-800",
  5: "bg-red-100 text-red-800",
};

const priorityLabels: Record<string, string> = {
  essential: "必答",
  important: "重要",
  general: "了解",
  challenge: "挑战",
};

const priorityColors: Record<string, string> = {
  essential: "text-red-500",
  important: "text-orange-500",
  general: "text-gray-400",
  challenge: "text-purple-500",
};

// Extract all unique categories from the data
const allCategories = Array.from(new Set(interviewData.questions.map((q) => q.category)));
const categories = ["全部", ...allCategories];
const difficulties = [1, 2, 3, 4, 5];
const priorities = ["全部", "essential", "important", "general", "challenge"];

function QuestionCard({ question, isFavorite, onToggleFavorite }: { question: Question; isFavorite: boolean; onToggleFavorite: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{question.question}</CardTitle>
          <Button variant="ghost" size="icon-sm" onClick={onToggleFavorite}>
            <Star className={`h-4 w-4 ${isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
          </Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline">{categoryLabels[question.category] || question.category}</Badge>
          <Badge className={difficultyColors[question.difficulty]}>
            难度: {difficultyLabels[question.difficulty]}
          </Badge>
          <span className={`text-xs ${priorityColors[question.priority]}`}>
            {priorityLabels[question.priority]}
          </span>
        </div>
        {question.tags && question.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-1">
            {question.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="w-full justify-between">
          {expanded ? "收起答案" : "查看答案"}
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {expanded && (
          <AnswerReveal
            keyPoints={question.answer.keyPoints}
            fullAnswer={question.answer.fullAnswer}
            keywords={question.answer.keywords}
            className="mt-4"
          />
        )}
      </CardContent>
    </Card>
  );
}

export default function InterviewPage() {
  const [category, setCategory] = useState("全部");
  const [difficulty, setDifficulty] = useState<number | 0>(0); // 0 means all
  const [priority, setPriority] = useState("全部");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filtered = useMemo(() => {
    return interviewData.questions.filter((q) => {
      if (category !== "全部" && q.category !== category) return false;
      if (difficulty !== 0 && q.difficulty !== difficulty) return false;
      if (priority !== "全部" && q.priority !== priority) return false;
      return true;
    });
  }, [category, difficulty, priority]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const randomQuestion = () => {
    setPracticeMode(true);
    setCurrentIndex(Math.floor(Math.random() * filtered.length));
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">面试题库</h1>
      <p className="text-muted-foreground">共 {interviewData.questions.length} 道题目</p>

      <Tabs defaultValue="browse">
        <TabsList>
          <TabsTrigger value="browse">浏览题目</TabsTrigger>
          <TabsTrigger value="favorites">我的收藏 ({favorites.size})</TabsTrigger>
          <TabsTrigger value="practice">练习模式</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded px-3 py-1.5 text-sm">
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "全部" ? c : categoryLabels[c] || c}
                </option>
              ))}
            </select>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value === "0" ? 0 : Number(e.target.value))}
              className="border rounded px-3 py-1.5 text-sm"
            >
              <option value="0">全部难度</option>
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {difficultyLabels[d]}
                </option>
              ))}
            </select>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="border rounded px-3 py-1.5 text-sm">
              <option value="全部">全部优先级</option>
              {priorities
                .filter((p) => p !== "全部")
                .map((p) => (
                  <option key={p} value={p}>
                    {priorityLabels[p]}
                  </option>
                ))}
            </select>
          </div>
          <div className="grid gap-4">
            {filtered.map((q) => (
              <QuestionCard key={q.id} question={q} isFavorite={favorites.has(q.id)} onToggleFavorite={() => toggleFavorite(q.id)} />
            ))}
            {filtered.length === 0 && <p className="text-muted-foreground text-center py-8">没有符合条件的题目</p>}
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          {favorites.size === 0 ? (
            <p className="text-muted-foreground text-center py-8">暂无收藏题目</p>
          ) : (
            <div className="grid gap-4">
              {interviewData.questions
                .filter((q) => favorites.has(q.id))
                .map((q) => (
                  <QuestionCard key={q.id} question={q} isFavorite onToggleFavorite={() => toggleFavorite(q.id)} />
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="practice" className="space-y-4">
          <Button onClick={randomQuestion} disabled={filtered.length === 0}>
            <Shuffle className="h-4 w-4 mr-2" />
            随机抽题 ({filtered.length} 题)
          </Button>
          {practiceMode && filtered.length > 0 && (
            <QuestionCard
              question={filtered[currentIndex]}
              isFavorite={favorites.has(filtered[currentIndex].id)}
              onToggleFavorite={() => toggleFavorite(filtered[currentIndex].id)}
            />
          )}
          {practiceMode && filtered.length === 0 && <p className="text-muted-foreground">没有可用的题目</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}
