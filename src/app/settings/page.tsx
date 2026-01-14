"use client"

import { useState } from "react"
import { useSettingsStore } from "@/lib/storage/settingsStore"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Palette,
  Clock,
  Bell,
  Volume2,
  RotateCcw,
  Monitor,
  Sun,
  Moon,
} from "lucide-react"

const THEME_OPTIONS = [
  { value: "light", label: "浅色", icon: Sun },
  { value: "dark", label: "深色", icon: Moon },
  { value: "system", label: "跟随系统", icon: Monitor },
] as const

const DAILY_GOAL_PRESETS = [15, 30, 45, 60, 90] as const

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useSettingsStore()
  const [dailyGoalValue, setDailyGoalValue] = useState([settings.dailyGoal])

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    updateSettings({ theme })
  }

  const handleDailyGoalChange = (value: number[]) => {
    setDailyGoalValue(value)
    updateSettings({ dailyGoal: value[0] })
  }

  const handleDailyGoalPreset = (minutes: number) => {
    setDailyGoalValue([minutes])
    updateSettings({ dailyGoal: minutes })
  }

  const handleNotificationsChange = (checked: boolean) => {
    updateSettings({ notifications: checked })
  }

  const handleSoundEffectsChange = (checked: boolean) => {
    updateSettings({ soundEffects: checked })
  }

  const handleReset = () => {
    resetSettings()
    setDailyGoalValue([30])
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">设置</h1>
        <p className="text-muted-foreground">
          管理您的应用偏好和学习配置
        </p>
      </div>

      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            外观
          </TabsTrigger>
          <TabsTrigger value="study" className="gap-2">
            <Clock className="h-4 w-4" />
            学习
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            通知与音效
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                主题设置
              </CardTitle>
              <CardDescription>
                选择您喜欢的界面主题风格
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {THEME_OPTIONS.map((option) => {
                  const Icon = option.icon
                  const isActive = settings.theme === option.value
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleThemeChange(option.value)}
                      className={`
                        relative flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all
                        ${
                          isActive
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border hover:border-primary/50 hover:bg-accent/50"
                        }
                      `}
                    >
                      <div
                        className={`
                          p-3 rounded-full transition-colors
                          ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }
                        `}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="font-medium">{option.label}</span>
                      {isActive && (
                        <div className="absolute top-3 right-3">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="study" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                每日学习目标
              </CardTitle>
              <CardDescription>
                设置您每天想要达到的学习时间目标（分钟）
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">当前目标</span>
                  <span className="text-2xl font-bold text-primary">
                    {dailyGoalValue[0]} 分钟
                  </span>
                </div>
                <Slider
                  value={dailyGoalValue}
                  onValueChange={handleDailyGoalChange}
                  min={5}
                  max={120}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5 分钟</span>
                  <span>120 分钟</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">快速预设</p>
                <div className="flex flex-wrap gap-2">
                  {DAILY_GOAL_PRESETS.map((preset) => (
                    <Button
                      key={preset}
                      variant={settings.dailyGoal === preset ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleDailyGoalPreset(preset)}
                      className="min-w-[70px]"
                    >
                      {preset} 分钟
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                通知设置
              </CardTitle>
              <CardDescription>
                管理学习提醒和通知偏好
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-4 border-b">
                <div className="space-y-0.5">
                  <p className="font-medium">学习提醒</p>
                  <p className="text-sm text-muted-foreground">
                    在约定时间接收学习提醒通知
                  </p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={handleNotificationsChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                音效设置
              </CardTitle>
              <CardDescription>
                配置应用中的音效反馈
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-4">
                <div className="space-y-0.5">
                  <p className="font-medium">音效</p>
                  <p className="text-sm text-muted-foreground">
                    在操作和完成学习任务时播放音效
                  </p>
                </div>
                <Switch
                  checked={settings.soundEffects}
                  onCheckedChange={handleSoundEffectsChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">重置所有设置</h3>
              <p className="text-sm text-muted-foreground">
                将所有设置恢复为默认值
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              重置
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
