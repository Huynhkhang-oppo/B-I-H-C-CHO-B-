import { ChildProfile, ParentSettings, RewardItem, LearningSessionLog } from '../types';
import { DEFAULT_REWARDS } from '../data/curriculumData';

const STORAGE_KEYS = {
  PROFILE: 'bvk_child_profile_v2',
  PARENT: 'bvk_parent_settings_v2',
  REWARDS: 'bvk_rewards_catalog_v2',
  LOGS: 'bvk_learning_logs_v2',
  SCREEN_TIME_DATE: 'bvk_screen_time_date_v2',
  SCREEN_TIME_USED: 'bvk_screen_time_used_v2',
};

export const INITIAL_PROFILE: ChildProfile = {
  name: 'Bé Yêu',
  ageGroup: '4-6',
  avatar: '🌟',
  totalStars: 0,
  completedLessonIds: [],
  unlockedBadges: [],
  activeStreakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

export const INITIAL_PARENT_SETTINGS: ParentSettings = {
  pinCode: '1234',
  useMathGate: true,
  screenTimeLimitMinutes: 25,
  dailyReminderEnabled: true,
  dailyReminderTime: '19:30',
  parentEmail: 'huynhkhang.tran90@gmail.com',
  autoEmailWeekly: true,
  syncCode: 'BAP2026',
  soundVolume: 1,
  speechRate: 0.85,
  dialect: 'southern',
  autoPronounce: true,
};

export function loadProfile(): ChildProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return INITIAL_PROFILE;
    return JSON.parse(raw);
  } catch {
    return INITIAL_PROFILE;
  }
}

export function saveProfile(profile: ChildProfile) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function loadParentSettings(): ParentSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PARENT);
    if (!raw) return INITIAL_PARENT_SETTINGS;
    return { ...INITIAL_PARENT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return INITIAL_PARENT_SETTINGS;
  }
}

export function saveParentSettings(settings: ParentSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.PARENT, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save parent settings', e);
  }
}

export function loadRewards(): RewardItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REWARDS);
    if (!raw) return DEFAULT_REWARDS;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_REWARDS;
  }
}

export function saveRewards(rewards: RewardItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
  } catch (e) {
    console.error('Failed to save rewards', e);
  }
}

export function loadLogs(): LearningSessionLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!raw) {
      // Provide some sample historical logs so parents immediately see beautiful weekly charts!
      const today = new Date();
      const sampleLogs: LearningSessionLog[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        sampleLogs.push({
          id: `log-${i}`,
          date: dateStr,
          durationMinutes: 10 + (i % 3) * 5,
          subjectId: (i % 3 === 0 ? 'vietnamese' : i % 3 === 1 ? 'math' : 'english'),
          lessonId: 'sample-lesson',
          lessonTitle: i % 3 === 0 ? 'Chữ cái A, B, C' : i % 3 === 1 ? 'Đếm số 1-10' : 'Colors & Animals',
          starsEarned: 3 + (i % 3),
          scorePercent: 100,
        });
      }
      return sampleLogs;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLogs(logs: LearningSessionLog[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save logs', e);
  }
}

// Screen Time tracker (resets daily)
export function getTodayScreenTimeMinutes(): number {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const savedDate = localStorage.getItem(STORAGE_KEYS.SCREEN_TIME_DATE);
    if (savedDate !== todayStr) {
      localStorage.setItem(STORAGE_KEYS.SCREEN_TIME_DATE, todayStr);
      localStorage.setItem(STORAGE_KEYS.SCREEN_TIME_USED, '0');
      return 0;
    }
    const mins = parseFloat(localStorage.getItem(STORAGE_KEYS.SCREEN_TIME_USED) || '0');
    return isNaN(mins) ? 0 : mins;
  } catch {
    return 0;
  }
}

export function addScreenTimeMinutes(deltaMinutes: number) {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const savedDate = localStorage.getItem(STORAGE_KEYS.SCREEN_TIME_DATE);
    let current = 0;
    if (savedDate === todayStr) {
      current = parseFloat(localStorage.getItem(STORAGE_KEYS.SCREEN_TIME_USED) || '0');
      if (isNaN(current)) current = 0;
    } else {
      localStorage.setItem(STORAGE_KEYS.SCREEN_TIME_DATE, todayStr);
    }
    const updated = current + deltaMinutes;
    localStorage.setItem(STORAGE_KEYS.SCREEN_TIME_USED, updated.toFixed(1));
    return updated;
  } catch {
    return 0;
  }
}

// Full Data Export & Import
export function exportAllData() {
  return {
    profile: loadProfile(),
    parentSettings: loadParentSettings(),
    rewards: loadRewards(),
    logs: loadLogs(),
    exportDate: new Date().toISOString(),
  };
}

export function importAllData(jsonObj: any) {
  if (jsonObj.profile) saveProfile(jsonObj.profile);
  if (jsonObj.parentSettings) saveParentSettings(jsonObj.parentSettings);
  if (jsonObj.rewards) saveRewards(jsonObj.rewards);
  if (jsonObj.logs) saveLogs(jsonObj.logs);
}
