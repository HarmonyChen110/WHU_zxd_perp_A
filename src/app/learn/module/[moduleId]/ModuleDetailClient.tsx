"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronRight, Home, CheckCircle2, FileText, AlertCircle } from "lucide-react"
import { FlashCard } from "@/components/FlashCard"
import { AnswerReveal } from "@/components/interview/AnswerReveal"
import { useProgressStore } from "@/lib/storage/progressStore"
import React from "react"

export interface Module {
  id: string
  title: string
  category: string
  description: string
  estimatedMinutes: number
  difficulty: number
  contentFile?: string
  flashcards?: string[]
  interviewQuestions?: string[]
}

export interface FlashcardData {
  id: string
  question: string
  answer: string
  category: string
  keyPoints?: string[]
  mnemonic?: string
  tags?: string[]
}

export interface InterviewQuestion {
  id: string
  question: string
  category: string
  answer: {
    keyPoints: string[]
    fullAnswer: string
    keywords: string[]
  }
  difficulty: number
  priority: string
  relatedModules?: string[]
  tags?: string[]
  [key: string]: any // Allow additional properties
}

interface ModuleDetailClientProps {
  module: Module
  markdownContent: React.ReactNode
  relatedFlashcards?: FlashcardData[]
  relatedQuestions?: InterviewQuestion[]
}

const categoryLabels: Record<string, string> = {
  basics: "基础知识",
  cells: "细胞图谱",
  disease: "疾病背景",
  technique: "实验技术",
  paper: "论文解析",
  synthesis: "全局综合",
}

export function ModuleDetailClient({
  module,
  markdownContent,
  relatedFlashcards = [],
  relatedQuestions = []
}: ModuleDetailClientProps) {
  const { updateModuleProgress } = useProgressStore()
  const [completed, setCompleted] = useState(false)
  const [showFallbackNotice, setShowFallbackNotice] = useState(false)

  const handleComplete = () => {
    updateModuleProgress(module.id, 1, 1)
    setCompleted(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-blue-600">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/learn" className="hover:text-blue-600">
            学习模块
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white">{module.title}</span>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Badge className="mb-2">{categoryLabels[module.category] || module.category}</Badge>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {module.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{module.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>预计 {module.estimatedMinutes} 分钟</span>
            <span>难度: {"⭐".repeat(Math.min(module.difficulty, 5))}</span>
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="prose prose-blue dark:prose-invert max-w-none">
              {markdownContent}
            </div>
          </CardContent>
        </Card>

        {relatedFlashcards.length > 0 && (
          <>
            <Separator className="my-8" />
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                相关闪卡
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedFlashcards.map((card) => (
                  <FlashCard key={card.id} card={card} />
                ))}
              </div>
            </div>
          </>
        )}

        {relatedQuestions.length > 0 && (
          <>
            <Separator className="my-8" />
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">相关面试题</h2>
              <div className="space-y-4">
                {relatedQuestions.map((question) => (
                  <Card key={question.id}>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">{question.question}</h3>
                      <AnswerReveal
                        keyPoints={question.answer.keyPoints}
                        fullAnswer={question.answer.fullAnswer}
                        keywords={question.answer.keywords}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator className="my-8" />

        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                  {completed ? "已完成！" : "完成本模块学习"}
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {completed
                    ? "恭喜你完成了本模块的学习"
                    : "学习完成后点击按钮记录进度"}
                </p>
              </div>
              <Button
                onClick={handleComplete}
                disabled={completed}
                variant={completed ? "secondary" : "default"}
                className={completed ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {completed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    已完成
                  </>
                ) : (
                  "标记为完成"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
