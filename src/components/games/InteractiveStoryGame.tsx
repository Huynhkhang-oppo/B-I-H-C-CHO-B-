import React, { useState, useEffect } from 'react';
import { Lesson } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Sparkles,
  BookOpen,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import {
  playClickSound,
  playPopSound,
  playSuccessSound,
  playStarSound,
  speakText,
} from '../../utils/audio';
import confetti from 'canvas-confetti';

interface Props {
  lesson: Lesson;
  onFinish: (stars: number) => void;
  onBack: () => void;
}

export const InteractiveStoryGame: React.FC<Props> = ({ lesson, onFinish, onBack }) => {
  const { language, voiceDialect, parentSettings } = useApp();
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  const currentPage = lesson.items[pageIndex] || lesson.items[0];
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  // The true correct answer is the first option in extraOptions or currentPage.display
  const trueCorrectAnswer = currentPage.extraOptions?.[0] || currentPage.display;

  // Auto-read current page when turned with safe debounce
  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);

    // Shuffle options so correct answer isn't always in position 0
    if (currentPage.extraOptions && currentPage.extraOptions.length > 0) {
      const opts = [...currentPage.extraOptions];
      // Seeded shuffle or random shuffle
      opts.sort(() => Math.random() - 0.5);
      setShuffledOptions(opts);
    } else {
      setShuffledOptions([]);
    }

    const timer = setTimeout(() => {
      const textToRead = currentPage.audioTextVi || currentPage.subTextVi;
      speakText(textToRead, 'vi', parentSettings.speechRate || 0.88, 'northern');
    }, 350);
    return () => clearTimeout(timer);
  }, [pageIndex, currentPage]);

  const handleSelectAnswer = (option: string) => {
    playClickSound();
    setSelectedAnswer(option);

    // Clean comparison: strip emojis, spaces, accents for 100% reliable matching
    const cleanOpt = option.replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();
    const cleanCorrect = trueCorrectAnswer.replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();
    const cleanDisplay = currentPage.display.replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();

    const isCorrect =
      cleanOpt === cleanCorrect ||
      cleanOpt === cleanDisplay ||
      (cleanCorrect.length > 0 && cleanOpt.includes(cleanCorrect)) ||
      (cleanOpt.length > 0 && cleanCorrect.includes(cleanOpt)) ||
      (cleanDisplay.length > 0 && cleanOpt.includes(cleanDisplay)) ||
      (cleanOpt.length > 0 && cleanDisplay.includes(cleanOpt));

    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      playSuccessSound();
      playStarSound();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
      speakText('Chính xác rồi! Bé chọn đúng rồi, giỏi quá!', 'vi', 0.88, 'northern');
    } else {
      speakText('Chưa đúng rồi, bé hãy thử chọn lại nha!', 'vi', 0.88, 'northern');
    }
  };

  const handleNextPage = () => {
    playClickSound();
    if (pageIndex < lesson.items.length - 1) {
      setPageIndex((prev) => prev + 1);
    } else {
      playSuccessSound();
      speakText('Bé đã đọc xong câu chuyện tuyệt vời này rồi! Giỏi quá!', 'vi', 0.88, voiceDialect);
      onFinish(lesson.rewardStars || 5);
    }
  };

  const handlePrevPage = () => {
    playClickSound();
    if (pageIndex > 0) {
      setPageIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white rounded-3xl p-4 shadow-sm border-2 border-amber-200">
        <button
          onClick={() => {
            playClickSound();
            onBack();
          }}
          className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-transform active:scale-95 cursor-pointer flex items-center gap-1 text-xs font-black"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Quay Lại</span>
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span>Truyện Tranh Tương Tác • Trang {pageIndex + 1}/{lesson.items.length}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-800">
            {lesson.titleVi}
          </h2>
        </div>

        <button
          onClick={() => {
            playClickSound();
            speakText(currentPage.audioTextVi || currentPage.subTextVi, 'vi', 0.88, voiceDialect);
          }}
          className="p-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black shadow-sm transition-transform active:scale-95 cursor-pointer flex items-center gap-1 text-xs"
        >
          <Volume2 className="w-5 h-5" />
          <span className="hidden sm:inline">Đọc Lại</span>
        </button>
      </div>

      {/* Main Story Book Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-300 relative overflow-hidden flex flex-col items-center text-center space-y-6">
        {/* Animated illustration area */}
        <div className="w-full max-w-lg aspect-video rounded-3xl bg-gradient-to-tr from-amber-100 via-orange-50 to-rose-100 border-3 border-amber-300 flex flex-col items-center justify-center p-6 shadow-inner relative group">
          <span className="text-8xl sm:text-9xl filter drop-shadow-md animate-float select-none">
            {currentPage.emojiOrImage}
          </span>
          <div className="absolute bottom-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-xs sm:text-sm font-black text-amber-950 border border-amber-300 shadow-xs flex items-center gap-1.5">
            <span>{currentPage.emojiOrImage}</span>
            <span>{currentPage.display}</span>
          </div>
        </div>

        {/* Story Text */}
        <div className="max-w-xl space-y-2">
          <p className="text-xl sm:text-2xl font-black text-slate-800 leading-relaxed">
            {currentPage.subTextVi}
          </p>
          <p className="text-sm font-semibold text-slate-500 italic">
            {currentPage.subTextEn}
          </p>
        </div>

        {/* Interactive Question / Touch Choice if extraOptions exist */}
        {currentPage.extraOptions && currentPage.extraOptions.length > 0 && (
          <div className="w-full max-w-lg bg-amber-50/90 p-4 sm:p-5 rounded-3xl border-3 border-amber-300 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-black text-amber-950">
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
              <span>Bé hãy nhìn hình và chọn đúng bạn nhỏ hoặc đồ vật trong tranh nhé:</span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {(shuffledOptions.length > 0 ? shuffledOptions : currentPage.extraOptions).map((opt) => {
                const isSelected = selectedAnswer === opt;
                // Extract emoji or determine icon for non-reading children
                const emojiMatch = opt.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u);
                const explicitEmoji = emojiMatch ? emojiMatch[0] : null;
                const textOnly = explicitEmoji ? opt.replace(explicitEmoji, '').trim() : opt.trim();
                
                // Lookup dictionary for matching picture emoji
                const optionEmoji =
                  explicitEmoji ||
                  (textOnly.toLowerCase().includes('cam') ? '🍊'
                    : textOnly.toLowerCase().includes('cá') ? '🐟'
                    : textOnly.toLowerCase().includes('gà con') ? '🐥'
                    : textOnly.toLowerCase().includes('gà trống') ? '🐓'
                    : textOnly.toLowerCase().includes('gà') ? '🐔'
                    : textOnly.toLowerCase().includes('mèo') ? '🐱'
                    : textOnly.toLowerCase().includes('chó') || textOnly.toLowerCase().includes('cún') ? '🐶'
                    : textOnly.toLowerCase().includes('bướm') ? '🦋'
                    : textOnly.toLowerCase().includes('bóng') || textOnly.toLowerCase().includes('banh') ? '⚽'
                    : textOnly.toLowerCase().includes('trăng') ? '🌙'
                    : textOnly.toLowerCase().includes('nón') || textOnly.toLowerCase().includes('mũ') ? '👒'
                    : textOnly.toLowerCase().includes('áo') ? '👕'
                    : textOnly.toLowerCase().includes('xe') ? '🚗'
                    : textOnly.toLowerCase().includes('dê') ? '🐐'
                    : textOnly.toLowerCase().includes('dưa') ? '🍉'
                    : textOnly.toLowerCase().includes('dâu') ? '🍓'
                    : textOnly.toLowerCase().includes('bút') ? '🖊️'
                    : textOnly.toLowerCase().includes('sách') ? '📚'
                    : textOnly.toLowerCase().includes('gấu') ? '🐻'
                    : textOnly.toLowerCase().includes('nhím') ? '🦔'
                    : textOnly.toLowerCase().includes('thỏ') ? '🐰'
                    : textOnly.toLowerCase().includes('rùa') ? '🐢'
                    : textOnly.toLowerCase().includes('ếch') ? '🐸'
                    : textOnly.toLowerCase().includes('cà') ? '🍅'
                    : textOnly.toLowerCase().includes('cây') ? '🌳'
                    : textOnly.toLowerCase().includes('nấm') ? '🍄'
                    : textOnly.toLowerCase().includes('cầu vồng') ? '🌈'
                    : textOnly.toLowerCase().includes('chim') ? '🐦'
                    : textOnly.toLowerCase().includes('vịt') ? '🦆'
                    : textOnly.toLowerCase().includes('heo') ? '🐷'
                    : textOnly.toLowerCase().includes('đồng hồ') ? '⏰'
                    : '🌟');

                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectAnswer(opt)}
                    className={`py-4 px-3 sm:px-4 rounded-2xl border-3 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm ${
                      isSelected
                        ? isAnswerCorrect
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-lg scale-102 ring-4 ring-emerald-200'
                          : 'bg-rose-500 text-white border-rose-600 shadow-md ring-4 ring-rose-200'
                        : 'bg-white hover:bg-amber-100/70 text-slate-900 border-slate-200 hover:border-amber-300 hover:scale-102'
                    }`}
                  >
                    {/* Visual picture is large and vivid for kids who cannot read text */}
                    <span className="text-4xl sm:text-5xl drop-shadow-xs transition-transform transform group-hover:scale-110">
                      {optionEmoji}
                    </span>
                    {/* Clear text label */}
                    <span className="text-xs sm:text-sm font-black text-center line-clamp-1">
                      {textOnly}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Book Navigation Bar */}
        <div className="w-full flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={handlePrevPage}
            disabled={pageIndex === 0}
            className={`px-4 py-2 rounded-2xl text-xs font-black border flex items-center gap-1 transition-all cursor-pointer ${
              pageIndex === 0
                ? 'opacity-40 bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Trang Trước</span>
          </button>

          <div className="flex items-center gap-1.5">
            {lesson.items.map((_, i) => (
              <div
                key={i}
                className={`h-2.5 rounded-full transition-all ${
                  i === pageIndex ? 'w-8 bg-amber-500' : 'w-2.5 bg-slate-200'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNextPage}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-slate-950 text-xs font-black shadow-md flex items-center gap-1 transition-transform active:scale-95 cursor-pointer"
          >
            <span>{pageIndex < lesson.items.length - 1 ? 'Trang Tiếp ➡️' : 'Đọc Xong! ⭐'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
