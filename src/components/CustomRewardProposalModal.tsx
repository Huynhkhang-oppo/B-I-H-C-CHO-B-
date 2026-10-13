import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Crown, Sparkles, Heart, Gift, Check, X } from 'lucide-react';
import { playSuccessSound, playClickSound } from '../utils/audio';

const QUICK_PROPOSAL_IDEAS = [
  { icon: '🥞', textVi: 'Mẹ làm bánh pancake thơm lừng', textEn: 'Mom makes delicious pancakes' },
  { icon: '🎪', textVi: 'Đi chơi khu nhà bóng cuối tuần', textEn: 'Weekend ball pit playground trip' },
  { icon: '🧸', textVi: 'Được tự chọn 1 món đồ chơi nhỏ', textEn: 'Pick one small toy at store' },
  { icon: '🍦', textVi: 'Một cây kem dâu mát lạnh', textEn: 'Strawberry ice cream treat' },
  { icon: '🏊‍♂️', textVi: 'Đi công viên nước cùng cả nhà', textEn: 'Family water park trip' },
  { icon: '🎬', textVi: 'Xem phim hoạt hình cùng ba mẹ 30 phút', textEn: 'Watch cartoon with parents 30m' },
];

export const CustomRewardProposalModal: React.FC = () => {
  const {
    isCustomRewardModalOpen,
    setCustomRewardModalOpen,
    pendingHardRewardLesson,
    proposeCustomReward,
    language,
  } = useApp();

  const [wishText, setWishText] = useState('');
  const [selectedQuick, setSelectedQuick] = useState<string | null>(null);

  if (!isCustomRewardModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalWish = wishText.trim() || selectedQuick || (language === 'vi' ? 'Đi chơi công viên cuối tuần' : 'Weekend park trip');
    playSuccessSound();
    proposeCustomReward(finalWish, 'Phần thưởng đặc biệt bé tự ước khi hoàn thành ải khó!', 10);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-gradient-to-b from-amber-50 to-orange-50 rounded-3xl max-w-lg w-full p-6 shadow-2xl border-4 border-amber-400 relative text-slate-800 overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 transform translate-x-10 -translate-y-10 w-36 h-36 bg-amber-300/40 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={() => {
            playClickSound();
            setCustomRewardModalOpen(false);
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-amber-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-5">
          <div className="w-18 h-18 mx-auto mb-2 rounded-3xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-lg shadow-amber-300/60 animate-bounce">
            <Crown className="w-10 h-10 fill-amber-200" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/80 text-amber-900 text-xs font-black mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'vi' ? 'XUẤT SẮC! VƯỢT QUA ẢI KHÓ' : 'AMAZING! HARD LEVEL CLEARED'}
          </div>
          <h2 className="text-2xl font-black text-amber-950">
            {language === 'vi' ? 'Hộp Ước Mơ Của Bé' : 'Kid Dream Wish Box'}
          </h2>
          <p className="text-sm text-amber-800/80 mt-1">
            {language === 'vi'
              ? 'Vì bé đã chinh phục phần khó, bé được tự đề xuất một món quà gần gũi với ba mẹ nè!'
              : 'Because you conquered a hard challenge, you can propose a special wish to parents!'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-black uppercase text-amber-900 tracking-wider block mb-2">
              {language === 'vi' ? 'Chọn nhanh điều ước dễ thương:' : 'Quick pick sweet ideas:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_PROPOSAL_IDEAS.map((idea, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    playClickSound();
                    setSelectedQuick(language === 'vi' ? idea.textVi : idea.textEn);
                    setWishText(language === 'vi' ? idea.textVi : idea.textEn);
                  }}
                  className={`p-2.5 rounded-2xl border text-left text-xs font-bold transition-all flex items-center gap-2 ${
                    wishText === (language === 'vi' ? idea.textVi : idea.textEn)
                      ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-sm'
                      : 'bg-white hover:bg-amber-100 text-slate-700 border-amber-200'
                  }`}
                >
                  <span className="text-lg">{idea.icon}</span>
                  <span className="truncate">{language === 'vi' ? idea.textVi : idea.textEn}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border-2 border-amber-300">
            <label className="text-xs font-black text-amber-900 flex items-center gap-1.5 mb-1.5">
              <Gift className="w-4 h-4 text-amber-600" />
              {language === 'vi' ? 'Hoặc gõ món quà bé tự ước:' : 'Or type custom reward wish:'}
            </label>
            <input
              type="text"
              value={wishText}
              onChange={(e) => setWishText(e.target.value)}
              placeholder={language === 'vi' ? 'VD: Đi bơi với bố, mẹ mua đất nặn...' : 'e.g., Swim with dad, playdough...'}
              className="w-full text-sm font-bold py-2 px-3 rounded-xl border border-amber-200 focus:outline-none focus:border-amber-500 bg-amber-50/50"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCustomRewardModalOpen(false)}
              className="flex-1 py-3 px-4 rounded-2xl font-bold text-slate-600 bg-slate-200/80 hover:bg-slate-300 transition-colors text-sm"
            >
              {language === 'vi' ? 'Để sau' : 'Later'}
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-2xl font-black text-slate-900 bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-300/50 transition-all text-sm flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              {language === 'vi' ? 'Gửi Ước Mơ Cho Ba Mẹ' : 'Send Wish to Parents'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
