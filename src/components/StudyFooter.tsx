'use client';

import { useProgressStore } from '@/lib/storage/progressStore';
import { Flame, Clock, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';

export function StudyFooter() {
  const { stats } = useProgressStore();
  const [todayStudyTime, setTodayStudyTime] = useState(0);
  const [nextReviewTime, setNextReviewTime] = useState<string>('--:--');

  useEffect(() => {
    // Calculate today's study time
    // For simplicity, we'll estimate based on consecutive days and total time
    // In a real app, you'd store daily study time separately
    const today = new Date().toISOString().split('T')[0];
    const lastStudyDate = stats.lastStudyDate;

    if (lastStudyDate === today) {
      // If studied today, estimate today's time (you could enhance this with actual daily tracking)
      // Using a reasonable portion of total time for today
      setTodayStudyTime(Math.min(60, Math.floor(stats.totalStudyTime / (stats.consecutiveDays || 1))));
    } else {
      setTodayStudyTime(0);
    }
  }, [stats]);

  useEffect(() => {
    // Calculate next review time (2 hours from now as a default)
    const now = new Date();
    const nextReview = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const hours = nextReview.getHours().toString().padStart(2, '0');
    const minutes = nextReview.getMinutes().toString().padStart(2, '0');
    setNextReviewTime(`${hours}:${minutes}`);
  }, []);

  return (
    <div className="container mx-auto flex h-12 items-center justify-between px-4 text-sm">
      <div className="flex items-center gap-1.5 text-orange-500">
        <Flame className="h-4 w-4" />
        <span>连续学习 {stats.consecutiveDays} 天</span>
      </div>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>今日学习 {todayStudyTime} 分钟</span>
      </div>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Bell className="h-4 w-4" />
        <span>下次复习: {nextReviewTime}</span>
      </div>
    </div>
  );
}
