import React, { useState, useEffect } from 'react';
import { Lesson, LessonItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Volume2, Sparkles, Trophy } from 'lucide-react';
import { speakText, playPopSound, playClickSound, playSuccessSound, playStarSound } from '../../utils/audio';

interface Props {
  lesson: Lesson;
  onFinish: (stars: number) => void;
  onBack: () => void;
}

interface ActiveBubble {
  id: string;
  item: LessonItem;
  x: number; // percentage
  y: number; // percentage
  size: number;
  color: string;
  popped: boolean;
}

const BUBBLE_COLORS = [
  'from-pink-400 to-rose-500 border-pink-200',
  'from-amber-400 to-orange-500 border-amber-200',
  'from-emerald-400 to-teal-500 border-emerald-200',
  'from-sky-400 to-blue-500 border-sky-200',
  'from-purple-400 to-indigo-500 border-purple-200',
  'from-yellow-400 to-amber-500 border-yellow-200',
];

export const BubblePopGame: React.FC<Props> = ({ lesson, onFinish, onBack }) => {
  const { language, voiceDialect, parentSettings } = useApp();
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  const [bubbles, setBubbles] = useState<ActiveBubble[]>([]);
  const [score, setScore] = useState(0);
  const [wrongPopAnim, setWrongPopAnim] = useState<string | null>(null);

  const targetItem: LessonItem = lesson.items[currentTargetIndex];

  // Speak instructions whenever target changes
  const speakInstruction = () => {
    if (!targetItem) return;
    const text =
      lesson.subjectId === 'english'
        ? `Find the bubble with ${targetItem.display}`
        : `Bé hãy tìm bong bóng có ${targetItem.display} nè!`;
    const lang = lesson.subjectId === 'english' ? 'en' : 'vi';
    speakText(text, lang, parentSettings.speechRate || 0.85, 'northern');
  };

  // Generate bubbles on mount or when target advances
  useEffect(() => {
    if (!targetItem) return;

    // Create 6 bubbles: 2 correct targets, 4 distractors
    const newBubbles: ActiveBubble[] = [];
    const pool = [...lesson.items];

    // Ensure at least 2 instances of current target
    const itemsToDistribute = [
      targetItem,
      targetItem,
      ...pool.filter((i) => i.id !== targetItem.id),
      ...pool,
    ].slice(0, 6);

    // Shuffle
    itemsToDistribute.sort(() => Math.random() - 0.5);

    const positions = [
      { x: 15, y: 18 },
      { x: 50, y: 15 },
      { x: 82, y: 22 },
      { x: 20, y: 62 },
      { x: 52, y: 65 },
      { x: 80, y: 68 },
    ];

    itemsToDistribute.forEach((item, idx) => {
      newBubbles.push({
        id: `bubble-${idx}-${Date.now()}`,
        item,
        x: positions[idx].x + (Math.random() * 6 - 3),
        y: positions[idx].y + (Math.random() * 6 - 3),
        size: Math.floor(Math.random() * 12) + 76,
        color: BUBBLE_COLORS[idx % BUBBLE_COLORS.length],
        popped: false,
      });
    });

    setBubbles(newBubbles);
    const timer = setTimeout(speakInstruction, 300);
    return () => clearTimeout(timer);
  }, [currentTargetIndex]);

  const handleBubbleTap = (bubble: ActiveBubble) => {
    if (bubble.popped) return;

    if (bubble.item.id === targetItem.id) {
      // Correct!
      playPopSound();
      playStarSound();

      // Mark bubble popped
      setBubbles((prev) =>
        prev.map((b) => (b.id === bubble.id ? { ...b, popped: true } : b))
      );

      const nextScore = score + 1;
      setScore(nextScore);

      // Check if all instances of this target are popped
      const remainingTargetBubbles = bubbles.filter(
        (b) => b.item.id === targetItem.id && b.id !== bubble.id && !b.popped
      );

      if (remainingTargetBubbles.length === 0) {
        // Move to next target or finish game
        if (currentTargetIndex < lesson.items.length - 1) {
          playSuccessSound();
          setTimeout(() => {
            setCurrentTargetIndex((prev) => prev + 1);
          }, 600);
        } else {
          // Finished all!
          playSuccessSound();
          setTimeout(() => {
            onFinish(lesson.rewardStars);
          }, 600);
        }
      }
    } else {
      // Wrong bubble
      playClickSound();
      setWrongPopAnim(bubble.id);
      setTimeout(() => setWrongPopAnim(null), 500);
      speakText(
        language === 'vi' ? 'Chưa đúng rồi, bé tìm lại nha!' : 'Try again!',
        language === 'vi' ? 'vi' : 'en',
        parentSettings.speechRate || 0.9,
        'northern'
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto w-full p-4 flex flex-col items-center">
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
            🎯 {currentTargetIndex + 1} / {lesson.items.length}
          </div>
          <div className="px-3 py-1.5 rounded-2xl bg-purple-100 text-purple-800 text-xs font-black border border-purple-200">
            ⭐ +{lesson.rewardStars}
          </div>
        </div>
      </div>

      {/* Target Mission Banner: Minimalist Visual Spotlight */}
      <div className="w-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 p-3.5 sm:p-4 rounded-3xl text-slate-900 shadow-md shadow-amber-400/20 flex items-center justify-between mb-4 border-2 border-amber-300">
        <div className="flex items-center gap-3.5">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-4xl shrink-0 border border-white/80 animate-float">
            {targetItem.emojiOrImage}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/10 text-slate-900 text-[11px] font-black uppercase tracking-wider mb-0.5">
              <span>{language === 'vi' ? 'Bé hãy tìm:' : 'Find:'}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-950 leading-tight">
              {targetItem.display}
            </h3>
          </div>
        </div>

        <button
          onClick={speakInstruction}
          className="p-3 bg-white/95 hover:bg-white rounded-2xl shadow-sm text-slate-900 transition-transform active:scale-90 cursor-pointer flex items-center gap-1.5 font-black text-xs"
          title="Nghe lại yêu cầu"
        >
          <Volume2 className="w-5 h-5 text-amber-600" />
          <span className="hidden sm:inline">Nghe 🔊</span>
        </button>
      </div>

      {/* Game Pond / Bubble Arena */}
      <div className="w-full h-80 sm:h-96 rounded-3xl bg-gradient-to-b from-sky-100 via-cyan-50 to-blue-100/70 border-4 border-sky-300 relative overflow-hidden shadow-inner flex items-center justify-center select-none">
        {/* Playful background waves */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

        {bubbles.map((b) => {
          if (b.popped) return null;
          const isWobbling = wrongPopAnim === b.id;

          return (
            <button
              key={b.id}
              onClick={() => handleBubbleTap(b)}
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                width: `${b.size}px`,
                height: `${b.size}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute rounded-full bg-gradient-to-br ${b.color} border-4 shadow-xl flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95 animate-float ${
                isWobbling ? 'animate-shake ring-4 ring-red-400' : ''
              }`}
            >
              {/* Bubble shine reflection */}
              <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-white/70" />

              <span className="text-xl sm:text-2xl drop-shadow">
                {b.item.emojiOrImage}
              </span>
              <span className="text-lg sm:text-xl font-black text-white drop-shadow-md">
                {b.item.display}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs font-bold text-slate-500">
          {language === 'vi'
            ? '💡 Chạm vào các quả bóng chứa đúng chữ hoặc số nhé!'
            : '💡 Tap the bubbles that match the requested target!'}
        </p>
      </div>
    </div>
  );
};
