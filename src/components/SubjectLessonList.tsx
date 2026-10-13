import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Difficulty, Lesson } from '../types';
import { LESSONS } from '../data/curriculumData';
import { ArrowLeft, Play, CheckCircle2, Star, Sparkles, Crown, HelpCircle } from 'lucide-react';
import { playClickSound } from '../utils/audio';

export const SubjectLessonList: React.FC = () => {
  const {
    selectedSubject,
    profile,
    startLesson,
    goHome,
    language,
    setNumberExplorerOpen,
    setAlphabetExplorerOpen,
  } = useApp();

  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | 'all'>('all');

  if (!selectedSubject) return null;

  // Filter lessons by selected subject and active age group
  const lessons = LESSONS.filter(
    (l) => l.subjectId === selectedSubject && l.ageGroup === profile.ageGroup
  );

  const filteredLessons =
    filterDifficulty === 'all'
      ? lessons
      : lessons.filter((l) => l.difficulty === filterDifficulty);

  const getSubjectTitle = () => {
    if (selectedSubject === 'vietnamese') return language === 'vi' ? 'Tiếng Việt' : 'Vietnamese';
    if (selectedSubject === 'math') return language === 'vi' ? 'Toán Học Mầm Non' : 'Preschool Math';
    return language === 'vi' ? 'Tiếng Anh Thiếu Nhi' : 'Kids English';
  };

  const getSubjectIcon = () => {
    if (selectedSubject === 'vietnamese') return '🅰️';
    if (selectedSubject === 'math') return '🔢';
    return '🔤';
  };

  const getGameTypeLabel = (type: string) => {
    switch (type) {
      case 'flashcard':
        return language === 'vi' ? '🃏 Thẻ Tranh' : '🃏 Flashcards';
      case 'bubble_pop':
        return language === 'vi' ? '🫧 Bắt Bóng' : '🫧 Bubble Pop';
      case 'matching':
        return language === 'vi' ? '🧩 Ghép Đôi' : '🧩 Matching';
      case 'tracing':
        return language === 'vi' ? '✍️ Tập Tô Nét' : '✍️ Tracing';
      case 'quiz':
        return language === 'vi' ? '❓ Đố Vui' : '❓ Pictorial Quiz';
      case 'feeding':
        return language === 'vi' ? '🍉 Cho Thú Ăn' : '🍉 Animal Feeder';
      case 'speak_pronounce':
        return language === 'vi' ? '🎙️ Luyện Nói & Giọng Nam' : '🎙️ Speak & Pronounce';
      default:
        return '🎮 Trò chơi';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => {
            playClickSound();
            goHome();
          }}
          className="p-2.5 rounded-2xl bg-white shadow-sm hover:bg-slate-50 text-slate-700 font-bold flex items-center gap-1.5 text-xs border border-slate-200 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'vi' ? 'Trang chủ' : 'Home'}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-3xl">{getSubjectIcon()}</span>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800">
              {getSubjectTitle()}
            </h1>
            <p className="text-xs text-slate-500 font-bold">
              {language === 'vi' ? `Lộ trình ${profile.ageGroup} tuổi` : `Age ${profile.ageGroup}`}
            </p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-2xl bg-amber-100 text-amber-900 text-xs font-black border border-amber-200">
          {lessons.filter((l) => profile.completedLessonIds.includes(l.id)).length} / {lessons.length} {language === 'vi' ? 'Đã xong' : 'Done'}
        </div>
      </div>

      {/* Difficulty Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        <button
          onClick={() => {
            playClickSound();
            setFilterDifficulty('all');
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
            filterDifficulty === 'all'
              ? 'bg-amber-400 text-slate-900 shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {language === 'vi' ? 'Tất cả bài học' : 'All Lessons'}
        </button>

        <button
          onClick={() => {
            playClickSound();
            setFilterDifficulty('easy');
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
            filterDifficulty === 'easy'
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>🌱</span>
          <span>{language === 'vi' ? 'Dễ (Khởi động)' : 'Easy'}</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setFilterDifficulty('medium');
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
            filterDifficulty === 'medium'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>🌿</span>
          <span>{language === 'vi' ? 'Vừa (Thực hành)' : 'Medium'}</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setFilterDifficulty('hard');
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
            filterDifficulty === 'hard'
              ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-sm ring-2 ring-amber-300'
              : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
          }`}
        >
          <span>👑</span>
          <span>{language === 'vi' ? 'Thử thách khó (Tự ước quà!)' : 'Hard Challenge (Wish Reward!)'}</span>
        </button>
      </div>

      {/* Vietnamese 36-Letter Interactive Alphabet Chart Banner */}
      {selectedSubject === 'vietnamese' && (
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 rounded-3xl p-5 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner shrink-0">
              🅰️
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider text-rose-100 mb-0.5">
                <Sparkles className="w-3 h-3 text-yellow-300" />
                <span>Đầy đủ 36+ Chữ Cái & Âm Tiết • Chuẩn Bộ GD&ĐT</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {language === 'vi' ? 'Bảng 36 Chữ Cái & Đánh Vần Thông Minh' : 'Vietnamese 36 Letters & Phonics Board'}
              </h3>
              <p className="text-xs text-rose-100 font-bold">
                {language === 'vi'
                  ? 'Đủ 29 chữ cái đơn + 11 chữ ghép (CH, NH, TR...). Chạm nghe phát âm chuẩn và tập tô chữ trực tiếp!'
                  : 'Complete single letters and compound digraphs with standard audio and tracing!'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              setAlphabetExplorerOpen(true);
            }}
            className="w-full sm:w-auto py-2.5 px-5 rounded-2xl bg-white text-rose-900 font-black text-xs shadow-md hover:bg-rose-50 transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0"
          >
            <span>Mở Bảng 36 Chữ Cái 🚀</span>
          </button>
        </div>
      )}

      {/* Math 1-1,000 Special Interactive Chart Banner */}
      {selectedSubject === 'math' && (
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-5 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner shrink-0">
              🔢
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider text-emerald-100 mb-0.5">
                <Sparkles className="w-3 h-3 text-yellow-300" />
                <span>Không giới hạn số 20 • Đếm tới 100 & 1,000</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {language === 'vi' ? 'Bảng Số Diệu Kỳ 1 Đến 1,000' : 'Magic Number Chart 1 to 1,000'}
              </h3>
              <p className="text-xs text-emerald-100 font-bold">
                {language === 'vi'
                  ? 'Chạm nghe đọc giọng Miền Nam chuẩn ngọt ngào: từ 1 đến 100, hàng trăm và 1 ngàn!'
                  : 'Tap to hear sweet Southern Vietnamese pronunciation: 1 to 100, hundreds, and 1,000!'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              setNumberExplorerOpen(true);
            }}
            className="w-full sm:w-auto py-2.5 px-5 rounded-2xl bg-white text-emerald-900 font-black text-xs shadow-md hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0"
          >
            <span>✨</span>
            <span>{language === 'vi' ? 'Mở Bảng Số 1-1,000' : 'Open Chart'}</span>
          </button>
        </div>
      )}

      {/* Lesson Cards List */}
      <div className="space-y-3">
        {filteredLessons.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
            <p className="text-3xl mb-2">📚</p>
            <p className="text-sm font-bold text-slate-500">
              {language === 'vi' ? 'Không có bài học trong mục này.' : 'No lessons in this category.'}
            </p>
          </div>
        ) : (
          filteredLessons.map((lesson) => {
            const isCompleted = profile.completedLessonIds.includes(lesson.id);
            const isHard = lesson.difficulty === 'hard';

            return (
              <div
                key={lesson.id}
                className={`p-4 sm:p-5 rounded-3xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isHard
                    ? 'bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-amber-300 shadow-md'
                    : 'bg-white hover:border-amber-300 border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm shrink-0 bg-gradient-to-br ${lesson.accentColor} text-white`}
                  >
                    {lesson.icon}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-black">
                        {getGameTypeLabel(lesson.gameType)}
                      </span>

                      {isHard && (
                        <span className="px-2 py-0.5 rounded-lg bg-amber-400 text-amber-950 text-[11px] font-black flex items-center gap-1 shadow-sm">
                          <Crown className="w-3 h-3 fill-amber-950" />
                          <span>{language === 'vi' ? 'Thử thách khó - Tự ước quà' : 'Hard - Wish Reward'}</span>
                        </span>
                      )}

                      {isCompleted && (
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-black flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{language === 'vi' ? 'Đã hoàn thành' : 'Completed'}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-800">
                      {language === 'vi' ? lesson.titleVi : lesson.titleEn}
                    </h3>

                    {/* Visual Preview of Characters/Animals in this lesson */}
                    <div className="flex items-center gap-1.5 mt-1.5 overflow-hidden">
                      {lesson.items.slice(0, 5).map((it) => (
                        <span
                          key={it.id}
                          className="px-2 py-0.5 rounded-lg bg-amber-50/80 border border-amber-200 text-xs font-black text-amber-950 flex items-center gap-1 shadow-2xs"
                        >
                          <span className="text-sm">{it.emojiOrImage}</span>
                          <span>{it.display}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center gap-1 font-black text-amber-600 text-sm">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>+{lesson.rewardStars}</span>
                  </div>

                  <button
                    onClick={() => {
                      playClickSound();
                      startLesson(lesson);
                    }}
                    className={`py-2.5 px-5 rounded-2xl font-black text-xs transition-all flex items-center gap-1.5 active:scale-95 shadow-sm ${
                      isCompleted
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : isHard
                        ? 'bg-amber-400 hover:bg-amber-300 text-slate-900 shadow-amber-300/50'
                        : 'bg-amber-500 hover:bg-amber-400 text-white'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isCompleted ? (language === 'vi' ? 'Học Lại' : 'Review') : (language === 'vi' ? 'Bắt Đầu' : 'Start')}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
