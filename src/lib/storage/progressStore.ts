import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ModuleProgress {
  completed: number;
  total: number;
}

interface KnowledgeMastery {
  [knowledgePointId: string]: number; // 0-100
}

interface LearningStats {
  totalStudyTime: number; // minutes
  consecutiveDays: number;
  lastStudyDate: string | null;
}

interface ProgressState {
  currentPath: string | null;
  moduleProgress: Record<string, ModuleProgress>;
  knowledgeMastery: KnowledgeMastery;
  stats: LearningStats;
  setCurrentPath: (path: string) => void;
  updateModuleProgress: (moduleId: string, completed: number, total: number) => void;
  updateKnowledgeMastery: (pointId: string, mastery: number) => void;
  addStudyTime: (minutes: number) => void;
  updateConsecutiveDays: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      currentPath: null,
      moduleProgress: {},
      knowledgeMastery: {},
      stats: {
        totalStudyTime: 0,
        consecutiveDays: 0,
        lastStudyDate: null,
      },
      setCurrentPath: (path) => set({ currentPath: path }),
      updateModuleProgress: (moduleId, completed, total) =>
        set((state) => ({
          moduleProgress: {
            ...state.moduleProgress,
            [moduleId]: { completed, total },
          },
        })),
      updateKnowledgeMastery: (pointId, mastery) =>
        set((state) => ({
          knowledgeMastery: {
            ...state.knowledgeMastery,
            [pointId]: Math.min(100, Math.max(0, mastery)),
          },
        })),
      addStudyTime: (minutes) =>
        set((state) => ({
          stats: {
            ...state.stats,
            totalStudyTime: state.stats.totalStudyTime + minutes,
          },
        })),
      updateConsecutiveDays: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastStudyDate, consecutiveDays } = get().stats;

        if (lastStudyDate === today) return;

        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const newConsecutive = lastStudyDate === yesterday ? consecutiveDays + 1 : 1;

        set((state) => ({
          stats: {
            ...state.stats,
            consecutiveDays: newConsecutive,
            lastStudyDate: today,
          },
        }));
      },
    }),
    { name: 'graduate-exam-progress' }
  )
);
