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
  ArrowRight,
  Layers,
  ChevronDown,
  X,
} from 'lucide-react';
import {
  speakText,
  playClickSound,
  playPopSound,
  playSuccessSound,
  playStarSound,
  speakLetter,
  speakNumber,
} from '../../utils/audio';
import { VIETNAMESE_ALPHABET } from '../../data/alphabetData';

interface Props {
  lesson: Lesson;
  onFinish: (stars: number) => void;
  onBack: () => void;
}

const BRUSH_COLORS = [
  { name: 'Cầu vồng', color: '#f59e0b', ring: 'ring-amber-400' },
  { name: 'Hồng phấn', color: '#ec4899', ring: 'ring-pink-400' },
  { name: 'Xanh ngọc', color: '#06b6d4', ring: 'ring-cyan-400' },
  { name: 'Xanh lá', color: '#10b981', ring: 'ring-emerald-400' },
  { name: 'Tím mộng', color: '#8b5cf6', ring: 'ring-purple-400' },
  { name: 'Đỏ tươi', color: '#ef4444', ring: 'ring-red-400' },
];

const TRACE_NUMBERS: LessonItem[] = [
  { id: 'num-0', display: '0', subTextVi: 'Số Không tròn trĩnh', subTextEn: 'Zero', audioTextVi: 'Số Không tròn trĩnh nè bé!', audioTextEn: 'Zero', emojiOrImage: '0️⃣' },
  { id: 'num-1', display: '1', subTextVi: 'Số Một thẳng đứng', subTextEn: 'One', audioTextVi: 'Số Một thẳng đứng như cây nến nghen!', audioTextEn: 'One', emojiOrImage: '1️⃣' },
  { id: 'num-2', display: '2', subTextVi: 'Số Hai cổ vịt', subTextEn: 'Two', audioTextVi: 'Số Hai cong cong như cổ bạn vịt bơi nè!', audioTextEn: 'Two', emojiOrImage: '2️⃣' },
  { id: 'num-3', display: '3', subTextVi: 'Số Ba tai thỏ', subTextEn: 'Three', audioTextVi: 'Số Ba có hai nét cong như tai thỏ nghen!', audioTextEn: 'Three', emojiOrImage: '3️⃣' },
  { id: 'num-4', display: '4', subTextVi: 'Số Bốn ghế ngược', subTextEn: 'Four', audioTextVi: 'Số Bốn giống cái ghế lộn ngược nè bé!', audioTextEn: 'Four', emojiOrImage: '4️⃣' },
  { id: 'num-5', display: '5', subTextVi: 'Số Năm bụng tròn', subTextEn: 'Five', audioTextVi: 'Số Năm có cái bụng tròn trĩnh nghen!', audioTextEn: 'Five', emojiOrImage: '5️⃣' },
  { id: 'num-6', display: '6', subTextVi: 'Số Sáu còi xe', subTextEn: 'Six', audioTextVi: 'Số Sáu nét cong xuống dưới nè bé!', audioTextEn: 'Six', emojiOrImage: '6️⃣' },
  { id: 'num-7', display: '7', subTextVi: 'Số Bảy lưỡi cuốc', subTextEn: 'Seven', audioTextVi: 'Số Bảy ngang rồi xiên xuống nghen!', audioTextEn: 'Seven', emojiOrImage: '7️⃣' },
  { id: 'num-8', display: '8', subTextVi: 'Số Tám người tuyết', subTextEn: 'Eight', audioTextVi: 'Số Tám như hai vòng tròn người tuyết nè!', audioTextEn: 'Eight', emojiOrImage: '8️⃣' },
  { id: 'num-9', display: '9', subTextVi: 'Số Chín bóng bay', subTextEn: 'Nine', audioTextVi: 'Số Chín có đầu tròn phía trên nghen!', audioTextEn: 'Nine', emojiOrImage: '9️⃣' },
  { id: 'num-10', display: '10', subTextVi: 'Số Mười tròn chục', subTextEn: 'Ten', audioTextVi: 'Số Mười gồm số một và số không tròn nè!', audioTextEn: 'Ten', emojiOrImage: '🔟' },
  { id: 'num-20', display: '20', subTextVi: 'Số Hai Mươi', subTextEn: 'Twenty', audioTextVi: 'Số Hai Mươi tròn chục nghen bé!', audioTextEn: 'Twenty', emojiOrImage: '✨' },
  { id: 'num-50', display: '50', subTextVi: 'Số Năm Mươi', subTextEn: 'Fifty', audioTextVi: 'Số Năm Mươi tròn chục nè bé!', audioTextEn: 'Fifty', emojiOrImage: '🌟' },
  { id: 'num-100', display: '100', subTextVi: 'Số Một Trăm tròn trĩnh', subTextEn: 'One Hundred', audioTextVi: 'Số Một Trăm có ba chữ số nè bé ơi!', audioTextEn: 'One Hundred', emojiOrImage: '💯' },
];

export const TracingCanvasGame: React.FC<Props> = ({ lesson, onFinish, onBack }) => {
  const { language, voiceDialect } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Active items list (can be original lesson items or switched dynamically)
  const [itemsList, setItemsList] = useState<LessonItem[]>(lesson.items);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('#f59e0b');
  const [brushSize, setBrushSize] = useState(18);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Quick letter/number picker modal
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerTab, setPickerTab] = useState<'letters' | 'numbers'>('letters');

  const currentItem: LessonItem = itemsList[currentIndex] || itemsList[0];

  // Draw background dashed guide letter on canvas
  const drawGuide = () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentItem) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background paper grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    // Horizontal helper guide lines (như ô li tập viết của học sinh mầm non)
    ctx.beginPath();
    ctx.moveTo(20, canvas.height * 0.22);
    ctx.lineTo(canvas.width - 20, canvas.height * 0.22);
    ctx.moveTo(20, canvas.height * 0.5);
    ctx.lineTo(canvas.width - 20, canvas.height * 0.5);
    ctx.moveTo(20, canvas.height * 0.78);
    ctx.lineTo(canvas.width - 20, canvas.height * 0.78);
    ctx.stroke();

    // Large dashed guide text
    ctx.setLineDash([6, 6]);
    const textLen = currentItem.display.length;
    const fontSize = textLen >= 3 ? 115 : textLen === 2 ? 145 : 185;
    ctx.font = `bold ${fontSize}px Nunito, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    ctx.strokeText(currentItem.display, canvas.width / 2, canvas.height / 2 + 10);

    // Reset dash
    ctx.setLineDash([]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 460;
      canvas.height = 360;
      drawGuide();
      setHasDrawn(false);
    }

    const timer = setTimeout(() => {
      const isNum = !isNaN(Number(currentItem.display));
      if (isNum) {
        speakNumber(currentItem.display);
      } else {
        speakText(
          language === 'vi'
            ? `Bé hãy tô nét chữ ${currentItem.display} thật đẹp nhé!`
            : `Trace the letter ${currentItem.display}!`,
          'vi',
          0.85,
          'northern'
        );
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [currentIndex, currentItem, language]);

  // Canvas drawing handlers
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.x) * scaleX,
      y: (clientY - rect.y) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    playPopSound();
    drawGuide();
    setHasDrawn(false);
  };

  const handleNextItem = () => {
    playStarSound();
    if (currentIndex < itemsList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      playSuccessSound();
      onFinish(lesson.rewardStars || 5);
    }
  };

  // Select a specific letter to trace from picker
  const handleSelectLetterToTrace = (alpha: typeof VIETNAMESE_ALPHABET[0]) => {
    playClickSound();
    const newItem: LessonItem = {
      id: `trace-${alpha.id}`,
      display: alpha.letter,
      subTextVi: alpha.exampleWordVi,
      subTextEn: alpha.exampleWordEn,
      audioTextVi: `Bé cùng tô chữ ${alpha.phonicsSoundVi} thật đẹp nghen!`,
      audioTextEn: `Trace ${alpha.letter}!`,
      emojiOrImage: alpha.emoji,
    };
    setItemsList([newItem]);
    setCurrentIndex(0);
    setIsPickerOpen(false);
  };

  // Select a specific number to trace from picker
  const handleSelectNumberToTrace = (numItem: LessonItem) => {
    playClickSound();
    setItemsList([numItem]);
    setCurrentIndex(0);
    setIsPickerOpen(false);
  };

  return (
    <div className="max-w-xl mx-auto w-full p-4 flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-3">
        <button
          onClick={() => {
            playClickSound();
            onBack();
          }}
          className="p-2.5 rounded-2xl bg-white shadow-sm hover:bg-slate-50 text-slate-700 font-bold flex items-center gap-1.5 text-xs border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'vi' ? 'Quay lại' : 'Back'}</span>
        </button>

        {/* Quick Open Picker Button */}
        <button
          onClick={() => {
            playClickSound();
            setIsPickerOpen(true);
          }}
          className="py-1.5 px-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-black border border-amber-300 flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{language === 'vi' ? 'Chọn Chữ / Số Để Vẽ' : 'Pick Letter/Number'}</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-2xl bg-amber-100 text-amber-800 text-xs font-black border border-amber-200">
            ✍️ {currentIndex + 1} / {itemsList.length}
          </div>
          <div className="px-3 py-1.5 rounded-2xl bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-200">
            ⭐ +{lesson.rewardStars || 4}
          </div>
        </div>
      </div>

      {/* Guide Banner */}
      <div className="w-full bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-3xl">{currentItem.emojiOrImage}</span>
          <div>
            <h4 className="font-black text-slate-800 text-sm">
              {language === 'vi'
                ? `Tô nét chữ & số: ${currentItem.display}`
                : `Trace: ${currentItem.display}`}
            </h4>
            <p className="text-xs text-slate-500">
              {language === 'vi' ? currentItem.subTextVi : currentItem.subTextEn}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const isNum = !isNaN(Number(currentItem.display));
            if (isNum) {
              speakNumber(currentItem.display, voiceDialect);
            } else {
              speakLetter(currentItem.display, 'phonics', true, voiceDialect);
            }
          }}
          className="p-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors"
          title="Nghe phát âm chuẩn"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Drawing Canvas */}
      <div className="relative w-full max-w-[460px] aspect-[460/360] bg-white rounded-3xl border-4 border-amber-300 shadow-xl overflow-hidden touch-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
          className="w-full h-full cursor-crosshair"
        />

        {/* Clear / Eraser Button on canvas */}
        <button
          onClick={handleClear}
          className="absolute bottom-3 right-3 p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1 shadow-md border border-slate-200"
          title="Xóa làm lại"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{language === 'vi' ? 'Tô lại' : 'Clear'}</span>
        </button>
      </div>

      {/* Palette Tools */}
      <div className="w-full flex items-center justify-between gap-3 mt-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        {/* Color buttons */}
        <div className="flex items-center gap-2">
          {BRUSH_COLORS.map((c) => (
            <button
              key={c.color}
              onClick={() => {
                playClickSound();
                setSelectedColor(c.color);
              }}
              style={{ backgroundColor: c.color }}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-transform ${
                selectedColor === c.color ? 'scale-125 ring-4 ring-amber-300 shadow-md' : 'hover:scale-110'
              }`}
            />
          ))}
        </div>

        {/* Brush sizes */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {[12, 18, 26].map((size) => (
            <button
              key={size}
              onClick={() => {
                playClickSound();
                setBrushSize(size);
              }}
              className={`p-1.5 rounded-lg text-xs font-black transition-all ${
                brushSize === size ? 'bg-white shadow text-slate-900' : 'text-slate-500'
              }`}
            >
              <div
                className="bg-slate-800 rounded-full mx-auto"
                style={{ width: `${size / 2}px`, height: `${size / 2}px` }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Finish / Next Button */}
      <div className="w-full mt-4">
        <button
          onClick={handleNextItem}
          className="w-full py-3.5 px-6 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-900 shadow-lg shadow-amber-300/40 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Check className="w-5 h-5 stroke-[3]" />
          <span>
            {currentIndex < itemsList.length - 1
              ? language === 'vi' ? 'Tiếp Tục Chữ Kế Tiếp' : 'Next Item'
              : language === 'vi' ? 'Hoàn Thành Nét Vẽ! 🌟' : 'Finish Tracing! 🌟'}
          </span>
        </button>
      </div>

      {/* Modal / Drawer to pick ANY letter from 36-alphabet or ANY number */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 shadow-2xl border-4 border-amber-300 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✍️</span>
                <div>
                  <h3 className="font-black text-base text-slate-800">
                    {language === 'vi' ? 'Chọn Chữ Cái Hoặc Số Để Tô' : 'Pick Letter or Number to Trace'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Đầy đủ 36+ chữ cái tiếng Việt và số đếm từ 0 đến 100
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPickerOpen(false)}
                className="p-2 rounded-2xl hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab switch: Chữ Cái vs Số Đếm */}
            <div className="flex gap-2 py-3 border-b border-slate-100">
              <button
                onClick={() => {
                  playClickSound();
                  setPickerTab('letters');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  pickerTab === 'letters'
                    ? 'bg-amber-400 text-slate-900 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>🅰️</span>
                <span>Bảng 36+ Chữ Cái (A-Y & Ghép)</span>
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  setPickerTab('numbers');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  pickerTab === 'numbers'
                    ? 'bg-amber-400 text-slate-900 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>🔢</span>
                <span>Số Đếm (0 - 100)</span>
              </button>
            </div>

            {/* Grid of items */}
            <div className="flex-1 overflow-y-auto py-3">
              {pickerTab === 'letters' ? (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {VIETNAMESE_ALPHABET.map((alpha) => (
                    <button
                      key={alpha.id}
                      onClick={() => handleSelectLetterToTrace(alpha)}
                      className="p-2.5 rounded-2xl border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-center transition-all group flex flex-col items-center justify-center"
                    >
                      <span className="text-xl sm:text-2xl font-black text-slate-800 group-hover:scale-110 transition-transform">
                        {alpha.letter}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 truncate w-full mt-0.5">
                        {alpha.phonicsSoundVi}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {TRACE_NUMBERS.map((numItem) => (
                    <button
                      key={numItem.id}
                      onClick={() => handleSelectNumberToTrace(numItem)}
                      className="p-3 rounded-2xl border-2 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 text-center transition-all group flex flex-col items-center justify-center"
                    >
                      <span className="text-xl sm:text-2xl font-black text-slate-800 group-hover:scale-110 transition-transform">
                        {numItem.display}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 truncate w-full mt-0.5">
                        {numItem.subTextVi}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
