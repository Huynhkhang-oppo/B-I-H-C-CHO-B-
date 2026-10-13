import React, { useState, useEffect } from 'react';
import { Lesson, LessonItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Volume2, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { speakText, playClickSound, playPopSound, playSuccessSound, playStarSound } from '../../utils/audio';

interface Props {
  lesson: Lesson;
  onFinish: (stars: number) => void;
  onBack: () => void;
}

export const QuizGame: React.FC<Props> = ({ lesson, onFinish, onBack }) => {
  const { language, voiceDialect, parentSettings } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shakeOption, setShakeOption] = useState<string | null>(null);

  const currentItem: LessonItem = lesson.items[currentIndex];

  // Options pool
  const options = currentItem.extraOptions || [
    currentItem.subTextVi,
    'Lựa chọn khác A',
    'Lựa chọn khác B',
  ];

  // The correct option:
  // Usually for animal quiz or math, the correct answer is the first extraOption or contains key words
  const correctAnswer = options[0];

  // Shuffled options for this question
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  useEffect(() => {
    const list = [...options];
    list.sort(() => Math.random() - 0.5);
    setShuffledOptions(list);
    setSelectedOption(null);
    setIsCorrect(null);
    setShakeOption(null);

    const timer = setTimeout(() => {
      speakText(
        lesson.subjectId === 'english'
          ? currentItem.audioTextEn
          : currentItem.audioTextVi,
        lesson.subjectId === 'english' ? 'en' : 'vi',
        parentSettings.speechRate || 0.88,
        'northern'
      );
    }, 350);
    return () => clearTimeout(timer);
  }, [currentIndex, language]);

  const handleSelectOption = (opt: string) => {
    if (isCorrect) return; // already answered correctly
    playClickSound();
    setSelectedOption(opt);

    if (opt === correctAnswer) {
      // Correct!
      setIsCorrect(true);
      playSuccessSound();
      playStarSound();

      speakText(
        language === 'vi' ? 'Hoan hô! Bé trả lời đúng rồi nè!' : 'Awesome! That is correct!',
        language === 'vi' ? 'vi' : 'en',
        parentSettings.speechRate || 0.88,
        'northern'
      );

      setTimeout(() => {
        if (currentIndex < lesson.items.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          onFinish(lesson.rewardStars);
        }
      }, 1200);
    } else {
      // Incorrect
      setIsCorrect(false);
      setShakeOption(opt);
      playPopSound();
      speakText(
        language === 'vi' ? 'Chưa đúng rồi, bé thử lại nghen!' : 'Not quite, try again!',
        language === 'vi' ? 'vi' : 'en',
        parentSettings.speechRate || 0.88,
        'northern'
      );
      setTimeout(() => {
        setShakeOption(null);
        setSelectedOption(null);
        setIsCorrect(null);
      }, 800);
    }
  };

  return (
    <div className="max-w-xl mx-auto w-full p-4 flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={() => {
            playClickSound();
            onBack();
          }}
          className="p-2.5 rounded-2xl bg-white shadow-sm hover:bg-slate-50 text-slate-700 font-bold flex items-center gap-1.5 text-xs border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'vi' ? 'Quay lại' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-2xl bg-amber-100 text-amber-800 text-xs font-black border border-amber-200">
            ❓ {currentIndex + 1} / {lesson.items.length}
          </div>
          <div className="px-3 py-1.5 rounded-2xl bg-purple-100 text-purple-800 text-xs font-black border border-purple-200">
            ⭐ +{lesson.rewardStars}
          </div>
        </div>
      </div>

      {/* Main Question Card: Minimalist Educational Visual Focus */}
      <div className="w-full bg-white rounded-3xl p-6 sm:p-7 shadow-xl border-4 border-amber-300 text-center relative overflow-hidden mb-5">
        <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-3 rounded-3xl bg-gradient-to-tr from-amber-100 to-orange-50 flex items-center justify-center text-6xl sm:text-7xl shadow-md border-2 border-amber-200 animate-float select-none">
          {currentItem.emojiOrImage}
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2 select-none tracking-tight">
          {currentItem.display}
        </h3>

        {currentItem.subTextVi && (
          <p className="text-sm sm:text-base font-bold text-amber-900 bg-amber-50/80 px-4 py-2 rounded-2xl border border-amber-200 inline-block max-w-lg mb-2">
            {currentItem.subTextVi}
          </p>
        )}

        <div className="flex justify-center mt-3">
          <button
            onClick={() =>
              speakText(
                lesson.subjectId === 'english'
                  ? currentItem.audioTextEn
                  : currentItem.audioTextVi,
                lesson.subjectId === 'english' ? 'en' : 'vi',
                parentSettings.speechRate || 0.88,
                'northern'
              )
            }
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-black shadow-md shadow-amber-300/40 transition-all active:scale-95 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>{language === 'vi' ? 'Bé Nghe Câu Hỏi 🔊' : 'Listen Question 🔊'}</span>
          </button>
        </div>
      </div>

      {/* Tactile Visual Options Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {shuffledOptions.map((opt, idx) => {
          const isThisSelected = selectedOption === opt;
          const isThisShaking = shakeOption === opt;
          const isThisCorrect = isThisSelected && isCorrect === true;

          // Find visual icon for this option if available
          const matchingItem = lesson.items.find(
            (it) =>
              it.display.trim().toLowerCase() === opt.trim().toLowerCase() ||
              it.subTextVi.trim().toLowerCase() === opt.trim().toLowerCase()
          );
          const optionIcon = matchingItem ? matchingItem.emojiOrImage : null;

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(opt)}
              disabled={isCorrect === true}
              className={`w-full py-4 px-5 rounded-3xl border-3 text-center sm:text-left font-black transition-all flex items-center justify-between shadow-sm cursor-pointer select-none active:scale-95 ${
                isThisCorrect
                  ? 'bg-emerald-100 border-emerald-500 text-emerald-950 scale-102 ring-4 ring-emerald-300 shadow-md'
                  : isThisShaking
                  ? 'bg-red-50 border-red-400 text-red-900 animate-shake'
                  : 'bg-white hover:bg-amber-50/70 border-slate-200 hover:border-amber-400 text-slate-800 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3.5 mx-auto sm:mx-0">
                <span className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-slate-700 flex items-center justify-center text-2xl font-black shrink-0 shadow-2xs">
                  {optionIcon || String.fromCharCode(65 + idx)}
                </span>
                <span className="text-lg sm:text-xl font-black">{opt}</span>
              </div>

              {isThisCorrect && (
                <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 hidden sm:block animate-bounce" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
