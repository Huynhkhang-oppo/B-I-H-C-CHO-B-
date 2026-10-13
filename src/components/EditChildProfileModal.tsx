import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AgeGroup } from '../types';
import { X, Check, Sparkles, Heart, Smile } from 'lucide-react';
import { playClickSound, playSuccessSound, speakText } from '../utils/audio';

const CUTE_NICKNAMES = [
  'Bé Bo',
  'Bé Bắp',
  'Bé Sam',
  'Bé Tin',
  'Bé Sóc',
  'Bé Nhím',
  'Bé Dâu',
  'Bé Kem',
  'Bé Gạo',
  'Bé Bơ',
  'Bé Miu',
  'Bé Thỏ',
  'Bé Bon',
  'Bé Tít',
  'Bé Cà Rốt',
  'Bé Bin',
  'Bé Na',
  'Bé Sữa',
];

const AVATAR_OPTIONS = [
  { emoji: '🦁', name: 'Sư Tử Vàng' },
  { emoji: '🐰', name: 'Thỏ Trắng' },
  { emoji: '🐻', name: 'Gấu Nâu' },
  { emoji: '🐱', name: 'Mèo Con' },
  { emoji: '🐶', name: 'Cún Cưng' },
  { emoji: '🦄', name: 'Kỳ Lân' },
  { emoji: '🐼', name: 'Gấu Trúc' },
  { emoji: '🐯', name: 'Hổ Con' },
  { emoji: '🐥', name: 'Gà Con' },
  { emoji: '🐨', name: 'Koala' },
  { emoji: '🦊', name: 'Cáo Nhỏ' },
  { emoji: '🐵', name: 'Khỉ Vui' },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const EditChildProfileModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { profile, updateProfile, language, voiceDialect } = useApp();

  const [name, setName] = useState(profile.name);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const [selectedAge, setSelectedAge] = useState<AgeGroup>(profile.ageGroup);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = name.trim() || 'Bé Yêu';
    updateProfile({
      name: trimmed,
      avatar: selectedAvatar,
      ageGroup: selectedAge,
    });
    playSuccessSound();

    speakText(
      language === 'vi'
        ? `Hoan hô! Ba mẹ đã đổi tên thành ${trimmed} rồi nè! Chúc ${trimmed} học thật ngoan nghen!`
        : `Profile updated for ${trimmed}!`,
      'vi',
      0.9,
      voiceDialect
    );

    onClose();
  };

  const handlePickNickname = (nick: string) => {
    playClickSound();
    setName(nick);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-4 border-amber-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✏️</span>
            <div>
              <h3 className="font-black text-lg text-slate-800">
                {language === 'vi' ? 'Đổi Tên & Hình Đại Diện Của Bé' : 'Customize Child Profile'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'vi'
                  ? 'Đặt tên thân mật ở nhà để ứng dụng gọi bé gần gũi nhất'
                  : 'Set your child’s home nickname and mascot'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-2 rounded-2xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 py-4">
          {/* Avatar Preview & Picker */}
          <div>
            <label className="block text-xs font-black uppercase text-amber-900 tracking-wider mb-2">
              {language === 'vi' ? '1. Chọn bạn thú đại diện của bé' : '1. Choose Child Mascot'}
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av.emoji}
                  onClick={() => {
                    playClickSound();
                    setSelectedAvatar(av.emoji);
                  }}
                  className={`aspect-square rounded-2xl flex items-center justify-center text-3xl transition-transform ${
                    selectedAvatar === av.emoji
                      ? 'bg-amber-100 border-3 border-amber-500 scale-110 shadow-md ring-2 ring-amber-300'
                      : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
                  }`}
                  title={av.name}
                >
                  {av.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Child Name Input */}
          <div>
            <label className="block text-xs font-black uppercase text-amber-900 tracking-wider mb-2">
              {language === 'vi' ? '2. Tên của bé hoặc tên thân mật ở nhà' : '2. Child’s Name or Nickname'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Bé Bắp, Bé Bo, Gia Bảo..."
                maxLength={30}
                className="w-full px-4 py-3 rounded-2xl border-2 border-amber-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 outline-none text-base font-black text-slate-800 placeholder-slate-400 shadow-inner"
              />
              <span className="absolute right-3.5 top-3.5 text-lg">❤️</span>
            </div>
          </div>

          {/* Quick Home Nicknames Chips */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-black text-slate-600">
                {language === 'vi' ? 'Gợi ý tên thân mật gọi ở nhà (Chạm để chọn):' : 'Popular Home Nicknames:'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CUTE_NICKNAMES.map((nick) => (
                <button
                  key={nick}
                  onClick={() => handlePickNickname(nick)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    name === nick
                      ? 'bg-amber-500 text-white shadow-sm scale-105'
                      : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200/60'
                  }`}
                >
                  {nick}
                </button>
              ))}
            </div>
          </div>

          {/* Age Group Selector */}
          <div>
            <label className="block text-xs font-black uppercase text-amber-900 tracking-wider mb-2">
              {language === 'vi' ? '3. Độ tuổi của bé' : '3. Age Group'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: '1-3', label: '1 - 3 tuổi', sub: 'Mầm non sớm' },
                { id: '4-6', label: '4 - 6 tuổi', sub: 'Tiền tiểu học' },
                { id: '7-9', label: '7 - 9 tuổi', sub: 'Tiểu học (Lớp 2-3)' },
                { id: '10-12', label: '10 - 12 tuổi', sub: 'Tiểu học & THCS' },
              ].map((grp) => (
                <button
                  key={grp.id}
                  onClick={() => {
                    playClickSound();
                    setSelectedAge(grp.id as AgeGroup);
                  }}
                  className={`p-2.5 rounded-2xl border-2 text-center transition-all ${
                    selectedAge === grp.id || (selectedAge === '1-2' && grp.id === '1-3') || (selectedAge === '3-4' && grp.id === '1-3') || (selectedAge === '4-5' && grp.id === '4-6')
                      ? 'border-amber-500 bg-amber-50 text-amber-950 font-black shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 font-bold hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-black">{grp.label}</div>
                  <div className="text-[10px] text-slate-500">{grp.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm"
          >
            {language === 'vi' ? 'Hủy' : 'Cancel'}
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-900 font-black text-sm shadow-md shadow-amber-300/40 flex items-center justify-center gap-1.5 transition-transform active:scale-95"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{language === 'vi' ? 'Lưu Thông Tin Bé' : 'Save Profile'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
