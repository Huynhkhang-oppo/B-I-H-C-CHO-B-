/**
 * Utilities for Vietnamese speech recognition & Standard Pronunciation evaluation (Bộ GD&ĐT).
 */

export const STANDARD_PRONUNCIATION_TIPS: Record<string, { sound: string; guide: string }> = {
  'a': { sound: 'Âm A', guide: 'Mở rộng khẩu hình miệng, phát âm to rõ ràng: Quả Cam, Con Cá' },
  'b': { sound: 'Âm Bờ', guide: 'Hai môi khép lại rồi bật nhẹ hơi ra: Bạn Búp Bê, Bánh Mì' },
  'c': { sound: 'Âm Cờ', guide: 'Nâng gốc lưỡi chạm vòm miệng: Con Cua, Cây Cầu' },
  'd': { sound: 'Âm Dờ', guide: 'Đầu lưỡi chạm chân răng trên rồi hạ xuống nhẹ nhàng: Quả Dưa' },
  'đ': { sound: 'Âm Đờ', guide: 'Bật nhẹ đầu lưỡi ở chân răng: Đồng Hồ, Đèn Lồng' },
  'e': { sound: 'Âm E', guide: 'Khẩu hình miệng mở vừa, môi bẹt nhẹ: Em Bé, Con Meo' },
  'ê': { sound: 'Âm Ê', guide: 'Môi hơi chúm, phát âm thanh thoát: Búp Bê, Con Bê' },
  'g': { sound: 'Âm Gờ', guide: 'Gốc lưỡi nâng chạm vòm họng: Con Gà, Ghế Gỗ' },
  'h': { sound: 'Âm Hờ', guide: 'Mở miệng tự nhiên, hơi thở nhẹ từ họng: Hoa Hồng, Xe Hơi' },
  'l': { sound: 'Âm Lờ', guide: 'Uốn cong đầu lưỡi chạm lợi trên rồi bật xuống rõ ràng: Quả Lê, Con Lợn' },
  'n': { sound: 'Âm Nờ', guide: 'Đầu lưỡi áp sát lợi trên, thoát hơi qua mũi: Cái Nơ, Ngôi Nhà' },
  'm': { sound: 'Âm Mờ', guide: 'Khép hai môi rồi thoát hơi: Mặt Trăng, Quả Mận' },
  'v': { sound: 'Âm Vờ', guide: 'Răng trên chạm nhẹ môi dưới, rung thanh quản chuẩn âm Vờ: Con Vịt, Vui Vẻ' },
  'r': { sound: 'Âm Rờ', guide: 'Đầu lưỡi hơi cong, rung nhẹ thanh thoát: Con Rùa, Rực Rỡ' },
  's': { sound: 'Âm Sờ', guide: 'Uốn nhẹ đầu lưỡi, xát hơi ra: Ngôi Sao, Sách Vở' },
  'x': { sound: 'Âm Xờ', guide: 'Đầu lưỡi chạm chân răng dưới, xát nhẹ: Xe Hơi, Xinh Xắn' },
  'tr': { sound: 'Âm Trờ', guide: 'Uốn cong đầu lưỡi: Con Trăn, Mặt Trời' },
  'ch': { sound: 'Âm Chờ', guide: 'Mặt lưỡi chạm ngạc cứng rồi bật hơi: Con Chó, Chú Chim' },
};

export const SOUTHERN_PRONUNCIATION_TIPS = STANDARD_PRONUNCIATION_TIPS;

export function cleanVietnameseString(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'–—]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Remove Vietnamese accents/diacritics for fallback fuzzy comparison
 */
export function removeDiacritics(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

/**
 * Evaluate standard Vietnamese pronunciation (Bộ GD&ĐT Standard).
 */
export function evaluateSouthernPronunciation(
  spoken: string,
  target: string,
  displayLetter?: string
): {
  score: number;
  matchedWord: boolean;
  southernBonus: boolean;
  feedbackVi: string;
  feedbackEn: string;
} {
  const normSpoken = cleanVietnameseString(spoken);
  const normTarget = cleanVietnameseString(target);

  if (!normSpoken || !normTarget) {
    return {
      score: 0,
      matchedWord: false,
      southernBonus: false,
      feedbackVi: 'Bé nói to và rõ hơn theo cô giáo nhé!',
      feedbackEn: 'Speak a little louder and clearer!',
    };
  }

  // Exact match
  if (normSpoken === normTarget) {
    return {
      score: 100,
      matchedWord: true,
      southernBonus: true,
      feedbackVi: 'Xuất sắc! Bé phát âm chuẩn 100% tròn vành rõ chữ theo chuẩn Bộ GD&ĐT! ⭐⭐⭐',
      feedbackEn: 'Excellent! Perfect standard pronunciation!',
    };
  }

  // Substring match
  if (normSpoken.includes(normTarget) || normTarget.includes(normSpoken)) {
    return {
      score: 95,
      matchedWord: true,
      southernBonus: true,
      feedbackVi: 'Bé đọc rất chuẩn xác từ rồi nhé! Giỏi lắm! ⭐⭐⭐',
      feedbackEn: 'Awesome! Great job pronouncing the word correctly!',
    };
  }

  // Check letter sound if target is single letter or letter lesson
  if (displayLetter) {
    const letterNorm = cleanVietnameseString(displayLetter);
    if (
      normSpoken.includes(letterNorm) ||
      normSpoken.includes(`chu ${removeDiacritics(letterNorm)}`) ||
      normSpoken.includes(`chữ ${letterNorm}`)
    ) {
      return {
        score: 90,
        matchedWord: true,
        southernBonus: false,
        feedbackVi: `Đúng âm chữ "${displayLetter}" rồi nè, bé giỏi quá! ⭐⭐`,
        feedbackEn: `Correct letter sound for "${displayLetter}"!`,
      };
    }
  }

  // Levenshtein distance on raw text
  const rawDist = levenshteinDistance(normSpoken, normTarget);
  const maxLen = Math.max(normSpoken.length, normTarget.length);
  const textSim = Math.max(0, 1 - rawDist / maxLen);

  // Levenshtein distance on accent-stripped text (for tone partial match)
  const stripSpoken = removeDiacritics(normSpoken);
  const stripTarget = removeDiacritics(normTarget);
  const stripDist = levenshteinDistance(stripSpoken, stripTarget);
  const stripSim = Math.max(0, 1 - stripDist / Math.max(stripSpoken.length, stripTarget.length));

  const finalSim = Math.round((textSim * 0.6 + stripSim * 0.4) * 100);

  if (finalSim >= 75) {
    return {
      score: 85,
      matchedWord: true,
      southernBonus: true,
      feedbackVi: 'Bé phát âm rất gần chuẩn rồi! Luyện thêm một chút nữa là tuyệt đối 10 điểm nhé! ⭐⭐',
      feedbackEn: 'Very close! Try once more for a perfect tone!',
    };
  } else if (finalSim >= 50) {
    return {
      score: 65,
      matchedWord: false,
      southernBonus: false,
      feedbackVi: 'Bé bấm nút Loa nghe cô giáo đọc mẫu rồi đọc to lại theo cô nhé! ⭐',
      feedbackEn: 'Listen to the teacher voice again and repeat aloud!',
    };
  } else {
    return {
      score: Math.max(30, finalSim),
      matchedWord: false,
      southernBonus: false,
      feedbackVi: 'Chưa đúng rồi nè, bé nghe cô giáo đọc mẫu rồi thử lại nhé!',
      feedbackEn: 'Not quite yet. Tap the speaker to listen and try again!',
    };
  }
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}
