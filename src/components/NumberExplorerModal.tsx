import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Volume2, Sparkles, Star, Trophy, Search, Calculator, Grid, HelpCircle } from 'lucide-react';
import { speakText, playPopSound, playClickSound, playStarSound, playFanfareSound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NumberExplorerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { language, parentSettings, voiceDialect } = useApp();
  const [mainTab, setMainTab] = useState<'1-1000' | 'multiplication' | 'calculator'>('1-1000');

  // 1-1000 Tab state
  const [rangeIndex, setRangeIndex] = useState<number>(0); // 0 = 1-100, 1 = 101-200 ... 9 = 901-1000
  const [searchNum, setSearchNum] = useState<string>('');
  const [activeNumber, setActiveNumber] = useState<number | null>(null);

  // Multiplication Tab state
  const [tableType, setTableType] = useState<'multiply' | 'divide'>('multiply');
  const [selectedTableNumber, setSelectedTableNumber] = useState<number>(2);

  // Calculator & Rods/Fingers state
  const [calcNum1, setCalcNum1] = useState<number>(5);
  const [calcOp, setCalcOp] = useState<'+' | '-' | '×' | '÷'>('+');
  const [calcNum2, setCalcNum2] = useState<number>(3);
  const [visualMode, setVisualMode] = useState<'fingers' | 'rods'>('fingers');

  if (!isOpen) return null;

  const isSouthern = voiceDialect === 'southern';

  // Pronounce number 1 - 1000
  const pronounceNumber = (num: number) => {
    setActiveNumber(num);
    playPopSound();
    playStarSound();

    let spoken = `Số ${num}`;
    if (num === 100) spoken = 'Một trăm';
    else if (num === 200) spoken = 'Hai trăm';
    else if (num === 500) spoken = 'Năm trăm';
    else if (num === 1000) spoken = isSouthern ? 'Một ngàn' : 'Một nghìn';

    if (num === 100 || num === 500 || num === 1000) {
      playFanfareSound();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    }

    speakText(spoken, 'vi', parentSettings.speechRate || 0.88, voiceDialect);
  };

  // Range options for 1-1000
  const rangeStart = rangeIndex * 100 + 1;
  const rangeEnd = (rangeIndex + 1) * 100;
  const numberList = Array.from({ length: 100 }, (_, i) => rangeStart + i);

  // Filtered list if search present
  const searchInt = parseInt(searchNum.trim(), 10);
  const displayNumbers = !isNaN(searchInt) && searchInt >= 1 && searchInt <= 1000
    ? [searchInt]
    : numberList;

  // Calculation Result
  let calcResult = 0;
  if (calcOp === '+') calcResult = calcNum1 + calcNum2;
  else if (calcOp === '-') calcResult = Math.max(0, calcNum1 - calcNum2);
  else if (calcOp === '×') calcResult = calcNum1 * calcNum2;
  else if (calcOp === '÷') calcResult = calcNum2 > 0 ? Math.floor(calcNum1 / calcNum2) : 0;

  const speakMathEquation = () => {
    playClickSound();
    let text = '';
    if (calcOp === '+') text = `${calcNum1} cộng ${calcNum2} bằng ${calcResult}`;
    else if (calcOp === '-') text = `${calcNum1} trừ ${calcNum2} bằng ${calcResult}`;
    else if (calcOp === '×') text = `${calcNum1} nhân ${calcNum2} bằng ${calcResult}`;
    else if (calcOp === '÷') text = `${calcNum1} chia ${calcNum2} bằng ${calcResult}`;

    speakText(text, 'vi', parentSettings.speechRate || 0.88, voiceDialect);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border-4 border-emerald-400 relative text-slate-800 flex flex-col max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 pr-10 shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl shadow-inner shrink-0">
            🔢
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
              <span>Bảng Đếm Số 1-1000 & Bảng Cửu Chương</span>
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              Đếm số 1-1000, Bảng cửu chương nhân chia & Máy tính đếm ngón tay / que tính sinh động
            </p>
          </div>
        </div>

        {/* Top Navigation Tabs */}
        <div className="flex gap-2 my-3 shrink-0">
          <button
            onClick={() => {
              playClickSound();
              setMainTab('1-1000');
            }}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
              mainTab === '1-1000'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Bảng Đếm Số (1 - 1,000)</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setMainTab('multiplication');
            }}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
              mainTab === 'multiplication'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Bảng Cửu Chương (1 - 10)</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setMainTab('calculator');
            }}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
              mainTab === 'calculator'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Máy Tính Ngón Tay & Que Tính</span>
          </button>
        </div>

        {/* TAB 1: 1 - 1000 */}
        {mainTab === '1-1000' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Search and Range Controls */}
            <div className="py-2 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 shrink-0">
              {/* Search number */}
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={searchNum}
                  onChange={(e) => setSearchNum(e.target.value)}
                  placeholder="Gõ số bất kỳ (1 - 1000)..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-emerald-400"
                />
              </div>

              <span className="text-xs font-bold text-slate-500">
                Hiển thị: <strong className="text-emerald-700">{rangeStart} - {rangeEnd}</strong>
              </span>
            </div>

            {/* Range Selectors */}
            <div className="py-2 flex items-center gap-1.5 overflow-x-auto shrink-0">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((idx) => {
                const start = idx * 100 + 1;
                const end = (idx + 1) * 100;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      playClickSound();
                      setRangeIndex(idx);
                      setSearchNum('');
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                      rangeIndex === idx && !searchNum
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {start} - {end}
                  </button>
                );
              })}
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto pr-1 py-2 grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2">
              {displayNumbers.map((n) => {
                const isActive = activeNumber === n;
                const isTen = n % 10 === 0;
                return (
                  <button
                    key={n}
                    onClick={() => pronounceNumber(n)}
                    className={`h-11 sm:h-12 rounded-xl border-2 font-black text-xs sm:text-sm flex items-center justify-center transition-all select-none active:scale-95 ${
                      isActive
                        ? 'bg-emerald-400 text-slate-950 border-emerald-500 scale-110 shadow-lg ring-2 ring-emerald-300'
                        : isTen
                        ? 'bg-amber-100 border-amber-300 text-amber-900 font-extrabold'
                        : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-800'
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: MULTIPLICATION & DIVISION TABLES */}
        {mainTab === 'multiplication' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Table Type & Number selection */}
            <div className="py-2 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 shrink-0">
              {/* Multiply vs Divide */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
                <button
                  onClick={() => {
                    playClickSound();
                    setTableType('multiply');
                  }}
                  className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
                    tableType === 'multiply'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-600'
                  }`}
                >
                  ✖️ Bảng Cửu Chương Nhân
                </button>
                <button
                  onClick={() => {
                    playClickSound();
                    setTableType('divide');
                  }}
                  className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
                    tableType === 'divide'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-600'
                  }`}
                >
                  ➗ Bảng Cửu Chương Chia
                </button>
              </div>

              {/* Number buttons (1 - 10) */}
              <div className="flex items-center gap-1 overflow-x-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      playClickSound();
                      setSelectedTableNumber(num);
                    }}
                    className={`w-9 h-9 rounded-xl font-black text-xs transition-all ${
                      selectedTableNumber === num
                        ? 'bg-purple-600 text-white shadow-md scale-105'
                        : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Table Lines Display */}
            <div className="flex-1 overflow-y-auto pr-1 py-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((idx) => {
                let eqText = '';
                let spokenText = '';
                let result = 0;

                if (tableType === 'multiply') {
                  result = selectedTableNumber * idx;
                  eqText = `${selectedTableNumber} × ${idx} = ${result}`;
                  spokenText = `${selectedTableNumber} nhân ${idx} bằng ${result}`;
                } else {
                  const dividend = selectedTableNumber * idx;
                  result = idx;
                  eqText = `${dividend} ÷ ${selectedTableNumber} = ${result}`;
                  spokenText = `${dividend} chia ${selectedTableNumber} bằng ${result}`;
                }

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      playClickSound();
                      speakText(spokenText, 'vi', parentSettings.speechRate || 0.88, voiceDialect);
                    }}
                    className="p-3.5 rounded-2xl border-2 border-purple-200 bg-purple-50/50 hover:bg-purple-100/60 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-purple-200 text-purple-900 font-black text-xs flex items-center justify-center">
                        #{idx}
                      </span>
                      <span className="text-lg font-black text-slate-800 tracking-wide">
                        {eqText}
                      </span>
                    </div>

                    <button className="p-2 rounded-xl bg-white group-hover:bg-purple-600 text-purple-600 group-hover:text-white transition-colors shadow-sm">
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: CALCULATOR & FINGER / RODS COUNTING */}
        {mainTab === 'calculator' && (
          <div className="flex-1 flex flex-col min-h-0 space-y-3">
            {/* Controls */}
            <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              {/* Inputs */}
              <div className="flex items-center gap-2">
                {/* Num 1 */}
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={calcNum1}
                  onChange={(e) => setCalcNum1(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-16 h-12 text-center text-xl font-black rounded-xl border-2 border-amber-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />

                {/* Operator Selector */}
                <div className="flex items-center bg-amber-200 p-1 rounded-xl">
                  {(['+', '-', '×', '÷'] as const).map((op) => (
                    <button
                      key={op}
                      onClick={() => {
                        playClickSound();
                        setCalcOp(op);
                      }}
                      className={`w-9 h-9 rounded-lg font-black text-base transition-all ${
                        calcOp === op
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      {op}
                    </button>
                  ))}
                </div>

                {/* Num 2 */}
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={calcNum2}
                  onChange={(e) => setCalcNum2(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-16 h-12 text-center text-xl font-black rounded-xl border-2 border-amber-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />

                <span className="text-2xl font-black text-slate-700">=</span>

                {/* Result Display */}
                <div className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-2xl shadow-sm border border-amber-500">
                  {calcResult}
                </div>
              </div>

              {/* Speak Equation Button */}
              <button
                onClick={speakMathEquation}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs shadow-md hover:from-amber-600 hover:to-orange-600 transition-all flex items-center gap-1.5"
              >
                <Volume2 className="w-4 h-4" />
                <span>Nghe Phép Tính</span>
              </button>
            </div>

            {/* Visual Guide Mode Toggle: Fingers vs Rods */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 shrink-0">
              <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Minh Họa Đếm Trực Quan Cho Bé:
              </span>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => {
                    playClickSound();
                    setVisualMode('fingers');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                    visualMode === 'fingers'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-600'
                  }`}
                >
                  🤚 Đếm Ngón Tay
                </button>
                <button
                  onClick={() => {
                    playClickSound();
                    setVisualMode('rods');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                    visualMode === 'rods'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-600'
                  }`}
                >
                  🥢 Đếm Que Tính
                </button>
              </div>
            </div>

            {/* Visual Area */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-2xl p-4 border-2 border-amber-200/80 space-y-4">
              {visualMode === 'fingers' ? (
                <div className="space-y-4 text-center">
                  <p className="text-xs font-bold text-amber-900">
                    Bé cùng xòe ngón tay để đếm phép tính <strong className="text-amber-700">{calcNum1} {calcOp} {calcNum2}</strong> nha!
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-4 py-2">
                    {/* First Num Fingers */}
                    <div className="bg-white p-3 rounded-2xl border border-amber-200 shadow-sm text-center">
                      <p className="text-xs font-black text-slate-600 mb-1">Số đầu: {calcNum1}</p>
                      <div className="text-3xl tracking-widest">
                        {'🤚'.repeat(Math.min(10, Math.max(1, Math.floor(calcNum1 / 5)))) || '☝️'}
                      </div>
                    </div>

                    <span className="text-3xl font-black text-amber-600">{calcOp}</span>

                    {/* Second Num Fingers */}
                    <div className="bg-white p-3 rounded-2xl border border-amber-200 shadow-sm text-center">
                      <p className="text-xs font-black text-slate-600 mb-1">Số sau: {calcNum2}</p>
                      <div className="text-3xl tracking-widest">
                        {'✋'.repeat(Math.min(10, Math.max(1, Math.floor(calcNum2 / 5)))) || '☝️'}
                      </div>
                    </div>

                    <span className="text-3xl font-black text-amber-600">=</span>

                    {/* Result Fingers */}
                    <div className="bg-amber-100 p-3 rounded-2xl border-2 border-amber-400 shadow-sm text-center">
                      <p className="text-xs font-black text-amber-900 mb-1">KẾT QUẢ: {calcResult}</p>
                      <div className="text-3xl tracking-widest">
                        {'⭐'.repeat(Math.min(15, calcResult))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-center">
                  <p className="text-xs font-bold text-emerald-900">
                    Minh họa bó que tính (bó 10 que + que lẻ) cho <strong className="text-emerald-700">{calcNum1} {calcOp} {calcNum2}</strong>:
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-4 py-2">
                    {/* First Num Rods */}
                    <div className="bg-white p-3 rounded-2xl border border-emerald-200 shadow-sm text-center">
                      <p className="text-xs font-black text-slate-600 mb-1">Số thứ nhất: {calcNum1}</p>
                      <div className="text-2xl tracking-wider">
                        {'🥢'.repeat(Math.min(20, calcNum1))}
                      </div>
                    </div>

                    <span className="text-3xl font-black text-emerald-600">{calcOp}</span>

                    {/* Second Num Rods */}
                    <div className="bg-white p-3 rounded-2xl border border-emerald-200 shadow-sm text-center">
                      <p className="text-xs font-black text-slate-600 mb-1">Số thứ hai: {calcNum2}</p>
                      <div className="text-2xl tracking-wider">
                        {'🥢'.repeat(Math.min(20, calcNum2))}
                      </div>
                    </div>

                    <span className="text-3xl font-black text-emerald-600">=</span>

                    {/* Result Rods */}
                    <div className="bg-emerald-100 p-3 rounded-2xl border-2 border-emerald-400 shadow-sm text-center">
                      <p className="text-xs font-black text-emerald-900 mb-1">BÓ QUE TÍNH TỔNG: {calcResult}</p>
                      <div className="text-2xl tracking-wider">
                        {'🥢'.repeat(Math.min(30, calcResult))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
