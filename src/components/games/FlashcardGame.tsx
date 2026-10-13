import React, { useState, useEffect } from 'react';
import { Lesson, LessonItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { Volume2, Snail, ArrowLeft, ArrowRight, RotateCw, CheckCircle2, Sparkles } from 'lucide-react';
import { speakText, playClickSound, playPopSound, playSuccessSound } from '../../utils/audio';

interface Props {
  lesson: Lesson;
  onFinish: (stars: number) => void;
  onBack: () => void;
}

export const FlashcardGame: React.FC<Props> = ({ lesson, onFinish, onBack }) => {
  const { language, voiceDialect, parentSettings } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasRepeatedWord, setHasRepeatedWord] = useState(false);

  const items = lesson.items;
  const currentItem: LessonItem = items[currentIndex];

  const handleSpeak = (slow: boolean = false) => {
    playClickSound();
    const textToSpeak =
      lesson.subjectId === 'english'
        ? currentItem.audioTextEn
        : currentItem.audioTextVi;
    const lang = lesson.subjectId === 'english' ? 'en' : 'vi';
    const rate = slow ? 0.65 : (parentSettings.speechRate || 0.85);
    speakText(textToSpeak, lang, rate, 'northern');
  };

  const handleSpeakMeaning = () => {
    playClickSound();
    speakText(currentItem.audioTextVi, 'vi', 0.88, 'northern');
  };

  // Speak automatically when moving to a new card (debounced)
  useEffect(() => {
    setIsFlipped(false);
    setHasRepeatedWord(false);
    const timeout = setTimeout(() => {
      handleSpeak(false);
    }, 350);
    return () => clearTimeout(timeout);
  }, [currentIndex]);

  const handleRepeatVoice = () => {
    playClickSound();
    playSuccessSound();
    setHasRepeatedWord(true);
    speakText(
      lesson.subjectId === 'english'
        ? `Great job! Bé phát âm từ "${currentItem.display}" rất giỏi! Sang từ tiếp theo nhé!`
        : `Bé đọc rất giỏi: ${currentItem.display}! Chuẩn rồi, bé có thể sang chữ tiếp theo nhé!`,
      'vi',
      0.88,
      'northern'
    );
  };

  const handleNext = () => {
    if (!hasRepeatedWord && items.length > 1) {
      speakText(
        lesson.subjectId === 'english'
          ? 'Bé hãy bấm vào nút Bé Đọc Lại để luyện phát âm từ tiếng Anh này trước nhé!'
          : 'Bé hãy bấm vào nút Bé Đọc Lại để đọc to chữ cái này trước nhé!',
        'vi',
        0.88,
        'northern'
      );
      return;
    }
    playPopSound();
    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      playSuccessSound();
      onFinish(lesson.rewardStars);
    }
  };

  const handlePrev = () => {
    playPopSound();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const progressPercent = Math.round(((currentIndex + 1) / items.length) * 100);

  return (
    <div className="max-w-xl mx-auto w-full p-4 flex flex-col items-center">
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={() => {
            playClickSound();
            onBack();
          }}
          className="p-2.5 rounded-2xl bg-white shadow-sm hover:bg-slate-50 text-slate-700 font-bold flex items-center gap-1.5 text-xs transition-all active:scale-95 border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'vi' ? 'Quay lại' : 'Back'}</span>
        </button>

        <div className="flex-1 mx-4">
          <div className="flex justify-between text-xs font-black text-slate-500 mb-1">
            <span>{language === 'vi' ? 'Thẻ' : 'Card'} {currentIndex + 1} / {items.length}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-2xl bg-amber-100 text-amber-800 text-xs font-black shrink-0 border border-amber-200">
          +{lesson.rewardStars} ⭐
        </div>
      </div>

      {/* Main Flashcard Container */}
      <div
        onClick={() => {
          playPopSound();
          setIsFlipped(!isFlipped);
        }}
        className="w-full cursor-pointer perspective-1000 my-2"
        role="button"
        tabIndex={0}
      >
        <div
          className={`w-full min-h-[360px] sm:min-h-[420px] rounded-3xl p-6 transition-all duration-500 transform-style-3d shadow-xl relative border-4 flex flex-col items-center justify-center text-center select-none ${
            isFlipped
              ? 'bg-gradient-to-b from-sky-50 via-white to-indigo-50 border-sky-300'
              : 'bg-gradient-to-b from-amber-50/90 via-white to-orange-50/70 border-amber-300'
          }`}
        >
          {/* Subtle Flip Hint Icon */}
          <div className="absolute top-4 right-4 text-xs font-black text-slate-400 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-xs border border-slate-100">
            <RotateCw className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">{language === 'vi' ? 'Lật thẻ' : 'Flip'}</span>
          </div>

          {!isFlipped ? (
            /* Front side: Giant Educational Imagery First */
            <div className="flex flex-col items-center justify-center animate-fade-in w-full">
              <div className="relative my-2">
                <span className="text-8xl sm:text-9xl filter drop-shadow-md select-none transform transition-transform duration-300 hover:scale-110 inline-block animate-float">
                  {currentItem.emojiOrImage}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-wide mt-1.5 mb-1 select-none drop-shadow-2xs">
                {currentItem.display}
              </h2>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100/90 border border-amber-200/60 text-[11px] sm:text-xs font-bold text-amber-900 shadow-2xs">
                {currentItem.category && (
                  <span className="px-2 py-0.2 rounded-md bg-amber-200/90 text-amber-950 text-[10px] font-black uppercase">
                    {currentItem.category}
                  </span>
                )}
                <span>{language === 'vi' ? currentItem.subTextVi : currentItem.subTextEn}</span>
              </div>
            </div>
          ) : (
            /* Back side: Visual audio focus */
            <div className="flex flex-col items-center justify-center animate-fade-in px-4 w-full">
              <div className="w-20 h-20 rounded-2xl bg-white shadow-md border-2 border-indigo-100 flex items-center justify-center text-4xl mb-2">
                {currentItem.emojiOrImage}
              </div>
              <span className="text-lg sm:text-xl font-bold text-indigo-950 mb-1 tracking-wide">
                {currentItem.display}
              </span>
              <p className="text-xs sm:text-sm font-semibold text-indigo-800 bg-indigo-50/80 px-3.5 py-1.5 rounded-2xl border border-indigo-100 max-w-md">
                {currentItem.audioTextVi}
              </p>
              {lesson.subjectId === 'english' && (
                <p className="text-xs font-bold text-indigo-600 mt-2 bg-white px-3 py-1 rounded-xl border border-indigo-100">
                  {currentItem.audioTextEn}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Voice Pronunciation & Repetition Controls */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 mt-3 w-full">
        {/* Listen Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSpeak(false);
          }}
          className="w-full sm:w-auto py-2.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs shadow-md shadow-amber-300/30 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
        >
          <Volume2 className="w-4 h-4" />
          <span>{lesson.subjectId === 'english' ? 'Nghe Tiếng Anh 🔤' : (language === 'vi' ? 'Nghe phát âm' : 'Listen')}</span>
        </button>

        {/* English Meaning Audio Button */}
        {lesson.subjectId === 'english' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSpeakMeaning();
            }}
            className="w-full sm:w-auto py-2.5 px-3.5 rounded-2xl bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-black text-xs shadow-xs border border-indigo-200 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            title="Nghe nghĩa tiếng Việt"
          >
            <span>🇻🇳</span>
            <span>Nghĩa Tiếng Việt</span>
          </button>
        )}

        {/* Bé Đọc Lại Button (Must read/confirm to advance!) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRepeatVoice();
          }}
          className={`w-full sm:w-auto py-2.5 px-5 rounded-2xl font-black text-xs shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer border-2 ${
            hasRepeatedWord
              ? 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-200'
              : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white border-rose-400 animate-pulse'
          }`}
          title="Bé đọc lại đúng mới qua chữ tiếp theo"
        >
          <span>🎙️</span>
          <span>
            {hasRepeatedWord
              ? (language === 'vi' ? 'Đã Đọc Xong! ✅' : 'Read Done! ✅')
              : (lesson.subjectId === 'english'
                  ? 'Bé Đọc Lại Tiếng Anh 🌟'
                  : (language === 'vi' ? 'Bé Đọc Lại (Để Qua Chữ) 🌟' : 'Repeat Aloud 🌟'))}
          </span>
        </button>

        {/* Slow Mode */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSpeak(true);
          }}
          className="w-full sm:w-auto py-2.5 px-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs border border-slate-200 flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
          title={language === 'vi' ? 'Đọc chậm từng tiếng cho bé' : 'Slow mode for toddler'}
        >
          <Snail className="w-4 h-4 text-emerald-600" />
          <span>{language === 'vi' ? 'Đọc Chậm' : 'Slow'}</span>
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between w-full mt-6 gap-3">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex-1 py-3.5 px-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 ${
            currentIndex === 0
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-white hover:bg-slate-50 text-slate-700 shadow-sm border border-slate-200 active:scale-95'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'vi' ? 'Thẻ Trước' : 'Previous'}</span>
        </button>

        <button
          onClick={handleNext}
          className="flex-1 py-3.5 px-4 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-lg shadow-amber-400/40 transition-all flex items-center justify-center gap-1.5 active:scale-95"
        >
          <span>{currentIndex < items.length - 1 ? (language === 'vi' ? 'Thẻ Tiếp Theo' : 'Next Card') : (language === 'vi' ? 'Hoàn Thành! 🌟' : 'Finish! 🌟')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
