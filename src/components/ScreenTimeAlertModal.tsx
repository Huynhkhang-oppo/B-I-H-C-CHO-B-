import React from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Eye, Sparkles } from 'lucide-react';
import { playClickSound } from '../utils/audio';

export const ScreenTimeAlertModal: React.FC = () => {
  const { isScreenTimeAlertOpen, dismissScreenTimeAlert, requestParentZone, language, parentSettings } = useApp();

  if (!isScreenTimeAlertOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-b from-indigo-900 to-indigo-950 text-white rounded-3xl max-w-md w-full p-6 text-center border-4 border-amber-300 shadow-2xl relative overflow-hidden">
        {/* Soft background stars */}
        <div className="absolute top-2 left-4 text-2xl animate-pulse">✨</div>
        <div className="absolute top-8 right-6 text-xl animate-pulse delay-100">🌙</div>
        <div className="absolute bottom-4 left-6 text-xl animate-pulse delay-200">⭐</div>

        <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-4xl shadow-inner animate-bounce">
          🐰
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-3">
          <Eye className="w-3.5 h-3.5" />
          {language === 'vi' ? 'Đã hết giờ học hôm nay' : 'Daily Screen Time Reached'}
        </div>

        <h2 className="text-2xl font-black text-amber-300 mb-2">
          {language === 'vi' ? 'Mắt bé cần nghỉ ngơi rồi!' : 'Time for a Gentle Rest!'}
        </h2>

        <p className="text-sm text-indigo-100/90 leading-relaxed mb-6 px-2">
          {language === 'vi'
            ? `Bé đã học chăm chỉ ${parentSettings.screenTimeLimitMinutes} phút hôm nay. Bé hãy chớp mắt 5 lần, uống một ngụm nước và cùng ba mẹ vận động nhẹ nhàng nhé!`
            : `You have studied diligently for ${parentSettings.screenTimeLimitMinutes} minutes today. Let's rest your eyes, take a sip of water, and stretch with parents!`}
        </p>

        <div className="space-y-3">
          <button
            onClick={() => {
              playClickSound();
              dismissScreenTimeAlert();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-base shadow-lg shadow-amber-400/30 transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <span>👍</span>
            {language === 'vi' ? 'Bé hiểu rồi, tạm biệt bạn thỏ!' : 'I understand, rest time!'}
          </button>

          <button
            onClick={() => {
              playClickSound();
              dismissScreenTimeAlert();
              requestParentZone();
            }}
            className="text-xs text-indigo-300 hover:text-white underline font-semibold transition-colors block mx-auto pt-1"
          >
            {language === 'vi' ? 'Ba mẹ muốn gia hạn thêm thời gian' : 'Parent: extend study time'}
          </button>
        </div>
      </div>
    </div>
  );
};
