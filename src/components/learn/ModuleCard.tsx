"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, CheckCircle2, Circle } from "lucide-react";
import { data } from "@/data";
import { useProgressStore } from "@/lib/storage/progressStore";

const categoryColors: Record<string, string> = {
  basics: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  cells: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  disease: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  paper: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  synthesis: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
  technique: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const categoryNames: Record<string, string> = {
  basics: "基础知识",
  cells: "细胞类型",
  disease: "疾病背景",
  paper: "论文解析",
  synthesis: "全局综合",
  technique: "技术方法",
  mechanism: "机制研究",
};

interface ModuleCardProps {
  moduleId: string;
  showProgress?: boolean;
}

export function ModuleCard({ moduleId, showProgress = true }: ModuleCardProps) {
  const module = data.modules.modules.find((m: { id: string }) => m.id === moduleId);
  const { moduleProgress } = useProgressStore();
  const progress = moduleProgress[moduleId];

  if (!module) return null;

  const isCompleted = progress && progress.completed === progress.total && progress.total > 0;
  const isInProgress = progress && progress.completed > 0 && progress.completed < progress.total;

  return (
    <Link href={`/learn/module/${module.id}`}>
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={categoryColors[module.category] || "bg-gray-100 text-gray-800"}>
                  {categoryNames[module.category] || module.category}
                </Badge>
                {isCompleted && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    已完成
                  </Badge>
                )}
                {isInProgress && (
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    <Circle className="w-3 h-3 mr-1" />
                    学习中
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg">{module.title}</CardTitle>
              <CardDescription className="mt-1">{module.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{module.estimatedMinutes} 分钟</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>
                  难度: {"⭐".repeat(Math.min(module.difficulty, 5))}
                </span>
              </div>
            </div>
            {showProgress && progress && (
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">学习进度</span>
                  <span className="font-medium">
                    {Math.round((progress.completed / progress.total) * 100)}%
                  </span>
                </div>
                <Progress value={(progress.completed / progress.total) * 100} className="h-2" />
              </div>
            )}
            <Button variant="ghost" size="sm" className="w-full">
              {isCompleted ? "复习" : isInProgress ? "继续学习" : "开始学习"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

interface ModuleListProps {
  moduleIds: string[];
  title?: string;
}

export function ModuleList({ moduleIds, title }: ModuleListProps) {
  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {moduleIds.map((moduleId) => (
          <ModuleCard key={moduleId} moduleId={moduleId} />
        ))}
      </div>
    </div>
  );
}
