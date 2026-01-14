"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Calendar,
  BookMarked,
  Layers,
  Network,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { PathCard } from "@/components/learn/PathCard";

const quickLinks = [
  { title: "闪卡复习", icon: Layers, href: "/flashcards", desc: "基于SM-2算法的科学记忆" },
  { title: "机制图谱", icon: Network, href: "/mechanism", desc: "MTB免疫逃逸核心机制" },
  { title: "面试题库", icon: MessageSquare, href: "/interview", desc: "高频面试题及参考答案" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <section className="text-center space-y-4 py-12">
          <Badge className="mb-2" variant="secondary">
            潘勤教授研究生复试准备系统
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            ManLAM-B细胞-IL-10轴
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            深入理解MTB免疫逃逸机制，掌握核心知识点，顺利通过研究生复试
          </p>
        </section>

        {/* Learning Paths */}
        <section className="space-y-6 py-8">
          <div className="flex items-center gap-2">
            <BookMarked className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">选择学习路径</h2>
          </div>
          <PathCard />
        </section>

        {/* Quick Links */}
        <section className="space-y-6 py-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-bold">快速入口</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105">
                  <CardContent className="flex flex-col items-center text-center p-6 pt-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <link.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{link.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {link.desc}
                    </p>
                    <ArrowRight className="h-4 w-4 text-primary mt-auto" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Today's Recommendation */}
        <section className="space-y-6 py-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-bold">今日推荐</h2>
          </div>
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardHeader>
              <CardTitle className="text-white">ManLAM分子档案</CardTitle>
              <CardDescription className="text-blue-100">
                MTB细胞壁关键成分，免疫逃逸的核心分子 - "糖衣炮弹"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-blue-100">预计学习时间: 20分钟</p>
                  <p className="text-sm text-blue-100">难度: ⭐⭐</p>
                </div>
                <Link href="/learn/module/module-manlam">
                  <Button variant="secondary" size="lg">
                    立即学习
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Core Concepts */}
        <section className="space-y-6 py-8">
          <h2 className="text-2xl font-bold">核心概念速览</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-orange-200 dark:border-orange-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <h3 className="font-semibold">ManLAM</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  MTB细胞壁上的"糖衣炮弹"
                </p>
              </CardContent>
            </Card>
            <Card className="border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <h3 className="font-semibold">IL-10</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  免疫系统的"灭火器"
                </p>
              </CardContent>
            </Card>
            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <h3 className="font-semibold">Bregs</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  CD19+CD5+CD1dhi调节性B细胞
                </p>
              </CardContent>
            </Card>
            <Card className="border-purple-200 dark:border-purple-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <h3 className="font-semibold">STAT3</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Breg分化的"总开关"
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
