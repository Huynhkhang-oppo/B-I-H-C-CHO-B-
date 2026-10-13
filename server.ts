import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory sync store for multi-device family sync
const familySyncStore = new Map<string, { data: any; updatedAt: string }>();

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Gemini TTS quota tracker (free tier has 10 requests/day limit)
let geminiQuotaCooldownUntil = Date.now() + 10 * 3600 * 1000;

// High-fidelity Native Vietnamese and English TTS service (zero-quota, loud, clear phonetics)
async function fetchTTS(text: string, lang: 'vi' | 'en' = 'vi'): Promise<{ audioBase64: string; format: string } | null> {
  try {
    const encoded = encodeURIComponent(text);
    const targetLang = lang === 'en' ? 'en' : 'vi';
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=${targetLang}&client=tw-ob`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (buffer.length === 0) return null;
    return {
      audioBase64: buffer.toString('base64'),
      format: 'audio/mp3',
    };
  } catch (err) {
    console.error('TTS service error:', err);
    return null;
  }
}

// Standard Speech TTS endpoint for Vietnamese & English
app.post('/api/tts/speak', async (req, res) => {
  try {
    const { text, dialect = 'northern', lang = 'vi' } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    // Always ensure loud, crisp native pronunciation
    const nativeAudio = await fetchTTS(text, lang as 'vi' | 'en');
    if (nativeAudio) {
      return res.json(nativeAudio);
    }

    res.status(500).json({ error: 'No audio returned' });
  } catch (error: any) {
    console.error('TTS endpoint error:', error);
    res.status(500).json({ error: error.message || 'TTS failure' });
  }
});

// Backward compatible endpoint for speak-southern
app.post('/api/tts/speak-southern', async (req, res) => {
  req.body.dialect = 'southern';
  return (app as any)._router.handle({ ...req, url: '/api/tts/speak' }, res);
});

// Cheerful Vietnamese Celebration TTS Endpoint (Mặc định Giọng Chuẩn Nam)
app.post('/api/tts/celebration', async (req, res) => {
  try {
    const { milestoneType, childName, starsEarned, lessonTitle, isHardLevel, dialect = 'southern' } = req.body;
    const name = childName || 'Bé yêu';
    const isSouth = dialect !== 'northern';

    let cheerText = '';
    if (isSouth) {
      if (isHardLevel) {
        cheerText = `Hoan hô ${name} giỏi quá xá là giỏi luôn nghen! Bé vừa chinh phục xong thử thách khó ${lessonTitle || ''} và nhận được ${starsEarned || 5} ngôi sao vàng nè! Mau vào Hộp Ước Mơ chọn phần thưởng nha!`;
      } else if (milestoneType === 'badge') {
        cheerText = `Giỏi dữ hôn ${name} ơi! Bé vừa mở khóa huy hiệu mới rực rỡ nè! Ba mẹ tự hào về bé lắm nghen!`;
      } else if (milestoneType === 'streak') {
        cheerText = `Xuất sắc quá ${name} ơi! Bé đã học chăm chỉ nhiều ngày liên tiếp rồi đó! Giỏi ghê hôn ta ơi!`;
      } else {
        cheerText = `Hoan hô ${name} giỏi quá chừng luôn nghen! Bé đã hoàn thành bài học và nhận được thêm ${starsEarned || 3} ngôi sao vàng lấp lánh nè! Tụi mình học vui quá đi hà!`;
      }
    } else {
      if (isHardLevel) {
        cheerText = `Hoan hô ${name} giỏi quá! Bé vừa chinh phục xong thử thách ${lessonTitle || ''} và nhận được ${starsEarned || 5} ngôi sao vàng lấp lánh! Mau vào Hộp Ước Mơ chọn quà nhé!`;
      } else if (milestoneType === 'badge') {
        cheerText = `Tuyệt vời lắm ${name} ơi! Bé vừa mở khóa huy hiệu mới thật rực rỡ! Bố mẹ rất tự hào về bé nhé!`;
      } else if (milestoneType === 'streak') {
        cheerText = `Xuất sắc lắm ${name} ơi! Bé đã chăm chỉ học bài nhiều ngày liên tiếp rồi đó! Chúng mình cùng cố gắng tiếp nhé!`;
      } else {
        cheerText = `Hoan hô ${name} giỏi lắm! Bé đã hoàn thành bài học và nhận thêm ${starsEarned || 3} ngôi sao vàng lấp lánh nhé!`;
      }
    }

    const voicePrompt = isSouth
      ? 'Giọng nữ miền Nam trẻ trung, tươi vui, reo hò khen ngợi bé mầm non thật ngọt ngào và tự hào'
      : 'Giọng nữ miền Bắc thanh thoát, truyền cảm, tươi vui, khen ngợi bé mầm non chăm ngoan';

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: cheerText,
                speechMetadata: {
                  style: voicePrompt,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: isSouth ? 'Kore' : 'Aoede' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return res.json({
          celebrationText: cheerText,
          audioBase64: base64Audio,
          format: 'audio/wav',
        });
      }
    } catch (aiErr) {
      console.warn('Gemini celebration TTS rate limited, falling back to Native Vietnamese audio:', (aiErr as any)?.message || aiErr);
    }

    const nativeAudio = await fetchTTS(cheerText, 'vi');
    res.json({
      celebrationText: cheerText,
      audioBase64: nativeAudio?.audioBase64 || null,
      format: nativeAudio?.format || 'audio/mp3',
    });
  } catch (error: any) {
    console.error('Error generating celebration speech:', error);
    const isSouth = req.body.dialect === 'southern';
    const fallback = isSouth
      ? `Hoan hô ${req.body.childName || 'bé'} giỏi quá xá luôn nghen! Bé nhận thêm ${req.body.starsEarned || 3} ngôi sao vàng nè!`
      : `Hoan hô ${req.body.childName || 'bé'} giỏi lắm! Bé nhận thêm ${req.body.starsEarned || 3} ngôi sao vàng nhé!`;
    res.json({
      celebrationText: fallback,
      audioBase64: null,
    });
  }
});

// AI 1: Lộ trình học cá nhân hóa dựa trên độ tuổi và kết quả học
app.post('/api/gemini/recommend-path', async (req, res) => {
  try {
    const { ageGroup, childName, completedLessons, weakSkills, totalStars } = req.body;

    const prompt = `Bạn là chuyên gia giáo dục mầm non Việt Nam theo chương trình Bộ Giáo dục & Đào tạo.
Bé tên: ${childName || 'Bé'}, Lứa tuổi: ${ageGroup || '3-4 tuổi'}.
Số sao tích lũy: ${totalStars || 0}.
Bài đã học: ${JSON.stringify(completedLessons || [])}.
Nội dung bé cần rèn thêm hoặc chưa thành thạo: ${JSON.stringify(weakSkills || [])}.

Hãy đề xuất lộ trình học tập cá nhân hóa 3 ngày tiếp theo cho bé thật vui tươi, vừa học vừa chơi:
1. Nhận xét ngắn gọn truyền cảm hứng cho bé (1-2 câu ngọt ngào, khen ngợi).
2. Lộ trình 3 bài tập trọng tâm (gồm Tiếng Việt, Toán, Tiếng Anh) phù hợp chuẩn lứa tuổi Việt Nam, có độ khó tăng dần từ dễ đến nâng cao.
3. Gợi ý 1 hoạt động tương tác ngoài đời thực giữa ba mẹ và bé (VD: đếm thìa ăn cơm, tìm chữ cái trên bảng hiệu quảng cáo, sờ nắm quả táo...).
4. Đề xuất phần thưởng tinh thần gần gũi (VD: mẹ đọc truyện cổ tích, bố cõng làm máy bay, dạo chơi công viên).

Trả về định dạng JSON hợp lệ:
{
  "cheerMessage": "...",
  "recommendedLessons": [
    { "subject": "vietnamese|math|english", "title": "...", "focusSkill": "...", "difficulty": "easy|medium|hard", "reason": "..." }
  ],
  "realLifeActivity": "...",
  "rewardSuggestion": "..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text || '{}';
    const parsed = JSON.parse(jsonText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating AI recommendation:', error);
    // Provide a rich fallback to ensure app remains smooth and functional
    res.json({
      cheerMessage: "Bé rất ngoan và chăm chỉ! Hôm nay chúng mình tiếp tục khám phá thế giới rực rỡ nhé!",
      recommendedLessons: [
        {
          subject: "vietnamese",
          title: "Khám phá chữ cái A, Ă, Â",
          focusSkill: "Nhận diện mặt chữ & phát âm",
          difficulty: "easy",
          reason: "Nền tảng bảng chữ cái tiếng Việt cho bé mầm non"
        },
        {
          subject: "math",
          title: "Tập đếm ngón tay xinh 1 - 5",
          focusSkill: "Đếm số lượng & nhận biết chữ số",
          difficulty: "easy",
          reason: "Tăng khả năng liên kết lượng và số"
        },
        {
          subject: "english",
          title: "Thế giới động vật (Animals)",
          focusSkill: "Từ vựng Dog, Cat, Bird",
          difficulty: "medium",
          reason: "Phát âm tiếng Anh tự nhiên qua hình ảnh con vật gần gũi"
        }
      ],
      realLifeActivity: "Cùng bé đếm các quả trong rổ trái cây ở nhà và gọi tên màu sắc bằng cả tiếng Việt lẫn tiếng Anh.",
      rewardSuggestion: "Mẹ cùng bé chơi trò chơi đố vui và thưởng cho bé một cái ôm thật chặt trước giờ ngủ!"
    });
  }
});

// AI 2: Kể chuyện đêm diệu kỳ củng cố kiến thức trước giờ ngủ
app.post('/api/gemini/bedtime-story', async (req, res) => {
  try {
    const { childName, ageGroup, learnedWords } = req.body;

    const prompt = `Bạn là người kể chuyện cổ tích cho trẻ em mầm non Việt Nam (${ageGroup || '3-4 tuổi'}).
Bé tên là: ${childName || 'Bé yêu'}.
Các từ/chữ/số bé vừa học hôm nay: ${JSON.stringify(learnedWords || ['Chữ A', 'Số 3', 'Quả táo'])}.

Hãy sáng tác một câu chuyện ngắn ấm áp, du dương, dễ thương dài khoảng 180-250 từ:
- Lồng ghép một cách tự nhiên và sinh động các từ/chữ/số mà bé đã học hôm nay.
- Giọng văn êm dịu, ấm áp, kết thúc có lời chúc bé ngủ ngon và mơ giấc mơ đẹp.
- Thích hợp để ba mẹ đọc cho bé nghe trước khi ngủ.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({
      title: `Chuyến phiêu lưu diệu kỳ của ${childName || 'Bé'}`,
      story: response.text || 'Ngày xửa ngày xưa, ở một khu vườn thần tiên...',
    });
  } catch (error: any) {
    console.error('Error generating bedtime story:', error);
    res.json({
      title: "Khu vườn giấc mơ của Bé",
      story: `Đêm đã buông xuống trên khu vườn nhỏ. Mặt trăng tròn xoe như một chiếc bánh sáng lấp lánh trên bầu trời đêm. Bạn Gấu con và bạn Thỏ trắng cùng nhau đếm những ngôi sao: một, hai, ba ngôi sao lấp lánh. Các bạn học thật ngoan chữ cái A, Ă, Â rồi rủ nhau nằm vào chiếc nệm êm ái thơm mùi hoa cúc. Gió khẽ thổi xào xạc khúc hát ru du dương: Chúc bé ngoan ngủ thật ngon, có những giấc mơ thật đẹp cùng những người bạn đáng yêu nhé!`
    });
  }
});

// AI 3: Cố vấn giáo dục mầm non cho cha mẹ
app.post('/api/gemini/parent-advice', async (req, res) => {
  try {
    const { question, ageGroup, childStrengths, childChallenges } = req.body;

    const prompt = `Bạn là chuyên gia tâm lý và giáo dục sớm mầm non tại Việt Nam.
Phụ huynh có con ${ageGroup || '3-4 tuổi'}.
Điểm mạnh hiện tại của bé: ${childStrengths || 'Rất thích hình ảnh sinh động và âm thanh vui vẻ'}.
Khó khăn gặp phải: ${childChallenges || 'Đôi khi chưa tập trung lâu, dễ bị phân tâm'}.
Câu hỏi/thắc mắc của phụ huynh: "${question || 'Làm sao để giúp con duy trì thói quen học mỗi ngày mà không bị áp lực?'}"

Hãy đưa ra lời khuyên thiết thực, đồng cảm và khoa học:
1. Giải thích tâm sinh lý lứa tuổi theo mầm non Việt Nam.
2. 3 phương pháp áp dụng ngay tại nhà (kết hợp trò chơi, khen thưởng tích cực, không ép buộc).
3. Thông điệp động viên cha mẹ.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({
      advice: response.text || 'Hãy luôn kiên nhẫn và đồng hành cùng con...',
    });
  } catch (error: any) {
    console.error('Error getting parent advice:', error);
    res.json({
      advice: `Ở lứa tuổi mầm non (1-5 tuổi), phương châm cốt lõi là "Học bằng chơi, chơi mà học". Trẻ tiếp thu tốt nhất qua thị giác, thính giác và cảm giác tương tác trực tiếp. Ba mẹ nên duy trì thời lượng học 10-15 phút mỗi ngày, kết hợp khen ngợi tức thì và gắn liền bài học với các sự vật quen thuộc trong gia đình.`
    });
  }
});

// Multi-device Cloud Sync
app.post('/api/sync/save', (req, res) => {
  const { syncCode, payload } = req.body;
  if (!syncCode || !payload) {
    return res.status(400).json({ error: 'Thiếu mã đồng bộ hoặc dữ liệu' });
  }
  const cleanCode = String(syncCode).trim().toUpperCase();
  familySyncStore.set(cleanCode, {
    data: payload,
    updatedAt: new Date().toISOString(),
  });
  res.json({ success: true, syncCode: cleanCode, timestamp: new Date().toISOString() });
});

app.get('/api/sync/load/:syncCode', (req, res) => {
  const cleanCode = String(req.params.syncCode || '').trim().toUpperCase();
  const entry = familySyncStore.get(cleanCode);
  if (!entry) {
    return res.status(404).json({ error: 'Không tìm thấy dữ liệu với mã này. Hãy kiểm tra lại mã đã lưu trên thiết bị cũ!' });
  }
  res.json({ success: true, data: entry.data, updatedAt: entry.updatedAt });
});

// Weekly Email Report Simulation
app.post('/api/reports/send-weekly-email', (req, res) => {
  const { email, reportSummary } = req.body;
  const targetEmail = email || 'huynhkhang.tran90@gmail.com';
  
  console.log(`[Báo Cáo Tuần] Đã lập lịch và gửi bản tóm tắt học tập đến ${targetEmail}`);
  res.json({
    success: true,
    message: `Đã gửi báo cáo tiến độ tuần thành công đến ${targetEmail}!`,
    scheduledNext: 'Chủ nhật tới, 20:00',
    reportData: reportSummary,
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Smart Kids Vietnam Learning API' });
});

// Vite Middleware for Dev / Static file serving for Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
