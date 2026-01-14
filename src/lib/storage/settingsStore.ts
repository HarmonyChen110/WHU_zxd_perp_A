import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
  theme: 'light' | 'dark' | 'system';
  dailyGoal: number;
  notifications: boolean;
  soundEffects: boolean;
}

interface SettingsState {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  theme: 'system',
  dailyGoal: 30,
  notifications: true,
  soundEffects: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    { name: 'graduate-exam-settings' }
  )
);
