import React, { useState, useEffect, useRef } from 'react';
import { Lesson, LessonItem } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Star,
  Award,
  Heart,
  HelpCircle,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import {
  speakText,
  playClickSound,
  playSuccessSound,
  playStarSound,
  playPopSound,
} from '../../utils/audio';
import {
  evaluateSouthernPronunciation,
  SOUTHERN_PRONUNCIATION_TIPS,
} from '../../utils/speechEvaluation';

interface Props {
  lesson: Lesson;
  onFinish: (stars: number) => void;
  onBack: () => void;
}

export const SpeakAndPronounceGame: React.FC<Props> = ({ lesson, onFinish, onBack }) => {
  const { language, profile, voiceDialect } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [evaluation, setEvaluation] = useState<{
    score: number;
    matchedWord: boolean;
    southernBonus: boolean;
    feedbackVi: string;
    feedbackEn: string;
  } | null>(null);
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [totalStarsEarned, setTotalStarsEarned] = useState(0);
  const [speechApiSupported, setSpeechApiSupported] = useState(true);
  const [showTip, setShowTip] = useState(false);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const currentItem: LessonItem = lesson.items[currentIndex] || lesson.items[0];

  // Target word to practice
  const targetWord = currentItem.subTextVi || currentItem.display;

  // Find relevant southern pronunciation tip
  const firstLetterKey = currentItem.display.toLowerCase().slice(0, 2);
  const singleLetterKey = currentItem.display.toLowerCase().slice(0, 1);
  const currentTip =
    SOUTHERN_PRONUNCIATION_TIPS[firstLetterKey] ||
    SOUTHERN_PRONUNCIATION_TIPS[singleLetterKey] ||
    null;

  // Initialize Web Speech API SpeechRecognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechApiSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'vi-VN'; // Vietnamese Speech Recognition

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          final += item[0].transcript;
        } else {
          interim += item[0].transcript;
        }
      }

      if (interim) {
        setInterimTranscript(interim);
      }

      if (final) {
        setTranscript(final);
        setInterimTranscript('');
        handleProcessSpeechResult(final);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition status:', event.error);
      if (event.error === 'not-allowed') {
        alert(
          language === 'vi'
            ? 'Bé hoặc phụ huynh vui lòng cho phép truy cập Micro để luyện phát âm nha!'
            : 'Please allow microphone access to practice speaking!'
        );
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
      stopAudioVisualizer();
    };
  }, []);

  // Play teacher voice when item changes
  useEffect(() => {
    setEvaluation(null);
    setTranscript('');
    setInterimTranscript('');
    setIsSuccessModal(false);

    // Auto teacher prompt
    const timer = setTimeout(() => {
      playTeacherAudio();
    }, 400);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  const playTeacherAudio = () => {
    playClickSound();
    const promptText =
      language === 'vi'
        ? `Bé đọc to rõ theo cô nhé: ${targetWord}. ${currentItem.audioTextVi || ''}`
        : `Repeat after teacher: ${targetWord}`;
    speakText(promptText, 'vi', 0.88, 'northern');
  };

  const startAudioVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setVolumeLevel(Math.min(100, Math.round((avg / 128) * 100)));
        animFrameRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (err) {
      console.warn('Microphone stream error:', err);
    }
  };

  const stopAudioVisualizer = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setVolumeLevel(0);
  };

  const toggleListening = async () => {
    playClickSound();

    if (isListening) {
      // Stop
      try {
        recognitionRef.current?.stop();
      } catch (_) {}
      setIsListening(false);
      stopAudioVisualizer();
    } else {
      // Start
      setTranscript('');
      setInterimTranscript('');
      setEvaluation(null);

      try {
        await startAudioVisualizer();
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Recognition start error:', err);
        // If already started or browser glitch
        try {
          recognitionRef.current?.stop();
          setTimeout(() => {
            recognitionRef.current?.start();
            setIsListening(true);
          }, 200);
        } catch (_) {}
      }
    }
  };

  const handleProcessSpeechResult = (spokenText: string) => {
    const result = evaluateSouthernPronunciation(spokenText, targetWord, currentItem.display);
    setEvaluation(result);

    if (result.matchedWord) {
      playSuccessSound();
      playStarSound();
      setIsSuccessModal(true);
      if (!completedItems.includes(currentItem.id)) {
        setCompletedItems((prev) => [...prev, currentItem.id]);
        setTotalStarsEarned((prev) => prev + (result.score >= 90 ? 3 : 2));
      }

      // Cheer in standard Northern pedagogical dialect
      setTimeout(() => {
        speakText(
          result.feedbackVi || `Bé ${profile.nickname || profile.name} giỏi quá! Phát âm rất chuẩn rồi nhé!`,
          'vi',
          0.95,
          'northern'
        );
      }, 300);
    } else {
      playPopSound();
      // Supportive encouragement
      setTimeout(() => {
        speakText(result.feedbackVi || 'Chưa chính xác rồi, bé cùng nghe lại và đọc to theo cô giáo nhé!', 'vi', 0.9, 'northern');
      }, 300);
    }
  };

  // Manual simulation for devices without mic permission or tests
  const handleSimulatePronounce = (simulatedWord: string) => {
    playClickSound();
    setTranscript(simulatedWord);
    handleProcessSpeechResult(simulatedWord);
  };

  const handleNext = () => {
    playClickSound();
    if (currentIndex < lesson.items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Finish lesson
      const earned = Math.max(3, totalStarsEarned || lesson.rewardStars);
      onFinish(earned);
    }
  };

  const handlePrev = () => {
    playClickSound();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 flex flex-col min-h-[calc(100vh-5rem)]">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <button
          onClick={() => {
            playClickSound();
            onBack();
          }}
          className="p-2 sm:px-4 sm:py-2 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">
            {language === 'vi' ? 'Quay lại' : 'Back'}
          </span>
        </button>

        {/* Progress pills */}
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full border border-amber-200 shadow-sm">
          <span className="text-xs font-black text-amber-950 uppercase">
            🎙️ {language === 'vi' ? 'Luyện Nói Chuẩn Giọng Nam' : 'Speak & Pronounce'}
          </span>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
            {currentIndex + 1} / {lesson.items.length}
          </span>
        </div>

        {/* Star count */}
        <div className="flex items-center gap-1.5 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-full text-amber-900 font-black text-xs sm:text-sm shadow-sm">
          <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
          <span>+{totalStarsEarned} ⭐</span>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-3xl border-3 border-amber-300 shadow-xl p-5 sm:p-8 flex-1 flex flex-col items-center justify-between relative overflow-hidden">
        {/* Soft decorative background accents */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-100 rounded-full blur-2xl pointer-events-none -z-0" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-100 rounded-full blur-2xl pointer-events-none -z-0" />

        {/* Target display presentation */}
        <div className="text-center z-10 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs mb-3 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>
              {language === 'vi'
                ? 'Bé quan sát hình và nghe cô phát âm nha'
                : 'Look at the picture and listen'}
            </span>
          </div>

          {/* Picture and Letter */}
          <div className="flex items-center justify-center gap-6 my-2">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border-3 border-amber-200 shadow-md flex items-center justify-center text-6xl sm:text-7xl hover:scale-105 transition-transform">
              {currentItem.emojiOrImage}
            </div>

            <div className="text-left">
              <span className="text-5xl sm:text-7xl font-black text-rose-600 block leading-tight drop-shadow-sm">
                {currentItem.display}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                {targetWord}
              </h2>
              <span className="text-xs sm:text-sm text-slate-500 font-semibold block">
                {currentItem.subTextEn}
              </span>
            </div>
          </div>

          {/* Teacher Voice & Standard Tip Buttons */}
          <div className="flex items-center justify-center gap-2.5 mt-3">
            <button
              onClick={playTeacherAudio}
              className="px-4 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-rose-500/20 active:scale-95 transition-transform"
            >
              <Volume2 className="w-4 h-4 animate-bounce" />
              <span>{language === 'vi' ? 'Nghe Cô Phát Âm Mẫu 🔊' : 'Listen Teacher 🔊'}</span>
            </button>

            <button
              onClick={() => setShowTip(!showTip)}
              className="px-3 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{language === 'vi' ? 'Mẹo Phát Âm Chuẩn 💡' : 'Pronunciation Tip'}</span>
            </button>
          </div>

          {/* Expanded standard accent guide tip */}
          {showTip && (
            <div className="mt-3 p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl max-w-lg mx-auto text-left text-xs shadow-sm">
              <div className="font-black text-amber-900 flex items-center gap-1.5 mb-1">
                <span>🌸 Phát âm chuẩn tiếng Việt:</span>
                <span className="text-rose-600 font-bold">Tròn vành rõ chữ, thanh âm chuẩn xác</span>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                Bé hãy mở rộng miệng, phát âm to, rõ ràng và chậm rãi từng âm tiết theo cô giáo nhé!
              </p>
            </div>
          )}
        </div>

        {/* Real-time speech input & wave visualizer */}
        <div className="w-full max-w-md my-4 flex flex-col items-center z-10">
          {/* Animated voice wave visualizer */}
          <div className="h-16 flex items-center justify-center gap-1.5 w-full mb-3">
            {[40, 70, 100, 85, 60, 95, 50, 80, 45].map((h, i) => {
              const currentH = isListening
                ? Math.max(12, (h * volumeLevel) / 100)
                : 10;
              return (
                <div
                  key={i}
                  style={{ height: `${currentH}px` }}
                  className={`w-2.5 rounded-full transition-all duration-75 ${
                    isListening
                      ? 'bg-gradient-to-t from-rose-500 via-amber-400 to-emerald-400 shadow-sm'
                      : 'bg-slate-200'
                  }`}
                />
              );
            })}
          </div>

          {/* Big Mic Button */}
          <button
            onClick={toggleListening}
            className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center gap-1 text-white shadow-2xl transition-all transform active:scale-90 ${
              isListening
                ? 'bg-gradient-to-tr from-rose-600 to-red-500 ring-8 ring-rose-200 animate-pulse'
                : 'bg-gradient-to-tr from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 ring-8 ring-emerald-100 hover:scale-105'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-8 h-8 sm:w-10 sm:h-10" />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  {language === 'vi' ? 'Đang Nghe...' : 'Listening...'}
                </span>
              </>
            ) : (
              <>
                <Mic className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  {language === 'vi' ? 'Bấm & Nói' : 'Tap & Speak'}
                </span>
              </>
            )}
          </button>

          {/* Speech transcription feedback */}
          <div className="mt-4 min-h-[50px] w-full text-center">
            {isListening && !transcript && !interimTranscript && (
              <span className="text-xs font-bold text-emerald-600 animate-pulse">
                🎙️ {language === 'vi' ? 'Bé hãy nói vào Micro nha...' : 'Speak into the mic...'}
              </span>
            )}

            {(transcript || interimTranscript) && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 inline-block max-w-full">
                <span className="text-xs text-slate-400 block font-semibold mb-0.5">
                  {language === 'vi' ? 'Giọng bé đọc được:' : 'Child spoken:'}
                </span>
                <span className="text-base sm:text-lg font-black text-slate-800">
                  "{transcript || interimTranscript}"
                </span>
              </div>
            )}
          </div>

          {/* Real-time score & feedback panel */}
          {evaluation && (
            <div
              className={`w-full mt-3 p-4 rounded-2xl border-2 transition-all text-center animate-in fade-in zoom-in-95 ${
                evaluation.matchedWord
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-md'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                {evaluation.matchedWord ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Flame className="w-5 h-5 text-amber-600" />
                )}
                <span className="text-sm font-black">
                  {language === 'vi' ? 'Độ Chuẩn Xác:' : 'Accuracy:'}{' '}
                  <span
                    className={
                      evaluation.score >= 80 ? 'text-emerald-600' : 'text-amber-700'
                    }
                  >
                    {evaluation.score}%
                  </span>
                </span>
                {evaluation.southernBonus && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black border border-rose-200">
                    🌸 Chuẩn Giọng Bộ GD&ĐT
                  </span>
                )}
              </div>
              <p className="text-xs font-bold leading-relaxed">
                {evaluation.feedbackVi}
              </p>
            </div>
          )}

          {/* Quick test buttons for simulator or test without mic */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 pt-2 border-t border-slate-100 w-full">
            <span className="text-[11px] font-bold text-slate-400">
              {language === 'vi' ? 'Hoặc thử nhanh:' : 'Quick test:'}
            </span>
            <button
              onClick={() => handleSimulatePronounce(targetWord)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              "{targetWord}" (Chuẩn)
            </button>
            {currentItem.display !== targetWord && (
              <button
                onClick={() => handleSimulatePronounce(currentItem.display)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                "{currentItem.display}"
              </button>
            )}
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between w-full pt-3 border-t border-slate-100 z-10">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              currentIndex === 0
                ? 'opacity-30 cursor-not-allowed text-slate-400'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'vi' ? 'Từ Trước' : 'Previous'}</span>
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 flex items-center gap-2 active:scale-95 transition-transform"
          >
            <span>
              {currentIndex === lesson.items.length - 1
                ? language === 'vi'
                  ? 'Hoàn Thành Bài Học 🌟'
                  : 'Complete Lesson 🌟'
                : language === 'vi'
                ? 'Từ Kế Tiếp 🚀'
                : 'Next Word 🚀'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
