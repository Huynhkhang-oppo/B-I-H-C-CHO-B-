import React, { useState, useEffect } from 'react';
import { Lesson, LessonItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Sparkles, Check, RefreshCw, Volume2 } from 'lucide-react';
import { speakText, playPopSound, playClickSound, playSuccessSound, playStarSound } from '../../utils/audio';

interface Props {
  lesson: Lesson;
  onFinish: (stars: number) => void;
  onBack: () => void;
}

interface MatchCard {
  id: string;
  itemId: string;
  type: 'symbol' | 'picture';
  content: string;
  label: string;
  isMatched: boolean;
  color: string;
}

const CARD_COLORS = [
  'bg-amber-100 border-amber-300 text-amber-950',
  'bg-rose-100 border-rose-300 text-rose-950',
  'bg-sky-100 border-sky-300 text-sky-950',
  'bg-emerald-100 border-emerald-300 text-emerald-950',
  'bg-purple-100 border-purple-300 text-purple-950',
];

export const MatchingGame: React.FC<Props> = ({ lesson, onFinish, onBack }) => {
  const { language, voiceDialect, parentSettings } = useApp();
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [wrongPair, setWrongPair] = useState<[string, string] | null>(null);

  const guidePrompt =
    language === 'vi'
      ? 'Trò chơi lật thẻ trí nhớ: Bé hãy chạm vào 1 thẻ hình ảnh và 1 thẻ chữ tương ứng để ghép thành một cặp đúng nhé!'
      : 'Memory matching game: Tap a picture card and its matching word card to make a pair!';

  const handleSpeakGuide = () => {
    playClickSound();
    speakText(guidePrompt, 'vi', 0.88, 'northern');
  };

  // Setup cards and read voice guidance for bé
  useEffect(() => {
    const list: MatchCard[] = [];
    lesson.items.forEach((item, index) => {
      const color = CARD_COLORS[index % CARD_COLORS.length];
      // Card 1: Symbol / Text
      list.push({
        id: `card-sym-${item.id}`,
        itemId: item.id,
        type: 'symbol',
        content: item.display,
        label: language === 'vi' ? item.subTextVi : item.subTextEn,
        isMatched: false,
        color,
      });
      // Card 2: Picture / Emoji
      list.push({
        id: `card-pic-${item.id}`,
        itemId: item.id,
        type: 'picture',
        content: item.emojiOrImage,
        label: language === 'vi' ? item.subTextVi : item.subTextEn,
        isMatched: false,
        color,
      });
    });

    // Shuffle
    list.sort(() => Math.random() - 0.5);
    setCards(list);
    setSelectedCardId(null);

    // Speak initial guidance clearly so the child knows how to play
    const timer = setTimeout(() => {
      speakText(guidePrompt, 'vi', 0.88, 'northern');
    }, 350);
    return () => clearTimeout(timer);
  }, [lesson, language]);

  const handleCardClick = (card: MatchCard) => {
    if (card.isMatched) return;
    playClickSound();

    if (!selectedCardId) {
      setSelectedCardId(card.id);
      return;
    }

    if (selectedCardId === card.id) {
      setSelectedCardId(null);
      return;
    }

    const firstCard = cards.find((c) => c.id === selectedCardId);
    if (!firstCard) {
      setSelectedCardId(card.id);
      return;
    }

    // Check if they match the same LessonItem and are different types
    if (firstCard.itemId === card.itemId && firstCard.type !== card.type) {
      // Correct pair!
      playPopSound();
      playStarSound();

      const item = lesson.items.find((i) => i.id === card.itemId);
      if (item) {
        speakText(
          lesson.subjectId === 'english' ? item.audioTextEn : item.audioTextVi,
          lesson.subjectId === 'english' ? 'en' : 'vi',
          parentSettings.speechRate || 0.88,
          'northern'
        );
      }

      setCards((prev) =>
        prev.map((c) =>
          c.id === firstCard.id || c.id === card.id
            ? { ...c, isMatched: true }
            : c
        )
      );
      setSelectedCardId(null);

      // Check if all matched
      const allDone = cards.every(
        (c) => c.id === firstCard.id || c.id === card.id || c.isMatched
      );
      if (allDone) {
        playSuccessSound();
        setTimeout(() => {
          onFinish(lesson.rewardStars);
        }, 800);
      }
    } else {
      // Wrong match
      setWrongPair([firstCard.id, card.id]);
      setTimeout(() => {
        setWrongPair(null);
        setSelectedCardId(null);
      }, 700);
    }
  };

  const matchedCount = cards.filter((c) => c.isMatched).length / 2;
  const totalPairs = lesson.items.length;

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
            🧩 {matchedCount} / {totalPairs} {language === 'vi' ? 'Cặp' : 'Pairs'}
          </div>
          <div className="px-3 py-1.5 rounded-2xl bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-200">
            ⭐ +{lesson.rewardStars}
          </div>
        </div>
      </div>

      <div className="w-full bg-gradient-to-r from-amber-50 to-orange-50 p-3 sm:p-3.5 rounded-2xl border-2 border-amber-300 text-center mb-4 shadow-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-left">
          <span className="text-2xl shrink-0">🧩</span>
          <span className="font-black text-amber-950 text-xs sm:text-sm">
            {language === 'vi' ? 'Bé chạm 1 thẻ hình và 1 thẻ chữ/số tương ứng để ghép cặp nhé!' : 'Match 1 picture card with its corresponding letter/number card!'}
          </span>
        </div>
        <button
          onClick={handleSpeakGuide}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1 shrink-0"
          title="Nghe hướng dẫn"
        >
          <Volume2 className="w-4 h-4" />
          <span className="hidden sm:inline">Nghe lại</span>
        </button>
      </div>

      {/* Cards Grid: High-focus minimalist visual cards (Supports 10 pairs) */}
      <div className="w-full grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3 my-2">
        {cards.map((card) => {
          const isSelected = selectedCardId === card.id;
          const isWrong = wrongPair && wrongPair.includes(card.id);

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card)}
              disabled={card.isMatched}
              className={`h-28 sm:h-32 rounded-2xl border-3 p-2 flex flex-col items-center justify-center transition-all select-none relative cursor-pointer active:scale-90 ${
                card.isMatched
                  ? 'bg-emerald-50/80 border-emerald-400 opacity-40 scale-95 cursor-default'
                  : isSelected
                  ? 'ring-3 ring-amber-400 scale-105 shadow-lg border-amber-400 bg-amber-50 animate-pulse'
                  : isWrong
                  ? 'border-red-400 bg-red-50 animate-shake'
                  : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-amber-300 shadow-sm hover:scale-102'
              }`}
            >
              {card.isMatched && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black shadow-xs">
                  ✓
                </div>
              )}

              <span
                className={`transition-transform duration-200 drop-shadow-xs select-none ${
                  card.type === 'picture'
                    ? 'text-4xl sm:text-5xl hover:scale-105'
                    : 'text-2xl sm:text-3xl font-black text-slate-800'
                }`}
              >
                {card.content}
              </span>

              <span className="text-[10px] font-semibold text-slate-500 mt-1 bg-slate-50 px-2 py-0.5 rounded-md truncate max-w-[95%] border border-slate-200/50">
                {card.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
