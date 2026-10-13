import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Volume2, Sparkles, Check, Play, Settings2 } from 'lucide-react';
import { playClickSound, speakText, speakLetter } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceControlModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { voiceDialect, setVoiceDialect, language, parentSettings, updateParentSettings } = useApp();
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  if (!isOpen) return null;

  const handleSelectDialect = (dialect: 'northern' | 'southern') => {
    playClickSound();
    setVoiceDialect(dialect);
    // Play greeting sample in the chosen dialect
    const greeting =
      dialect === 'northern'
        ? 'Xin chào bé yêu! Chúc bé học thật chăm ngoan nhé!'
        : 'Xin chào bé yêu! Chúc bé học thật vui và giỏi giang nghen!';
    speakText(greeting, 'vi', parentSettings.speechRate || 0.88, dialect);
  };

  const handleTestPhonicsB = () => {
    playClickSound();
    // Test letter B: crisp Grade 1 phonics sound "Bờ"
    speakLetter('B', 'phonics', false, voiceDialect);
  };

  const handleTestWordBe = () => {
    playClickSound();
    const word = voiceDialect === 'northern' ? 'Bé ngoan học giỏi' : 'Bé cưng học giỏi nghen';
    speakText(word, 'vi', parentSettings.speechRate || 0.88, voiceDialect);
  };

  const handleTestLetterOo = () => {
    playClickSound();
    // Test letter Ô
    speakLetter('Ô', 'phonics', true, voiceDialect);
  };

  const handleTestNumbers = () => {
    playClickSound();
    speakText('Số Một, Số Hai, Số Ba', 'vi', parentSettings.speechRate || 0.88, voiceDialect);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border-4 border-amber-300 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-400 text-white flex items-center justify-center text-2xl shadow-md">
              🎙️
            </div>
            <div>
              <h3 className="font-black text-lg sm:text-xl text-slate-800">
                {language === 'vi' ? 'Cài Đặt Giọng Đọc Chuẩn' : 'Vietnamese Voice Settings'}
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                {language === 'vi'
                  ? 'Chuẩn âm đánh vần Bộ GD&ĐT • Không sai từ vựng'
                  : 'Official Ministry Phonics Standards'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-4 space-y-4 overflow-y-auto">
          {/* Accent Options */}
          <div className="space-y-2.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500">
              {language === 'vi' ? 'Chọn Vùng Miền Giọng Đọc' : 'Choose Regional Accent'}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Giọng Nam (Mặc định) */}
              <button
                onClick={() => handleSelectDialect('southern')}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all relative ${
                  voiceDialect === 'southern'
                    ? 'border-amber-400 bg-amber-50/70 shadow-md ring-2 ring-amber-200'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                {voiceDialect === 'southern' && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-2xl">🌴</span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                    Mặc định
                  </span>
                </div>
                <div className="font-black text-sm text-slate-900">
                  {language === 'vi' ? 'Giọng Chuẩn Nam' : 'Southern Accent'}
                </div>
                <div className="text-[11px] font-semibold text-slate-500 mt-1">
                  {language === 'vi'
                    ? 'Sài Gòn ấm áp, ngọt ngào, phát âm chuẩn mầm non không nuốt âm.'
                    : 'Warm Saigon accent, gentle and melodic.'}
                </div>
              </button>

              {/* Giọng Bắc */}
              <button
                onClick={() => handleSelectDialect('northern')}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all relative ${
                  voiceDialect === 'northern'
                    ? 'border-rose-400 bg-rose-50/70 shadow-md ring-2 ring-rose-200'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                {voiceDialect === 'northern' && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className="text-2xl mb-1">🌸</div>
                <div className="font-black text-sm text-slate-900">
                  {language === 'vi' ? 'Giọng Chuẩn Bắc' : 'Northern Accent'}
                </div>
                <div className="text-[11px] font-semibold text-slate-500 mt-1">
                  {language === 'vi'
                    ? 'Hà Nội theo chuẩn SGK Bộ GD&ĐT, thanh thoát, rõ dấu hỏi ngã.'
                    : 'Standard Hanoi accent, crisp and clear.'}
                </div>
              </button>
            </div>
          </div>

          {/* Interactive Pronunciation Test Bar */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-amber-600" />
                {language === 'vi' ? 'Kiểm Tra Phát Âm Thực Tế' : 'Test Speech Pronunciation'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {voiceDialect === 'northern' ? 'Đang dùng: Giọng Bắc' : 'Đang dùng: Giọng Nam'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={handleTestWordBe}
                className="py-2.5 px-2 rounded-xl bg-white hover:bg-amber-50 text-slate-800 font-black text-xs border border-slate-200 hover:border-amber-300 shadow-sm flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all"
              >
                <span className="text-sm">👶</span>
                <span>Từ: "Bé"</span>
              </button>

              <button
                onClick={handleTestLetterOo}
                className="py-2.5 px-2 rounded-xl bg-white hover:bg-purple-50 text-slate-800 font-black text-xs border border-slate-200 hover:border-purple-300 shadow-sm flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all"
              >
                <span className="text-sm">☂️</span>
                <span>Chữ "Ô"</span>
              </button>

              <button
                onClick={handleTestPhonicsB}
                className="py-2.5 px-2 rounded-xl bg-white hover:bg-rose-50 text-slate-800 font-black text-xs border border-slate-200 hover:border-rose-300 shadow-sm flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all"
              >
                <span className="text-sm">🅱️</span>
                <span>Chữ B (Bờ)</span>
              </button>

              <button
                onClick={handleTestNumbers}
                className="py-2.5 px-2 rounded-xl bg-white hover:bg-emerald-50 text-slate-800 font-black text-xs border border-slate-200 hover:border-emerald-300 shadow-sm flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all"
              >
                <span className="text-sm">🔢</span>
                <span>Số 1, 2, 3</span>
              </button>
            </div>
          </div>

          {/* Speech Rate Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                {language === 'vi' ? 'Tốc Độ Giọng Đọc' : 'Speaking Pace'}
              </label>
              <span className="text-xs font-bold text-amber-700">
                {parentSettings.speechRate === 0.8
                  ? 'Chậm rãi (Bé 1-2 tuổi)'
                  : parentSettings.speechRate === 1.0
                  ? 'Bình thường'
                  : 'Chuẩn mầm non (0.88x)'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { rate: 0.8, labelVi: 'Chậm rãi 🐢', labelEn: 'Slow' },
                { rate: 0.88, labelVi: 'Chuẩn mầm non ⭐', labelEn: 'Standard' },
                { rate: 1.0, labelVi: 'Tự nhiên 🐰', labelEn: 'Normal' },
              ].map((item) => (
                <button
                  key={item.rate}
                  onClick={() => {
                    playClickSound();
                    updateParentSettings({ speechRate: item.rate });
                    speakText('Bé ngoan học giỏi nhé', 'vi', item.rate, voiceDialect);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                    Math.abs((parentSettings.speechRate || 0.88) - item.rate) < 0.04
                      ? 'bg-amber-400 text-slate-950 font-black border-amber-500 shadow-sm'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {language === 'vi' ? item.labelVi : item.labelEn}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-black text-sm shadow-md active:scale-95 transition-all text-center"
          >
            {language === 'vi' ? 'Xác Nhận & Tiếp Tục Học 🚀' : 'Done & Continue Learning 🚀'}
          </button>
        </div>
      </div>
    </div>
  );
};
