/**
 * Web Audio Synthesizer & Speech Synthesis Utility
 * Enhanced for Southern Vietnamese Dialect (Giọng Miền Nam thân thương)
 * Features Cheerful Celebration Voice System for milestones & lesson completion.
 */

let audioCtx: AudioContext | null = null;
let currentPlayingAudio: HTMLAudioElement | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Gentle Click Sound
export function playClickSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    console.debug(e);
  }
}

// Pop sound for bubbles
export function playPopSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    console.debug(e);
  }
}

// Star collect chime
export function playStarSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.25);
    });
  } catch (e) {
    console.debug(e);
  }
}

// Correct Answer / Triumph
export function playSuccessSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0.25, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.35);
    });
  } catch (e) {
    console.debug(e);
  }
}

// Grand Fanfare / Lesson Completed
export function playFanfareSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const chords = [
      { t: 0, f: 523.25 },
      { t: 0.12, f: 659.25 },
      { t: 0.24, f: 783.99 },
      { t: 0.36, f: 1046.5 },
      { t: 0.55, f: 1046.5, dur: 0.6 },
    ];

    chords.forEach(({ t, f, dur }) => {
      const duration = dur || 0.22;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + t);

      gain.gain.setValueAtTime(0.28, now + t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + t);
      osc.stop(now + t + duration);
    });
  } catch (e) {
    console.debug(e);
  }
}

// Convert Northern terms to warm Southern Vietnamese colloquial terms
// Standard Grade 1 Vietnamese Phonics Map (Chuẩn Bộ Giáo Dục & Đào Tạo)
export const VI_GRADE1_PHONICS_MAP: Record<string, string> = {
  'A': 'A',
  'Ă': 'Á',
  'Â': 'Ớ',
  'B': 'Bờ',
  'C': 'Cờ',
  'D': 'Dờ',
  'Đ': 'Đờ',
  'E': 'E',
  'Ê': 'Ê',
  'G': 'Gờ',
  'H': 'Hờ',
  'I': 'I',
  'K': 'Ca',
  'L': 'Lờ',
  'M': 'Mờ',
  'N': 'Nờ',
  'O': 'O',
  'Ô': 'Ô',
  'Ơ': 'Ơ',
  'P': 'Pờ',
  'Q': 'Quờ',
  'R': 'Rờ',
  'S': 'Sờ',
  'T': 'Tờ',
  'U': 'U',
  'Ư': 'Ư',
  'V': 'Vờ',
  'X': 'Xờ',
  'Y': 'I',
  'F': 'Phờ',
  'J': 'Di',
  'W': 'Vờ kép',
  'Z': 'Dét',
  // Compound consonants
  'CH': 'Chờ',
  'GH': 'Gờ',
  'GI': 'Gi',
  'KH': 'Khờ',
  'NH': 'Nhờ',
  'NG': 'Ngờ',
  'NGH': 'Ngờ',
  'PH': 'Phờ',
  'QU': 'Quờ',
  'TH': 'Thờ',
  'TR': 'Trờ',
};

// Standard pedagogical Vietnamese Letter Pronunciation Dictionary (Bộ Giáo Dục Mầm Non)
export const VI_LETTER_PHONICS_MAP: Record<string, { phonics: string; name: string; exampleNorth: string; exampleSouth: string }> = {
  'A': { phonics: 'A', name: 'Chữ A', exampleNorth: 'Quả cam', exampleSouth: 'Trái cam' },
  'Ă': { phonics: 'Á', name: 'Chữ Á', exampleNorth: 'Mặt trăng', exampleSouth: 'Mặt trăng' },
  'Â': { phonics: 'Ớ', name: 'Chữ Ớ', exampleNorth: 'Cái nón', exampleSouth: 'Cái nón lá' },
  'B': { phonics: 'Bờ', name: 'Chữ Bê', exampleNorth: 'Bé ngoan', exampleSouth: 'Bé cưng' },
  'C': { phonics: 'Cờ', name: 'Chữ Xê', exampleNorth: 'Con cá', exampleSouth: 'Con cá vàng' },
  'D': { phonics: 'Dờ', name: 'Chữ Dê', exampleNorth: 'Con dê', exampleSouth: 'Con dê núi' },
  'Đ': { phonics: 'Đờ', name: 'Chữ Đê', exampleNorth: 'Đèn lồng', exampleSouth: 'Đèn lồng' },
  'E': { phonics: 'E', name: 'Chữ E', exampleNorth: 'Em bé', exampleSouth: 'Em bé ngoan' },
  'Ê': { phonics: 'Ê', name: 'Chữ Ê', exampleNorth: 'Quả khế', exampleSouth: 'Trái khế' },
  'G': { phonics: 'Gờ', name: 'Chữ Giê', exampleNorth: 'Con gà', exampleSouth: 'Con gà trống' },
  'H': { phonics: 'Hờ', name: 'Chữ Hát', exampleNorth: 'Bông hoa', exampleSouth: 'Bông hoa' },
  'I': { phonics: 'I', name: 'Chữ I ngắn', exampleNorth: 'Viên bi', exampleSouth: 'Viên bi' },
  'K': { phonics: 'Ca', name: 'Chữ Ca', exampleNorth: 'Cây kẹo', exampleSouth: 'Cây kẹo' },
  'L': { phonics: 'Lờ', name: 'Chữ E-lờ', exampleNorth: 'Quả lê', exampleSouth: 'Trái lê' },
  'M': { phonics: 'Mờ', name: 'Chữ Em-mờ', exampleNorth: 'Con mèo', exampleSouth: 'Con mèo' },
  'N': { phonics: 'Nờ', name: 'Chữ En-nờ', exampleNorth: 'Cây nấm', exampleSouth: 'Cây nấm' },
  'O': { phonics: 'O', name: 'Chữ O', exampleNorth: 'Con ong', exampleSouth: 'Con ong mật' },
  'Ô': { phonics: 'Ô', name: 'Chữ Ô', exampleNorth: 'Cái ô', exampleSouth: 'Cây dù' },
  'Ơ': { phonics: 'Ơ', name: 'Chữ Ơ', exampleNorth: 'Quả ớt', exampleSouth: 'Trái ớt' },
  'P': { phonics: 'Pờ', name: 'Chữ Pê', exampleNorth: 'Đèn pin', exampleSouth: 'Đèn pin' },
  'Q': { phonics: 'Quờ', name: 'Chữ Quy', exampleNorth: 'Cái quạt', exampleSouth: 'Cây quạt' },
  'R': { phonics: 'Rờ', name: 'Chữ E-rờ', exampleNorth: 'Con rùa', exampleSouth: 'Con rùa' },
  'S': { phonics: 'Sờ', name: 'Chữ Ét-xì', exampleNorth: 'Ngôi sao', exampleSouth: 'Ngôi sao' },
  'T': { phonics: 'Tờ', name: 'Chữ Tê', exampleNorth: 'Tàu hỏa', exampleSouth: 'Xe lửa' },
  'U': { phonics: 'U', name: 'Chữ U', exampleNorth: 'Cái mũ', exampleSouth: 'Cái nón' },
  'Ư': { phonics: 'Ư', name: 'Chữ Ư', exampleNorth: 'Con hươu', exampleSouth: 'Con nai' },
  'V': { phonics: 'Vờ', name: 'Chữ Vê', exampleNorth: 'Con vịt', exampleSouth: 'Con vịt' },
  'X': { phonics: 'Xờ', name: 'Chữ Ích-xì', exampleNorth: 'Xe ô tô', exampleSouth: 'Xe hơi' },
  'Y': { phonics: 'I', name: 'Chữ I dài', exampleNorth: 'Cái yếm', exampleSouth: 'Cái yếm' },
  'F': { phonics: 'Phờ', name: 'Chữ Ép-phờ', exampleNorth: 'Cà phê', exampleSouth: 'Ly cà phê' },
  'J': { phonics: 'Di', name: 'Chữ Dây', exampleNorth: 'Quần jeans', exampleSouth: 'Quần jeans' },
  'W': { phonics: 'Vờ kép', name: 'Chữ Vê kép', exampleNorth: 'Trang web', exampleSouth: 'Mạng Wi-Fi' },
  'Z': { phonics: 'Dét', name: 'Chữ Dét', exampleNorth: 'Cái zippo', exampleSouth: 'Ngựa vằn Zebra' },
  // Digraphs & Compound letters
  'CH': { phonics: 'Chờ', name: 'Chữ Chờ', exampleNorth: 'Con chó', exampleSouth: 'Con chó' },
  'GH': { phonics: 'Gờ', name: 'Chữ Gờ kép', exampleNorth: 'Cái ghế', exampleSouth: 'Cái ghế' },
  'GI': { phonics: 'Gi', name: 'Chữ Gi', exampleNorth: 'Cái giỏ', exampleSouth: 'Cái giỏ mây' },
  'KH': { phonics: 'Khờ', name: 'Chữ Khờ', exampleNorth: 'Con khỉ', exampleSouth: 'Con khỉ' },
  'NH': { phonics: 'Nhờ', name: 'Chữ Nhờ', exampleNorth: 'Ngôi nhà', exampleSouth: 'Ngôi nhà' },
  'NG': { phonics: 'Ngờ', name: 'Chữ Ngờ đơn', exampleNorth: 'Con ngựa', exampleSouth: 'Con ngựa' },
  'NGH': { phonics: 'Ngờ', name: 'Chữ Ngờ kép', exampleNorth: 'Con nghé', exampleSouth: 'Con nghé' },
  'PH': { phonics: 'Phờ', name: 'Chữ Phờ', exampleNorth: 'Pháo hoa', exampleSouth: 'Pháo hoa' },
  'QU': { phonics: 'Quờ', name: 'Chữ Quờ', exampleNorth: 'Quả quýt', exampleSouth: 'Trái quýt' },
  'TH': { phonics: 'Thờ', name: 'Chữ Thờ', exampleNorth: 'Con thỏ', exampleSouth: 'Con thỏ' },
  'TR': { phonics: 'Trờ', name: 'Chữ Trờ', exampleNorth: 'Trái cây', exampleSouth: 'Trái cây' },
};

// Natural preschool number pronunciation dictionary
export const VI_NUMBER_WORDS_MAP: Record<number, string> = {
  0: 'Số Không',
  1: 'Số Một',
  2: 'Số Hai',
  3: 'Số Ba',
  4: 'Số Bốn',
  5: 'Số Năm',
  6: 'Số Sáu',
  7: 'Số Bảy',
  8: 'Số Tám',
  9: 'Số Chín',
  10: 'Số Mười',
  11: 'Mười một',
  12: 'Mười hai',
  13: 'Mười ba',
  14: 'Mười bốn',
  15: 'Mười lăm',
  16: 'Mười sáu',
  17: 'Mười bảy',
  18: 'Mười tám',
  19: 'Mười chín',
  20: 'Hai mươi',
  21: 'Hai mươi mốt',
  24: 'Hai mươi tư',
  25: 'Hai mươi lăm',
  30: 'Ba mươi',
  40: 'Bốn mươi',
  50: 'Năm mươi',
  60: 'Sáu mươi',
  70: 'Bảy mươi',
  80: 'Tám mươi',
  90: 'Chín mươi',
  100: 'Một Trăm',
  200: 'Hai Trăm',
  500: 'Năm Trăm',
  1000: 'Một Ngàn',
  10000: 'Mười Ngàn',
  100000: 'Một Trăm Ngàn',
  1000000: 'Một Triệu',
};

// Global active dialect state ('northern' | 'southern') - Default: 'northern'
let activeDialect: 'northern' | 'southern' = 'northern';
try {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('bvk_parent_settings_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.dialect === 'northern' || parsed.dialect === 'southern') {
        activeDialect = parsed.dialect;
      }
    }
  }
} catch {}

export function setAppDialect(dialect: 'northern' | 'southern') {
  activeDialect = dialect || 'northern';
}

export function getAppDialect(): 'northern' | 'southern' {
  return activeDialect || 'northern';
}

/**
 * Safe dialect formatter
 */
export function formatSouthernDialect(text: string): string {
  if (!text) return '';
  return text;
}

// Pre-load voices on startup
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    try {
      window.speechSynthesis.getVoices();
    } catch {}
  };
}

// In-memory cache for audio synthesis
const audioCache = new Map<string, string>();
let activeSpeechToken = 0;

/**
 * Standard Speech Synthesis for Vietnamese (Giọng Bắc chuẩn Bộ GD&ĐT) and English
 * Fully synchronized to prevent duplicate speech or overlapping voices.
 */
export function speakText(
  text: string,
  lang: 'vi' | 'en' = 'vi',
  rate: number = 0.88,
  preferDialect?: 'northern' | 'southern' | boolean
) {
  if (typeof window === 'undefined' || !text) return;

  const currentToken = ++activeSpeechToken;

  // Immediately cancel any currently playing audio and web speech synthesis
  if (currentPlayingAudio) {
    try {
      currentPlayingAudio.pause();
      currentPlayingAudio.currentTime = 0;
    } catch {}
    currentPlayingAudio = null;
  }
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }

  let textToSpeak = text;
  const currentDialect: 'northern' | 'southern' =
    typeof preferDialect === 'string'
      ? preferDialect
      : typeof preferDialect === 'boolean'
      ? (preferDialect ? 'southern' : 'northern')
      : (activeDialect || 'northern');

  // Grade 1 Phonics check: If text is a single letter (e.g. 'B', 'C')
  if (lang === 'vi') {
    const trimmed = text.trim().toUpperCase();
    if (VI_GRADE1_PHONICS_MAP[trimmed]) {
      // Speak exact Grade 1 spelling phonics sound!
      textToSpeak = VI_GRADE1_PHONICS_MAP[trimmed];
    } else {
      // Check if it's a single integer number
      const parsedNum = parseInt(trimmed, 10);
      if (!isNaN(parsedNum) && trimmed === String(parsedNum) && VI_NUMBER_WORDS_MAP[parsedNum]) {
        textToSpeak = VI_NUMBER_WORDS_MAP[parsedNum];
      }
    }
  }

  // Try Online Native Vietnamese TTS for authentic pronunciation
  const cacheKey = `${currentDialect}:${lang}:${textToSpeak}`;
  if (audioCache.has(cacheKey)) {
    const audioUrl = audioCache.get(cacheKey)!;
    playAudioUrl(audioUrl).catch(() => {
      if (currentToken === activeSpeechToken) {
        speakViaWebSpeech(textToSpeak, lang, rate, currentDialect);
      }
    });
    return;
  }

  // Fetch authentic speech from backend (Vietnamese & English)
  if (typeof fetch !== 'undefined') {
    fetch('/api/tts/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: textToSpeak, dialect: currentDialect, lang }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('TTS server response not ok');
        return res.json();
      })
      .then((data) => {
        // If a new speak request was made while fetching, discard this response to avoid duplicate speech
        if (currentToken !== activeSpeechToken) return;

        if (data.audioBase64) {
          const mimeType = data.format || 'audio/mp3';
          const audioUrl = `data:${mimeType};base64,${data.audioBase64}`;
          audioCache.set(cacheKey, audioUrl);
          playAudioUrl(audioUrl).catch(() => {
            if (currentToken === activeSpeechToken) {
              speakViaWebSpeech(textToSpeak, lang, rate, currentDialect);
            }
          });
        } else {
          speakViaWebSpeech(textToSpeak, lang, rate, currentDialect);
        }
      })
      .catch(() => {
        if (currentToken === activeSpeechToken) {
          speakViaWebSpeech(textToSpeak, lang, rate, currentDialect);
        }
      });
    return;
  }

  speakViaWebSpeech(textToSpeak, lang, rate, currentDialect);
}

/**
 * Play audio from URL or Base64 data with Web Audio API fallback for autoplay unlocking
 */
async function playAudioUrl(url: string): Promise<void> {
  if (currentPlayingAudio) {
    try {
      currentPlayingAudio.pause();
      currentPlayingAudio.currentTime = 0;
    } catch {}
  }

  const audio = new Audio(url);
  audio.volume = 1.0;
  currentPlayingAudio = audio;

  try {
    await audio.play();
  } catch (err) {
    // If HTML5 audio is blocked by browser policy or needs amplification, decode via AudioContext
    const ctx = getAudioContext();
    if (ctx && url.startsWith('data:audio/')) {
      try {
        const base64Index = url.indexOf('base64,');
        if (base64Index !== -1) {
          const base64 = url.substring(base64Index + 7);
          const binaryString = atob(base64);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const audioBuffer = await ctx.decodeAudioData(bytes.buffer.slice(0));
          const source = ctx.createBufferSource();
          const gainNode = ctx.createGain();
          gainNode.gain.value = 1.25; // boost clarity and loudness
          source.buffer = audioBuffer;
          source.connect(gainNode);
          gainNode.connect(ctx.destination);
          source.start(0);
        }
      } catch (decodeErr) {
        console.warn('AudioContext decode error:', decodeErr);
        throw err;
      }
    } else {
      throw err;
    }
  }
}

function speakViaWebSpeech(
  text: string,
  lang: 'vi' | 'en',
  rate: number,
  dialect: 'northern' | 'southern' = 'southern'
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'vi' ? 'vi-VN' : 'en-US';
    utterance.rate = dialect === 'southern' ? rate * 0.95 : rate;
    utterance.pitch = dialect === 'southern' ? 1.02 : 1.08;

    const voices = window.speechSynthesis.getVoices();

    if (lang === 'vi') {
      const viVoices = voices.filter(
        (v) =>
          v.lang.toLowerCase().startsWith('vi') ||
          v.lang.toLowerCase().replace('_', '-').startsWith('vi')
      );

      // CRITICAL: NEVER speak Vietnamese with an English voice!
      // If no Vietnamese voice is present in Web Speech API, DO NOT use English voice.
      if (viVoices.length === 0) {
        console.warn('No Vietnamese Web Speech voice found on device; prevented English fallback to avoid mispronouncing "bé".');
        return;
      }

      const isNorthVoice = (name: string) => {
        const n = name.toLowerCase();
        return (
          n.includes('north') ||
          n.includes('bac') ||
          n.includes('bắc') ||
          n.includes('hanoi') ||
          n.includes('ha noi') ||
          n.includes('hoaimy') ||
          n.includes('namminh')
        );
      };

      const isSouthVoice = (name: string) => {
        const n = name.toLowerCase();
        return (
          (n.includes('south') ||
            n.includes('saigon') ||
            n.includes('sai gon') ||
            n.includes('mien nam') ||
            n.includes('miền nam') ||
            n.includes('linh') ||
            n.includes('myan') ||
            n.includes('thi')) &&
          !isNorthVoice(n)
        );
      };

      if (dialect === 'southern') {
        const southCandidate =
          viVoices.find((v) => isSouthVoice(v.name)) ||
          viVoices.find((v) => !isNorthVoice(v.name)) ||
          viVoices[0];
        utterance.voice = southCandidate;
      } else {
        const northCandidate =
          viVoices.find((v) => isNorthVoice(v.name)) ||
          viVoices[0];
        utterance.voice = northCandidate;
      }

      window.speechSynthesis.speak(utterance);
    } else {
      const enVoice = voices.find((v) => v.lang.toLowerCase().startsWith('en'));
      if (enVoice) utterance.voice = enVoice;
      window.speechSynthesis.speak(utterance);
    }
  } catch (e) {
    console.debug('Speech synthesis error:', e);
  }
}

/**
 * Speak Grade 1 Vietnamese letter:
 * - 'phonics': Speaks ONLY the grade 1 spelling sound (e.g. 'Bờ', 'Cờ', 'Dờ')
 * - 'name': Speaks letter name (e.g. 'Chữ Bê', 'Chữ Xê')
 */
export function speakLetter(
  letter: string,
  mode: 'phonics' | 'name' = 'phonics',
  withExample: boolean = false,
  dialect?: 'northern' | 'southern'
) {
  const upper = letter.trim().toUpperCase();
  const currentDialect = dialect || activeDialect;
  const grade1Sound = VI_GRADE1_PHONICS_MAP[upper];
  const info = VI_LETTER_PHONICS_MAP[upper];

  if (mode === 'phonics' && grade1Sound) {
    if (withExample && info) {
      const ex = currentDialect === 'southern' ? info.exampleSouth : info.exampleNorth;
      speakText(`${grade1Sound}. ${ex}`, 'vi', 0.88, currentDialect);
    } else {
      // Crisp, clean Grade 1 spelling sound: "Bờ", "Cờ", "Dờ"
      speakText(grade1Sound, 'vi', 0.88, currentDialect);
    }
  } else if (info) {
    let phrase = info.name;
    if (withExample) {
      const ex = currentDialect === 'southern' ? info.exampleSouth : info.exampleNorth;
      phrase += `. ${ex}`;
    }
    speakText(phrase, 'vi', 0.88, currentDialect);
  } else {
    speakText(letter, 'vi', 0.88, currentDialect);
  }
}

/**
 * Generates slow, step-by-step authentic Grade 1 Vietnamese phonics spelling guide.
 * E.g. "CAM" => "Cờ, am, cam. Trái Cam!"
 * E.g. "CÁ" => "Cờ, a, ca, sắc, cá. Con Cá!"
 * E.g. "MÈO" => "Mờ, eo, meo, huyền, mèo. Con Mèo!"
 */
export function formatVietnameseSpellingSlow(text: string, meaning?: string): string {
  if (!text) return '';
  const cleanWord = text.trim().toUpperCase();
  const words = cleanWord.split(/\s+/);

  const wordGuides = words.map((w) => {
    // Break word into individual uppercase letters / compound consonants
    const chars: string[] = [];
    let idx = 0;
    while (idx < w.length) {
      if (idx + 3 <= w.length && w.substring(idx, idx + 3) === 'NGH') {
        chars.push('NGH');
        idx += 3;
      } else if (
        idx + 2 <= w.length &&
        ['CH', 'GH', 'GI', 'KH', 'NH', 'NG', 'PH', 'QU', 'TH', 'TR'].includes(w.substring(idx, idx + 2))
      ) {
        chars.push(w.substring(idx, idx + 2));
        idx += 2;
      } else {
        chars.push(w[idx]);
        idx++;
      }
    }

    const phonicsList = chars.map((ch) => VI_GRADE1_PHONICS_MAP[ch] || ch.toLowerCase());

    let toneName = '';
    const rawLower = w.toLowerCase();
    if (/[áếíóốớúứý]/i.test(rawLower)) toneName = 'sắc';
    else if (/[àềìòồờùừỳ]/i.test(rawLower)) toneName = 'huyền';
    else if (/[ảẩẳẻểỉỏổởủửỷ]/i.test(rawLower)) toneName = 'hỏi';
    else if (/[ãẫẵẽễĩõỗỡũữỹ]/i.test(rawLower)) toneName = 'ngã';
    else if (/[ạậặẹệịọộợụựỵ]/i.test(rawLower)) toneName = 'nặng';

    let guide = phonicsList.join(', ');
    if (toneName) {
      guide += `, ${toneName}, ${w.toLowerCase()}`;
    } else {
      guide += `, ${w.toLowerCase()}`;
    }

    return guide;
  });

  let fullGuide = wordGuides.join('. ');
  if (meaning) {
    fullGuide += `. ${meaning}`;
  }

  return fullGuide;
}

export function speakSpellingSlow(
  word: string,
  meaning?: string,
  dialect?: 'northern' | 'southern'
) {
  const guideText = formatVietnameseSpellingSlow(word, meaning);
  // Speak slowly (rate 0.80) so children can hear every letter clearly
  speakText(`Cùng đánh vần từ từ nhé: ${guideText}`, 'vi', 0.80, dialect || activeDialect);
}

/**
 * Speak standard preschool number
 */
export function speakNumber(num: number | string, dialect?: 'northern' | 'southern') {
  const n = typeof num === 'string' ? parseInt(num, 10) : num;
  const currentDialect = dialect || activeDialect;
  if (!isNaN(n) && VI_NUMBER_WORDS_MAP[n]) {
    speakText(VI_NUMBER_WORDS_MAP[n], 'vi', 0.88, currentDialect);
  } else {
    speakText(`Số ${num}`, 'vi', 0.88, currentDialect);
  }
}

export const SOUTHERN_CELEBRATIONS = [
  'Hoan hô bé yêu giỏi quá xá là giỏi luôn nghen! Bé nhận thêm ngôi sao vàng lấp lánh nè!',
  'Giỏi dữ hôn ta ơi! Bé vừa hoàn thành xong bài học rồi đó, xuất sắc quá chừng luôn nè!',
  'Bé cưng học ngoan quá chừng nè! Cây tri thức của bé nở thêm hoa đẹp rực rỡ nghen!',
  'Quá đã luôn bé ơi! Mau vô Hộp Ước Mơ chọn quà nghen!',
  'Hoan hô bé giỏi ơi là giỏi! Ba mẹ tự hào về bé dữ lắm luôn nghen!',
];

export const NORTHERN_CELEBRATIONS = [
  'Hoan hô bé yêu thật là giỏi! Bé nhận thêm ngôi sao vàng lấp lánh nhé!',
  'Tuyệt vời quá! Bé vừa hoàn thành xong bài học rồi, xuất sắc lắm nhé!',
  'Bé ngoan học chăm chỉ quá! Bố mẹ rất tự hào về bé nhé!',
  'Hoan hô bé! Mau vào Hộp Ước Mơ để chọn phần thưởng nào!',
  'Bé thông minh và chăm ngoan lắm! Cùng cố gắng học tiếp nhé!',
];

export interface CelebrationAudioResult {
  text: string;
  hasAudioClip: boolean;
}

/**
 * Triggers cheerful Vietnamese text-to-speech celebration feedback (North & South)
 */
export async function playCelebrationFeedback(params: {
  childName?: string;
  lessonTitle?: string;
  starsEarned?: number;
  isHardLevel?: boolean;
  milestoneType?: 'lesson' | 'badge' | 'streak';
  dialect?: 'northern' | 'southern';
}): Promise<CelebrationAudioResult> {
  const name = params.childName || 'Bé';
  const stars = params.starsEarned || 3;
  const currentDialect = params.dialect || activeDialect;
  const isSouth = currentDialect === 'southern';

  let fallbackText = '';
  if (isSouth) {
    if (params.isHardLevel) {
      fallbackText = `Hoan hô ${name} giỏi quá xá là giỏi luôn nghen! Bé vừa chinh phục xong thử thách khó và nhận được ${stars} ngôi sao vàng nè! Mau vào Hộp Ước Mơ chọn quà nghen!`;
    } else if (params.milestoneType === 'badge') {
      fallbackText = `Giỏi dữ hôn ${name} ơi! Bé vừa mở khóa huy hiệu mới rực rỡ nè! Ba mẹ tự hào về bé lắm nghen!`;
    } else if (params.milestoneType === 'streak') {
      fallbackText = `Xuất sắc quá ${name} ơi! Bé đã học chăm chỉ nhiều ngày liên tiếp rồi đó! Tụi mình cùng cố gắng tiếp nghen!`;
    } else {
      fallbackText = `Hoan hô ${name} giỏi quá chừng luôn nghen! Bé đã hoàn thành bài học và nhận thêm ${stars} ngôi sao vàng nè!`;
    }
  } else {
    if (params.isHardLevel) {
      fallbackText = `Hoan hô ${name} giỏi quá! Bé vừa chinh phục xong thử thách khó và nhận được ${stars} ngôi sao vàng nhé! Mau vào Hộp Ước Mơ chọn quà nào!`;
    } else if (params.milestoneType === 'badge') {
      fallbackText = `Tuyệt vời lắm ${name} ơi! Bé vừa mở khóa huy hiệu mới rực rỡ nè! Bố mẹ rất tự hào về bé nhé!`;
    } else if (params.milestoneType === 'streak') {
      fallbackText = `Xuất sắc lắm ${name} ơi! Bé đã học chăm chỉ nhiều ngày liên tiếp rồi đó! Chúng mình cùng cố gắng tiếp nhé!`;
    } else {
      fallbackText = `Hoan hô ${name} giỏi lắm! Bé đã hoàn thành bài học và nhận thêm ${stars} ngôi sao vàng nhé!`;
    }
  }

  // Try calling Gemini TTS celebration endpoint
  try {
    const res = await fetch('/api/tts/celebration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        childName: name,
        lessonTitle: params.lessonTitle,
        starsEarned: stars,
        isHardLevel: params.isHardLevel,
        milestoneType: params.milestoneType || 'lesson',
        dialect: currentDialect,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.audioBase64) {
        if (currentPlayingAudio) {
          currentPlayingAudio.pause();
        }
        const mimeType = data.format || 'audio/mp3';
        const audio = new Audio(`data:${mimeType};base64,${data.audioBase64}`);
        currentPlayingAudio = audio;
        audio.play().catch(() => {
          speakText(data.celebrationText || fallbackText, 'vi', 0.9, currentDialect);
        });

        return {
          text: data.celebrationText || fallbackText,
          hasAudioClip: true,
        };
      }
    }
  } catch (e) {
    console.debug('Online celebration TTS failed, using offline fallback', e);
  }

  // Offline or fallback path
  speakText(fallbackText, 'vi', 0.9, currentDialect);
  return {
    text: fallbackText,
    hasAudioClip: false,
  };
}
