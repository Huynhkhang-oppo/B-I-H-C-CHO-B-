import React from 'react';
import { useApp } from '../../context/AppContext';
import { getDaySchedule, getTodayDayIndex } from '../../utils/dailyCurriculum';
import { Sparkles, Star, Play, Gift, Trophy, ArrowRight, Gamepad2 } from 'lucide-react';
import { playClickSound, speakText } from '../../utils/audio';

const DAY_NAMES = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];

export const DailyPointsGameSection: React.FC = () => {
  const { profile, language, startLesson, voiceDialect, parentSettings, setRewardStoreOpen, selectedDay } = useApp();
  const todayIdx = getTodayDayIndex();
  const schedule = getDaySchedule(profile.ageGroup, selectedDay);

  // Daily points target (recommended: 20 stars daily)
  const dailyTarget = 20;
  const progressPercent = Math.min(100, Math.round((profile.totalStars / dailyTarget) * 100));

  const handleLaunchGame = (game: (typeof schedule.pointGames)[0]) => {
    playClickSound();
    startLesson(game.lesson);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-purple-300 shadow-sm space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex items-center justify-center text-2xl shadow-md shrink-0">
            🎮
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
                Phần 3 • Chơi Vui Học Giỏi
              </span>
              <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                📌 Theo {DAY_NAMES[selectedDay]} (Đồng bộ Phần 1 & 2) ⭐
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mt-0.5">
              {language === 'vi' ? 'Phần Game Tích Điểm Theo Ngày' : 'Daily Point-Earning Mini-Games'}
            </h2>
          </div>
        </div>

        {/* Reward Store Direct Launch Button */}
        <button
          onClick={() => {
            playClickSound();
            setRewardStoreOpen(true);
          }}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Gift className="w-4 h-4" />
          <span>{language === 'vi' ? 'Đổi Quà Ba Mẹ 🎁' : 'Claim Rewards 🎁'}</span>
        </button>
      </div>

      {/* Daily Point Goal Bar */}
      <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 rounded-2xl p-4 border border-purple-200 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-black text-slate-800">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>
              {language === 'vi'
                ? `Mục tiêu kiếm sao hôm nay: ${dailyTarget} ⭐`
                : `Daily Target: ${dailyTarget} ⭐`}
            </span>
          </div>
          <span className="font-extrabold text-purple-700">
            {profile.totalStars} ⭐ {language === 'vi' ? 'sao hiện có' : 'stars total'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-purple-200/80 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-500 font-semibold text-right">
          {progressPercent >= 100
            ? '🎉 Bé đã đạt và vượt chỉ tiêu sao hôm nay! Hãy ghé Kho Quà nhé!'
            : `Còn thiếu ${Math.max(0, dailyTarget - profile.totalStars)} sao nữa để đạt mục tiêu ngày!`}
        </p>
      </div>

      {/* 6 Point Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {schedule.pointGames.map((game) => (
          <div
            key={game.id}
            className="p-4 rounded-3xl border-2 border-slate-200 hover:border-purple-400 bg-white hover:bg-purple-50/20 transition-all flex flex-col justify-between group shadow-xs hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${game.color} text-white flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform`}
                >
                  {game.icon}
                </div>
                <div className="flex items-center gap-1 font-black text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 shadow-2xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>+{game.rewardStars} ⭐</span>
                </div>
              </div>

              <h3 className="font-black text-base text-slate-800 line-clamp-1 group-hover:text-purple-700 transition-colors">
                {game.titleVi}
              </h3>

              {/* Sample preview items */}
              {game.lesson && game.lesson.items && (
                <div className="flex items-center gap-1.5 my-2 overflow-hidden">
                  {game.lesson.items.slice(0, 3).map((it) => (
                    <span
                      key={it.id}
                      className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 flex items-center gap-1 shrink-0"
                    >
                      <span className="text-sm">{it.emojiOrImage}</span>
                      <span className="max-w-[65px] truncate">{it.display}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                Vui nhộn 🎮
              </span>

              <button
                onClick={() => handleLaunchGame(game)}
                className="py-2 px-4 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-black text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Chơi Ngay</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
