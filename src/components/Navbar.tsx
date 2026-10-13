import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AgeGroup } from '../types';
import { Star, Flame, Clock, WifiOff, Gift, ShieldAlert, Globe } from 'lucide-react';
import { playClickSound } from '../utils/audio';
import { PWAInstallButton } from './PWAInstallButton';

export const Navbar: React.FC = () => {
  const {
    profile,
    setAgeGroup,
    parentSettings,
    voiceDialect,
    screenTimeMinutes,
    isOnline,
    setRewardStoreOpen,
    requestParentZone,
    language,
    setLanguage,
    goHome,
    setNumberExplorerOpen,
    setAlphabetExplorerOpen,
    setEditProfileOpen,
    updateParentSettings,
    setVoiceModalOpen,
  } = useApp();

  const ageGroups: { id: AgeGroup; labelVi: string; labelEn: string; icon: string }[] = [
    { id: '1-3', labelVi: '1 - 3 Tuổi (Mầm Non)', labelEn: '1-3 Years', icon: '🍼' },
    { id: '4-6', labelVi: '4 - 6 Tuổi (Tiền Tiểu Học)', labelEn: '4-6 Years', icon: '🎒' },
    { id: '7-9', labelVi: '7 - 9 Tuổi (Tiểu Học)', labelEn: '7-9 Years', icon: '📚' },
    { id: '10-12', labelVi: '10 - 12 Tuổi (Lớn)', labelEn: '10-12 Years', icon: '🎓' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-2 border-amber-200 shadow-sm py-2 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Brand Logo */}
        <button
          onClick={() => {
            playClickSound();
            goHome();
          }}
          className="flex items-center gap-2 group transition-transform active:scale-95"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-2xl shadow-md shadow-amber-300/60 group-hover:rotate-6 transition-transform">
            🦁
          </div>
          <div className="text-left">
            <span className="font-black text-lg sm:text-xl text-amber-950 tracking-tight block leading-none">
              Bé Vui Học
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-amber-600 tracking-wide uppercase">
              Smart Kids VN
            </span>
          </div>
        </button>

        {/* Quick Child Name / Nickname Badge */}
        <button
          onClick={() => {
            playClickSound();
            setEditProfileOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-black border-2 border-amber-300 shadow-sm transition-transform active:scale-95 group"
          title={language === 'vi' ? 'Chạm để đổi tên bé hoặc tên ở nhà' : 'Change child name'}
        >
          <span className="text-base group-hover:scale-110 transition-transform">{profile.avatar}</span>
          <span className="max-w-[100px] sm:max-w-[130px] truncate">{profile.name}</span>
          <span className="text-[11px] text-amber-700 bg-amber-200/80 px-1 py-0.2 rounded-md">✏️</span>
        </button>

        {/* Age Group Selector */}
        <div className="flex items-center bg-amber-50 p-1 rounded-2xl border border-amber-200">
          {ageGroups.map((grp) => {
            const isSelected = profile.ageGroup === grp.id;
            return (
              <button
                key={grp.id}
                onClick={() => {
                  playClickSound();
                  setAgeGroup(grp.id);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-900 shadow-sm'
                    : 'text-amber-800 hover:bg-amber-100/60'
                }`}
                title={language === 'vi' ? grp.labelVi : grp.labelEn}
              >
                <span>{grp.icon}</span>
                <span className="hidden sm:inline">{grp.id} tuổi</span>
                <span className="sm:hidden">{grp.id}t</span>
              </button>
            );
          })}
        </div>

        {/* Status Indicators & Actions */}
        <div className="flex items-center gap-2">
          {/* Offline Indicator */}
          {!isOnline && (
            <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-300">
              <WifiOff className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'vi' ? 'Ngoại Tuyến' : 'Offline'}</span>
            </div>
          )}

          {/* Screen Time */}
          {parentSettings.screenTimeLimitMinutes > 0 && (
            <div
              className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200"
              title="Thời gian học hôm nay"
            >
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>{Math.round(screenTimeMinutes)}/{parentSettings.screenTimeLimitMinutes}p</span>
            </div>
          )}

          {/* Streak */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-black border border-orange-200">
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
            <span>{profile.activeStreakDays}d</span>
          </div>

          {/* Star Counter */}
          <button
            onClick={() => {
              playClickSound();
              setRewardStoreOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-black shadow-sm transition-transform active:scale-95"
          >
            <Star className="w-4 h-4 fill-amber-950 text-amber-950" />
            <span>{profile.totalStars}</span>
          </button>

          {/* Reward Shop */}
          <button
            onClick={() => {
              playClickSound();
              setRewardStoreOpen(true);
            }}
            className="p-2 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-800 transition-colors"
            title={language === 'vi' ? 'Kho quà & Đổi thưởng' : 'Rewards'}
          >
            <Gift className="w-4 h-4" />
          </button>



          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Language Toggle */}
          <button
            onClick={() => {
              playClickSound();
              setLanguage(language === 'vi' ? 'en' : 'vi');
            }}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center gap-1 border border-slate-200 shrink-0"
            title="Đổi ngôn ngữ / Change language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Parent Zone Button */}
          <button
            onClick={() => {
              playClickSound();
              requestParentZone();
            }}
            className="p-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors flex items-center gap-1 font-bold text-xs shrink-0"
            title={language === 'vi' ? 'Khu vực phụ huynh (Bảo mật)' : 'Parent Zone (Protected)'}
          >
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">{language === 'vi' ? 'Phụ Huynh' : 'Parents'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
