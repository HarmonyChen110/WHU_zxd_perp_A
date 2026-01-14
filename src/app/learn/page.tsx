"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { data } from "@/data"
import { useProgressStore } from "@/lib/storage/progressStore"
import { useRouter } from "next/navigation"

const difficultyColors = {
  beginner: "bg-green-500",
  intermediate: "bg-yellow-500",
  advanced: "bg-red-500",
}

const difficultyLabels = {
  beginner: "入门",
  intermediate: "中级",
  advanced: "高级",
}

export default function LearnPage() {
  const { currentPath, moduleProgress, setCurrentPath } = useProgressStore()
  const router = useRouter()

  const handlePathClick = (pathId: string) => {
    setCurrentPath(pathId)
    router.push(`/learn/path/${pathId}`)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">学习路径</h1>
      <p className="text-muted-foreground mb-8">选择适合你的学习路径，系统掌握MTB免疫逃逸机制</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.paths.paths.map((path: { id: string; name: string; description: string; duration: string; difficulty: string; estimatedHours: number; phases: { modules: string[] }[] }) => {
          // Calculate progress based on modules in this specific path
          const pathModuleIds = path.phases.flatMap((p) => p.modules)
          const totalModules = pathModuleIds.length
          const completedModules = pathModuleIds.filter(
            (moduleId) => {
              const progress = moduleProgress[moduleId]
              return progress && progress.completed === progress.total && progress.total > 0
            }
          ).length
          const progress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0
          const isActive = currentPath === path.id

          return (
            <Card
              key={path.id}
              className={`h-full hover:shadow-lg transition-shadow cursor-pointer ${
                isActive ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => handlePathClick(path.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{path.name}</CardTitle>
                  <Badge className={difficultyColors[path.difficulty as keyof typeof difficultyColors]}>
                    {difficultyLabels[path.difficulty as keyof typeof difficultyLabels]}
                  </Badge>
                </div>
                <CardDescription>{path.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">时长</span>
                    <span>{path.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">预计学时</span>
                    <span>{path.estimatedHours}小时</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">阶段数</span>
                    <span>{path.phases.length}个阶段</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2">
                <div className="flex justify-between w-full text-sm">
                  <span className="text-muted-foreground">当前进度</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
                <Button className="w-full" size="sm" variant={isActive ? "default" : "outline"}>
                  {isActive ? "继续学习" : progress > 0 ? "继续" : "开始学习"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
