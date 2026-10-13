import React, { useState, useEffect } from 'react';
import { Lesson, LessonItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Volume2, Sparkles, Heart } from 'lucide-react';
import { speakText, playPopSound, playClickSound, playSuccessSound, playStarSound } from '../../utils/audio';

interface Props {
  lesson: Lesson;
  onFinish: (stars: number) => void;
  onBack: () => void;
}

export const AnimalFeederGame: React.FC<Props> = ({ lesson, onFinish, onBack }) => {
  const { language, parentSettings } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animalState, setAnimalState] = useState<'idle' | 'happy' | 'wobble'>('idle');
  const [wrongOpt, setWrongOpt] = useState<string | null>(null);

  const targetItem: LessonItem = lesson.items[currentIndex];

  // Options: 1 correct target, 2-3 distractors from the same lesson
  const distractors = lesson.items.filter((i) => i.id !== targetItem.id);
  const shuffledOptions = [targetItem, ...distractors.slice(0, 2)].sort(() => Math.random() - 0.5);

  const dialect = parentSettings.dialect || 'southern';
  const isSouthern = dialect === 'southern';

  const speakInstruction = () => {
    if (!targetItem) return;
    const text =
      lesson.subjectId === 'english'
        ? `Feed the cute friend with ${targetItem.display}!`
        : isSouthern
        ? `Bé ơi, cho bạn ăn món mang số ${targetItem.display} nè!`
        : `Bé ơi, cho bạn ăn số ${targetItem.display} nhé!`;
    const lang = lesson.subjectId === 'english' ? 'en' : 'vi';
    speakText(text, lang, 0.85, dialect);
  };

  useEffect(() => {
    setAnimalState('idle');
    setWrongOpt(null);
    const timer = setTimeout(speakInstruction, 250);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleFeed = (item: LessonItem) => {
    if (animalState === 'happy') return;
    playClickSound();

    if (item.id === targetItem.id) {
      // Correct!
      setAnimalState('happy');
      playSuccessSound();
      playStarSound();

      const cheer = isSouthern
        ? 'Ngon quá xá! Cảm ơn bé yêu nghen!'
        : 'Ngon quá! Cảm ơn bé nhé!';
      speakText(cheer, 'vi', 0.85, dialect);

      setTimeout(() => {
        if (currentIndex < lesson.items.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          onFinish(lesson.rewardStars);
        }
      }, 1300);
    } else {
      // Wrong!
      setAnimalState('wobble');
      setWrongOpt(item.id);
      playPopSound();

      const retryText = isSouthern
        ? 'Hổng phải món này rồi, bé chọn lại nghen!'
        : 'Chưa đúng rồi, bé thử lại nhé!';
      speakText(retryText, 'vi', 0.85, dialect);

      setTimeout(() => {
        setAnimalState('idle');
        setWrongOpt(null);
      }, 800);
    }
  };

  // Animal mascot
  const animalIcon = currentIndex % 2 === 0 ? '🐻' : '🐶';
  const animalName = currentIndex % 2 === 0 ? 'Bạn Gấu Con' : 'Bạn Cún Xinh';

  return (
    <div className="max-w-xl mx-auto w-full p-4 flex flex-col items-center select-none">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-3">
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
            🍉 {currentIndex + 1} / {lesson.items.length}
          </div>
          <div className="px-3 py-1.5 rounded-2xl bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-200">
            ⭐ +{lesson.rewardStars}
          </div>
        </div>
      </div>

      {/* Animal Feed Arena */}
      <div className="w-full bg-gradient-to-b from-amber-100/80 via-white to-amber-50 rounded-3xl p-6 border-4 border-amber-300 shadow-xl text-center relative overflow-hidden mb-4">
        {/* Animal Character with animated reactions */}
        <div className="relative inline-block my-2">
          <div
            className={`text-8xl sm:text-9xl transition-transform duration-300 ${
              animalState === 'happy'
                ? 'scale-125 rotate-6 animate-bounce'
                : animalState === 'wobble'
                ? 'animate-shake'
                : 'hover:scale-105'
            }`}
          >
            {animalIcon}
          </div>

          {animalState === 'happy' && (
            <div className="absolute -top-3 -right-3 text-3xl animate-ping">
              💖
            </div>
          )}
        </div>

        {/* Dialogue Bubble: Minimalist Visual Focus */}
        <div className="bg-white/95 rounded-2xl px-4 py-2.5 shadow-md border-2 border-amber-200 inline-flex items-center gap-2 mb-2">
          <span className="text-sm font-black text-slate-700">{animalName} muốn ăn:</span>
          <span className="text-xl sm:text-2xl font-black text-amber-600 bg-amber-100 px-3 py-0.5 rounded-xl border border-amber-300">
            {targetItem.display}
          </span>
        </div>

        <div className="mt-1">
          <button
            onClick={speakInstruction}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-slate-900" />
            <span>{language === 'vi' ? 'Bé Nghe Lời Bạn 🔊' : 'Listen 🔊'}</span>
          </button>
        </div>
      </div>

      {/* Food Items Choices: Giant tactile snack cards */}
      <div className="w-full">
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {shuffledOptions.map((opt, idx) => {
            const isWrong = wrongOpt === opt.id;
            const foodIcons = ['🍓', '🍎', '🧁', '🍪', '🍉', '🍌'];
            const foodIcon = opt.emojiOrImage || foodIcons[idx % foodIcons.length];

            return (
              <button
                key={opt.id}
                onClick={() => handleFeed(opt)}
                className={`py-5 px-3 rounded-3xl border-3 bg-white shadow-md transition-all flex flex-col items-center justify-center gap-1 active:scale-90 cursor-pointer select-none ${
                  isWrong
                    ? 'border-red-400 bg-red-50 animate-shake'
                    : 'border-amber-200 hover:border-amber-400 hover:shadow-xl hover:scale-102'
                }`}
              >
                <span className="text-4xl sm:text-5xl drop-shadow-sm mb-1 hover:scale-110 transition-transform">
                  {foodIcon}
                </span>

                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-wide mt-1">
                  {opt.display}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
