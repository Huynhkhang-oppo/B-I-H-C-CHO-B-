import React from 'react';
import { useApp } from '../context/AppContext';
import { SubjectId, Lesson } from '../types';
import { LESSONS, BADGES } from '../data/curriculumData';
import { BookOpen, Calculator, Languages, Sparkles, Trophy, Play, CheckCircle2, Star, Gift, Flame, Volume2 } from 'lucide-react';
import { playClickSound, playStarSound, speakText } from '../utils/audio';
import { DailyLearningSection } from './home/DailyLearningSection';
import { DailyReviewSection } from './home/DailyReviewSection';
import { DailyPointsGameSection } from './home/DailyPointsGameSection';

export const HomeDashboard: React.FC = () => {
  const {
    profile,
    openSubject,
    startLesson,
    setRewardStoreOpen,
    setNumberExplorerOpen,
    setAlphabetExplorerOpen,
    setEditProfileOpen,
    parentSettings,
    language,
    voiceDialect,
    setVoiceDialect,
    setVoiceModalOpen,
  } = useApp();

  // Filter lessons matching child's age group
  const currentAgeLessons = LESSONS.filter((l) => l.ageGroup === profile.ageGroup);

  // Subject statistics
  const getSubjectStats = (subjectId: SubjectId) => {
    const list = currentAgeLessons.filter((l) => l.subjectId === subjectId);
    const completed = list.filter((l) => profile.completedLessonIds.includes(l.id)).length;
    return {
      total: list.length,
      completed,
      percent: list.length > 0 ? Math.round((completed / list.length) * 100) : 0,
    };
  };

  const viStats = getSubjectStats('vietnamese');
  const mathStats = getSubjectStats('math');
  const enStats = getSubjectStats('english');

  // Quick recommended lesson (first uncompleted or first available)
  const quickLesson =
    currentAgeLessons.find((l) => !profile.completedLessonIds.includes(l.id)) ||
    currentAgeLessons[0];

  // Tree of Wisdom Level
  const getTreeLevel = () => {
    const stars = profile.totalStars;
    if (stars < 15) return { stage: 'Mầm Xanh Mới Nhú', icon: '🌱', desc: 'Bé bắt đầu hành trình học tập!' };
    if (stars < 40) return { stage: 'Cây Nhỏ Tươi Tốt', icon: '🌿', desc: 'Cây vươn cành đón nắng ấm!' };
    if (stars < 80) return { stage: 'Cây Ra Hoa Đẹp', icon: '🌸', desc: 'Những bông hoa tri thức nở rộ!' };
    return { stage: 'Cây Cổ Thụ Thần Tiên', icon: '🌳🍎', desc: 'Trái ngọt tri thức xum xuê rực rỡ!' };
  };

  const tree = getTreeLevel();

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">


      {/* Hero Welcome Banner - Tối ưu trực quan bằng hình ảnh lớn, ít chữ */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-3xl p-5 sm:p-7 text-white shadow-xl shadow-amber-400/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-black uppercase text-amber-950">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>{language === 'vi' ? `Bé ${profile.ageGroup} Tuổi` : `Age ${profile.ageGroup}`}</span>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-2">
            <h1 className="text-3xl sm:text-4xl font-black text-white drop-shadow-sm">
              {language === 'vi' ? `Chào ${profile.name}! 🌟` : `Hello ${profile.name}! 🌟`}
            </h1>
            <button
              onClick={() => {
                playClickSound();
                setEditProfileOpen(true);
              }}
              className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold border border-white/30 transition-transform active:scale-95"
              title="Đổi tên bé"
            >
              ✏️
            </button>
          </div>

            {/* Quick Action Visual Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-1">
            {quickLesson && (
              <button
                onClick={() => {
                  playClickSound();
                  startLesson(quickLesson);
                }}
                className="py-3 px-5 rounded-2xl bg-white text-slate-950 font-black text-sm shadow-lg hover:bg-amber-50 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Học Bài Mới</span>
              </button>
            )}

            <button
              onClick={() => {
                playClickSound();
                setRewardStoreOpen(true);
              }}
              className="py-3 px-4 rounded-2xl bg-amber-900/40 hover:bg-amber-900/50 text-white font-black text-sm border border-white/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="text-xl">🎁</span>
              <span>Đổi Quà Ba Mẹ</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setAlphabetExplorerOpen(true);
              }}
              className="py-3 px-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-black text-sm border border-white/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="text-xl">🔤</span>
              <span>Chữ Cái & 200 Từ Vựng</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setNumberExplorerOpen(true);
              }}
              className="py-3 px-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-black text-sm border border-white/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="text-xl">🔢</span>
              <span>Bảng Số & Máy Tính</span>
            </button>
          </div>
        </div>

        {/* Mascot / Avatar Display (Clickable to edit child profile) */}
        <button
          onClick={() => {
            playClickSound();
            setEditProfileOpen(true);
          }}
          className="relative shrink-0 flex items-center justify-center z-10 group cursor-pointer transition-transform active:scale-95"
          title="Chạm để đổi hình bạn thú đại diện"
        >
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/50 flex items-center justify-center text-6xl sm:text-7xl shadow-inner animate-float group-hover:scale-105 transition-transform">
            {profile.avatar}
          </div>
          <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-amber-300 text-slate-900 font-black text-xs shadow-md border-2 border-white flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-slate-900" />
            <span>{profile.totalStars}</span>
          </div>
          <div className="absolute top-0 right-0 bg-white/80 rounded-full p-1 shadow-sm text-xs">
            ✏️
          </div>
        </button>
      </div>

      {/* 2 Top Informative Widgets: Tree of Wisdom & Daily Reminder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tree of Wisdom Widget */}
        <div className="bg-white p-5 rounded-3xl border-2 border-emerald-200 shadow-sm flex items-center gap-4">
          <div className="w-18 h-18 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-4xl shadow-inner shrink-0">
            {tree.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">
                {language === 'vi' ? 'Vườn Tri Thức Của Bé' : 'Wisdom Garden'}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {profile.totalStars} ⭐
              </span>
            </div>
            <h3 className="text-base font-black text-slate-800 truncate mt-0.5">
              {tree.stage}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
              {tree.desc}
            </p>
          </div>
        </div>

        {/* Daily Smart Habit Reminder Widget */}
        <div className="bg-white p-5 rounded-3xl border-2 border-amber-200 shadow-sm flex items-center gap-4">
          <div className="w-18 h-18 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-4xl shadow-inner shrink-0">
            ⏰
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-700 uppercase tracking-wider">
                {language === 'vi' ? 'Thói Quen Mỗi Ngày' : 'Daily Routine'}
              </span>
              <span className="text-xs font-bold text-orange-600 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-orange-500" />
                {profile.activeStreakDays} {language === 'vi' ? 'ngày liên tục' : 'day streak'}
              </span>
            </div>
            <h3 className="text-base font-black text-slate-800 truncate mt-0.5">
              {language === 'vi'
                ? `Nhắc học: ${parentSettings.dailyReminderTime} tối`
                : `Reminder: ${parentSettings.dailyReminderTime}`}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
              {language === 'vi'
                ? 'Duy trì 15 phút mỗi ngày giúp bé nhớ sâu và vui vẻ!'
                : '15 mins daily routine boosts natural early learning!'}
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3 PHẦN RIÊNG BIỆT THEO YÊU CẦU CỦA BA MẸ                 */}
      {/* 1. Phần Học Theo Ngày                                    */}
      {/* 2. Phần Ôn Tập Bài Học Theo Ngày                         */}
      {/* 3. Phần Game Tích Điểm Theo Ngày                         */}
      {/* ======================================================== */}
      <div className="space-y-6 pt-2">
        {/* Phần 1: Học Theo Ngày */}
        <section id="daily-learning-section">
          <DailyLearningSection />
        </section>

        {/* Phần 2: Ôn Tập Bài Học Theo Ngày */}
        <section id="daily-review-section">
          <DailyReviewSection />
        </section>

        {/* Phần 3: Game Tích Điểm Theo Ngày (Đổi quà ba mẹ) */}
        <section id="daily-points-section">
          <DailyPointsGameSection />
        </section>
      </div>

      {/* Badges / Gamification Section */}
      <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-black text-base text-slate-800 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>{language === 'vi' ? 'Huy Hiệu Bé Chăm Học' : 'Study Badges'}</span>
          </h3>
          <span className="text-xs text-slate-500 font-bold">
            {profile.unlockedBadges.length} / {BADGES.length} {language === 'vi' ? 'đã mở khóa' : 'unlocked'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {BADGES.map((b) => {
            const isUnlocked = profile.unlockedBadges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`p-3 rounded-2xl text-center border-2 transition-all ${
                  isUnlocked
                    ? 'bg-amber-50/80 border-amber-300 text-amber-950 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                }`}
                title={language === 'vi' ? b.descVi : b.descEn}
              >
                <div className="text-3xl mb-1">{b.icon}</div>
                <div className="font-extrabold text-xs truncate">
                  {language === 'vi' ? b.titleVi : b.titleEn}
                </div>
                <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
                  {b.criteriaStars} ⭐
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
