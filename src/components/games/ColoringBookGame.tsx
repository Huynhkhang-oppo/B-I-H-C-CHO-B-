import React, { useRef, useState, useEffect } from 'react';
import { Lesson, LessonItem } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Eraser,
  RotateCcw,
  Check,
  Sparkles,
  Volume2,
  Palette,
  Download,
  Share2,
} from 'lucide-react';
import {
  playClickSound,
  playPopSound,
  playSuccessSound,
  playStarSound,
  speakText,
} from '../../utils/audio';
import confetti from 'canvas-confetti';

interface Props {
  lesson: Lesson;
  onFinish: (stars: number) => void;
  onBack: () => void;
}

// Preset vibrant child-friendly colors
const COLOR_PALETTE = [
  { name: 'Đỏ dâu', hex: '#ef4444' },
  { name: 'Cam tươi', hex: '#f97316' },
  { name: 'Vàng nắng', hex: '#eab308' },
  { name: 'Xanh lá mạ', hex: '#22c55e' },
  { name: 'Xanh ngọc', hex: '#06b6d4' },
  { name: 'Xanh biển sâu', hex: '#3b82f6' },
  { name: 'Tím mộng mơ', hex: '#a855f7' },
  { name: 'Hồng kẹo ngọt', hex: '#ec4899' },
  { name: 'Nâu socola', hex: '#854d0e' },
  { name: 'Đen than', hex: '#1e293b' },
];

const BRUSH_SIZES = [
  { label: 'Nhỏ', size: 10 },
  { label: 'Vừa', size: 20 },
  { label: 'To', size: 36 },
];

export const ColoringBookGame: React.FC<Props> = ({ lesson, onFinish, onBack }) => {
  const { language, voiceDialect, parentSettings } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0].hex);
  const [brushSize, setBrushSize] = useState(20);
  const [isEraser, setIsEraser] = useState(false);
  const [hasColored, setHasColored] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const currentItem: LessonItem = lesson.items[currentIndex] || lesson.items[0];

  // Speak intro when item changes with safe debounce to avoid duplicate speech
  useEffect(() => {
    setHasColored(false);
    clearCanvas();
    const timer = setTimeout(() => {
      const prompt = `Bé hãy chọn màu và tô tranh cho ${currentItem.subTextVi || currentItem.display} nhé!`;
      speakText(prompt, 'vi', parentSettings.speechRate || 0.88, 'northern');
    }, 350);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handleStartDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawingRef.current = true;
    const pt = getCanvasCoords(e);
    if (!pt) return;
    lastPointRef.current = pt;
    playPopSound();
    drawPoint(pt.x, pt.y);
  };

  const drawPoint = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, brushSize * 1.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = selectedColor;
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    setHasColored(true);
  };

  const handleMoveDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const pt = getCanvasCoords(e);
    if (!pt || !lastPointRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 2;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = brushSize;
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    ctx.restore();

    lastPointRef.current = pt;
    setHasColored(true);
  };

  const handleEndDraw = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  const handleNextOrFinish = () => {
    playStarSound();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });

    if (currentIndex < lesson.items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      playSuccessSound();
      speakText('Bé vẽ tranh và tô màu siêu đẹp luôn! Hoan hô bé!', 'vi', 0.88, voiceDialect);
      onFinish(lesson.rewardStars || 4);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white rounded-3xl p-4 shadow-sm border-2 border-pink-200">
        <button
          onClick={() => {
            playClickSound();
            onBack();
          }}
          className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-transform active:scale-95 cursor-pointer flex items-center gap-1 text-xs font-black"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Quay Lại</span>
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-100 text-pink-900 text-xs font-black">
            <Palette className="w-3.5 h-3.5 text-pink-600" />
            <span>Sách Tô Màu Bé Yêu • {currentIndex + 1}/{lesson.items.length}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-800">
            {currentItem.subTextVi || currentItem.display}
          </h2>
        </div>

        <button
          onClick={() => {
            playClickSound();
            speakText(currentItem.audioTextVi || currentItem.subTextVi, 'vi', 0.88, voiceDialect);
          }}
          className="p-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black shadow-sm transition-transform active:scale-95 cursor-pointer flex items-center gap-1 text-xs"
        >
          <Volume2 className="w-5 h-5" />
          <span className="hidden sm:inline">Nghe</span>
        </button>
      </div>

      {/* Main Canvas Drawing Area */}
      <div className="relative bg-white rounded-3xl p-4 sm:p-6 shadow-md border-3 border-pink-300 flex flex-col items-center">
        {/* 5 Template Type Switchers */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
          {lesson.items.slice(0, 5).map((it, idx) => (
            <button
              key={it.id}
              onClick={() => {
                playClickSound();
                setCurrentIndex(idx);
              }}
              className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                currentIndex === idx
                  ? 'bg-pink-500 text-white shadow-sm ring-2 ring-pink-300 scale-105'
                  : 'bg-slate-100 hover:bg-pink-50 text-slate-700 border border-slate-200'
              }`}
            >
              <span>{it.emojiOrImage}</span>
              <span>{it.category || it.display}</span>
            </button>
          ))}
        </div>

        {/* The black-and-white coloring outline template behind canvas */}
        <div className="relative w-full max-w-[420px] aspect-square rounded-3xl bg-white border-4 border-dashed border-pink-300 shadow-inner overflow-hidden select-none touch-none flex items-center justify-center">
          {/* Black & White Outline Template: filter grayscale contrast to produce clean colouring book page */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            {/* Outline badge informing bé */}
            <div className="absolute top-3 px-3 py-1 rounded-full bg-white/95 text-[11px] font-black text-slate-600 border border-slate-300 shadow-2xs flex items-center gap-1.5 z-0">
              <span>🎨 Tranh vẽ đen trắng • Bé tự do tô màu sáng tạo!</span>
            </div>

            <div className="flex flex-col items-center justify-center filter grayscale contrast-200 opacity-60">
              <span className="text-[150px] sm:text-[190px] drop-shadow-sm leading-none transition-transform select-none">
                {currentItem.emojiOrImage}
              </span>
            </div>

            <div className="absolute bottom-3 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-xs font-black text-slate-800 border border-slate-300 shadow-2xs">
              {currentItem.subTextVi || currentItem.display}
            </div>
          </div>

          {/* User Drawing Canvas overlay */}
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            onMouseDown={handleStartDraw}
            onMouseMove={handleMoveDraw}
            onMouseUp={handleEndDraw}
            onMouseLeave={handleEndDraw}
            onTouchStart={handleStartDraw}
            onTouchMove={handleMoveDraw}
            onTouchEnd={handleEndDraw}
            className="absolute inset-0 w-full h-full cursor-crosshair z-10"
          />
        </div>

        {/* Toolbar: Colors & Brushes */}
        <div className="w-full mt-4 space-y-3">
          {/* Color Palette */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {COLOR_PALETTE.map((c) => (
              <button
                key={c.hex}
                onClick={() => {
                  playClickSound();
                  setIsEraser(false);
                  setSelectedColor(c.hex);
                }}
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full transition-transform active:scale-90 shadow-sm cursor-pointer border-3 ${
                  !isEraser && selectedColor === c.hex
                    ? 'scale-115 border-slate-900 shadow-md ring-2 ring-pink-300'
                    : 'border-white hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>

          {/* Tools: Eraser, Size & Clear */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            {/* Brush sizes */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Cỡ cọ:</span>
              {BRUSH_SIZES.map((b) => (
                <button
                  key={b.size}
                  onClick={() => {
                    playClickSound();
                    setBrushSize(b.size);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    brushSize === b.size
                      ? 'bg-pink-500 text-white border-pink-600 shadow-xs'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            {/* Eraser & Reset */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playClickSound();
                  setIsEraser(!isEraser);
                }}
                className={`px-3 py-1.5 rounded-2xl text-xs font-black border flex items-center gap-1 transition-all cursor-pointer ${
                  isEraser
                    ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                }`}
              >
                <Eraser className="w-4 h-4" />
                <span>{isEraser ? 'Đang Tẩy' : 'Tẩy'}</span>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  clearCanvas();
                }}
                className="px-3 py-1.5 rounded-2xl text-xs font-black bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Xóa Hết</span>
              </button>

              {/* Next/Finish Button */}
              <button
                onClick={handleNextOrFinish}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{currentIndex < lesson.items.length - 1 ? 'Xong Bức Này ➡️' : 'Hoàn Thành! ⭐'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
