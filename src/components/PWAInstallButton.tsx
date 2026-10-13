import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { playClickSound } from '../utils/audio';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed or running as standalone, don't show
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={() => {
          playClickSound();
          install();
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-black shadow-md shadow-amber-300/40 transition-all active:scale-95"
        title="Cài đặt ứng dụng vào điện thoại / máy tính bảng"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Cài Ứng Dụng</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => {
            playClickSound();
            setShowIOSGuide(true);
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-black border border-amber-300 transition-all"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Thêm Vào Màn Hình</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border-4 border-amber-300 relative text-slate-800">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-3xl shadow-inner">
                📲
              </div>

              <h3 className="text-lg font-black text-center text-slate-900">
                Cài Đặt Trên iPhone / iPad
              </h3>
              <p className="text-xs text-slate-500 text-center mt-1 mb-4">
                Để bé học mượt mà không cần mở trình duyệt Safari:
              </p>

              <div className="space-y-3 bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs font-bold text-amber-950">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center shrink-0 text-xs">1</span>
                  <span>Nhấn nút <strong>Chia sẻ (Share ⎋)</strong> ở thanh dưới của Safari.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center shrink-0 text-xs">2</span>
                  <span>Cuộn xuống và chọn <strong>Thêm vào MH chính (Add to Home Screen)</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center shrink-0 text-xs">3</span>
                  <span>Nhấn <strong>Thêm (Add)</strong> ở góc trên bên phải.</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-black shadow-md transition-all"
              >
                Đã Hiểu, Cảm Ơn!
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
