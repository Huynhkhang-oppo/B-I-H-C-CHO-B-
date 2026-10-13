import React, { useState, useEffect } from 'react';
import { Lesson, LessonItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Sparkles, Volume2, CheckCircle2, RotateCcw } from 'lucide-react';
import {
  playClickSound,
  playPopSound,
  playSuccessSound,
  playStarSound,
  speakText,
  formatVietnameseSpellingSlow,
  speakSpellingSlow,
} from '../../utils/audio';
import confetti from 'canvas-confetti';

interface Props {
  lesson: Lesson;
  onFinish: (stars: number) => void;
  onBack: () => void;
}

interface RoundData {
  targetWord: string;
  targetMeaning: string;
  audioPrompt: string;
  spellingGuide: string;
  icon: string;
  letters: string[]; // Correct sequence e.g. ['B', 'A']
}

export const LetterTrainGame: React.FC<Props> = ({ lesson, onFinish, onBack }) => {
  const { language, voiceDialect, parentSettings } = useApp();
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);

  // Train slots filled by user
  const [placedLetters, setPlacedLetters] = useState<(string | null)[]>([]);
  // Letter pool available to pick
  const [scrambledLetters, setScrambledLetters] = useState<{ id: string; char: string; used: boolean }[]>([]);
  const [isCompletedRound, setIsCompletedRound] = useState(false);
  const [showSpellingGuide, setShowSpellingGuide] = useState(false);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<NodeJS.Timeout | null>(null);

  // Derive rounds from lesson items
  const rounds: RoundData[] = lesson.items.map((it) => {
    const rawWord = it.display.trim().toUpperCase();
    const chars = Array.from(rawWord);
    const slowSpelling = formatVietnameseSpellingSlow(rawWord, it.subTextVi);
    return {
      targetWord: rawWord,
      targetMeaning: it.subTextVi,
      audioPrompt: `Toa tàu chở từ: ${rawWord}. Bé hãy xếp chữ lên toa tàu nhé!`,
      spellingGuide: slowSpelling,
      icon: it.emojiOrImage,
      letters: chars,
    };
  });

  const currentRound = rounds[currentRoundIdx] || rounds[0];

  const handleNextRound = () => {
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }
    if (currentRoundIdx < rounds.length - 1) {
      setCurrentRoundIdx((prev) => prev + 1);
    } else {
      onFinish(lesson.rewardStars || 5);
    }
  };

  // Set up round
  useEffect(() => {
    if (!currentRound) return;
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }
    setIsCompletedRound(false);
    setShowSpellingGuide(false);
    setPlacedLetters(new Array(currentRound.letters.length).fill(null));

    // Scramble letters with 1 optional distractor for fun
    const pool = [...currentRound.letters];
    // shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    setScrambledLetters(
      pool.map((char, index) => ({
        id: `${char}-${index}-${Date.now()}`,
        char,
        used: false,
      }))
    );

    const timer = setTimeout(() => {
      // Step 1: Teach slow step-by-step spelling BEFORE assembling letters
      speakText(
        `Bé cùng lắng nghe cô đánh vần từ từ nhé: ${currentRound.spellingGuide}! Giờ bé hãy xếp các chữ cái lên toa tàu nhé!`,
        'vi',
        0.80,
        voiceDialect
      );
    }, 350);
    return () => clearTimeout(timer);
  }, [currentRoundIdx]);

  // Click letter to place into next empty train car
  const handlePickLetter = (item: { id: string; char: string; used: boolean }) => {
    if (item.used || isCompletedRound) return;
    playPopSound();

    const emptySlotIdx = placedLetters.findIndex((slot) => slot === null);
    if (emptySlotIdx === -1) return;

    const newPlaced = [...placedLetters];
    newPlaced[emptySlotIdx] = item.char;
    setPlacedLetters(newPlaced);

    setScrambledLetters((prev) =>
      prev.map((l) => (l.id === item.id ? { ...l, used: true } : l))
    );

    // Check if train is full
    if (emptySlotIdx === placedLetters.length - 1) {
      checkCompletion(newPlaced as string[]);
    }
  };

  // Remove letter from train back to pool
  const handleRemoveFromTrain = (slotIdx: number) => {
    if (isCompletedRound) return;
    const char = placedLetters[slotIdx];
    if (!char) return;

    playClickSound();
    const newPlaced = [...placedLetters];
    newPlaced[slotIdx] = null;
    setPlacedLetters(newPlaced);

    // Free the first matching used letter in pool
    let freed = false;
    setScrambledLetters((prev) =>
      prev.map((l) => {
        if (!freed && l.char === char && l.used) {
          freed = true;
          return { ...l, used: false };
        }
        return l;
      })
    );
  };

  const checkCompletion = (attempt: string[]) => {
    const isCorrect = attempt.every((char, i) => char === currentRound.letters[i]);

    if (isCorrect) {
      setIsCompletedRound(true);
      setShowSpellingGuide(true);
      playSuccessSound();
      playStarSound();

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Step 2: Spell AGAIN slowly and completely after assembling
      const fullSpellingSpeech = `Hoan hô bé đã ghép đúng từ ${currentRound.targetWord}! Cùng đánh vần lại từ từ nhé: ${currentRound.spellingGuide}!`;
      
      speakText(
        fullSpellingSpeech,
        'vi',
        0.78,
        voiceDialect
      );

      // Estimate required duration so speech finishes completely BEFORE advancing
      const requiredDurationMs = Math.max(8500, fullSpellingSpeech.length * 115 + 4000);

      const timer = setTimeout(() => {
        handleNextRound();
      }, requiredDurationMs);

      setAutoAdvanceTimer(timer);
    } else {
      speakText('Chưa đúng rồi, bé hãy bấm vào chữ trên toa tàu để xếp lại nhé!', 'vi', 0.88, voiceDialect);
    }
  };

  const handleResetRound = () => {
    playClickSound();
    setPlacedLetters(new Array(currentRound.letters.length).fill(null));
    setScrambledLetters((prev) => prev.map((l) => ({ ...l, used: false })));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white rounded-3xl p-4 shadow-sm border-2 border-emerald-200">
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
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
            <span>🚂 Đoàn Tàu Ghép Chữ Vui Nhộn • {currentRoundIdx + 1}/{rounds.length}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-800">
            Ghép thành từ: <span className="text-emerald-600 underline">{currentRound.targetWord}</span>
          </h2>
        </div>

        <button
          onClick={() => {
            playClickSound();
            speakSpellingSlow(currentRound.targetWord, currentRound.targetMeaning, voiceDialect);
          }}
          className="p-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black shadow-md transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs"
          title="Bấm để nghe đánh vần chậm từng chữ"
        >
          <Volume2 className="w-5 h-5" />
          <span>Đánh Vần Lại 🔊</span>
        </button>
      </div>

      {/* Target Word & Visual Card */}
      <div className="bg-white rounded-3xl p-6 shadow-md border-3 border-emerald-300 flex flex-col items-center space-y-5">
        <div className="flex items-center gap-4 bg-emerald-50/60 px-6 py-3 rounded-2xl border border-emerald-200">
          <span className="text-5xl">{currentRound.icon}</span>
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-wider">
              {currentRound.targetWord}
            </h3>
            <p className="text-xs text-slate-500 font-bold">{currentRound.targetMeaning}</p>
          </div>
        </div>

        {/* Phonics Spelling Guide Banner: clickable repeat spelling button */}
        <button
          onClick={() => {
            playClickSound();
            speakSpellingSlow(currentRound.targetWord, currentRound.targetMeaning, voiceDialect);
          }}
          className={`w-full max-w-md px-4 py-3 rounded-2xl border-2 text-center flex items-center justify-between gap-2 transition-all cursor-pointer hover:scale-102 ${
            showSpellingGuide
              ? 'bg-gradient-to-r from-amber-300 via-orange-300 to-amber-300 text-slate-950 border-amber-400 shadow-lg animate-pulse'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border-emerald-300 shadow-xs'
          }`}
          title="Chạm để nghe cô đánh vần từ từ từng âm"
        >
          <div className="flex items-center gap-2 text-left">
            <span className="text-2xl">📖</span>
            <div>
              <div className="text-[11px] font-black uppercase text-emerald-900 tracking-wider">
                {showSpellingGuide ? '🎉 Ghép Đúng Rồi! Chạm Để Đánh Vần Lại:' : 'Hướng Dẫn Đánh Vần Từ Từ:'}
              </div>
              <div className="text-sm sm:text-base font-black text-slate-900">{currentRound.spellingGuide}</div>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shrink-0 shadow-sm flex items-center gap-1">
            <Volume2 className="w-4 h-4" />
            <span>Đánh Vần 🔊</span>
          </div>
        </button>

        {isCompletedRound && (
          <button
            onClick={() => {
              playClickSound();
              handleNextRound();
            }}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:scale-105 text-white font-black text-sm sm:text-base shadow-xl border-2 border-emerald-200 animate-bounce flex items-center justify-center gap-2 cursor-pointer transition-transform"
          >
            <span>🎉 Qua Từ Tiếp Theo ➡️</span>
          </button>
        )}

        {/* The Train with Carriages */}
        <div className="w-full overflow-x-auto py-4 flex items-center justify-center gap-2 sm:gap-3">
          {/* Locomotive Engine */}
          <div className="flex flex-col items-center shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex flex-col items-center justify-center shadow-lg border-2 border-white relative">
              <span className="text-3xl sm:text-4xl">🚂</span>
              <span className="text-[10px] font-black uppercase tracking-wider">Tàu Bé</span>
              {/* Wheels */}
              <div className="absolute -bottom-2 flex gap-3">
                <div className="w-4 h-4 rounded-full bg-slate-900 border-2 border-white" />
                <div className="w-4 h-4 rounded-full bg-slate-900 border-2 border-white" />
              </div>
            </div>
          </div>

          {/* Letter Carriages */}
          {placedLetters.map((char, idx) => (
            <div key={idx} className="flex flex-col items-center shrink-0 relative">
              {/* Coupling bar */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-1.5 bg-slate-400 rounded-full" />

              <button
                onClick={() => handleRemoveFromTrain(idx)}
                className={`w-18 h-20 sm:w-22 sm:h-24 rounded-2xl border-3 flex flex-col items-center justify-center transition-all cursor-pointer relative shadow-sm active:scale-95 ${
                  char
                    ? 'bg-amber-400 border-amber-500 text-slate-950 font-black text-3xl sm:text-4xl shadow-md'
                    : 'bg-slate-50 border-dashed border-slate-300 text-slate-400 hover:bg-emerald-50'
                }`}
                title={char ? 'Chạm để gỡ chữ này' : `Toa số ${idx + 1}`}
              >
                {char ? (
                  <span>{char}</span>
                ) : (
                  <span className="text-xs font-bold text-slate-400">Toa {idx + 1}</span>
                )}

                {/* Train Carriage Wheels */}
                <div className="absolute -bottom-2 flex gap-3">
                  <div className="w-4 h-4 rounded-full bg-slate-800 border-2 border-white" />
                  <div className="w-4 h-4 rounded-full bg-slate-800 border-2 border-white" />
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Scrambled Letter Blocks to pick */}
        <div className="w-full pt-4 border-t border-slate-100 flex flex-col items-center space-y-3">
          <p className="text-xs font-bold text-slate-500">
            Chạm vào chữ cái bên dưới để đưa lên toa tàu:
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {scrambledLetters.map((item) => (
              <button
                key={item.id}
                onClick={() => handlePickLetter(item)}
                disabled={item.used || isCompletedRound}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl text-2xl sm:text-3xl font-black transition-transform active:scale-90 shadow-md border-3 cursor-pointer ${
                  item.used
                    ? 'bg-slate-200 border-slate-300 text-slate-400 opacity-40 cursor-not-allowed scale-95'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-white border-emerald-600 hover:scale-105'
                }`}
              >
                {item.char}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={handleResetRound}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xếp Lại Toa Này</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
