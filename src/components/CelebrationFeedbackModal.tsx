import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, Sparkles, Volume2, Trophy, Heart, ArrowRight, Gift, Check } from 'lucide-react';
import { speakText, playClickSound, playPopSound } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  celebrationText: string;
  starsEarned: number;
  lessonTitle: string;
  isHardLevel: boolean;
  onOpenDreamBox?: () => void;
}

export const CelebrationFeedbackModal: React.FC<Props> = ({
  isOpen,
  onClose,
  celebrationText,
  starsEarned,
  lessonTitle,
  isHardLevel,
  onOpenDreamBox,
}) => {
  const { language, parentSettings, profile } = useApp();
  const [isPlayingAgain, setIsPlayingAgain] = useState(false);

  if (!isOpen) return null;

  const dialect = parentSettings.dialect || 'southern';
  const isSouthern = dialect === 'southern';

  const handleReplayVoice = () => {
    setIsPlayingAgain(true);
    playClickSound();
    speakText(celebrationText, 'vi', 0.9, dialect);
    setTimeout(() => setIsPlayingAgain(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-gradient-to-b from-amber-50 via-white to-orange-50 rounded-3xl max-w-md w-full p-6 text-center border-4 border-amber-400 shadow-2xl relative overflow-hidden">
        {/* Glow & Party Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-300/30 rounded-full blur-3xl pointer-events-none" />

        {/* Mascot celebrating */}
        <div className="relative inline-block mb-3">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-amber-400 text-slate-900 flex items-center justify-center text-5xl shadow-lg shadow-amber-300/60 animate-bounce">
            🥳
          </div>
          <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-rose-500 text-white font-black text-xs shadow-md border-2 border-white flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-white" />
            <span>+{starsEarned}</span>
          </div>
        </div>

        {/* Milestone Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-200/80 text-amber-950 text-xs font-black uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>
            {isHardLevel
              ? language === 'vi' ? 'CHINH PHỤC ẢI KHÓ!' : 'HARD LEVEL CONQUERED!'
              : language === 'vi' ? 'HOÀN THÀNH XUẤT SẮC!' : 'LESSON COMPLETED!'}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
          {lessonTitle || (language === 'vi' ? 'Bé Đã Hoàn Thành!' : 'Great Job!')}
        </h3>

        {/* Cheerful Speech Feedback Bubble */}
        <div className="bg-amber-100/70 border-2 border-amber-300/80 rounded-2xl p-4 my-3 text-left relative shadow-sm">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 text-base shadow-sm">
              🗣️
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-black uppercase text-amber-900 block mb-0.5">
                {language === 'vi'
                  ? `Giọng Miền Nam Vui Tươi Khen Ngợi Bé:`
                  : `Cheerful Southern Praise:`}
              </span>
              <p className="text-xs sm:text-sm font-extrabold text-amber-950 leading-relaxed">
                "{celebrationText}"
              </p>
            </div>
          </div>

          <button
            onClick={handleReplayVoice}
            className={`mt-2.5 w-full py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 border border-amber-300 ${
              isPlayingAgain
                ? 'bg-amber-400 text-slate-900 ring-2 ring-amber-300 animate-pulse'
                : 'bg-white hover:bg-amber-50 text-amber-900'
            }`}
          >
            <Volume2 className="w-4 h-4 text-amber-600" />
            <span>{language === 'vi' ? 'Nghe Lại Lời Khen Ngọt Ngào' : 'Replay Cheerful Voice'}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 mt-4">
          {isHardLevel && onOpenDreamBox && (
            <button
              onClick={() => {
                playClickSound();
                onClose();
                onOpenDreamBox();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-sm shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Gift className="w-4 h-4" />
              <span>{language === 'vi' ? 'Vào Hộp Ước Mơ Chọn Quà 🎁' : 'Open Dream Wish Box 🎁'}</span>
            </button>
          )}

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-sm shadow-md shadow-amber-300/40 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <span>{language === 'vi' ? 'Tiếp Tục Học Nào! 🚀' : 'Continue Learning! 🚀'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
