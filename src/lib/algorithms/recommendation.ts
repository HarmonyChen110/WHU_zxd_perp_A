export interface Recommendation {
  type: 'flashcard' | 'module' | 'review' | 'interview';
  priority: number;
  reason: string;
  action: {
    label: string;
    route: string;
  };
}

interface UserProgress {
  currentPathId: string | null;
  moduleProgress: Record<string, { status: string; completedAt?: string }>;
  topicProgress: Record<string, number>;
}

interface LearningPath {
  id: string;
  phases: { modules: string[] }[];
}

export function generateRecommendations(
  progress: UserProgress,
  currentPath: LearningPath | null,
  dueFlashcardsCount: number
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  if (dueFlashcardsCount > 0) {
    recommendations.push({
      type: 'flashcard',
      priority: 10,
      reason: `有 ${dueFlashcardsCount} 张卡片到期复习`,
      action: { label: '立即复习', route: '/flashcards/review' },
    });
  }

  const inProgressModules = Object.entries(progress.moduleProgress)
    .filter(([, p]) => p.status === 'in_progress')
    .map(([id]) => id);

  if (inProgressModules.length > 0) {
    recommendations.push({
      type: 'module',
      priority: 8,
      reason: '继续未完成的学习',
      action: { label: '继续学习', route: `/learn/module/${inProgressModules[0]}` },
    });
  }

  const weakTopics = Object.entries(progress.topicProgress)
    .filter(([, mastery]) => mastery < 70)
    .map(([id]) => id);

  if (weakTopics.length > 0) {
    recommendations.push({
      type: 'review',
      priority: 7,
      reason: `巩固 ${weakTopics.length} 个薄弱知识点`,
      action: { label: '开始复习', route: `/learn/module/${weakTopics[0]}` },
    });
  }

  if (currentPath) {
    const allModules = currentPath.phases.flatMap((p) => p.modules);
    const nextModule = allModules.find(
      (m) => !progress.moduleProgress[m] || progress.moduleProgress[m].status !== 'completed'
    );
    if (nextModule) {
      recommendations.push({
        type: 'module',
        priority: 6,
        reason: '继续学习路径',
        action: { label: '下一模块', route: `/learn/module/${nextModule}` },
      });
    }
  }

  recommendations.push({
    type: 'interview',
    priority: 5,
    reason: '练习面试题目',
    action: { label: '面试练习', route: '/interview' },
  });

  return recommendations.sort((a, b) => b.priority - a.priority);
}
