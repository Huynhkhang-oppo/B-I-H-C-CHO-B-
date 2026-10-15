import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    try {
      localStorage.removeItem('be_vui_hoc_state_v1');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl border-4 border-amber-300 text-center space-y-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-black text-slate-800">
                Ôi, có chút trục trặc nhỏ! 🌈
              </h1>
              <p className="text-sm font-semibold text-slate-600">
                Ứng dụng gặp sự cố ngoài ý muốn. Bé và ba mẹ đừng lo lắng nhé!
              </p>
            </div>

            {this.state.error && (
              <div className="bg-slate-50 p-3 rounded-xl text-left border border-slate-200">
                <p className="text-xs font-mono text-red-600 break-words line-clamp-3">
                  {this.state.error.message || 'Lỗi không xác định'}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-extrabold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Tải lại ứng dụng ngay</span>
              </button>

              <button
                onClick={this.handleReset}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Khôi phục về trạng thái ban đầu</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
