"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Zap, Calendar, BookMarked, ArrowRight } from "lucide-react";
import { data } from "@/data";
import { useProgressStore } from "@/lib/storage/progressStore";
import { useRouter } from "next/navigation";

const pathIcons = {
  "path-3days": Zap,
  "path-2weeks": Calendar,
  "path-1month": BookMarked,
};

const pathColors = {
  "path-3days": "from-red-500 to-orange-500",
  "path-2weeks": "from-blue-500 to-cyan-500",
  "path-1month": "from-green-500 to-emerald-500",
};

export function PathCard() {
  const { currentPath, moduleProgress, setCurrentPath } = useProgressStore();
  const router = useRouter();

  const handlePathClick = (pathId: string) => {
    setCurrentPath(pathId);
    router.push(`/learn/path/${pathId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {data.paths.paths.map((path: { id: string; phases: { modules: string[] }[]; difficulty: string; duration: string; estimatedHours: number; name: string; description: string }) => {
        const Icon = pathIcons[path.id as keyof typeof pathIcons] || BookMarked;
        const isActive = currentPath === path.id;
        // Calculate progress based on modules in this specific path
        const pathModuleIds = path.phases.flatMap((p: { modules: string[] }) => p.modules);
        const totalModules = pathModuleIds.length;
        const completedModules = pathModuleIds.filter(
          (moduleId) => {
            const progress = moduleProgress[moduleId];
            return progress && progress.completed === progress.total && progress.total > 0;
          }
        ).length;
        const progress = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

        return (
          <Card
            key={path.id}
            onClick={() => handlePathClick(path.id)}
            className={`h-full transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer ${
              isActive ? "ring-2 ring-blue-500" : ""
            }`}
          >
              <CardHeader className={`bg-gradient-to-r ${pathColors[path.id as keyof typeof pathColors] || "from-gray-500 to-gray-600"} text-white rounded-t-lg`}>
                <div className="flex items-center justify-between">
                  <Icon className="w-8 h-8" />
                  {isActive && <Badge className="bg-white text-gray-900">进行中</Badge>}
                </div>
                <CardTitle className="text-xl mt-2">{path.name}</CardTitle>
                <CardDescription className="text-white/90">
                  {path.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">难度</span>
                    <Badge
                      variant={
                        path.difficulty === "beginner"
                          ? "default"
                          : path.difficulty === "intermediate"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {path.difficulty === "beginner" && "入门"}
                      {path.difficulty === "intermediate" && "中等"}
                      {path.difficulty === "advanced" && "进阶"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">时长</span>
                    <span className="font-medium">{path.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">预计学时</span>
                    <span className="font-medium">{path.estimatedHours} 小时</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">学习阶段</span>
                    <span className="font-medium">{path.phases.length} 个阶段</span>
                  </div>
                  {progress > 0 && (
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">进度</span>
                        <span className="font-medium">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}
                  <Button className="w-full" size="sm">
                    {isActive ? "继续学习" : "开始学习"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
        );
      })}
    </div>
  );
}
