import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, ShieldAlert, Check, X, KeyRound } from 'lucide-react';
import { playClickSound, playSuccessSound } from '../utils/audio';

export const ParentalGateModal: React.FC = () => {
  const { isParentGateOpen, closeParentGate, unlockParentZone, parentSettings, language } = useApp();

  const [mode, setMode] = useState<'math' | 'pin'>('math');
  const [num1, setNum1] = useState(3);
  const [num2, setNum2] = useState(4);
  const [userAnswer, setUserAnswer] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Generate random math problem when opened
  useEffect(() => {
    if (isParentGateOpen) {
      const a = Math.floor(Math.random() * 8) + 3; // 3 to 10
      const b = Math.floor(Math.random() * 8) + 2; // 2 to 9
      setNum1(a);
      setNum2(b);
      setUserAnswer('');
      setPinInput('');
      setErrorMsg('');
      setMode(parentSettings.useMathGate ? 'math' : 'pin');
    }
  }, [isParentGateOpen, parentSettings.useMathGate]);

  if (!isParentGateOpen) return null;

  const expectedMathAnswer = num1 + num2;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();

    if (mode === 'math') {
      if (parseInt(userAnswer.trim(), 10) === expectedMathAnswer) {
        playSuccessSound();
        unlockParentZone();
      } else {
        setErrorMsg(language === 'vi' ? 'Kết quả chưa chính xác. Vui lòng thử lại!' : 'Incorrect answer. Please try again!');
        setUserAnswer('');
      }
    } else {
      if (pinInput.trim() === parentSettings.pinCode) {
        playSuccessSound();
        unlockParentZone();
      } else {
        setErrorMsg(language === 'vi' ? 'Mã PIN không đúng. Mặc định là 1234.' : 'Incorrect PIN. Default is 1234.');
        setPinInput('');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-amber-300 relative text-slate-800">
        <button
          onClick={() => {
            playClickSound();
            closeParentGate();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-5">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">
            {language === 'vi' ? 'Khu Vực Phụ Huynh' : 'Parent Zone'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {language === 'vi'
              ? 'Xác nhận để bảo vệ quyền riêng tư và cài đặt cho bé.'
              : 'Security check to prevent toddlers from modifying settings.'}
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('math');
              setErrorMsg('');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'math'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {language === 'vi' ? '🧮 Phép tính bảo vệ' : '🧮 Math Challenge'}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('pin');
              setErrorMsg('');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'pin'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {language === 'vi' ? '🔢 Mã PIN (1234)' : '🔢 PIN Code'}
          </button>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          {mode === 'math' ? (
            <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 text-center">
              <span className="text-xs uppercase tracking-wider text-amber-700 font-extrabold block mb-1">
                {language === 'vi' ? 'Giải phép toán sau để mở khóa' : 'Solve the math problem to unlock'}
              </span>
              <div className="text-3xl font-black text-slate-800 tracking-wider my-2">
                {num1} + {num2} = ?
              </div>
              <input
                type="number"
                pattern="[0-9]*"
                inputMode="numeric"
                value={userAnswer}
                onChange={(e) => {
                  setUserAnswer(e.target.value);
                  setErrorMsg('');
                }}
                placeholder={language === 'vi' ? 'Nhập kết quả...' : 'Enter answer...'}
                className="w-full text-center text-xl font-bold py-2.5 px-4 rounded-xl border-2 border-amber-300 focus:outline-none focus:border-amber-500 bg-white"
                autoFocus
              />
            </div>
          ) : (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-extrabold block mb-1">
                {language === 'vi' ? 'Nhập mã PIN 4 chữ số' : 'Enter 4-digit PIN'}
              </span>
              <input
                type="password"
                maxLength={6}
                inputMode="numeric"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="••••"
                className="w-full text-center text-2xl tracking-widest font-bold py-2.5 px-4 rounded-xl border-2 border-slate-300 focus:outline-none focus:border-amber-500 bg-white"
                autoFocus
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                {language === 'vi' ? '(Mã mặc định: 1234 - có thể đổi trong Cài đặt)' : '(Default: 1234)'}
              </span>
            </div>
          )}

          {errorMsg && (
            <p className="text-red-500 text-xs font-semibold text-center animate-shake">
              {errorMsg}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeParentGate}
              className="flex-1 py-3 px-4 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors text-sm"
            >
              {language === 'vi' ? 'Quay lại' : 'Back'}
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-2xl font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-md shadow-amber-200 transition-all text-sm flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              {language === 'vi' ? 'Mở Khóa' : 'Unlock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
