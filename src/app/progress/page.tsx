"use client";

import { useProgressStore } from "@/lib/storage/progressStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useRef } from "react";

export default function ProgressPage() {
  const { currentPath, moduleProgress, knowledgeMastery, stats } =
    useProgressStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const completedModules = Object.values(moduleProgress).filter(
    (m) => m.completed === m.total && m.total > 0
  ).length;
  const totalModules = Object.keys(moduleProgress).length;
  const pathProgress =
    totalModules > 0
      ? Math.round(
          (Object.values(moduleProgress).reduce(
            (acc, m) => acc + (m.total > 0 ? m.completed / m.total : 0),
            0
          ) /
            totalModules) *
            100
        )
      : 0;

  const masteryData = Object.entries(knowledgeMastery).map(([id, value]) => ({
    name: id.slice(0, 8),
    mastery: value,
  }));

  const masteredCount = Object.values(knowledgeMastery).filter(
    (v) => v >= 80
  ).length;
  const learningCount = Object.values(knowledgeMastery).filter(
    (v) => v >= 40 && v < 80
  ).length;
  const pendingCount = Object.values(knowledgeMastery).filter(
    (v) => v < 40
  ).length;

  const flashcardData = [
    { name: "已掌握", value: masteredCount, color: "#22c55e" },
    { name: "学习中", value: learningCount, color: "#eab308" },
    { name: "待复习", value: pendingCount, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  const dailyData = [
    { day: "周一", time: Math.round(stats.totalStudyTime * 0.15) },
    { day: "周二", time: Math.round(stats.totalStudyTime * 0.2) },
    { day: "周三", time: Math.round(stats.totalStudyTime * 0.1) },
    { day: "周四", time: Math.round(stats.totalStudyTime * 0.18) },
    { day: "周五", time: Math.round(stats.totalStudyTime * 0.12) },
    { day: "周六", time: Math.round(stats.totalStudyTime * 0.15) },
    { day: "周日", time: Math.round(stats.totalStudyTime * 0.1) },
  ];

  const exportData = () => {
    const data = { currentPath, moduleProgress, knowledgeMastery, stats };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "progress-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        localStorage.setItem("graduate-exam-progress", JSON.stringify({ state: data }));
        window.location.reload();
      } catch {
        alert("导入失败：文件格式错误");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">学习进度统计</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">总学习时间</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {Math.floor(stats.totalStudyTime / 60)}小时
              {stats.totalStudyTime % 60}分钟
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">连续学习天数</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.consecutiveDays}天</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">完成模块数</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {completedModules}/{totalModules}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>学习路径进度</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            当前路径：{currentPath || "未选择"}
          </p>
          <Progress value={pathProgress} />
          <p className="text-sm text-right">{pathProgress}%</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>知识点掌握度</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {masteryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={masteryData}>
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="mastery" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center pt-20">暂无数据</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>闪卡复习统计</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {flashcardData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={flashcardData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {flashcardData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center pt-20">暂无数据</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>每日学习时间</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}分钟`, "学习时间"]} />
              <Bar dataKey="time" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>数据管理</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button onClick={exportData}>导出数据</Button>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            导入数据
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={importData}
            className="hidden"
          />
        </CardContent>
      </Card>
    </div>
  );
}
