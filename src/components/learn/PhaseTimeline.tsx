"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { ModuleCard } from "./ModuleCard";
import { useProgressStore } from "@/lib/storage/progressStore";

interface Phase {
  id: string;
  name: string;
  duration: string;
  modules: string[];
  objectives: string[];
}

interface PhaseTimelineProps {
  phases: Phase[];
}

export function PhaseTimeline({ phases }: PhaseTimelineProps) {
  const { moduleProgress } = useProgressStore();

  const getPhaseStatus = (modules: string[]) => {
    const completedCount = modules.filter(
      (m) => moduleProgress[m] && moduleProgress[m].completed === moduleProgress[m].total && moduleProgress[m].total > 0
    ).length;
    const inProgressCount = modules.filter(
      (m) => moduleProgress[m] && moduleProgress[m].completed > 0 && moduleProgress[m].completed < moduleProgress[m].total
    ).length;

    if (completedCount === modules.length) return "completed";
    if (completedCount > 0 || inProgressCount > 0) return "in-progress";
    return "pending";
  };

  const getPhaseProgress = (modules: string[]) => {
    const completedCount = modules.filter(
      (m) => moduleProgress[m] && moduleProgress[m].completed === moduleProgress[m].total && moduleProgress[m].total > 0
    ).length;
    return (completedCount / modules.length) * 100;
  };

  return (
    <div className="relative">
      {phases.map((phase, index) => {
        const status = getPhaseStatus(phase.modules);
        const progress = getPhaseProgress(phase.modules);

        return (
          <div key={phase.id} className="relative">
            {index < phases.length - 1 && (
              <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
            )}
            <div className="flex gap-4 mb-8">
              <div className="flex-shrink-0">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${
                    status === "completed"
                      ? "bg-green-100 border-green-500"
                      : status === "in-progress"
                      ? "bg-blue-100 border-blue-500"
                      : "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600"
                  }`}
                >
                  {status === "completed" ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : status === "in-progress" ? (
                    <Clock className="w-6 h-6 text-blue-600 animate-pulse" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </div>
              <Card className="flex-1">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant={
                            status === "completed"
                              ? "default"
                              : status === "in-progress"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          第{index + 1}阶段
                        </Badge>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {phase.duration}
                        </span>
                      </div>
                      <CardTitle>{phase.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {phase.objectives.join("、")}
                      </CardDescription>
                    </div>
                  </div>
                  {progress > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">完成进度</span>
                        <span className="font-medium">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {phase.modules.map((moduleId) => (
                      <ModuleCard key={moduleId} moduleId={moduleId} showProgress={false} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      })}
    </div>
  );
}
