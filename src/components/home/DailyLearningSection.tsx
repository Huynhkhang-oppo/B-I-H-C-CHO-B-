import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getDaySchedule, getTodayDayIndex } from '../../utils/dailyCurriculum';
import { Lesson } from '../../types';
import { Calendar, CheckCircle2, Play, Star, Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import { playClickSound, speakText } from '../../utils/audio';

const DAY_LABELS = [
  { idx: 0, short: 'T2', name: 'Thứ 2' },
  { idx: 1, short: 'T3', name: 'Thứ 3' },
  { idx: 2, short: 'T4', name: 'Thứ 4' },
  { idx: 3, short: 'T5', name: 'Thứ 5' },
  { idx: 4, short: 'T6', name: 'Thứ 6' },
  { idx: 5, short: 'T7', name: 'Thứ 7' },
  { idx: 6, short: 'CN', name: 'Chủ Nhật' },
];

export const DailyLearningSection: React.FC = () => {
  const { profile, language, startLesson, voiceDialect, parentSettings, selectedDay, setSelectedDay } = useApp();
  const todayIdx = getTodayDayIndex();

  const schedule = getDaySchedule(profile.ageGroup, selectedDay);
  const completedCount = schedule.learningLessons.filter((l) =>
    profile.completedLessonIds.includes(l.id)
  ).length;
  const isAllDone = completedCount === schedule.learningLessons.length;

  const handleLaunchLesson = (lesson: Lesson) => {
    playClickSound();
    startLesson(lesson);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-sm space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-2xl shadow-md shrink-0">
            📅
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                Phần 1 • Theo Lộ Trình Chuẩn
              </span>
              {selectedDay === todayIdx && (
                <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Hôm nay ✨
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mt-0.5">
              {language === 'vi' ? 'Phần Học Theo Ngày' : 'Daily Learning Lessons'}
            </h2>
          </div>
        </div>

        {/* Progress badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-amber-50 px-3.5 py-1.5 rounded-2xl border border-amber-200 text-xs font-black text-amber-900">
          <CheckCircle2 className={`w-4 h-4 ${isAllDone ? 'text-emerald-600' : 'text-amber-500'}`} />
          <span>
            {language === 'vi'
              ? `Tiến độ: ${completedCount}/${schedule.learningLessons.length} bài`
              : `Progress: ${completedCount}/${schedule.learningLessons.length} done`}
          </span>
        </div>
      </div>

      {/* 7 Days of the Week Selector Pills */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2 px-1">
          <span>{language === 'vi' ? 'Chọn ngày trong tuần:' : 'Choose day of the week:'}</span>
          <span className="text-amber-700 font-extrabold">{schedule.themeVi}</span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {DAY_LABELS.map((d) => {
            const isSelected = selectedDay === d.idx;
            const isToday = todayIdx === d.idx;
            return (
              <button
                key={d.idx}
                onClick={() => {
                  playClickSound();
                  setSelectedDay(d.idx);
                }}
                className={`py-2 px-1 rounded-2xl text-center transition-all flex flex-col items-center gap-0.5 relative cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md border-2 border-amber-500 ring-2 ring-amber-200 scale-102'
                    : 'bg-slate-50 hover:bg-amber-50 text-slate-700 font-bold border border-slate-200'
                }`}
              >
                {isToday && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
                <span className="text-[11px] sm:text-xs leading-none">{d.short}</span>
                <span className="text-[10px] hidden sm:inline opacity-80">{d.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3 Core Lessons for the Selected Day */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {schedule.learningLessons.map((lesson, idx) => {
          const isDone = profile.completedLessonIds.includes(lesson.id);
          const subjColor =
            lesson.subjectId === 'vietnamese'
              ? 'border-rose-200 bg-rose-50/40 text-rose-900'
              : lesson.subjectId === 'math'
              ? 'border-emerald-200 bg-emerald-50/40 text-emerald-900'
              : 'border-indigo-200 bg-indigo-50/40 text-indigo-900';

          const subjBadge =
            lesson.subjectId === 'vietnamese'
              ? { label: 'Tiếng Việt 🅰️', bg: 'bg-rose-100 text-rose-800 border-rose-200' }
              : lesson.subjectId === 'math'
              ? { label: 'Toán Học 🔢', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' }
              : { label: 'Tiếng Anh 🔤 (5 Từ)', bg: 'bg-indigo-100 text-indigo-800 border-indigo-200' };

          return (
            <div
              key={lesson.id}
              className={`p-4 sm:p-5 rounded-3xl border-2 transition-all flex flex-col justify-between hover:shadow-lg ${subjColor}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${subjBadge.bg}`}>
                    {subjBadge.label}
                  </span>
                  <div className="flex items-center gap-1 font-black text-xs text-amber-600 bg-white px-2 py-0.5 rounded-full shadow-2xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>+{lesson.rewardStars}⭐</span>
                  </div>
                </div>

                {/* Big Visual Icon & Characters Row */}
                <div className="flex items-center gap-3 my-2 bg-white/70 backdrop-blur-sm p-3 rounded-2xl border border-white/60">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-100 to-white shadow-sm flex items-center justify-center text-3xl shrink-0">
                    {lesson.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-base text-slate-800 line-clamp-1">
                      {lesson.titleVi}
                    </h3>
                    {/* Visual sample items (letters, animals, numbers, english words) */}
                    <div className="flex items-center gap-1.5 mt-1.5 overflow-hidden">
                      {lesson.items.slice(0, 5).map((it) => (
                        <span
                          key={it.id}
                          className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-xs font-black text-slate-700 shadow-2xs flex items-center gap-1 shrink-0"
                        >
                          <span className="text-sm">{it.emojiOrImage}</span>
                          <span className="max-w-[65px] truncate">{it.display}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-xs font-black text-slate-600">
                  {isDone ? '✅ Hoàn thành' : `Bài số ${idx + 1}`}
                </span>

                <button
                  onClick={() => handleLaunchLesson(lesson)}
                  className={`py-2 px-3.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer ${
                    isDone
                      ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black shadow-md'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isDone ? 'Học Lại' : 'Học Ngay'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
