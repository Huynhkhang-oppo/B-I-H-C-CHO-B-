import React, { useState } from 'react';
import { VIETNAMESE_ALPHABET, ENGLISH_ALPHABET, AlphabetLetter, EnglishLetter } from '../data/alphabetData';
import { VOCABULARY_200_ITEMS, VOCABULARY_CATEGORIES, VocabularyItem } from '../data/vocabulary200Data';
import { useApp } from '../context/AppContext';
import { X, Volume2, Search, BookOpen, Pencil, Sparkles, Layers, Globe } from 'lucide-react';
import { playClickSound, speakLetter, speakText, speakSpellingSlow } from '../utils/audio';
import { Lesson } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onStartTracingLetter?: (letter: AlphabetLetter) => void;
}

export const AlphabetExplorerModal: React.FC<Props> = ({ isOpen, onClose, onStartTracingLetter }) => {
  const { language, startLesson, voiceDialect, parentSettings } = useApp();
  const [mainTab, setMainTab] = useState<'vietnamese' | 'english' | 'vocab200'>('vietnamese');

  // Vietnamese Tab states
  const [viFilter, setViFilter] = useState<'all' | 'single29' | 'ext4' | 'compound' | 'vowels' | 'consonants'>('all');
  const [pronounceMode, setPronounceMode] = useState<'phonics' | 'name'>('phonics');
  const [viSearch, setViSearch] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<AlphabetLetter | null>(VIETNAMESE_ALPHABET[0]);

  // English Tab states
  const [enSearch, setEnSearch] = useState('');

  // Vocab 200 Tab states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [vocabSearch, setVocabSearch] = useState('');

  if (!isOpen) return null;

  const EXT_LETTERS = ['F', 'J', 'W', 'Z'];

  // Filter Vietnamese Letters
  const filteredViLetters = VIETNAMESE_ALPHABET.filter((item) => {
    if (viSearch.trim()) {
      const q = viSearch.toLowerCase();
      const matchLetter = item.letter.toLowerCase().includes(q);
      const matchWord = item.exampleWordVi.toLowerCase().includes(q);
      const matchSound = item.phonicsSoundVi.toLowerCase().includes(q);
      if (!matchLetter && !matchWord && !matchSound) return false;
    }
    if (viFilter === 'single29') return !item.isCompound && !EXT_LETTERS.includes(item.letter);
    if (viFilter === 'ext4') return EXT_LETTERS.includes(item.letter);
    if (viFilter === 'compound') return item.isCompound;
    if (viFilter === 'vowels') return item.isVowel;
    if (viFilter === 'consonants') return !item.isVowel;
    return true;
  });

  // Filter English Letters
  const filteredEnLetters = ENGLISH_ALPHABET.filter((item) => {
    if (enSearch.trim()) {
      const q = enSearch.toLowerCase();
      return (
        item.letter.toLowerCase().includes(q) ||
        item.wordEn.toLowerCase().includes(q) ||
        item.wordVi.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filter Vocabulary 200 Items
  const filteredVocab = VOCABULARY_200_ITEMS.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (vocabSearch.trim()) {
      const q = vocabSearch.toLowerCase();
      return item.wordVi.toLowerCase().includes(q) || item.wordEn.toLowerCase().includes(q);
    }
    return true;
  });

  const handlePlayViLetter = (item: AlphabetLetter) => {
    playClickSound();
    setSelectedLetter(item);
    if (pronounceMode === 'phonics') {
      speakLetter(item.letter, 'phonics', false, voiceDialect);
    } else {
      speakLetter(item.letter, 'name', false, voiceDialect);
    }
  };

  const handlePlayEnLetter = (item: EnglishLetter) => {
    playClickSound();
    speakText(`${item.letter}. ${item.wordEn}`, 'en', parentSettings.speechRate || 0.88);
  };

  const handlePlayVocab = (item: VocabularyItem, lang: 'vi' | 'en' = 'vi') => {
    playClickSound();
    if (lang === 'vi') {
      speakText(item.wordVi, 'vi', parentSettings.speechRate || 0.88, voiceDialect);
    } else {
      speakText(item.wordEn, 'en', parentSettings.speechRate || 0.88);
    }
  };

  const handleLaunchTrace = (item: AlphabetLetter) => {
    playClickSound();
    onClose();
    if (onStartTracingLetter) {
      onStartTracingLetter(item);
      return;
    }
    const dynamicLesson: Lesson = {
      id: `trace-dynamic-${item.id}`,
      subjectId: 'vietnamese',
      ageGroup: '3-4',
      titleVi: `Tập tô chữ cái ${item.letter}`,
      titleEn: `Trace letter ${item.letter}`,
      subtitleVi: `Tô chữ ${item.letter} - ${item.exampleWordVi}`,
      subtitleEn: `Trace ${item.letter} with glitter brushes`,
      difficulty: 'medium',
      gameType: 'tracing',
      starsRequired: 0,
      rewardStars: 4,
      icon: '✍️',
      accentColor: 'from-fuchsia-400 to-pink-500',
      items: [
        {
          id: `trace-${item.id}`,
          display: item.letter,
          subTextVi: item.exampleWordVi,
          subTextEn: item.exampleWordEn,
          audioTextVi: `Bé cùng tô chữ ${item.phonicsSoundVi} thật đẹp nghen!`,
          audioTextEn: `Trace letter ${item.letter}!`,
          emojiOrImage: item.emoji,
        },
      ],
    };
    startLesson(dynamicLesson);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border-4 border-amber-300 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center text-2xl shadow-md shrink-0">
              🅰️
            </div>
            <div>
              <h3 className="font-black text-lg sm:text-xl text-slate-800 flex items-center gap-2 flex-wrap">
                <span>Bảng Chữ Cái & 200 Từ Vựng Cơ Bản</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                  {voiceDialect === 'southern' ? '🌴 Miền Nam' : '🌸 Miền Bắc'}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Tra cứu phát âm chữ cái Tiếng Việt, Tiếng Anh & 200 Từ Vựng Cơ Bản song ngữ cho bé
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-2 rounded-2xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Top Main Tabs */}
        <div className="flex gap-2 my-3 shrink-0">
          <button
            onClick={() => {
              playClickSound();
              setMainTab('vietnamese');
            }}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
              mainTab === 'vietnamese'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <span>🇻🇳 Chữ Cái Tiếng Việt</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-bold">29+11 Chữ</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setMainTab('english');
            }}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
              mainTab === 'english'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            <span>🇬🇧 English Alphabet</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-bold">26 Letters</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setMainTab('vocab200');
            }}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
              mainTab === 'vocab200'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <span>📚 200 Từ Vựng Cơ Bản</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-bold">10 Chủ Đề</span>
          </button>
        </div>

        {/* TAB 1: VIETNAMESE ALPHABET */}
        {mainTab === 'vietnamese' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Controls */}
            <div className="py-2 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 shrink-0">
              {/* Pronunciation mode */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
                <button
                  onClick={() => {
                    playClickSound();
                    setPronounceMode('phonics');
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                    pronounceMode === 'phonics' ? 'bg-amber-400 text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5 inline mr-1" />
                  Theo Âm (Bờ, Cờ, Dờ) ⭐
                </button>
                <button
                  onClick={() => {
                    playClickSound();
                    setPronounceMode('name');
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                    pronounceMode === 'name' ? 'bg-amber-400 text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Tên Chữ (A, Bê, Xê)
                </button>
              </div>

              {/* Search */}
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={viSearch}
                  onChange={(e) => setViSearch(e.target.value)}
                  placeholder="Tìm chữ hoặc từ..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Filter buttons */}
            <div className="py-2 flex flex-wrap items-center gap-1.5 shrink-0 overflow-x-auto">
              {[
                { id: 'all', label: `Tất Cả (${VIETNAMESE_ALPHABET.length})` },
                { id: 'single29', label: '29 Chữ Đơn (A - Y)' },
                { id: 'ext4', label: '4 Chữ Mở Rộng (F, J, W, Z)' },
                { id: 'compound', label: '11 Chữ Ghép (CH, NH...)' },
                { id: 'vowels', label: 'Nguyên Âm (12)' },
                { id: 'consonants', label: 'Phụ Âm' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    playClickSound();
                    setViFilter(cat.id as any);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all ${
                    viFilter === cat.id
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-amber-50 text-amber-900 border border-amber-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Phonetic Tip Banner */}
            <div className="my-1.5 px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-base">💡</span>
                <span>
                  <strong>Quy tắc âm chữ Q:</strong> Đọc theo âm (Bờ, Cờ, Dờ...) là <strong>"Quờ"</strong>. Đọc theo tên chữ (A, Bê, Xê...) là <strong>"Quy"</strong>.
                </span>
              </div>
              <button
                onClick={() => {
                  playClickSound();
                  speakLetter('Q', pronounceMode, false, voiceDialect);
                }}
                className="px-2 py-0.5 rounded-lg bg-amber-200 hover:bg-amber-300 font-black text-[11px] text-amber-950 shrink-0"
              >
                🔊 Nghe chữ Q ({pronounceMode === 'phonics' ? 'Âm Quờ' : 'Tên Quy'})
              </button>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto pr-1 py-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
              {filteredViLetters.map((item) => (
                <div
                  key={item.id}
                  className="relative rounded-2xl p-3 border-2 border-slate-200 hover:border-amber-300 bg-white hover:bg-amber-50/30 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                        item.isCompound
                          ? 'bg-purple-100 text-purple-800'
                          : item.isVowel
                          ? 'bg-pink-100 text-pink-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {item.isCompound ? 'Chữ Ghép' : item.isVowel ? 'Nguyên Âm' : 'Phụ Âm'}
                    </span>
                    <span className="text-xl">{item.emoji}</span>
                  </div>

                  <button onClick={() => handlePlayViLetter(item)} className="text-center py-1">
                    <div className="text-4xl font-black text-slate-800 tracking-tight font-sans">
                      {item.letter}
                    </div>
                    <div className="mt-1 text-xs font-black text-amber-700 bg-amber-100/80 inline-block px-2 py-0.5 rounded-lg">
                      {pronounceMode === 'phonics' ? `Âm: "${item.phonicsSoundVi}"` : item.letterNameVi}
                    </div>
                  </button>

                  <div className="text-center mt-1 border-t border-slate-100 pt-1">
                    <p className="text-xs font-bold text-slate-700 truncate">{item.exampleWordVi}</p>
                  </div>

                  <div className="flex items-center gap-1.5 mt-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => handlePlayViLetter(item)}
                      className="flex-1 py-1 px-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px] flex items-center justify-center gap-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Nghe</span>
                    </button>
                    <button
                      onClick={() => handleLaunchTrace(item)}
                      className="flex-1 py-1 px-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-bold text-[11px] flex items-center justify-center gap-1"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Tô</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ENGLISH ALPHABET */}
        {mainTab === 'english' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Search */}
            <div className="py-2 flex items-center justify-between gap-2 border-b border-slate-100 shrink-0">
              <span className="text-xs font-black text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
                🇬🇧 Standard American Phonics & Vocabulary
              </span>
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={enSearch}
                  onChange={(e) => setEnSearch(e.target.value)}
                  placeholder="Search letter or English word..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-blue-400"
                />
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto pr-1 py-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
              {filteredEnLetters.map((item) => (
                <div
                  key={item.id}
                  className="relative rounded-2xl p-3 border-2 border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50/30 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800">
                      English
                    </span>
                    <span className="text-xl">{item.emoji}</span>
                  </div>

                  <button onClick={() => handlePlayEnLetter(item)} className="text-center py-1">
                    <div className="text-4xl font-black text-blue-900 tracking-tight font-sans">
                      {item.letter}
                    </div>
                    <div className="mt-1 text-[11px] font-bold text-slate-500">
                      {item.phonicsEn}
                    </div>
                  </button>

                  <div className="text-center mt-1 border-t border-slate-100 pt-1">
                    <p className="text-xs font-black text-blue-700 truncate">{item.wordEn}</p>
                    <p className="text-[11px] font-bold text-slate-500 truncate">{item.wordVi}</p>
                  </div>

                  <button
                    onClick={() => handlePlayEnLetter(item)}
                    className="mt-2 w-full py-1.5 px-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen English</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: 200 VOCABULARY */}
        {mainTab === 'vocab200' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Search & Category Filter */}
            <div className="py-2 space-y-2 border-b border-slate-100 shrink-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  📚 200 Từ Vựng Song Ngữ Chuẩn Mầm Nhỏ
                </span>
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={vocabSearch}
                    onChange={(e) => setVocabSearch(e.target.value)}
                    placeholder="Tìm từ tiếng Việt hoặc Anh..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <button
                  onClick={() => {
                    playClickSound();
                    setSelectedCategory('all');
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  }`}
                >
                  Tất Cả (200)
                </button>
                {VOCABULARY_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      playClickSound();
                      setSelectedCategory(cat.id);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    }`}
                  >
                    {cat.nameVi}
                  </button>
                ))}
              </div>
            </div>

            {/* Vocab Grid */}
            <div className="flex-1 overflow-y-auto pr-1 py-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
              {filteredVocab.map((item) => (
                <div
                  key={item.id}
                  className="relative rounded-2xl p-3 border-2 border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/30 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-slate-400">{item.categoryVi}</span>
                    <span className="text-2xl">{item.emoji}</span>
                  </div>

                  <div className="text-center py-1">
                    <p className="text-sm font-black text-slate-800">{item.wordVi}</p>
                    <p className="text-xs font-extrabold text-emerald-700">{item.wordEn}</p>
                  </div>

                  <div className="flex items-center gap-1 mt-2 pt-1.5 border-t border-slate-100 flex-wrap">
                    <button
                      onClick={() => handlePlayVocab(item, 'vi')}
                      className="flex-1 py-1 px-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[10px] flex items-center justify-center gap-0.5"
                      title="Nghe Đọc Tiếng Việt"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Việt</span>
                    </button>

                    <button
                      onClick={() => {
                        playClickSound();
                        speakSpellingSlow(item.wordVi, undefined, voiceDialect);
                      }}
                      className="flex-1 py-1 px-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] flex items-center justify-center gap-0.5 shadow-xs"
                      title="Nghe Đánh Vần Chậm Từ Từ"
                    >
                      <span>🗣️ Đánh Vần</span>
                    </button>

                    <button
                      onClick={() => handlePlayVocab(item, 'en')}
                      className="flex-1 py-1 px-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold text-[10px] flex items-center justify-center gap-0.5"
                      title="Listen English"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Anh</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
