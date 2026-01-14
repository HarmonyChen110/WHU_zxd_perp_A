"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ChevronRight, Home, Play, RotateCcw } from "lucide-react"
import { ModuleCard } from "@/components/learn/ModuleCard"
import { useProgressStore } from "@/lib/storage/progressStore"

interface Path {
  id: string
  name: string
  description: string
  difficulty: string
  duration: string
  estimatedHours: number
  phases: Array<{
    id?: string
    name: string
    duration: string
    modules: string[]
    objectives: string[]
  }>
}

interface PathDetailClientProps {
  path: Path
}

export function PathDetailClient({ path }: PathDetailClientProps) {
  const { currentPath, moduleProgress, setCurrentPath } = useProgressStore()

  // Set current path when component mounts
  useEffect(() => {
    setCurrentPath(path.id)
  }, [path.id, setCurrentPath])

  // Calculate actual progress from moduleProgress
  const allModuleIds = path.phases.flatMap((phase) => phase.modules)
  const totalModules = allModuleIds.length
  const completedModulesIds = allModuleIds.filter(
    (moduleId) => {
      const progress = moduleProgress[moduleId]
      return progress && progress.completed === progress.total && progress.total > 0
    }
  )
  const overallProgress = totalModules > 0 ? Math.round((completedModulesIds.length / totalModules) * 100) : 0
  const hasStarted = overallProgress > 0

  // Find the first incomplete module to continue from
  const firstIncompleteModule = allModuleIds.find((moduleId) => {
    const progress = moduleProgress[moduleId]
    return !progress || progress.completed < progress.total
  })
  const continueModuleId = firstIncompleteModule || allModuleIds[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-blue-600">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/learn" className="hover:text-blue-600">
            学习路径
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white">{path.name}</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{path.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{path.description}</p>

          <div className="flex items-center gap-4 mb-4">
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
            <span className="text-sm text-gray-600 dark:text-gray-400">
              预计 {path.estimatedHours} 小时
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">•</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{path.duration}</span>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">整体进度</span>
              <span className="font-medium">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          {/* Start/Continue Button */}
          <div className="mt-4">
            <Link href={`/learn/module/${continueModuleId}`}>
              <Button size="lg" className="w-full sm:w-auto">
                {hasStarted ? (
                  <>
                    <RotateCcw className="w-5 h-5 mr-2" />
                    继续学习 ({completedModulesIds.length}/{totalModules} 已完成)
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    开始学习路径
                  </>
                )}
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          {path.phases.map((phase, index) => {
            const phaseCompleted = phase.modules.filter((m) => completedModulesIds.includes(m)).length
            const phaseProgress = phase.modules.length > 0 ? Math.round((phaseCompleted / phase.modules.length) * 100) : 0

            return (
              <div key={index} className="relative pl-12">
                {index < path.phases.length - 1 && (
                  <div className="absolute left-2 top-16 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                )}

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                        phaseProgress === 100
                          ? "bg-green-100 border-green-500"
                          : phaseProgress > 0
                          ? "bg-blue-100 border-blue-500"
                          : "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600"
                      }`}
                    >
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                  </div>

                  <Card className="flex-1">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
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
                      {phaseProgress > 0 && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-400">完成进度</span>
                            <span className="font-medium">{phaseProgress}%</span>
                          </div>
                          <Progress value={phaseProgress} className="h-2" />
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
            )
          })}
        </div>
      </div>
    </div>
  )
}
