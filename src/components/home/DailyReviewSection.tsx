import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getDaySchedule, getTodayDayIndex, isDailyReviewDoneToday, markDailyReviewDoneToday } from '../../utils/dailyCurriculum';
import { RotateCw, CheckCircle2, Sparkles, Star, Play, Flame, Award } from 'lucide-react';
import { playClickSound, speakText, playFanfareSound } from '../../utils/audio';
import confetti from 'canvas-confetti';

const DAY_NAMES = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];

export const DailyReviewSection: React.FC = () => {
  const { profile, language, startLesson, voiceDialect, parentSettings, updateProfile, selectedDay } = useApp();
  const todayIdx = getTodayDayIndex();
  const schedule = getDaySchedule(profile.ageGroup, selectedDay);
  const [isReviewed, setIsReviewed] = useState<boolean>(isDailyReviewDoneToday);

  const handleLaunchReviewActivity = (activity: (typeof schedule.reviewItems)[0]) => {
    playClickSound();
    startLesson(activity.lesson);
  };

  const handleClaimReviewBonus = () => {
    if (isReviewed) return;
    playFanfareSound();
    markDailyReviewDoneToday();
    setIsReviewed(true);
    updateProfile({ totalStars: profile.totalStars + 5 });

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899'],
    });

    speakText(
      'Hoan hô bé giỏi quá! Bé đã hoàn thành ôn tập bài học hôm nay và nhận thêm 5 ngôi sao vàng!',
      'vi',
      parentSettings.speechRate || 0.88,
      voiceDialect
    );
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-sky-300 shadow-sm space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 text-white flex items-center justify-center text-2xl shadow-md shrink-0">
            🔄
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-200">
                Phần 2 • Khắc Sâu Trí Nhớ
              </span>
              <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                📌 Theo {DAY_NAMES[selectedDay]} (Đồng bộ Phần 1)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mt-0.5">
              {language === 'vi' ? 'Phần Ôn Tập Bài Học Theo Ngày' : 'Daily Lesson Review'}
            </h2>
          </div>
        </div>

        {/* Daily Bonus Reward Button / Status */}
        <div className="self-start sm:self-auto">
          {isReviewed ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-xs border border-emerald-300 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Đã hoàn thành ôn tập hôm nay (+5⭐)</span>
            </div>
          ) : (
            <button
              onClick={handleClaimReviewBonus}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Nhận Thưởng Ôn Tập (+5⭐)</span>
            </button>
          )}
        </div>
      </div>

      {/* Spaced Repetition Note Banner */}
      <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-white rounded-2xl p-3.5 border border-sky-200 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">💡</span>
          <p className="text-slate-600 font-semibold leading-relaxed">
            {language === 'vi'
              ? 'Luyện tập lặp lại cách quãng giúp não bộ của bé ghi nhớ sâu từ vựng, con số và phát âm lâu dài mà không thấy áp lực.'
              : 'Spaced repetition helps toddlers remember vocabulary and numbers 3x longer!'}
          </p>
        </div>
        <span className="hidden sm:inline-block px-2.5 py-1 rounded-xl bg-white text-indigo-700 font-black border border-indigo-200 shrink-0">
          Khoa học mầm non 🌟
        </span>
      </div>

      {/* 4 Review Activities Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {schedule.reviewItems.map((act) => (
          <div
            key={act.id}
            className="p-4 rounded-3xl border-2 border-slate-200 hover:border-sky-400 bg-white hover:bg-sky-50/20 transition-all flex flex-col justify-between group shadow-xs hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-11 h-11 rounded-2xl bg-sky-100 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                  {act.icon}
                </span>
                <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>+{act.rewardStars}⭐</span>
                </span>
              </div>

              <h3 className="font-black text-sm text-slate-800 line-clamp-1 group-hover:text-sky-700 transition-colors">
                {act.titleVi}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-1 line-clamp-2">
                {act.subtitleVi}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => handleLaunchReviewActivity(act)}
                className="w-full py-2 px-3 rounded-xl bg-sky-100 hover:bg-sky-500 text-sky-900 hover:text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Bé Ôn Ngay</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
