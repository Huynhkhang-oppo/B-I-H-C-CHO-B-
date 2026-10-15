import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  ChildProfile,
  ParentSettings,
  RewardItem,
  LearningSessionLog,
  SubjectId,
  Lesson,
  Language,
  AgeGroup,
} from '../types';
import {
  INITIAL_PROFILE,
  loadProfile,
  saveProfile,
  loadParentSettings,
  saveParentSettings,
  loadRewards,
  saveRewards,
  loadLogs,
  saveLogs,
  getTodayScreenTimeMinutes,
  addScreenTimeMinutes,
} from '../utils/storage';
import { LESSONS, BADGES, DEFAULT_REWARDS } from '../data/curriculumData';
import { getTodayDayIndex } from '../utils/dailyCurriculum';
import { playStarSound, playFanfareSound, playCelebrationFeedback, setAppDialect } from '../utils/audio';
import confetti from 'canvas-confetti';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  profile: ChildProfile;
  parentSettings: ParentSettings;
  rewards: RewardItem[];
  logs: LearningSessionLog[];
  screenTimeMinutes: number;
  isOnline: boolean;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  voiceDialect: 'northern' | 'southern';
  setVoiceDialect: (dialect: 'northern' | 'southern') => void;

  // Navigation
  activeScreen: 'home' | 'subject' | 'lesson' | 'parent';
  selectedSubject: SubjectId | null;
  currentLesson: Lesson | null;
  selectedDay: number;
  setSelectedDay: (day: number) => void;

  // Modals
  isParentGateOpen: boolean;
  isRewardStoreOpen: boolean;
  isCustomRewardModalOpen: boolean;
  isScreenTimeAlertOpen: boolean;
  isNumberExplorerOpen: boolean;
  isAlphabetExplorerOpen: boolean;
  isEditProfileOpen: boolean;
  isCelebrationModalOpen: boolean;
  isVoiceModalOpen: boolean;
  celebrationData: {
    text: string;
    starsEarned: number;
    lessonTitle: string;
    isHardLevel: boolean;
  } | null;
  pendingHardRewardLesson: Lesson | null;

  // Actions
  goHome: () => void;
  openSubject: (subjectId: SubjectId) => void;
  startLesson: (lesson: Lesson) => void;
  finishCurrentLesson: (earnedStars: number) => void;
  closeCelebrationModal: () => void;
  requestParentZone: () => void;
  unlockParentZone: () => void;
  closeParentGate: () => void;
  setRewardStoreOpen: (open: boolean) => void;
  setCustomRewardModalOpen: (open: boolean) => void;
  setNumberExplorerOpen: (open: boolean) => void;
  setAlphabetExplorerOpen: (open: boolean) => void;
  setEditProfileOpen: (open: boolean) => void;
  setVoiceModalOpen: (open: boolean) => void;
  dismissScreenTimeAlert: () => void;

  setAgeGroup: (age: AgeGroup) => void;
  updateProfile: (partial: Partial<ChildProfile>) => void;
  updateParentSettings: (partial: Partial<ParentSettings>) => void;
  claimReward: (rewardId: string) => boolean;
  proposeCustomReward: (title: string, description: string, stars: number) => void;
  toggleApproveReward: (rewardId: string) => void;
  addParentReward: (reward: {
    titleVi: string;
    descriptionVi: string;
    costStars: number;
    icon: string;
    category?: 'bonding' | 'outing' | 'treat' | 'custom';
  }) => void;
  updateParentReward: (id: string, updated: Partial<RewardItem>) => void;
  deleteParentReward: (id: string) => void;
  resetRewardsToDefault: () => void;
  resetAllPointsAndProgress: () => void;
  syncDataToServer: () => Promise<boolean>;
  loadDataFromServer: (code: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('vi');
  const [profile, setProfile] = useState<ChildProfile>(loadProfile);
  const [parentSettings, setParentSettings] = useState<ParentSettings>(loadParentSettings);
  const [rewards, setRewards] = useState<RewardItem[]>(loadRewards);
  const [logs, setLogs] = useState<LearningSessionLog[]>(loadLogs);
  const [screenTimeMinutes, setScreenTimeMinutes] = useState<number>(getTodayScreenTimeMinutes);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  // Navigation states
  const [activeScreen, setActiveScreen] = useState<'home' | 'subject' | 'lesson' | 'parent'>('home');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(getTodayDayIndex);

  // Modals
  const [isParentGateOpen, setIsParentGateOpen] = useState(false);
  const [isRewardStoreOpen, setIsRewardStoreOpen] = useState(false);
  const [isCustomRewardModalOpen, setIsCustomRewardModalOpen] = useState(false);
  const [isScreenTimeAlertOpen, setIsScreenTimeAlertOpen] = useState(false);
  const [isNumberExplorerOpen, setIsNumberExplorerOpen] = useState(false);
  const [isAlphabetExplorerOpen, setIsAlphabetExplorerOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isCelebrationModalOpen, setIsCelebrationModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{
    text: string;
    starsEarned: number;
    lessonTitle: string;
    isHardLevel: boolean;
  } | null>(null);
  const [pendingHardRewardLesson, setPendingHardRewardLesson] = useState<Lesson | null>(null);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Screen time interval tracker (increment every 1 minute)
  useEffect(() => {
    const timer = setInterval(() => {
      const updatedMins = addScreenTimeMinutes(1);
      setScreenTimeMinutes(updatedMins);

      // Check limit
      if (
        parentSettings.screenTimeLimitMinutes > 0 &&
        updatedMins >= parentSettings.screenTimeLimitMinutes &&
        !isScreenTimeAlertOpen
      ) {
        setIsScreenTimeAlertOpen(true);
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [parentSettings.screenTimeLimitMinutes, isScreenTimeAlertOpen]);

  // Synchronize active speech dialect across the entire app
  useEffect(() => {
    const dialectToUse = parentSettings.dialect || 'southern';
    setAppDialect(dialectToUse);
  }, [parentSettings.dialect]);

  // Save changes automatically
  const updateProfile = useCallback((partial: Partial<ChildProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...partial };
      saveProfile(updated);
      return updated;
    });
  }, []);

  const updateParentSettings = useCallback((partial: Partial<ParentSettings>) => {
    setParentSettings((prev) => {
      const updated = { ...prev, ...partial };
      if (updated.dialect) {
        setAppDialect(updated.dialect);
      }
      saveParentSettings(updated);
      return updated;
    });
  }, []);

  const setAgeGroup = useCallback((age: AgeGroup) => {
    updateProfile({ ageGroup: age });
  }, [updateProfile]);

  const goHome = useCallback(() => {
    setActiveScreen('home');
    setCurrentLesson(null);
  }, []);

  const openSubject = useCallback((subjectId: SubjectId) => {
    setSelectedSubject(subjectId);
    setActiveScreen('subject');
    setCurrentLesson(null);
  }, []);

  const startLesson = useCallback((lesson: Lesson) => {
    setCurrentLesson(lesson);
    setActiveScreen('lesson');
  }, []);

  const requestParentZone = useCallback(() => {
    setIsParentGateOpen(true);
  }, []);

  const unlockParentZone = useCallback(() => {
    setIsParentGateOpen(false);
    setActiveScreen('parent');
  }, []);

  const closeParentGate = useCallback(() => {
    setIsParentGateOpen(false);
  }, []);

  const dismissScreenTimeAlert = useCallback(() => {
    setIsScreenTimeAlertOpen(false);
  }, []);

  // Finish current lesson & award stars + check badges + check hard challenge reward
  const finishCurrentLesson = useCallback((earnedStars: number) => {
    if (!currentLesson) return;

    playFanfareSound();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#8b5cf6'],
    });

    const isHard = currentLesson.difficulty === 'hard';
    const lessonId = currentLesson.id;
    const subjId = currentLesson.subjectId;

    // Update profile stars & completed lessons
    setProfile((prev) => {
      const alreadyDone = prev.completedLessonIds.includes(lessonId);
      const newCompleted = alreadyDone ? prev.completedLessonIds : [...prev.completedLessonIds, lessonId];
      const newStars = prev.totalStars + earnedStars;

      // Check badge unlocks
      const newBadges = [...prev.unlockedBadges];
      BADGES.forEach((b) => {
        if (!newBadges.includes(b.id) && newStars >= b.criteriaStars) {
          newBadges.push(b.id);
        }
      });

      const updated = {
        ...prev,
        totalStars: newStars,
        completedLessonIds: newCompleted,
        unlockedBadges: newBadges,
      };
      saveProfile(updated);
      return updated;
    });

    // Add session log
    const todayStr = new Date().toISOString().split('T')[0];
    const lessonTitle = language === 'vi' ? currentLesson.titleVi : currentLesson.titleEn;
    const newLog: LearningSessionLog = {
      id: `log-${Date.now()}`,
      date: todayStr,
      durationMinutes: 5,
      subjectId: subjId,
      lessonId: lessonId,
      lessonTitle,
      starsEarned: earnedStars,
      scorePercent: 100,
    };
    setLogs((prev) => {
      const updated = [newLog, ...prev];
      saveLogs(updated);
      return updated;
    });

    if (isHard) {
      setPendingHardRewardLesson(currentLesson);
    }

    // Trigger cheerful Vietnamese celebration feedback (North or South)
    playCelebrationFeedback({
      childName: profile.name,
      lessonTitle,
      starsEarned: earnedStars,
      isHardLevel: isHard,
      milestoneType: 'lesson',
      dialect: parentSettings.dialect || 'southern',
    }).then((res) => {
      setCelebrationData({
        text: res.text,
        starsEarned: earnedStars,
        lessonTitle,
        isHardLevel: isHard,
      });
      setIsCelebrationModalOpen(true);
    });
  }, [currentLesson, language, profile.name, parentSettings.dialect]);

  const setVoiceDialect = useCallback((dialect: 'northern' | 'southern') => {
    setParentSettings((prev) => {
      const updated = { ...prev, dialect };
      saveParentSettings(updated);
      return updated;
    });
    setAppDialect(dialect);
  }, []);

  const closeCelebrationModal = useCallback(() => {
    setIsCelebrationModalOpen(false);
  }, []);

  // Rewards handling
  const claimReward = useCallback((rewardId: string): boolean => {
    const item = rewards.find((r) => r.id === rewardId);
    if (!item) return false;
    if (profile.totalStars < item.costStars) return false;

    // Deduct stars
    setProfile((prev) => {
      const updated = {
        ...prev,
        totalStars: Math.max(0, prev.totalStars - item.costStars),
      };
      saveProfile(updated);
      return updated;
    });

    // Mark as claimed
    setRewards((prev) => {
      const updated = prev.map((r) =>
        r.id === rewardId ? { ...r, claimedAt: new Date().toISOString(), parentApproved: false } : r
      );
      saveRewards(updated);
      return updated;
    });

    playStarSound();
    return true;
  }, [rewards, profile.totalStars]);

  const proposeCustomReward = useCallback((title: string, description: string, stars: number) => {
    const newReward: RewardItem = {
      id: `custom-${Date.now()}`,
      titleVi: title,
      titleEn: title,
      descriptionVi: description || 'Phần thưởng do bé tự đề xuất khi vượt qua thử thách khó!',
      descriptionEn: description || 'Custom reward proposed by kid after beating a hard challenge!',
      costStars: stars || 10,
      icon: '🎁',
      category: 'custom',
      isCustomProposed: true,
      parentApproved: true,
    };
    setRewards((prev) => {
      const updated = [newReward, ...prev];
      saveRewards(updated);
      return updated;
    });
    setIsCustomRewardModalOpen(false);
  }, []);

  const toggleApproveReward = useCallback((rewardId: string) => {
    setRewards((prev) => {
      const updated = prev.map((r) =>
        r.id === rewardId ? { ...r, parentApproved: !r.parentApproved } : r
      );
      saveRewards(updated);
      return updated;
    });
  }, []);

  const addParentReward = useCallback(
    (newRew: {
      titleVi: string;
      descriptionVi: string;
      costStars: number;
      icon: string;
      category?: 'bonding' | 'outing' | 'treat' | 'custom';
    }) => {
      const item: RewardItem = {
        id: `parent-rew-${Date.now()}`,
        titleVi: newRew.titleVi,
        titleEn: newRew.titleVi,
        descriptionVi: newRew.descriptionVi || 'Phần thưởng ấm áp ba mẹ tự cập nhật cho bé!',
        descriptionEn: newRew.descriptionVi || 'Special reward customized by parents!',
        costStars: Math.max(1, newRew.costStars || 5),
        icon: newRew.icon || '🎁',
        category: newRew.category || 'treat',
        parentApproved: true,
      };
      setRewards((prev) => {
        const updated = [item, ...prev];
        saveRewards(updated);
        return updated;
      });
      playStarSound();
    },
    []
  );

  const updateParentReward = useCallback((id: string, updated: Partial<RewardItem>) => {
    setRewards((prev) => {
      const updatedList = prev.map((r) => (r.id === id ? { ...r, ...updated } : r));
      saveRewards(updatedList);
      return updatedList;
    });
  }, []);

  const deleteParentReward = useCallback((id: string) => {
    setRewards((prev) => {
      const updatedList = prev.filter((r) => r.id !== id);
      saveRewards(updatedList);
      return updatedList;
    });
  }, []);

  const resetRewardsToDefault = useCallback(() => {
    setRewards(DEFAULT_REWARDS);
    saveRewards(DEFAULT_REWARDS);
  }, []);

  const resetAllPointsAndProgress = useCallback(() => {
    const cleanProfile: ChildProfile = {
      ...INITIAL_PROFILE,
      name: profile.name || 'Bé Yêu',
      ageGroup: profile.ageGroup || '4-6',
      avatar: profile.avatar || '🌟',
      totalStars: 0,
      completedLessonIds: [],
      unlockedBadges: [],
      activeStreakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
    setProfile(cleanProfile);
    saveProfile(cleanProfile);
    // Also reset claimed rewards so child can earn and redeem again
    setRewards(DEFAULT_REWARDS);
    saveRewards(DEFAULT_REWARDS);
  }, [profile.name, profile.ageGroup, profile.avatar]);

  // Multi-device Cloud Sync
  const syncDataToServer = useCallback(async () => {
    setSyncStatus('syncing');
    try {
      const payload = {
        profile,
        parentSettings,
        rewards,
        logs,
      };
      const res = await fetch('/api/sync/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          syncCode: parentSettings.syncCode || 'BAP2026',
          payload,
        }),
      });
      if (res.ok) {
        setSyncStatus('synced');
        setTimeout(() => setSyncStatus('idle'), 3000);
        return true;
      }
      setSyncStatus('error');
      return false;
    } catch {
      setSyncStatus('error');
      return false;
    }
  }, [profile, parentSettings, rewards, logs]);

  const loadDataFromServer = useCallback(async (code: string) => {
    setSyncStatus('syncing');
    try {
      const res = await fetch(`/api/sync/load/${encodeURIComponent(code)}`);
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        const payload = data.data;
        if (payload.profile) {
          setProfile(payload.profile);
          saveProfile(payload.profile);
        }
        if (payload.parentSettings) {
          setParentSettings(payload.parentSettings);
          saveParentSettings(payload.parentSettings);
        }
        if (payload.rewards) {
          setRewards(payload.rewards);
          saveRewards(payload.rewards);
        }
        if (payload.logs) {
          setLogs(payload.logs);
          saveLogs(payload.logs);
        }
        setSyncStatus('synced');
        setTimeout(() => setSyncStatus('idle'), 3000);
        return true;
      }
      setSyncStatus('error');
      return false;
    } catch {
      setSyncStatus('error');
      return false;
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        profile,
        parentSettings,
        rewards,
        logs,
        screenTimeMinutes,
        isOnline,
        syncStatus,
        voiceDialect: parentSettings.dialect || 'southern',
        setVoiceDialect,
        activeScreen,
        selectedSubject,
        currentLesson,
        selectedDay,
        setSelectedDay,
        isParentGateOpen,
        isRewardStoreOpen,
        isCustomRewardModalOpen,
        isScreenTimeAlertOpen,
        isNumberExplorerOpen,
        isAlphabetExplorerOpen,
        isEditProfileOpen,
        isCelebrationModalOpen,
        isVoiceModalOpen,
        celebrationData,
        closeCelebrationModal,
        pendingHardRewardLesson,
        goHome,
        openSubject,
        startLesson,
        finishCurrentLesson,
        requestParentZone,
        unlockParentZone,
        closeParentGate,
        setRewardStoreOpen: setIsRewardStoreOpen,
        setCustomRewardModalOpen: setIsCustomRewardModalOpen,
        setNumberExplorerOpen: setIsNumberExplorerOpen,
        setAlphabetExplorerOpen: setIsAlphabetExplorerOpen,
        setEditProfileOpen: setIsEditProfileOpen,
        setVoiceModalOpen: setIsVoiceModalOpen,
        dismissScreenTimeAlert,
        setAgeGroup,
        updateProfile,
        updateParentSettings,
        claimReward,
        proposeCustomReward,
        toggleApproveReward,
        addParentReward,
        updateParentReward,
        deleteParentReward,
        resetRewardsToDefault,
        resetAllPointsAndProgress,
        syncDataToServer,
        loadDataFromServer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
