import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Wifi, WifiOff, CheckCircle2, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { playClickSound } from '../utils/audio';

export const OfflineStatusIndicator: React.FC = () => {
  const { isOnline, language } = useApp();
  const [showToast, setShowToast] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasBeenOffline, setHasBeenOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setHasBeenOffline(true);
      setShowToast(false);
    } else if (hasBeenOffline) {
      // Reconnected
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, hasBeenOffline]);

  // Online and no recent reconnect toast: render nothing or simple discreet pill
  if (isOnline && !showToast) {
    return null;
  }

  // Reconnected Toast
  if (isOnline && showToast) {
    return (
      <div className="fixed top-18 right-4 z-50 animate-fade-in">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white shadow-xl text-xs font-black border border-emerald-400">
          <Wifi className="w-4 h-4 text-emerald-200 animate-pulse" />
          <span>
            {language === 'vi'
              ? 'Đã kết nối Internet trở lại — Sẵn sàng đồng bộ đa thiết bị!'
              : 'Back online — Ready to sync!'}
          </span>
        </div>
      </div>
    );
  }

  // Active Offline Indicator Banner
  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-fade-in select-none">
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-3xl p-3.5 shadow-2xl border-2 border-amber-300">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <WifiOff className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
                <h4 className="font-black text-xs sm:text-sm tracking-wide">
                  {language === 'vi' ? 'Chế Độ Ngoại Tuyến (Offline)' : 'Offline Learning Active'}
                </h4>
              </div>
              <p className="text-[11px] text-amber-100 font-bold mt-0.5">
                {language === 'vi'
                  ? 'Bé vẫn học bình thường, không lo mất mạng!'
                  : 'All lessons & progress work seamlessly offline!'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              setIsExpanded(!isExpanded);
            }}
            className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
            title="Chi tiết"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-white/20 text-[11px] font-semibold text-amber-50 space-y-1.5 animate-fade-in">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
              <span>Dữ liệu bài học Tiếng Việt, Toán, Tiếng Anh đã nạp sẵn 100%.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
              <span>Âm thanh phát âm và trò chơi tự tạo offline không tốn 4G.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
              <span>Tiến độ và sao vàng được lưu tự động trên thiết bị này.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
