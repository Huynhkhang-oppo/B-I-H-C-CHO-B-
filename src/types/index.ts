export type AgeGroup = '1-3' | '4-6' | '7-9' | '10-12' | '1-2' | '3-4' | '4-5';

export type SubjectId = 'vietnamese' | 'math' | 'english';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameType =
  | 'flashcard'
  | 'bubble_pop'
  | 'matching'
  | 'tracing'
  | 'quiz'
  | 'feeding'
  | 'speak_pronounce'
  | 'coloring'
  | 'letter_train'
  | 'interactive_story';

export interface Lesson {
  id: string;
  subjectId: SubjectId;
  ageGroup: AgeGroup;
  titleVi: string;
  titleEn: string;
  subtitleVi: string;
  subtitleEn: string;
  difficulty: Difficulty;
  gameType: GameType;
  starsRequired: number;
  rewardStars: number;
  icon: string;
  accentColor: string;
  // Specific lesson content
  items: LessonItem[];
}

export interface LessonItem {
  id: string;
  display: string; // e.g. "A", "1", "Dog"
  subTextVi: string; // e.g. "Con Cá", "Số một", "Con Chó"
  subTextEn: string; // e.g. "Fish", "Number One", "Dog"
  phonetic?: string; // e.g. "/eɪ/", "ba"
  audioTextVi: string; // text spoken for Vietnamese
  audioTextEn: string; // text spoken for English
  emojiOrImage: string; // emoji icon or visual representation
  category?: string;
  tracePath?: string; // SVG path or stroke guide points
  extraOptions?: string[]; // for quiz
}

export interface RewardItem {
  id: string;
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  descriptionEn: string;
  costStars: number;
  icon: string;
  category: 'bonding' | 'outing' | 'treat' | 'custom';
  isCustomProposed?: boolean; // propose by kid on hard levels
  claimedAt?: string;
  parentApproved?: boolean;
}

export interface LearningSessionLog {
  id: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  subjectId: SubjectId;
  lessonId: string;
  lessonTitle: string;
  starsEarned: number;
  scorePercent: number;
}

export interface ChildProfile {
  name: string;
  nickname?: string;
  ageGroup: AgeGroup;
  avatar: string;
  totalStars: number;
  completedLessonIds: string[];
  unlockedBadges: string[];
  activeStreakDays: number;
  lastActiveDate: string;
}

export interface ParentSettings {
  pinCode: string;
  useMathGate: boolean;
  screenTimeLimitMinutes: number; // e.g. 20 mins per day
  dailyReminderEnabled: boolean;
  dailyReminderTime: string; // "19:30"
  parentEmail: string;
  autoEmailWeekly: boolean;
  syncCode: string;
  soundVolume: number;
  speechRate: number; // 0.8 for kids
  dialect: 'southern' | 'northern';
  autoPronounce: boolean;
}

export type Language = 'vi' | 'en';

export interface Badge {
  id: string;
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
  icon: string;
  criteriaStars: number;
}
