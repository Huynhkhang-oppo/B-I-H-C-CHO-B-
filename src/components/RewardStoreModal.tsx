import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Gift, Star, CheckCircle, Clock, Heart, Sparkles, X, PlusCircle, Settings2 } from 'lucide-react';
import { playClickSound, playStarSound } from '../utils/audio';
import { ParentRewardManager } from './ParentRewardManager';

export const RewardStoreModal: React.FC = () => {
  const {
    isRewardStoreOpen,
    setRewardStoreOpen,
    rewards,
    profile,
    claimReward,
    toggleApproveReward,
    setCustomRewardModalOpen,
    language,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'available' | 'claimed' | 'manage'>('available');

  if (!isRewardStoreOpen) return null;

  const availableRewards = rewards.filter((r) => !r.claimedAt);
  const claimedRewards = rewards.filter((r) => !!r.claimedAt);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border-4 border-amber-300 relative text-slate-800 flex flex-col max-h-[90vh]">
        <button
          onClick={() => {
            playClickSound();
            setRewardStoreOpen(false);
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 pr-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl shadow-inner">
              🎁
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                {language === 'vi' ? 'Kho Quà Ước Mơ' : 'Dream Rewards Shop'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'vi' ? 'Đổi sao lấy những phần thưởng đời thực ấm áp từ ba mẹ!' : 'Redeem stars for sweet real-life family rewards!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-400 text-amber-950 font-black text-base shadow-sm">
            <Star className="w-5 h-5 fill-amber-950 text-amber-950" />
            <span>{profile.totalStars}</span>
          </div>
        </div>

        {/* Tabs & Propose Wish Button */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 mb-3">
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => {
                playClickSound();
                setActiveTab('available');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'available'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {language === 'vi' ? `Quà Đổi (${availableRewards.length})` : `Available (${availableRewards.length})`}
            </button>
            <button
              onClick={() => {
                playClickSound();
                setActiveTab('claimed');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'claimed'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {language === 'vi' ? `Đã Đổi (${claimedRewards.length})` : `Redeemed (${claimedRewards.length})`}
            </button>
            <button
              onClick={() => {
                playClickSound();
                setActiveTab('manage');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'manage'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
              }`}
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? 'Ba Mẹ Cập Nhật Quà' : 'Parent Manage'}</span>
            </button>
          </div>

          {activeTab !== 'manage' && (
            <button
              onClick={() => {
                playClickSound();
                setRewardStoreOpen(false);
                setCustomRewardModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-purple-600" />
              <span>{language === 'vi' ? 'Bé Đề Xuất Quà' : 'Propose Wish'}</span>
            </button>
          )}
        </div>

        {/* Content List */}
        <div className="overflow-y-auto flex-1 space-y-3 pr-1 py-1">
          {activeTab === 'manage' ? (
            <ParentRewardManager />
          ) : activeTab === 'available' ? (
            availableRewards.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p className="text-3xl mb-2">🎈</p>
                <p className="text-sm font-semibold">{language === 'vi' ? 'Bé đã đổi hết quà rồi! Hãy học thêm để tích sao nhé!' : 'All rewards claimed! Study more to get stars!'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableRewards.map((reward) => {
                  const canAfford = profile.totalStars >= reward.costStars;
                  return (
                    <div
                      key={reward.id}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                        canAfford
                          ? 'border-amber-200 bg-amber-50/40 hover:border-amber-400 hover:shadow-md'
                          : 'border-slate-200 bg-slate-50/70 opacity-80'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl shrink-0">
                          {reward.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-extrabold text-sm text-slate-800 truncate">
                              {language === 'vi' ? reward.titleVi : reward.titleEn}
                            </h4>
                            {reward.isCustomProposed && (
                              <span className="px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-black shrink-0">
                                {language === 'vi' ? 'Bé ước' : 'Kid Wish'}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                            {language === 'vi' ? reward.descriptionVi : reward.descriptionEn}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                        <div className="flex items-center gap-1 font-black text-xs text-amber-600">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span>{reward.costStars} {language === 'vi' ? 'sao' : 'stars'}</span>
                        </div>

                        <button
                          onClick={() => {
                            if (canAfford) {
                              claimReward(reward.id);
                            }
                          }}
                          disabled={!canAfford}
                          className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                            canAfford
                              ? 'bg-amber-400 hover:bg-amber-300 text-slate-900 shadow-sm active:scale-95'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {canAfford
                            ? language === 'vi' ? 'Đổi Quà Ngay' : 'Redeem Now'
                            : language === 'vi' ? `Cần thêm ${reward.costStars - profile.totalStars} ⭐` : `Need ${reward.costStars - profile.totalStars} ⭐`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : claimedRewards.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-3xl mb-2">⭐</p>
              <p className="text-sm font-semibold">{language === 'vi' ? 'Chưa có phần thưởng nào được đổi.' : 'No rewards claimed yet.'}</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {claimedRewards.map((reward) => (
                <div
                  key={reward.id}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{reward.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-800">
                          {language === 'vi' ? reward.titleVi : reward.titleEn}
                        </span>
                        <span className="text-xs text-slate-400">
                          ({new Date(reward.claimedAt || '').toLocaleDateString('vi-VN')})
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {language === 'vi' ? reward.descriptionVi : reward.descriptionEn}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        playClickSound();
                        toggleApproveReward(reward.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        reward.parentApproved
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
                      }`}
                    >
                      {reward.parentApproved ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{language === 'vi' ? 'Ba mẹ đã trao' : 'Given'}</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>{language === 'vi' ? 'Chờ ba mẹ trao' : 'Pending'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
