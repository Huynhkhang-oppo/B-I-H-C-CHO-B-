import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RewardItem } from '../types';
import { Plus, Edit2, Trash2, RotateCcw, Check, Gift, Star, X, Sparkles } from 'lucide-react';
import { playClickSound, playStarSound } from '../utils/audio';

const REWARD_ICONS = ['🎁', '🍦', '🎡', '🧸', '🚗', '📚', '🍕', '🏊', '🎬', '🧁', '🚂', '🚲', '🍫', '🏖️', '🎠', '🎨'];

export const ParentRewardManager: React.FC = () => {
  const { rewards, addParentReward, updateParentReward, deleteParentReward, resetRewardsToDefault, language } = useApp();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [costStars, setCostStars] = useState<number>(10);
  const [icon, setIcon] = useState('🎁');

  const handleStartAdd = () => {
    playClickSound();
    setTitle('');
    setDescription('');
    setCostStars(10);
    setIcon('🎁');
    setEditingId(null);
    setIsAddingNew(true);
  };

  const handleStartEdit = (item: RewardItem) => {
    playClickSound();
    setTitle(item.titleVi);
    setDescription(item.descriptionVi);
    setCostStars(item.costStars);
    setIcon(item.icon);
    setIsAddingNew(false);
    setEditingId(item.id);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    playStarSound();

    if (isAddingNew) {
      addParentReward({
        titleVi: title.trim(),
        descriptionVi: description.trim() || 'Phần thưởng ấm áp ba mẹ dành tặng bé!',
        costStars: Math.max(1, Number(costStars) || 5),
        icon,
      });
      setIsAddingNew(false);
    } else if (editingId) {
      updateParentReward(editingId, {
        titleVi: title.trim(),
        titleEn: title.trim(),
        descriptionVi: description.trim() || 'Phần thưởng ấm áp ba mẹ dành tặng bé!',
        costStars: Math.max(1, Number(costStars) || 5),
        icon,
      });
      setEditingId(null);
    }

    setTitle('');
    setDescription('');
  };

  const handleCancel = () => {
    playClickSound();
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleDelete = (id: string, name: string) => {
    playClickSound();
    if (window.confirm(`Ba mẹ có chắc muốn xóa phần thưởng "${name}" không?`)) {
      deleteParentReward(id);
    }
  };

  const handleReset = () => {
    playClickSound();
    if (window.confirm('Khôi phục danh sách phần thưởng mặc định ban đầu?')) {
      resetRewardsToDefault();
    }
  };

  return (
    <div className="space-y-4 text-slate-800">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
        <div>
          <h3 className="font-black text-sm text-slate-800 flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-amber-600" />
            <span>{language === 'vi' ? 'Ba Mẹ Tự Cập Nhật Phần Thưởng' : 'Parent Custom Rewards'}</span>
          </h3>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            {language === 'vi'
              ? 'Tự do thêm món quà thực tế, chuyến đi chơi hoặc điều bé thích để bé có động lực học!'
              : 'Add custom real-world family rewards and motivate your child!'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isAddingNew && !editingId && (
            <button
              onClick={handleStartAdd}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'vi' ? 'Thêm Quà Mới' : 'Add Reward'}</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-500 border border-slate-200 transition-colors"
            title="Khôi phục quà mặc định"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add / Edit Form Modal or Inline Card */}
      {(isAddingNew || editingId) && (
        <form onSubmit={handleSave} className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-amber-400 shadow-md space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-black text-sm text-amber-950 flex items-center gap-1.5">
              <span>{isAddingNew ? '✨ Thêm Phần Thưởng Mới' : '✏️ Chỉnh Sửa Phần Thưởng'}</span>
            </h4>
            <button
              type="button"
              onClick={handleCancel}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Title */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-black text-slate-700">Tên Phần Thưởng (*)</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Đi Thảo Cầm Viên, Ăn kem ốc quế, Mua sách tranh..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            {/* Cost in Stars */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-700">Số Sao Đổi (*)</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="500"
                  required
                  value={costStars}
                  onChange={(e) => setCostStars(Number(e.target.value))}
                  className="w-full px-3 py-2 pl-8 rounded-xl border border-slate-200 text-xs font-black outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                />
                <Star className="w-4 h-4 text-amber-500 fill-amber-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-700">Lời Nhắn / Mô Tả Của Ba Mẹ</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ví dụ: Cả nhà cùng đi chơi cuối tuần khi bé học chăm chỉ!"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>

          {/* Icon Selector */}
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-700">Chọn Biểu Tượng Quà:</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {REWARD_ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl transition-all cursor-pointer ${
                    icon === ic
                      ? 'bg-amber-400 border-2 border-amber-600 scale-110 shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isAddingNew ? 'Lưu Quà Mới' : 'Cập Nhật Quà'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Rewards Catalog List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className="p-3.5 rounded-2xl border-2 border-slate-200 hover:border-amber-300 bg-white transition-all flex items-start justify-between gap-3 shadow-xs"
          >
            <div className="flex items-start gap-3 min-w-0">
              <span className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-2xl shrink-0">
                {reward.icon}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-extrabold text-sm text-slate-800 truncate">
                    {reward.titleVi}
                  </h4>
                  <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    {reward.costStars} ⭐
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-semibold line-clamp-1 mt-0.5">
                  {reward.descriptionVi}
                </p>
                {reward.claimedAt && (
                  <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    {reward.parentApproved ? '✅ Ba mẹ đã trao' : '⏳ Bé đã đổi, chờ trao quà'}
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons: Edit & Delete */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => handleStartEdit(reward)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 transition-colors cursor-pointer"
                title="Sửa phần thưởng"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(reward.id, reward.titleVi)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition-colors cursor-pointer"
                title="Xóa phần thưởng"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
