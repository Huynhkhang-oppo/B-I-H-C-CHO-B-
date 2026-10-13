import { AgeGroup, Lesson, LessonItem } from '../types';
import { LESSONS } from '../data/curriculumData';

export interface DayLetterItem {
  letter: string;
  phonicsVi: string;
  nameVi: string;
  words: {
    word: string;
    emoji: string;
    audioVi: string;
    spellingPhonics?: string; // e.g. "Cờ - A - Ca - Sắc - CÁ"
  }[];
}

export interface DayModule {
  dayIndex: number; // 0 to 6
  dayNameVi: string;
  dayShortVi: string;
  themeVi: string;
  icon: string;
  letters: DayLetterItem[];
}

export const DAILY_36_LETTERS_MODULES: DayModule[] = [
  // Thứ Hai: 5 chữ đầu tiên: A, Ă, Â, B, C
  {
    dayIndex: 0,
    dayNameVi: 'Thứ Hai',
    dayShortVi: 'T2',
    themeVi: 'Khởi Đầu Tuần Vui Vẻ: Chữ A, Ă, Â, B, C',
    icon: '🌱',
    letters: [
      {
        letter: 'A',
        phonicsVi: 'A',
        nameVi: 'Chữ A',
        words: [
          { word: 'Quả Cam', emoji: '🍊', audioVi: 'Quả cam mọng nước, có chữ A nè bé!', spellingPhonics: 'Cờ - am - cam - CAM' },
          { word: 'Con Cá', emoji: '🐟', audioVi: 'Con cá vàng bơi tung tăng, có chữ A!', spellingPhonics: 'Cờ - a - ca - sắc - CÁ' },
          { word: 'Cái Áo', emoji: '👕', audioVi: 'Cái áo mới sạch sẽ tinh tươm!', spellingPhonics: 'A - sắc - ÁO' },
          { word: 'Xe Hơi', emoji: '🚗', audioVi: 'Xe hơi chạy êm ru trên đường phố!', spellingPhonics: 'Hờ - ơi - hơi - HƠI' },
          { word: 'Con Gà', emoji: '🐔', audioVi: 'Con gà trống gáy ò ó o gọi mặt trời!', spellingPhonics: 'Gờ - a - ga - huyền - GÀ' },
        ],
      },
      {
        letter: 'Ă',
        phonicsVi: 'Á',
        nameVi: 'Chữ Á',
        words: [
          { word: 'Mặt Trăng', emoji: '🌙', audioVi: 'Mặt trăng khuyết cong cong như chữ Ă!', spellingPhonics: 'Trờ - ăng - trăng - TRĂNG' },
          { word: 'Cái Khăn', emoji: '🧣', audioVi: 'Cái khăn quàng cổ ấm áp ngày đông!', spellingPhonics: 'Khờ - ăn - khăn - KHĂN' },
          { word: 'Đôi Mắt', emoji: '👀', audioVi: 'Đôi mắt sáng ngời chăm chú học bài!', spellingPhonics: 'Mờ - ăt - măt - sắc - MẮT' },
          { word: 'Bắp Cải', emoji: '🥬', audioVi: 'Bắp cải xanh tươi giòn ngọt mẹ nấu canh!', spellingPhonics: 'Bờ - ăp - băp - sắc - BẮP' },
          { word: 'Con Trăn', emoji: '🐍', audioVi: 'Bạn trăn hiền hòa trong thảo cầm viên!', spellingPhonics: 'Trờ - ăn - trăn - TRĂN' },
        ],
      },
      {
        letter: 'Â',
        phonicsVi: 'Ớ',
        nameVi: 'Chữ Ớ',
        words: [
          { word: 'Cái Nón', emoji: '👒', audioVi: 'Cái nón lá che nắng như chiếc mũ chữ Â!', spellingPhonics: 'Nờ - on - non - sắc - NÓN' },
          { word: 'Bồ Câu', emoji: '🕊️', audioVi: 'Chim bồ câu trắng mang niềm vui hòa bình!', spellingPhonics: 'Cờ - âu - câu - CÂU' },
          { word: 'Cây Nấm', emoji: '🍄', audioVi: 'Cây nấm nhỏ xinh bung xòe dưới tán cây!', spellingPhonics: 'Nờ - âm - nâm - sắc - NẤM' },
          { word: 'Cầu Vồng', emoji: '🌈', audioVi: 'Cầu vồng bảy sắc lung linh sau cơn mưa!', spellingPhonics: 'Cờ - âu - câu - huyền - CẦU' },
          { word: 'Cái Ấm', emoji: '🫖', audioVi: 'Cái ấm pha trà tỏa hương thơm ngát!', spellingPhonics: 'Â - mờ - âm - sắc - ẤM' },
        ],
      },
      {
        letter: 'B',
        phonicsVi: 'Bờ',
        nameVi: 'Chữ Bê',
        words: [
          { word: 'Em Bé', emoji: '👶', audioVi: 'Em bé ngoan chăm chỉ lắng nghe lời cô!', spellingPhonics: 'Bờ - e - be - sắc - BÉ' },
          { word: 'Con Bướm', emoji: '🦋', audioVi: 'Con bướm rực rỡ dạo chơi vườn hoa!', spellingPhonics: 'Bờ - ươm - bươm - sắc - BƯỚM' },
          { word: 'Quả Bưởi', emoji: '🍈', audioVi: 'Quả bưởi mọng nước ngọt thanh dịu mát!', spellingPhonics: 'Bờ - ươi - bươi - hỏi - BƯỞI' },
          { word: 'Trái Banh', emoji: '⚽', audioVi: 'Trái banh tròn xoe lăn trên sân cỏ!', spellingPhonics: 'Bờ - anh - banh - BANH' },
          { word: 'Bánh Mì', emoji: '🥖', audioVi: 'Bánh mì nóng hổi thơm ngon bổ dưỡng!', spellingPhonics: 'Bờ - anh - banh - sắc - BÁNH' },
        ],
      },
      {
        letter: 'C',
        phonicsVi: 'Cờ',
        nameVi: 'Chữ Xê',
        words: [
          { word: 'Con Cò', emoji: '🦩', audioVi: 'Con cò bay lả bay la trên cánh đồng!', spellingPhonics: 'Cờ - o - co - huyền - CÒ' },
          { word: 'Cái Cốc', emoji: '🥛', audioVi: 'Cái cốc đựng sữa thơm ngọt mỗi sáng!', spellingPhonics: 'Cờ - ôc - côc - sắc - CỐC' },
          { word: 'Con Cua', emoji: '🦀', audioVi: 'Con cua tám cẳng hai càng bò ngang!', spellingPhonics: 'Cờ - ua - cua - CUA' },
          { word: 'Quả Cà', emoji: '🍅', audioVi: 'Quả cà chua chín đỏ mọng giàu vitamin!', spellingPhonics: 'Cờ - a - ca - huyền - CÀ' },
          { word: 'Cây Cối', emoji: '🌳', audioVi: 'Cây cối tỏa bóng râm che mát sân trường!', spellingPhonics: 'Cờ - ây - cây - CỐI' },
        ],
      },
    ],
  },

  // Thứ Ba: 5 chữ tiếp theo: D, Đ, E, Ê, G
  {
    dayIndex: 1,
    dayNameVi: 'Thứ Ba',
    dayShortVi: 'T3',
    themeVi: 'Khám Phá Sáng Tạo: Chữ D, Đ, E, Ê, G',
    icon: '🔢',
    letters: [
      {
        letter: 'D',
        phonicsVi: 'Dờ',
        nameVi: 'Chữ Dê',
        words: [
          { word: 'Con Dê', emoji: '🐐', audioVi: 'Con dê ăn cỏ kêu be be vui tai!', spellingPhonics: 'Dờ - ê - dê - DÊ' },
          { word: 'Dưa Hấu', emoji: '🍉', audioVi: 'Dưa hấu ruột đỏ ngọt lịm mát lành!', spellingPhonics: 'Dờ - ưa - dưa - HẤU' },
          { word: 'Cây Dù', emoji: '☂️', audioVi: 'Cây dù che mưa che nắng cho bé!', spellingPhonics: 'Dờ - u - du - huyền - DÙ' },
          { word: 'Đôi Dép', emoji: '🩴', audioVi: 'Đôi dép xinh xắn êm ái bảo vệ bàn chân!', spellingPhonics: 'Dờ - ep - dep - sắc - DÉP' },
          { word: 'Quả Dâu', emoji: '🍓', audioVi: 'Quả dâu tây đỏ tươi chua ngọt hấp dẫn!', spellingPhonics: 'Dờ - âu - dâu - DÂU' },
        ],
      },
      {
        letter: 'Đ',
        phonicsVi: 'Đờ',
        nameVi: 'Chữ Đê',
        words: [
          { word: 'Đèn Pin', emoji: '🔦', audioVi: 'Đèn pin chiếu sáng rực rỡ trong đêm!', spellingPhonics: 'Đờ - en - đen - huyền - ĐÈN' },
          { word: 'Đồng Hồ', emoji: '⏰', audioVi: 'Đồng hồ tích tắc nhắc bé dậy đúng giờ!', spellingPhonics: 'Đờ - ông - đông - huyền - ĐỒNG' },
          { word: 'Quả Đu Đủ', emoji: '🍈', audioVi: 'Đu đủ chín vàng ngọt ngào bồi bổ sức khỏe!', spellingPhonics: 'Đờ - u - đu - ĐỦ' },
          { word: 'Xe Đạp', emoji: '🚲', audioVi: 'Xe đạp hai bánh bé cùng tập thể thao!', spellingPhonics: 'Đờ - ap - đap - nặng - ĐẠP' },
          { word: 'Đèn Lồng', emoji: '🏮', audioVi: 'Đèn lồng lung linh đón rằm trung thu!', spellingPhonics: 'Đờ - en - đen - huyền - ĐÈN' },
        ],
      },
      {
        letter: 'E',
        phonicsVi: 'E',
        nameVi: 'Chữ E',
        words: [
          { word: 'Em Bé', emoji: '👶', audioVi: 'Em bé mỉm cười rạng rỡ đón ngày mới!', spellingPhonics: 'E - mờ - em - BÉ' },
          { word: 'Con Ve', emoji: '🦗', audioVi: 'Con ve sầu ca hát rộn ràng mùa hè!', spellingPhonics: 'Vờ - e - ve - VE' },
          { word: 'Cây Me', emoji: '🌿', audioVi: 'Cây me xanh tốt trái me chua chua ngọt ngọt!', spellingPhonics: 'Mờ - e - me - ME' },
          { word: 'Búp Bê', emoji: '🪆', audioVi: 'Búp bê xinh xắn mặc đầm công chúa!', spellingPhonics: 'Bờ - e - be - BÊ' },
          { word: 'Cái Xe', emoji: '🛴', audioVi: 'Cái xe trượt scooter bé tập giữ thăng bằng!', spellingPhonics: 'Xờ - e - xe - XE' },
        ],
      },
      {
        letter: 'Ê',
        phonicsVi: 'Ê',
        nameVi: 'Chữ Ê',
        words: [
          { word: 'Quả Khế', emoji: '⭐', audioVi: 'Quả khế năm múi như ngôi sao năm cánh!', spellingPhonics: 'Khờ - ê - khê - sắc - KHẾ' },
          { word: 'Cái Ghế', emoji: '🪑', audioVi: 'Cái ghế gỗ ngay ngắn cho bé ngồi học!', spellingPhonics: 'Gờ - ê - ghê - sắc - GHẾ' },
          { word: 'Con Bê', emoji: '🐄', audioVi: 'Con bê con non nớt theo bước chân bò mẹ!', spellingPhonics: 'Bờ - ê - bê - BÊ' },
          { word: 'Chú Hề', emoji: '🤡', audioVi: 'Chú hề biểu diễn tung hứng vui nhộn!', spellingPhonics: 'Hờ - ê - hê - huyền - HỀ' },
          { word: 'Bắp Kê', emoji: '🌽', audioVi: 'Hạt kê vàng ươm nuôi bầy chim sẻ!', spellingPhonics: 'Cờ - ê - kê - KÊ' },
        ],
      },
      {
        letter: 'G',
        phonicsVi: 'Gờ',
        nameVi: 'Chữ Giê',
        words: [
          { word: 'Con Gà', emoji: '🐓', audioVi: 'Con gà trống có chiếc mào đỏ tươi!', spellingPhonics: 'Gờ - a - ga - huyền - GÀ' },
          { word: 'Cái Gương', emoji: '🪞', audioVi: 'Cái gương soi sáng khuôn mặt rạng rỡ!', spellingPhonics: 'Gờ - ương - gương - GƯƠNG' },
          { word: 'Đôi Găng', emoji: '🧤', audioVi: 'Đôi găng tay ấm áp giữ ấm ngón tay bé!', spellingPhonics: 'Gờ - ăng - găng - GĂNG' },
          { word: 'Cái Gối', emoji: '🛋️', audioVi: 'Cái gối bông êm ái cho giấc ngủ ngon!', spellingPhonics: 'Gờ - ôi - gôi - sắc - GỐI' },
          { word: 'Gấu Trúc', emoji: '🐼', audioVi: 'Bạn gấu trúc thích ăn lá trúc xanh!', spellingPhonics: 'Gờ - âu - gâu - sắc - GẤU' },
        ],
      },
    ],
  },

  // Thứ Tư: 5 chữ tiếp theo: H, I, K, L, M
  {
    dayIndex: 2,
    dayNameVi: 'Thứ Tư',
    dayShortVi: 'T4',
    themeVi: 'Khám Phá Thiên Nhiên: Chữ H, I, K, L, M',
    icon: '🎨',
    letters: [
      {
        letter: 'H',
        phonicsVi: 'Hờ',
        nameVi: 'Chữ Hát',
        words: [
          { word: 'Bông Hoa', emoji: '🌸', audioVi: 'Bông hoa hồng thơm ngát khoe sắc thắm!', spellingPhonics: 'Hờ - oa - hoa - HOA' },
          { word: 'Con Hổ', emoji: '🐯', audioVi: 'Con hổ dũng mãnh bảo vệ rừng xanh!', spellingPhonics: 'Hờ - ô - hô - hỏi - HỔ' },
          { word: 'Hộp Quà', emoji: '🎁', audioVi: 'Hộp quà xinh xắn gửi gắm yêu thương!', spellingPhonics: 'Hờ - ôp - hôp - nặng - HỘP' },
          { word: 'Quả Hồng', emoji: '🍅', audioVi: 'Quả hồng giòn thơm ngọt ngào mùa thu!', spellingPhonics: 'Hờ - ông - hồng - huyền - HỒNG' },
          { word: 'Hươu Cao Cổ', emoji: '🦒', audioVi: 'Bạn hươu cao cổ vươn cổ ăn lá trên cao!', spellingPhonics: 'Hờ - ươu - hươu - HƯƠU' },
        ],
      },
      {
        letter: 'I',
        phonicsVi: 'I',
        nameVi: 'Chữ I ngắn',
        words: [
          { word: 'Viên Bi', emoji: '🔮', audioVi: 'Viên bi thủy tinh lấp lánh sắc màu!', spellingPhonics: 'Bờ - i - bi - BI' },
          { word: 'Bút Chì', emoji: '✏️', audioVi: 'Cây bút chì cho bé tập tô vẽ chữ đẹp!', spellingPhonics: 'Chờ - i - chi - huyền - CHÌ' },
          { word: 'Cái Thìa', emoji: '🥄', audioVi: 'Cái thìa sạch bé xúc cơm gọn gàng!', spellingPhonics: 'Thờ - ia - thia - huyền - THÌA' },
          { word: 'Cái Kính', emoji: '👓', audioVi: 'Cái kính bảo vệ mắt sáng tinh anh!', spellingPhonics: 'Cờ - inh - kinh - sắc - KÍNH' },
          { word: 'Chú Khỉ', emoji: '🐒', audioVi: 'Chú khỉ thông minh leo trèo thoăn thoắt!', spellingPhonics: 'Khờ - i - khi - hỏi - KHỈ' },
        ],
      },
      {
        letter: 'K',
        phonicsVi: 'Ca',
        nameVi: 'Chữ Ca',
        words: [
          { word: 'Cây Kẹo', emoji: '🍭', audioVi: 'Cây kẹo que ngọt lịm sắc cầu vồng!', spellingPhonics: 'Cờ - eo - keo - nặng - KẸO' },
          { word: 'Cái Kéo', emoji: '✂️', audioVi: 'Cái kéo cắt giấy bé làm thủ công khéo léo!', spellingPhonics: 'Cờ - eo - keo - sắc - KÉO' },
          { word: 'Bánh Kem', emoji: '🎂', audioVi: 'Bánh kem sinh nhật ngọt ngào chúc mừng bé!', spellingPhonics: 'Cờ - em - kem - KEM' },
          { word: 'Cái Kèn', emoji: '🎺', audioVi: 'Cái kèn thổi vang khúc nhạc vui tươi!', spellingPhonics: 'Cờ - en - ken - huyền - KÈN' },
          { word: 'Cây Kim', emoji: '🪡', audioVi: 'Cây kim chỉ cho bà may áo mới!', spellingPhonics: 'Cờ - im - kim - KIM' },
        ],
      },
      {
        letter: 'L',
        phonicsVi: 'Lờ',
        nameVi: 'Chữ E-lờ',
        words: [
          { word: 'Quả Lê', emoji: '🍐', audioVi: 'Quả lê giòn tan ngọt lành thanh mát!', spellingPhonics: 'Lờ - ê - lê - LÊ' },
          { word: 'Lá Cây', emoji: '🍃', audioVi: 'Lá cây xanh rì đón ánh nắng chan hòa!', spellingPhonics: 'Lờ - a - la - sắc - LÁ' },
          { word: 'Con Lợn', emoji: '🐷', audioVi: 'Con lợn ủn ỉn béo tròn đáng yêu!', spellingPhonics: 'Lờ - ơn - lơn - nặng - LỢN' },
          { word: 'Lọ Hoa', emoji: '🏺', audioVi: 'Lọ hoa tươi tắn cắm trên bàn học!', spellingPhonics: 'Lờ - o - lo - hỏi - LỌ' },
          { word: 'Bông Lúa', emoji: '🌾', audioVi: 'Bông lúa vàng ươm trĩu hạt ấm no!', spellingPhonics: 'Lờ - ua - lua - sắc - LÚA' },
        ],
      },
      {
        letter: 'M',
        phonicsVi: 'Mờ',
        nameVi: 'Chữ Em-mờ',
        words: [
          { word: 'Con Mèo', emoji: '🐱', audioVi: 'Con mèo kêu meo meo bắt chuột tài ba!', spellingPhonics: 'Mờ - eo - meo - huyền - MÈO' },
          { word: 'Quả Mận', emoji: '🍎', audioVi: 'Quả mận chín đỏ mọng ngọt thơm ngon miệng!', spellingPhonics: 'Mờ - ân - mân - nặng - MẬN' },
          { word: 'Mặt Trời', emoji: '☀️', audioVi: 'Mặt trời tỏa nắng ấm sưởi ấm muôn loài!', spellingPhonics: 'Mờ - ăt - măt - nặng - MẶT' },
          { word: 'Cái Mũ', emoji: '🧢', audioVi: 'Cái mũ che nắng bảo vệ đầu bé mát mẻ!', spellingPhonics: 'Mờ - u - mu - ngã - MŨ' },
          { word: 'Măng Cụt', emoji: '🫐', audioVi: 'Trái măng cụt ngọt bùi múi trắng ngần!', spellingPhonics: 'Mờ - ăng - măng - CỤT' },
        ],
      },
    ],
  },

  // Thứ Năm: 5 chữ tiếp theo: N, O, Ô, Ơ, P
  {
    dayIndex: 3,
    dayNameVi: 'Thứ Năm',
    dayShortVi: 'T5',
    themeVi: 'Khéo Tay Rèn Luyện: Chữ N, O, Ô, Ơ, P',
    icon: '✍️',
    letters: [
      {
        letter: 'N',
        phonicsVi: 'Nờ',
        nameVi: 'Chữ En-nờ',
        words: [
          { word: 'Con Nai', emoji: '🦌', audioVi: 'Con nai vàng hiền lành dạo bước trong rừng!', spellingPhonics: 'Nờ - ai - nai - NAI' },
          { word: 'Quả Na', emoji: '🍈', audioVi: 'Quả na mở mắt thơm lừng ngọt ngào!', spellingPhonics: 'Nờ - a - na - NA' },
          { word: 'Cây Nấm', emoji: '🍄', audioVi: 'Cây nấm bung xòe như chiếc ô nhỏ!', spellingPhonics: 'Nờ - âm - nâm - sắc - NẤM' },
          { word: 'Ngôi Nhà', emoji: '🏡', audioVi: 'Ngôi nhà ấm cúng đầy ắp tiếng cười gia đình!', spellingPhonics: 'Nhờ - a - nha - huyền - NHÀ' },
          { word: 'Cái Nơ', emoji: '🎀', audioVi: 'Cái nơ hồng xinh cài trên mái tóc bé!', spellingPhonics: 'Nờ - ơ - nơ - NƠ' },
        ],
      },
      {
        letter: 'O',
        phonicsVi: 'O',
        nameVi: 'Chữ O',
        words: [
          { word: 'Con Ong', emoji: '🐝', audioVi: 'Con ong chăm chỉ bay tìm nhụy hoa làm mật!', spellingPhonics: 'O - ngừ - ong - ONG' },
          { word: 'Con Bò', emoji: '🐄', audioVi: 'Con bò sữa cho nguồn sữa ngon lành!', spellingPhonics: 'Bờ - o - bo - huyền - BÒ' },
          { word: 'Quả Nho', emoji: '🍇', audioVi: 'Chùm nho tím ngọt mọng từng hạt tròn!', spellingPhonics: 'Nhờ - o - nho - NHO' },
          { word: 'Con Cò', emoji: '🪿', audioVi: 'Con cò trắng phau đậu bên bờ ao!', spellingPhonics: 'Cờ - o - co - huyền - CÒ' },
          { word: 'Cái Lọ', emoji: '🏺', audioVi: 'Cái lọ gốm xinh xắn trang trí bàn học!', spellingPhonics: 'Lờ - o - lo - hỏi - LỌ' },
        ],
      },
      {
        letter: 'Ô',
        phonicsVi: 'Ô',
        nameVi: 'Chữ Ô',
        words: [
          { word: 'Cái Ô', emoji: '☂️', audioVi: 'Cái ô che mưa che nắng như chiếc nón chữ Ô!', spellingPhonics: 'Ô - Ô' },
          { word: 'Cột Cờ', emoji: '🚩', audioVi: 'Cột cờ tung bay lá cờ đỏ sao vàng!', spellingPhonics: 'Cờ - ô - cô - nặng - CỘT' },
          { word: 'Đồng Hồ', emoji: '⏱️', audioVi: 'Đồng hồ báo thức tích tắc nhắc việc!', spellingPhonics: 'Hờ - ô - hô - huyền - HỒ' },
          { word: 'Xe Ô Tô', emoji: '🚗', audioVi: 'Xe ô tô bon bon đưa bé đến trường!', spellingPhonics: 'Tờ - ô - tô - TÔ' },
          { word: 'Hộp Gỗ', emoji: '📦', audioVi: 'Hộp gỗ đựng đồ chơi ngăn nắp!', spellingPhonics: 'Gờ - ô - gô - ngã - GỖ' },
        ],
      },
      {
        letter: 'Ơ',
        phonicsVi: 'Ơ',
        nameVi: 'Chữ Ơ',
        words: [
          { word: 'Quả Ớt', emoji: '🌶️', audioVi: 'Quả ớt đỏ cay nồng thơm trong gian bếp!', spellingPhonics: 'Ơ - tờ - ớt - sắc - ỚT' },
          { word: 'Quả Bơ', emoji: '🥑', audioVi: 'Quả bơ sáp béo ngậy bổ dưỡng cho trí não bé!', spellingPhonics: 'Bờ - ơ - bơ - BƠ' },
          { word: 'Lá Cờ', emoji: '🇻🇳', audioVi: 'Lá cờ tổ quốc thắm tươi bay trong gió!', spellingPhonics: 'Cờ - ơ - cơ - huyền - CỜ' },
          { word: 'Đôi Vớ', emoji: '🧦', audioVi: 'Đôi vớ giữ ấm bàn chân bé mùa đông!', spellingPhonics: 'Vờ - ơ - vơ - sắc - VỚ' },
          { word: 'Cái Nơ', emoji: '🎀', audioVi: 'Cái nơ xinh xắn điểm tô trang phục!', spellingPhonics: 'Nờ - ơ - nơ - NƠ' },
        ],
      },
      {
        letter: 'P',
        phonicsVi: 'Pờ',
        nameVi: 'Chữ Pê',
        words: [
          { word: 'Đèn Pin', emoji: '🔦', audioVi: 'Đèn pin chiếu tia sáng rọi đường đi!', spellingPhonics: 'Pờ - in - pin - PIN' },
          { word: 'Pháo Hoa', emoji: '🎆', audioVi: 'Pháo hoa rực rỡ sắc màu đêm giao thừa!', spellingPhonics: 'Phờ - ao - phao - sắc - PHÁO' },
          { word: 'Bút Phấn', emoji: '🖍️', audioVi: 'Bút phấn trắng cô giáo viết chữ đẹp trên bảng!', spellingPhonics: 'Phờ - ân - phân - sắc - PHẤN' },
          { word: 'Bánh Pizza', emoji: '🍕', audioVi: 'Bánh pizza phô mai thơm ngon giòn rụm!', spellingPhonics: 'Pờ - i - pi - PIZZA' },
          { word: 'Đàn Piano', emoji: '🎹', audioVi: 'Đàn piano phát ra những thanh âm trong trẻo!', spellingPhonics: 'Pờ - ia - pia - PIANO' },
        ],
      },
    ],
  },

  // Thứ Sáu: 5 chữ tiếp theo: Q, R, S, T, U
  {
    dayIndex: 4,
    dayNameVi: 'Thứ Sáu',
    dayShortVi: 'T6',
    themeVi: 'Ghép Từ Tinh Anh: Chữ Q, R, S, T, U',
    icon: '🔤',
    letters: [
      {
        letter: 'Q',
        phonicsVi: 'Quờ',
        nameVi: 'Chữ Quy',
        words: [
          { word: 'Quả Quýt', emoji: '🍊', audioVi: 'Quả quýt mọng nước thơm mát ngọt lịm!', spellingPhonics: 'Quờ - yt - quyt - sắc - QUÝT' },
          { word: 'Cái Quạt', emoji: '🪭', audioVi: 'Cái quạt nan xua tan cái nóng trưa hè!', spellingPhonics: 'Quờ - at - quat - nặng - QUẠT' },
          { word: 'Quyển Sách', emoji: '📖', audioVi: 'Quyển sách mở ra chân trời tri thức mới!', spellingPhonics: 'Quờ - uyên - quyên - hỏi - QUYỂN' },
          { word: 'Quả Táo', emoji: '🍎', audioVi: 'Quả táo đỏ giòn thơm ngọt ngào!', spellingPhonics: 'Quờ - a - qua - hỏi - QUẢ' },
          { word: 'Quân Cờ', emoji: '♟️', audioVi: 'Quân cờ thông minh bé rèn luyện tư duy!', spellingPhonics: 'Quờ - ân - quân - CỜ' },
        ],
      },
      {
        letter: 'R',
        phonicsVi: 'Rờ',
        nameVi: 'Chữ E-rờ',
        words: [
          { word: 'Con Rùa', emoji: '🐢', audioVi: 'Bạn rùa chăm chỉ kiên trì từng bước một!', spellingPhonics: 'Rờ - ua - rua - huyền - RÙA' },
          { word: 'Con Rắn', emoji: '🐍', audioVi: 'Con rắn trườn mình uốn lượn nhịp nhàng!', spellingPhonics: 'Rờ - ăn - răn - sắc - RẮN' },
          { word: 'Rổ Quả', emoji: '🧺', audioVi: 'Rổ quả tươi ngon mẹ vừa hái trong vườn!', spellingPhonics: 'Rờ - ô - rô - hỏi - RỔ' },
          { word: 'Răng Trắng', emoji: '🦷', audioVi: 'Răng trắng xinh bé đánh răng sạch mỗi ngày!', spellingPhonics: 'Rờ - ăng - răng - TRẮNG' },
          { word: 'Rừng Cây', emoji: '🌲', audioVi: 'Rừng cây xanh tốt là ngôi nhà của muôn thú!', spellingPhonics: 'Rờ - ưng - rưng - huyền - RỪNG' },
        ],
      },
      {
        letter: 'S',
        phonicsVi: 'Sờ',
        nameVi: 'Chữ Ét-xì',
        words: [
          { word: 'Ngôi Sao', emoji: '⭐', audioVi: 'Ngôi sao lấp lánh tỏa sáng trên bầu trời đêm!', spellingPhonics: 'Sờ - ao - sao - SAO' },
          { word: 'Sư Tử', emoji: '🦁', audioVi: 'Bác sư tử dũng mãnh là chúa sơn lâm!', spellingPhonics: 'Sờ - ư - sư - TỬ' },
          { word: 'Sổ Tay', emoji: '📓', audioVi: 'Cuốn sổ tay bé ghi những điều hay lẽ phải!', spellingPhonics: 'Sờ - ô - sô - hỏi - SỔ' },
          { word: 'Sữa Tươi', emoji: '🥛', audioVi: 'Sữa tươi dinh dưỡng cho bé cao lớn khỏe mạnh!', spellingPhonics: 'Sờ - ưa - xưa - ngã - SỮA' },
          { word: 'Quả Su Su', emoji: '🥒', audioVi: 'Quả su su luộc chấm vừng bùi bùi thơm ngon!', spellingPhonics: 'Sờ - u - su - SU' },
        ],
      },
      {
        letter: 'T',
        phonicsVi: 'Tờ',
        nameVi: 'Chữ Tê',
        words: [
          { word: 'Tàu Hỏa', emoji: '🚂', audioVi: 'Tàu hỏa chạy xình xịch đưa khách đi xa!', spellingPhonics: 'Tờ - au - tau - huyền - TÀU' },
          { word: 'Trái Táo', emoji: '🍎', audioVi: 'Trái táo đỏ thơm ngon giòn ngọt mát!', spellingPhonics: 'Tờ - ao - tao - sắc - TÁO' },
          { word: 'Thuyền Buồm', emoji: '⛵', audioVi: 'Thuyền buồm căng gió lướt sóng ra khơi!', spellingPhonics: 'Thờ - uyên - thuyên - huyền - THUYỀN' },
          { word: 'Con Tôm', emoji: '🦐', audioVi: 'Con tôm búng càng tanh tách dưới sông!', spellingPhonics: 'Tờ - ôm - tôm - TÔM' },
          { word: 'Cái Tủ', emoji: '🗄️', audioVi: 'Cái tủ gỗ xếp quần áo gọn gàng ngăn nắp!', spellingPhonics: 'Tờ - u - tu - hỏi - TỦ' },
        ],
      },
      {
        letter: 'U',
        phonicsVi: 'U',
        nameVi: 'Chữ U',
        words: [
          { word: 'Cái Dù', emoji: '☂️', audioVi: 'Cái dù xòe rộng che chở nắng mưa cho bé!', spellingPhonics: 'Dờ - u - du - huyền - DÙ' },
          { word: 'Đu Đủ', emoji: '🍈', audioVi: 'Quả đu đủ ngọt bùi bổ mắt cho cả nhà!', spellingPhonics: 'Đờ - u - đu - ĐỦ' },
          { word: 'Củ Cà Rốt', emoji: '🥕', audioVi: 'Củ cà rốt cam tươi bạn thỏ thích mê!', spellingPhonics: 'Cờ - u - cu - hỏi - CỦ' },
          { word: 'Con Cừu', emoji: '🐑', audioVi: 'Bạn cừu có bộ lông trắng mềm mại như mây!', spellingPhonics: 'Cờ - ưu - cưu - huyền - CỪU' },
          { word: 'Hộp Sữa Chua', emoji: '🍶', audioVi: 'Hộp sữa chua thơm ngon mát lạnh tiêu hóa tốt!', spellingPhonics: 'Chờ - ua - chua - CHUA' },
        ],
      },
    ],
  },

  // Thứ Bảy: 5 chữ tiếp theo: Ư, V, X, Y, CH
  {
    dayIndex: 5,
    dayNameVi: 'Thứ Bảy',
    dayShortVi: 'T7',
    themeVi: 'Khám Phá & Đố Vui Nhanh: Chữ Ư, V, X, Y, CH',
    icon: '🚀',
    letters: [
      {
        letter: 'Ư',
        phonicsVi: 'Ư',
        nameVi: 'Chữ Ư',
        words: [
          { word: 'Con Hươu', emoji: '🦌', audioVi: 'Con hươu sao hiền lành chạy nhảy trong rừng!', spellingPhonics: 'Hờ - ươu - hươu - HƯƠU' },
          { word: 'Hộp Thư', emoji: '✉️', audioVi: 'Hộp thư xinh xắn gửi gắm những lời chúc tốt đẹp!', spellingPhonics: 'Thờ - ư - thư - THƯ' },
          { word: 'Mực Ống', emoji: '🦑', audioVi: 'Con mực bơi tung tăng dưới đáy biển sâu!', spellingPhonics: 'Mờ - ưc - mưc - nặng - MỰC' },
          { word: 'Bức Tranh', emoji: '🖼️', audioVi: 'Bức tranh sắc màu bé tự tay vẽ tặng mẹ!', spellingPhonics: 'Bờ - ưc - bưc - sắc - BỨC' },
          { word: 'Quả Dưa', emoji: '🍈', audioVi: 'Quả dưa lưới thơm lừng thanh mát ngày hè!', spellingPhonics: 'Dờ - ưa - dưa - DƯA' },
        ],
      },
      {
        letter: 'V',
        phonicsVi: 'Vờ',
        nameVi: 'Chữ Vê',
        words: [
          { word: 'Con Vịt', emoji: '🦆', audioVi: 'Con vịt trắng lạch bạch bơi trong hồ sen!', spellingPhonics: 'Vờ - it - vit - nặng - VỊT' },
          { word: 'Con Voi', emoji: '🐘', audioVi: 'Con voi to lớn uống nước bằng chiếc vòi dài!', spellingPhonics: 'Vờ - oi - voi - VOI' },
          { word: 'Ví Tiền', emoji: '👛', audioVi: 'Cái ví nhỏ gọn gàng cất giữ giấy tờ!', spellingPhonics: 'Vờ - i - vi - sắc - VÍ' },
          { word: 'Vòng Tay', emoji: '💍', audioVi: 'Chiếc vòng tay ngọc lấp lánh tặng bạn nhỏ!', spellingPhonics: 'Vờ - ong - vong - huyền - VÒNG' },
          { word: 'Khăn Vải', emoji: '🧣', audioVi: 'Khăn vải mềm mại lau tay sạch sẽ!', spellingPhonics: 'Vờ - ai - vai - hỏi - VẢI' },
        ],
      },
      {
        letter: 'X',
        phonicsVi: 'Xờ',
        nameVi: 'Chữ Ích-xì',
        words: [
          { word: 'Xe Xích Lô', emoji: '🚲', audioVi: 'Xe xích lô đưa khách dạo phố ngắm cảnh!', spellingPhonics: 'Xờ - ich - xich - sắc - XÍCH' },
          { word: 'Cái Xẻng', emoji: '🪵', audioVi: 'Cái xẻng nhỏ cho bé trồng hoa trong vườn!', spellingPhonics: 'Xờ - eng - xeng - hỏi - XẺNG' },
          { word: 'Xúc Xắc', emoji: '🎲', audioVi: 'Viên xúc xắc tròn số cho trò chơi vui vẻ!', spellingPhonics: 'Xờ - uc - xuc - sắc - XÚC' },
          { word: 'Xà Bông', emoji: '🧼', audioVi: 'Cục xà bông rửa tay thơm mát diệt vi khuẩn!', spellingPhonics: 'Xờ - a - xa - huyền - XÀ' },
          { word: 'Quả Xoài', emoji: '🥭', audioVi: 'Quả xoài cát chín vàng ngọt thơm đậm đà!', spellingPhonics: 'Xờ - oai - xoai - huyền - XOÀI' },
        ],
      },
      {
        letter: 'Y',
        phonicsVi: 'I',
        nameVi: 'Chữ I dài',
        words: [
          { word: 'Cái Yếm', emoji: '🎽', audioVi: 'Cái yếm ăn sạch sẽ cho bé dùng bữa ngon miệng!', spellingPhonics: 'Y - em - yêm - sắc - YẾM' },
          { word: 'Máy Bay', emoji: '✈️', audioVi: 'Máy bay vút bay trên nền trời xanh biếc!', spellingPhonics: 'Bờ - ay - bay - BAY' },
          { word: 'Cây Ý Dĩ', emoji: '🌾', audioVi: 'Hạt ý dĩ bổ dưỡng nấu chè thanh nhiệt!', spellingPhonics: 'Y - sắc - Ý' },
          { word: 'Tàu Thủy', emoji: '🚢', audioVi: 'Tàu thủy rẽ sóng vượt biển khơi bao la!', spellingPhonics: 'Thờ - uy - thuy - hỏi - THỦY' },
          { word: 'Hoa Hướng Dương', emoji: '🌻', audioVi: 'Hoa hướng dương luôn hướng về vầng thái dương!', spellingPhonics: 'Dờ - ương - dương - DƯƠNG' },
        ],
      },
      {
        letter: 'CH',
        phonicsVi: 'Chờ',
        nameVi: 'Chữ Chờ',
        words: [
          { word: 'Con Chó', emoji: '🐶', audioVi: 'Con chó trung thành vẫy đuôi mừng bé về!', spellingPhonics: 'Chờ - o - cho - sắc - CHÓ' },
          { word: 'Con Chuột', emoji: '🐭', audioVi: 'Bạn chuột nhắt nhanh nhẹn gặm hạt dẻ!', spellingPhonics: 'Chờ - uôt - chuôt - nặng - CHUỘT' },
          { word: 'Chiếc Chiếu', emoji: '🧺', audioVi: 'Chiếc chiếu cói mát lành trải trên sàn nhà!', spellingPhonics: 'Chờ - iêu - chiêu - sắc - CHIẾU' },
          { word: 'Cái Chén', emoji: '🥣', audioVi: 'Cái chén sứ trắng đựng cháo thơm mẹ nấu!', spellingPhonics: 'Chờ - en - chen - sắc - CHÉN' },
          { word: 'Chùm Nho', emoji: '🍇', audioVi: 'Chùm nho trĩu quả thơm ngọt trên giàn!', spellingPhonics: 'Chờ - um - chum - huyền - CHÙM' },
        ],
      },
    ],
  },

  // Chủ Nhật: 6 âm ghép còn lại: GH, GI, KH, NH, NG, TR (Tổng kết tuần!)
  {
    dayIndex: 6,
    dayNameVi: 'Chủ Nhật',
    dayShortVi: 'CN',
    themeVi: 'Tổng Kết Tuần & Âm Tiết Ghép: GH, GI, KH, NH, NG, TR',
    icon: '🎁',
    letters: [
      {
        letter: 'GH',
        phonicsVi: 'Gờ ghép',
        nameVi: 'Chữ Gờ kép',
        words: [
          { word: 'Cái Ghế', emoji: '🪑', audioVi: 'Cái ghế gỗ xinh xắn bé ngồi ngay ngắn!', spellingPhonics: 'Gờ - ê - ghê - sắc - GHẾ' },
          { word: 'Con Ghẹ', emoji: '🦀', audioVi: 'Con ghẹ biển xanh tươi thơm ngọt!', spellingPhonics: 'Gờ - e - ghe - nặng - GHẸ' },
          { word: 'Con Nghé', emoji: '🐂', audioVi: 'Con nghé con ngoan ngoãn theo chân mẹ!', spellingPhonics: 'Ngờ - e - nghe - sắc - NGHÉ' },
          { word: 'Cái Ghim', emoji: '📎', audioVi: 'Cái ghim kẹp giấy tài liệu gọn gàng!', spellingPhonics: 'Gờ - im - ghim - GHIM' },
          { word: 'Ghé Thăm', emoji: '🏡', audioVi: 'Bé ghé thăm ông bà vào ngày cuối tuần vui vẻ!', spellingPhonics: 'Gờ - e - ghe - sắc - GHÉ' },
        ],
      },
      {
        letter: 'GI',
        phonicsVi: 'Di',
        nameVi: 'Chữ Gi',
        words: [
          { word: 'Cái Giỏ', emoji: '🧺', audioVi: 'Cái giỏ mây đựng đầy hoa quả tươi ngon!', spellingPhonics: 'Giờ - o - gio - hỏi - GIỎ' },
          { word: 'Giường Ngủ', emoji: '🛏️', audioVi: 'Chiếc giường êm ái cho giấc ngủ ngọt ngào!', spellingPhonics: 'Giờ - ương - giương - huyền - GIƯỜNG' },
          { word: 'Đôi Giày', emoji: '👟', audioVi: 'Đôi giày thể thao cùng bé chạy nhảy linh hoạt!', spellingPhonics: 'Giờ - ay - giay - huyền - GIÀY' },
          { word: 'Giọt Nước', emoji: '💧', audioVi: 'Giọt sương sớm long lanh đọng trên ngọn cỏ!', spellingPhonics: 'Giờ - ot - giot - nặng - GIỌT' },
          { word: 'Cơn Gió', emoji: '💨', audioVi: 'Cơn gió mát lành thổi dịu cả buổi trưa hè!', spellingPhonics: 'Giờ - o - gio - sắc - GIÓ' },
        ],
      },
      {
        letter: 'KH',
        phonicsVi: 'Khờ',
        nameVi: 'Chữ Khờ',
        words: [
          { word: 'Con Khỉ', emoji: '🐒', audioVi: 'Bạn khỉ vui tính chuyền cành thoăn thoắt!', spellingPhonics: 'Khờ - i - khi - hỏi - KHỈ' },
          { word: 'Quả Khế', emoji: '⭐', audioVi: 'Quả khế chín vàng mọng nước vị thơm thanh!', spellingPhonics: 'Khờ - ê - khê - sắc - KHẾ' },
          { word: 'Khăn Len', emoji: '🧣', audioVi: 'Khăn len quàng cổ giữ ấm những ngày gió rét!', spellingPhonics: 'Khờ - ăn - khăn - LEN' },
          { word: 'Khay Quả', emoji: '🍽️', audioVi: 'Khay quả tươi ngon mời cả nhà cùng thưởng thức!', spellingPhonics: 'Khờ - ay - khay - QUẢ' },
          { word: 'Khủng Long', emoji: '🦖', audioVi: 'Bạn khủng long tốt bụng trong tranh hoạt hình!', spellingPhonics: 'Khờ - ung - khung - hỏi - KHỦNG' },
        ],
      },
      {
        letter: 'NH',
        phonicsVi: 'Nhờ',
        nameVi: 'Chữ Nhờ',
        words: [
          { word: 'Ngôi Nhà', emoji: '🏠', audioVi: 'Ngôi nhà xinh xắn chan hòa tình yêu thương!', spellingPhonics: 'Nhờ - a - nha - huyền - NHÀ' },
          { word: 'Nhẫn Vàng', emoji: '💍', audioVi: 'Chiếc nhẫn nhỏ lấp lánh tặng mẹ yêu quý!', spellingPhonics: 'Nhờ - ân - nhân - ngã - NHẪN' },
          { word: 'Nhành Cây', emoji: '🌿', audioVi: 'Nhành cây đâm chồi nảy lộc đón mùa xuân!', spellingPhonics: 'Nhờ - anh - nhanh - huyền - NHÀNH' },
          { word: 'Bạn Nhím', emoji: '🦔', audioVi: 'Bạn nhím con có bộ gai nhọn bảo vệ bản thân!', spellingPhonics: 'Nhờ - im - nhim - sắc - NHÍM' },
          { word: 'Nhạc Cụ', emoji: '🎵', audioVi: 'Bé chơi nhạc cụ ngân nga khúc ca yêu đời!', spellingPhonics: 'Nhờ - ac - nhac - nặng - NHẠC' },
        ],
      },
      {
        letter: 'NG',
        phonicsVi: 'Ngờ đơn',
        nameVi: 'Chữ Ngờ đơn',
        words: [
          { word: 'Con Ngựa', emoji: '🐴', audioVi: 'Con ngựa phi nhanh vó ngựa giòn giã phi đường xa!', spellingPhonics: 'Ngờ - ưa - ngưa - nặng - NGỰA' },
          { word: 'Ngôi Sao', emoji: '🌟', audioVi: 'Ngôi sao vàng năm cánh tỏa sáng trên cờ tổ quốc!', spellingPhonics: 'Ngờ - ôi - ngôi - SAO' },
          { word: 'Bắp Ngô', emoji: '🌽', audioVi: 'Bắp ngô vàng óng thơm ngon ngọt bùi mẹ luộc!', spellingPhonics: 'Ngờ - ô - ngô - NGÔ' },
          { word: 'Con Ngỗng', emoji: '🦢', audioVi: 'Con ngỗng trắng bơi lượn duyên dáng trên mặt hồ!', spellingPhonics: 'Ngờ - ông - ngông - ngã - NGỖNG' },
          { word: 'Ngón Tay', emoji: '🖐️', audioVi: 'Mười ngón tay ngoan bé giữ sạch sẽ tinh tươm!', spellingPhonics: 'Ngờ - on - ngon - sắc - NGÓN' },
        ],
      },
      {
        letter: 'TR',
        phonicsVi: 'Trờ',
        nameVi: 'Chữ Trờ',
        words: [
          { word: 'Trái Tim', emoji: '❤️', audioVi: 'Trái tim yêu thương luôn biết chia sẻ cùng bạn bè!', spellingPhonics: 'Trờ - ai - trai - sắc - TRÁI' },
          { word: 'Mặt Trời', emoji: '☀️', audioVi: 'Mặt trời chiếu những tia nắng vàng ấm áp!', spellingPhonics: 'Trờ - ơi - trơi - huyền - TRỜI' },
          { word: 'Bức Tranh', emoji: '🎨', audioVi: 'Bức tranh mùa xuân rực rỡ sắc hoa đua nở!', spellingPhonics: 'Trờ - anh - tranh - TRANH' },
          { word: 'Trái Cây', emoji: '🍎', audioVi: 'Đĩa trái cây tươi ngon bổ sung nhiều vitamin!', spellingPhonics: 'Trờ - ai - trai - sắc - TRÁI' },
          { word: 'Cây Trúc', emoji: '🎋', audioVi: 'Cây trúc thẳng tắp vươn mình kiên cường trước gió!', spellingPhonics: 'Trờ - uc - truc - sắc - TRÚC' },
        ],
      },
    ],
  },
];

export interface DayScheduleInfo {
  dayIndex: number; // 0 to 6
  dayNameVi: string;
  dayShortVi: string;
  themeVi: string;
  icon: string;
  currentLetters: string[];
  learningLessons: Lesson[];
  reviewItems: {
    id: string;
    type: 'flashcard' | 'quiz' | 'pronounce' | 'tracing';
    titleVi: string;
    subtitleVi: string;
    icon: string;
    rewardStars: number;
    lesson: Lesson;
  }[];
  pointGames: {
    id: string;
    gameType: Lesson['gameType'];
    titleVi: string;
    descVi: string;
    icon: string;
    rewardStars: number;
    color: string;
    lesson: Lesson;
  }[];
}

export interface DailyEnglishWord {
  wordEn: string;
  meaningVi: string;
  category: 'Con vật' | 'Màu sắc' | 'Đồ vật';
  emoji: string;
  phonicsEn: string;
  audioEn: string;
  audioVi: string;
}

export const DAILY_ENGLISH_VOCABULARY: Record<
  number,
  { themeVi: string; themeEn: string; words: DailyEnglishWord[] }
> = {
  // Thứ Hai (Day 0): Mèo, Chó, Màu Đỏ, Xanh & Quả Bóng
  0: {
    themeVi: 'Mèo, Chó, Màu Đỏ, Xanh & Quả Bóng',
    themeEn: 'Cat, Dog, Red, Blue & Ball',
    words: [
      {
        wordEn: 'Cat',
        meaningVi: 'Con Mèo',
        category: 'Con vật',
        emoji: '🐱',
        phonicsEn: '/kæt/',
        audioEn: 'Cat! A cute cat says meow meow!',
        audioVi: 'Cat nghĩa là Bạn Mèo đáng yêu kêu meo meo nè bé!',
      },
      {
        wordEn: 'Dog',
        meaningVi: 'Con Chó',
        category: 'Con vật',
        emoji: '🐶',
        phonicsEn: '/dɒɡ/',
        audioEn: 'Dog! A friendly puppy says woof woof!',
        audioVi: 'Dog là Bạn Chó con thân thiện vẫy đuôi mừng bé nhé!',
      },
      {
        wordEn: 'Red',
        meaningVi: 'Màu Đỏ',
        category: 'Màu sắc',
        emoji: '🔴',
        phonicsEn: '/red/',
        audioEn: 'Red! The color red is bright and warm!',
        audioVi: 'Red là Màu Đỏ tươi sáng như quả dâu tây ngọt ngào nè!',
      },
      {
        wordEn: 'Blue',
        meaningVi: 'Màu Xanh Dương',
        category: 'Màu sắc',
        emoji: '🔵',
        phonicsEn: '/bluː/',
        audioEn: 'Blue! Blue like the beautiful ocean and sky!',
        audioVi: 'Blue là Màu Xanh Dương của bầu trời và biển cả!',
      },
      {
        wordEn: 'Ball',
        meaningVi: 'Quả Bóng',
        category: 'Đồ vật',
        emoji: '⚽',
        phonicsEn: '/bɔːl/',
        audioEn: 'Ball! A round ball to kick and bounce!',
        audioVi: 'Ball là Quả Bóng tròn trĩnh để bé vui chơi rèn luyện sức khỏe!',
      },
    ],
  },

  // Thứ Ba (Day 1): Chim, Cá, Màu Vàng, Cuốn Sách & Cây Bút
  1: {
    themeVi: 'Chim, Cá, Màu Vàng, Cuốn Sách & Cây Bút',
    themeEn: 'Bird, Fish, Yellow, Book & Pen',
    words: [
      {
        wordEn: 'Bird',
        meaningVi: 'Con Chim',
        category: 'Con vật',
        emoji: '🐦',
        phonicsEn: '/bɜːd/',
        audioEn: 'Bird! A lovely bird flying high in the sky!',
        audioVi: 'Bird là Chú Chim hót véo von đón ngày mới!',
      },
      {
        wordEn: 'Fish',
        meaningVi: 'Con Cá',
        category: 'Con vật',
        emoji: '🐟',
        phonicsEn: '/fɪʃ/',
        audioEn: 'Fish! Little gold fish swims happily in the pond!',
        audioVi: 'Fish là Bạn Cá vàng bơi lội tung tăng dưới làn nước mát!',
      },
      {
        wordEn: 'Yellow',
        meaningVi: 'Màu Vàng',
        category: 'Màu sắc',
        emoji: '🟡',
        phonicsEn: '/ˈjel.əʊ/',
        audioEn: 'Yellow! Warm yellow sunshine lighting up the day!',
        audioVi: 'Yellow là Màu Vàng ấm áp rạng rỡ của ánh nắng ban mai!',
      },
      {
        wordEn: 'Book',
        meaningVi: 'Cuốn Sách',
        category: 'Đồ vật',
        emoji: '📚',
        phonicsEn: '/bʊk/',
        audioEn: 'Book! Reading an exciting book brings smart knowledge!',
        audioVi: 'Book là Cuốn Sách mở ra cả chân trời tri thức bổ ích!',
      },
      {
        wordEn: 'Pen',
        meaningVi: 'Cây Bút',
        category: 'Đồ vật',
        emoji: '🖊️',
        phonicsEn: '/pen/',
        audioEn: 'Pen! Write colorful letters and draw pictures with a pen!',
        audioVi: 'Pen là Cây Bút xinh để bé tập viết và vẽ tranh thật khéo!',
      },
    ],
  },

  // Thứ Tư (Day 2): Vịt, Heo, Màu Xanh Lá, Xe Hơi & Đồng Hồ
  2: {
    themeVi: 'Vịt, Heo, Màu Xanh Lá, Xe Hơi & Đồng Hồ',
    themeEn: 'Duck, Pig, Green, Car & Clock',
    words: [
      {
        wordEn: 'Duck',
        meaningVi: 'Con Vịt',
        category: 'Con vật',
        emoji: '🦆',
        phonicsEn: '/dʌk/',
        audioEn: 'Duck! Yellow duck says quack quack in the fresh pond!',
        audioVi: 'Duck là Bạn Vịt kêu cạp cạp bơi lội bên bờ ao!',
      },
      {
        wordEn: 'Pig',
        meaningVi: 'Con Heo',
        category: 'Con vật',
        emoji: '🐷',
        phonicsEn: '/pɪɡ/',
        audioEn: 'Pig! A cute pink pig playing happily in the sunshine!',
        audioVi: 'Pig là Bạn Heo hồng hào bụ bẫm rất đáng yêu nè!',
      },
      {
        wordEn: 'Green',
        meaningVi: 'Màu Xanh Lá',
        category: 'Màu sắc',
        emoji: '🟢',
        phonicsEn: '/ɡriːn/',
        audioEn: 'Green! Fresh green leaves and green grass!',
        audioVi: 'Green là Màu Xanh Lá tươi non mơn mởn của cỏ cây!',
      },
      {
        wordEn: 'Car',
        meaningVi: 'Xe Hơi',
        category: 'Đồ vật',
        emoji: '🚗',
        phonicsEn: '/kɑːr/',
        audioEn: 'Car! Beep beep, the little car drives smoothly on the street!',
        audioVi: 'Car là Chiếc Xe Hơi bon bon chở bé đi dạo phố!',
      },
      {
        wordEn: 'Clock',
        meaningVi: 'Đồng Hồ',
        category: 'Đồ vật',
        emoji: '⏰',
        phonicsEn: '/klɒk/',
        audioEn: 'Clock! Tick tock, the clock reminds us of great study time!',
        audioVi: 'Clock là Chiếc Đồng Hồ tích tắc nhắc bé thức dậy và học bài đúng giờ!',
      },
    ],
  },

  // Thứ Năm (Day 3): Thỏ, Khỉ, Màu Hồng, Cái Mũ & Ba Lô
  3: {
    themeVi: 'Thỏ, Khỉ, Màu Hồng, Cái Mũ & Ba Lô',
    themeEn: 'Rabbit, Monkey, Pink, Hat & Bag',
    words: [
      {
        wordEn: 'Rabbit',
        meaningVi: 'Con Thỏ',
        category: 'Con vật',
        emoji: '🐰',
        phonicsEn: '/ˈræb.ɪt/',
        audioEn: 'Rabbit! White rabbit with long ears loves sweet carrots!',
        audioVi: 'Rabbit là Bạn Thỏ trắng tai dài nhảy thoăn thoắt thích ăn cà rốt!',
      },
      {
        wordEn: 'Monkey',
        meaningVi: 'Con Khỉ',
        category: 'Con vật',
        emoji: '🐒',
        phonicsEn: '/ˈmʌŋ.ki/',
        audioEn: 'Monkey! Playful monkey swings from tree branches!',
        audioVi: 'Monkey là Chú Khỉ tinh nghịch leo trèo thoăn thoắt trên cành cây!',
      },
      {
        wordEn: 'Pink',
        meaningVi: 'Màu Hồng',
        category: 'Màu sắc',
        emoji: '🌸',
        phonicsEn: '/pɪŋk/',
        audioEn: 'Pink! Gentle pink flowers blooming beautifully!',
        audioVi: 'Pink là Màu Hồng dịu ngọt như đóa hoa kẹo bông xinh xắn!',
      },
      {
        wordEn: 'Hat',
        meaningVi: 'Cái Mũ / Nón',
        category: 'Đồ vật',
        emoji: '🧢',
        phonicsEn: '/hæt/',
        audioEn: 'Hat! Put on a pretty hat to shade from the warm sun!',
        audioVi: 'Hat là Chiếc Mũ xinh xắn che nắng che mưa cho bé!',
      },
      {
        wordEn: 'Bag',
        meaningVi: 'Chiếc Ba Lô',
        category: 'Đồ vật',
        emoji: '🎒',
        phonicsEn: '/bæɡ/',
        audioEn: 'Bag! Carry learning books and toys in the school bag!',
        audioVi: 'Bag là Chiếc Ba Lô đựng sách vở đến trường mỗi ngày!',
      },
    ],
  },

  // Thứ Sáu (Day 4): Voi, Sư Tử, Màu Cam, Cái Cốc & Cái Bàn
  4: {
    themeVi: 'Voi, Sư Tử, Màu Cam, Cái Cốc & Cái Bàn',
    themeEn: 'Elephant, Lion, Orange, Cup & Table',
    words: [
      {
        wordEn: 'Elephant',
        meaningVi: 'Con Voi',
        category: 'Con vật',
        emoji: '🐘',
        phonicsEn: '/ˈel.ɪ.fənt/',
        audioEn: 'Elephant! Giant elephant has big ears and a clever trunk!',
        audioVi: 'Elephant là Chú Voi hiền lành to lớn có chiếc vòi dài khéo léo!',
      },
      {
        wordEn: 'Lion',
        meaningVi: 'Sư Tử',
        category: 'Con vật',
        emoji: '🦁',
        phonicsEn: '/ˈlaɪ.ən/',
        audioEn: 'Lion! Strong lion is the brave king of animals!',
        audioVi: 'Lion là Bác Sư Tử dũng cảm với chiếc bờm vàng oai vệ!',
      },
      {
        wordEn: 'Orange',
        meaningVi: 'Màu Cam',
        category: 'Màu sắc',
        emoji: '🟠',
        phonicsEn: '/ˈɒr.ɪndʒ/',
        audioEn: 'Orange! Bright orange like a sweet ripe orange fruit!',
        audioVi: 'Orange là Màu Cam rực rỡ và ngọt ngào như quả cam mọng nước!',
      },
      {
        wordEn: 'Cup',
        meaningVi: 'Cái Cốc / Ly',
        category: 'Đồ vật',
        emoji: '🥛',
        phonicsEn: '/kʌp/',
        audioEn: 'Cup! Drink fresh warm milk every day from a clean cup!',
        audioVi: 'Cup là Chiếc Cốc uống nước hoặc uống sữa thơm ngon giúp bé mau lớn!',
      },
      {
        wordEn: 'Table',
        meaningVi: 'Cái Bàn',
        category: 'Đồ vật',
        emoji: '🪑',
        phonicsEn: '/ˈteɪ.bəl/',
        audioEn: 'Table! Sit nicely at the table to draw and read books!',
        audioVi: 'Table là Cái Bàn học tập ngăn nắp và sạch sẽ của bé!',
      },
    ],
  },

  // Thứ Bảy (Day 5): Gấu, Ếch, Màu Tím, Chiếc Ghế & Giường Ngủ
  5: {
    themeVi: 'Gấu, Ếch, Màu Tím, Chiếc Ghế & Giường Ngủ',
    themeEn: 'Bear, Frog, Purple, Chair & Bed',
    words: [
      {
        wordEn: 'Bear',
        meaningVi: 'Con Gấu',
        category: 'Con vật',
        emoji: '🐻',
        phonicsEn: '/beər/',
        audioEn: 'Bear! Fuzzy bear loves honey and rests in the forest cave!',
        audioVi: 'Bear là Bạn Gấu tròn xoe thích ăn mật ong ngọt lịm!',
      },
      {
        wordEn: 'Frog',
        meaningVi: 'Con Ếch',
        category: 'Con vật',
        emoji: '🐸',
        phonicsEn: '/frɒɡ/',
        audioEn: 'Frog! Little green frog hops around green lotus leaves!',
        audioVi: 'Frog là Bạn Ếch xanh nhảy nhót trên lá sen đón cơn mưa rào!',
      },
      {
        wordEn: 'Purple',
        meaningVi: 'Màu Tím',
        category: 'Màu sắc',
        emoji: '🟣',
        phonicsEn: '/ˈpɜː.pəl/',
        audioEn: 'Purple! Yummy purple grapes hanging on the vine!',
        audioVi: 'Purple là Màu Tím mộng mơ của chùm nho chín mọng thơm ngon!',
      },
      {
        wordEn: 'Chair',
        meaningVi: 'Chiếc Ghế',
        category: 'Đồ vật',
        emoji: '🪑',
        phonicsEn: '/tʃeər/',
        audioEn: 'Chair! Sit upright on your chair to study well!',
        audioVi: 'Chair là Chiếc Ghế ngồi êm ái cho bé ngồi học và vẽ tranh!',
      },
      {
        wordEn: 'Bed',
        meaningVi: 'Chiếc Giường',
        category: 'Đồ vật',
        emoji: '🛏️',
        phonicsEn: '/bed/',
        audioEn: 'Bed! Go to sleep peacefully on a soft cozy bed!',
        audioVi: 'Bed là Chiếc Giường êm ru đưa bé vào giấc ngủ ngon và mơ đẹp!',
      },
    ],
  },

  // Chủ Nhật (Day 6): Gấu Trúc, Màu Trắng, Đen, Đôi Giày & Cánh Cửa
  6: {
    themeVi: 'Gấu Trúc, Sắc Trắng Đen, Đôi Giày & Cánh Cửa',
    themeEn: 'Panda, White, Black, Shoes & Door',
    words: [
      {
        wordEn: 'Panda',
        meaningVi: 'Gấu Trúc',
        category: 'Con vật',
        emoji: '🐼',
        phonicsEn: '/ˈpæn.də/',
        audioEn: 'Panda! Cute panda has black and white fur, chewing green bamboo!',
        audioVi: 'Panda là Bạn Gấu Trúc trắng đen đáng yêu thích ăn lá trúc non!',
      },
      {
        wordEn: 'White',
        meaningVi: 'Màu Trắng',
        category: 'Màu sắc',
        emoji: '⚪',
        phonicsEn: '/waɪt/',
        audioEn: 'White! Soft white clouds floating in the bright sky!',
        audioVi: 'White là Màu Trắng tinh khôi như mây trời bồng bềnh buổi sáng!',
      },
      {
        wordEn: 'Black',
        meaningVi: 'Màu Đen',
        category: 'Màu sắc',
        emoji: '⚫',
        phonicsEn: '/blæk/',
        audioEn: 'Black! The nighttime sky is black and full of sparkling stars!',
        audioVi: 'Black là Màu Đen của bầu trời đêm lung linh ngàn vì sao sáng!',
      },
      {
        wordEn: 'Shoes',
        meaningVi: 'Đôi Giày',
        category: 'Đồ vật',
        emoji: '👟',
        phonicsEn: '/ʃuːz/',
        audioEn: 'Shoes! Put on shoes to walk, run and play safely outdoors!',
        audioVi: 'Shoes là Đôi Giày xinh nâng niu bước chân bé khi chạy nhảy!',
      },
      {
        wordEn: 'Door',
        meaningVi: 'Cánh Cửa',
        category: 'Đồ vật',
        emoji: '🚪',
        phonicsEn: '/dɔːr/',
        audioEn: 'Door! Open the door to welcome your loved ones!',
        audioVi: 'Door là Cánh Cửa mở ra những điều kỳ diệu và niềm vui cuộc sống!',
      },
    ],
  },
};

export function getTodayDayIndex(): number {
  const day = new Date().getDay(); // 0 is Sunday, 1 is Monday ...
  return day === 0 ? 6 : day - 1; // 0 = Mon, 6 = Sun
}

/**
 * Builds synchronized lessons tailored to today's 5 letters
 */
export function getDaySchedule(ageGroup: AgeGroup, dayIndex: number): DayScheduleInfo {
  const safeDay = Math.max(0, Math.min(6, dayIndex));
  const moduleInfo = DAILY_36_LETTERS_MODULES[safeDay];
  const letterList = moduleInfo.letters.map((l) => l.letter);

  // 1. Phonics & Letter/Word Lesson adapted by Age Group
  let todayLettersItems: LessonItem[] = [];
  let vnTitle = `Chữ Cái Hôm Nay: ${letterList.join(', ')}`;
  let vnSubtitle = `Học 5 chữ cái tiêu chuẩn (${letterList.join(', ')}) và nhận biết hình ảnh trực quan!`;

  if (ageGroup === '1-3' || ageGroup === '1-2' || ageGroup === '3-4') {
    // Age 1-3: Nhận biết mặt chữ to, âm thanh cơ bản & đồ vật thân thuộc
    todayLettersItems = moduleInfo.letters.map((l) => {
      const primaryWord = l.words[0];
      return {
        id: `day-${safeDay}-let-${l.letter}`,
        display: l.letter,
        subTextVi: `${l.nameVi} • ${primaryWord.word}`,
        subTextEn: `Letter ${l.letter}`,
        audioTextVi: `Chữ ${l.letter}. Đọc là ${l.phonicsVi}! Ví dụ: ${primaryWord.word}!`,
        audioTextEn: `Letter ${l.letter}`,
        emojiOrImage: primaryWord.emoji,
        category: 'alphabet',
      };
    });
    vnTitle = `Làm Quen Chữ Cái (1-3 Tuổi): ${letterList.join(', ')}`;
    vnSubtitle = `Bé xem mặt chữ to, nghe cô giáo phát âm chuẩn và làm quen đồ vật thân thuộc!`;
  } else if (ageGroup === '4-6' || ageGroup === '4-5') {
    // Age 4-6: Tiền tiểu học - Tập ghép vần, đánh vần từng từ hoàn chỉnh
    todayLettersItems = moduleInfo.letters.map((l) => {
      const w = l.words[1] || l.words[0];
      const spelling = w.spellingPhonics || `${l.phonicsVi} - ${w.word}`;
      return {
        id: `day-${safeDay}-let-${l.letter}`,
        display: `${l.letter} • ${w.word.split(' ').pop() || w.word}`,
        subTextVi: `${l.nameVi}: ${w.word}`,
        subTextEn: `Spelling ${w.word}`,
        audioTextVi: `Chữ ${l.letter}. Đánh vần: ${spelling}!`,
        audioTextEn: `Letter ${l.letter}`,
        emojiOrImage: w.emoji,
        category: 'spelling',
      };
    });
    vnTitle = `Ghép Vần & Đánh Vần (4-6 Tuổi): ${letterList.join(', ')}`;
    vnSubtitle = `Tiền tiểu học: Bé luyện phát âm khẩu hình chuẩn và đánh vần từng tiếng!`;
  } else if (ageGroup === '7-9') {
    // Age 7-9: Lớp 1-3 - Mở rộng vốn từ vựng, câu hoàn chỉnh, từ đồng nghĩa/trái nghĩa
    todayLettersItems = moduleInfo.letters.map((l) => {
      const w = l.words[2] || l.words[0];
      return {
        id: `day-${safeDay}-let-${l.letter}`,
        display: w.word,
        subTextVi: `Mở rộng từ ngữ chứa chữ ${l.letter}: ${w.word}`,
        subTextEn: `Vocabulary: ${w.word}`,
        audioTextVi: `Từ ngữ chữ ${l.letter}: ${w.word}. ${w.audioVi}`,
        audioTextEn: `Word: ${w.word}`,
        emojiOrImage: w.emoji,
        category: 'vocabulary',
      };
    });
    vnTitle = `Luyện Từ & Câu Tiểu Học (7-9 Tuổi): Chữ ${letterList.join(', ')}`;
    vnSubtitle = `Tiểu học: Mở rộng vốn từ ngữ phong phú, luyện đọc lưu loát và đặt câu hoàn chỉnh!`;
  } else {
    // Age 10-12: Lớp 4-5 - Tiếng Việt nâng cao, thành ngữ, diễn đạt phong phú
    todayLettersItems = moduleInfo.letters.map((l) => {
      const w = l.words[3] || l.words[0];
      return {
        id: `day-${safeDay}-let-${l.letter}`,
        display: w.word,
        subTextVi: `Chủ đề nâng cao: Khám phá từ vựng "${w.word}"`,
        subTextEn: `Advanced concept: ${w.word}`,
        audioTextVi: `Từ vựng nâng cao: ${w.word}. ${w.audioVi}`,
        audioTextEn: `Advanced word: ${w.word}`,
        emojiOrImage: w.emoji,
        category: 'advanced',
      };
    });
    vnTitle = `Tiếng Việt Nâng Cao (10-12 Tuổi): Khám Phá ${letterList.join(', ')}`;
    vnSubtitle = `Luyện tư duy ngôn ngữ, hiểu sâu ngữ nghĩa và làm giàu vốn từ biểu cảm!`;
  }

  const dailyVietnameseLesson: Lesson = {
    id: `daily-vi-day-${safeDay}`,
    subjectId: 'vietnamese',
    ageGroup: ageGroup,
    titleVi: vnTitle,
    titleEn: `Daily Vietnamese Lesson`,
    subtitleVi: vnSubtitle,
    subtitleEn: `Learn standard letters and vocabulary`,
    difficulty: ageGroup === '1-3' ? 'easy' : ageGroup === '4-6' ? 'easy' : 'medium',
    gameType: 'flashcard',
    starsRequired: 0,
    rewardStars: 5,
    icon: '🅰️',
    accentColor: 'from-rose-500 to-pink-500',
    items: todayLettersItems,
  };

  // 2. Daily Math Lesson adapted by Age Group with Precise Pedagogy
  let mathItems: LessonItem[] = [];
  let mathTitle = `Toán Tư Duy Ngày ${safeDay + 1}`;
  let mathSubtitle = `Làm quen toán học phù hợp lứa tuổi!`;

  if (ageGroup === '1-3' || ageGroup === '1-2' || ageGroup === '3-4') {
    // 1-3 tuổi: Học đếm số chia theo mỗi ngày, đủ 7 ngày đếm được đến 100!
    // Ngày 0 (T2): 1 - 15
    // Ngày 1 (T3): 16 - 30
    // Ngày 2 (T4): 31 - 45
    // Ngày 3 (T5): 46 - 60
    // Ngày 4 (T6): 61 - 75
    // Ngày 5 (T7): 76 - 90
    // Ngày 6 (CN): 91 - 100 & Tổng kết 1 - 100
    const startNum = safeDay === 0 ? 1 : safeDay === 1 ? 16 : safeDay === 2 ? 31 : safeDay === 3 ? 46 : safeDay === 4 ? 61 : safeDay === 5 ? 76 : 91;
    const endNum = safeDay === 6 ? 100 : startNum + 14;

    // Pick 5 representative counting checkpoints for quiz interaction
    const step = Math.max(1, Math.floor((endNum - startNum) / 4));
    const checkpoints = [
      startNum,
      startNum + step,
      startNum + step * 2,
      startNum + step * 3,
      endNum,
    ];

    mathItems = checkpoints.map((num, idx) => ({
      id: `math-count-${safeDay}-${num}`,
      display: `Số ${num}`,
      subTextVi: `Bé tập đếm số: ${num} (Chặng ${startNum} - ${endNum})`,
      subTextEn: `Count number ${num}`,
      audioTextVi: `Số ${num}! Bé cùng đếm to theo cô giáo nhé: ${num}!`,
      audioTextEn: `Number ${num}`,
      emojiOrImage: idx % 2 === 0 ? '🔢' : '⭐',
      extraOptions: [
        `Số ${num}`,
        `Số ${num + 2}`,
        `Số ${Math.max(1, num - 1)}`,
      ],
    }));

    mathTitle = `Tập Đếm Số (1-3 Tuổi): Số ${startNum} đến ${endNum}`;
    mathSubtitle = `Lộ trình 7 ngày đếm đến 100: Hôm nay bé khám phá số ${startNum} đến ${endNum}!`;
  } else if (ageGroup === '4-6' || ageGroup === '4-5') {
    // 4-6 tuổi: Học phép tính cộng, trừ đơn giản trong phạm vi 10, mỗi ngày 1 bài, hướng dẫn đếm ngón tay 🖐️
    // Rotate operations and numbers based on safeDay
    const fingerGuides = [
      { a: 2, b: 3, op: '+', res: 5, fingers: '🖐️ (Xòe 2 ngón tay rồi xòe thêm 3 ngón tay)' },
      { a: 4, b: 2, op: '+', res: 6, fingers: '🖐️☝️ (Xòe 4 ngón tay rồi xòe thêm 2 ngón tay)' },
      { a: 5, b: 3, op: '+', res: 8, fingers: '🖐️🤟 (Xòe 5 ngón một bàn tay rồi thêm 3 ngón)' },
      { a: 5, b: 2, op: '-', res: 3, fingers: '🖐️ (Xòe 5 ngón tay rồi cụp bớt 2 ngón tay lại)' },
      { a: 6, b: 3, op: '-', res: 3, fingers: '🖐️☝️ (Xòe 6 ngón tay rồi gập bớt 3 ngón tay lại)' },
      { a: 4, b: 4, op: '+', res: 8, fingers: '✌️✌️ (Xòe 4 ngón mỗi bàn tay bé đếm nhé)' },
      { a: 7, b: 2, op: '-', res: 5, fingers: '🖐️✌️ (Xòe 7 ngón tay rồi cụp bớt 2 ngón lại)' },
    ];

    const currentGuide = fingerGuides[safeDay % fingerGuides.length];
    const isPlus = currentGuide.op === '+';

    mathItems = [
      {
        id: `math-finger-${safeDay}-1`,
        display: `${currentGuide.a} ${currentGuide.op} ${currentGuide.b} = ?`,
        subTextVi: `Hướng dẫn đếm ngón tay: ${currentGuide.fingers}`,
        subTextEn: `Finger math in range 10`,
        audioTextVi: `Bé cùng dùng ngón tay tính nhé: ${currentGuide.a} ${isPlus ? 'cộng' : 'trừ'} ${currentGuide.b} bằng mấy? ${currentGuide.fingers}`,
        audioTextEn: `${currentGuide.a} ${currentGuide.op} ${currentGuide.b}`,
        emojiOrImage: '🖐️',
        extraOptions: [
          `Bằng ${currentGuide.res}`,
          `Bằng ${currentGuide.res + 1}`,
          `Bằng ${Math.max(1, currentGuide.res - 1)}`,
        ],
      },
      {
        id: `math-finger-${safeDay}-2`,
        display: `${isPlus ? currentGuide.a + 1 : currentGuide.a} ${currentGuide.op} 1 = ?`,
        subTextVi: `Đếm ngón tay: ${isPlus ? currentGuide.a + 1 : currentGuide.a} ${isPlus ? 'cộng' : 'bớt'} 1`,
        subTextEn: `Add/Subtract 1`,
        audioTextVi: `Tiếp tục đếm ngón tay nào: ${isPlus ? currentGuide.a + 1 : currentGuide.a} ${isPlus ? 'thêm 1 ngón nữa' : 'bớt đi 1 ngón'} là mấy bé ơi?`,
        audioTextEn: `Count fingers`,
        emojiOrImage: '✌️',
        extraOptions: [
          `Bằng ${isPlus ? currentGuide.a + 2 : currentGuide.a - 1}`,
          `Bằng ${isPlus ? currentGuide.a + 3 : currentGuide.a}`,
          `Bằng ${Math.max(1, isPlus ? currentGuide.a : currentGuide.a - 2)}`,
        ],
      },
      {
        id: `math-finger-${safeDay}-3`,
        display: `3 + 2 = ?`,
        subTextVi: `Xòe bàn tay: 3 ngón tay thêm 2 ngón tay`,
        subTextEn: `3 plus 2`,
        audioTextVi: `Thử thách đếm ngón tay: 3 ngón tay thêm 2 ngón tay là trọn vẹn 1 bàn tay gồm 5 ngón!`,
        audioTextEn: `3 + 2 = 5`,
        emojiOrImage: '✋',
        extraOptions: [`Bằng 5`, `Bằng 4`, `Bằng 6`],
      },
      {
        id: `math-finger-${safeDay}-4`,
        display: `5 - 1 = ?`,
        subTextVi: `Cụp bớt 1 ngón: 5 ngón tay gập 1 ngón`,
        subTextEn: `5 minus 1`,
        audioTextVi: `Bé xòe 5 ngón tay của một bàn tay, gập bớt 1 ngón lại xem còn mấy ngón nhé?`,
        audioTextEn: `5 - 1 = 4`,
        emojiOrImage: '🖐️',
        extraOptions: [`Bằng 4`, `Bằng 3`, `Bằng 5`],
      },
      {
        id: `math-finger-${safeDay}-5`,
        display: `4 + 1 = ?`,
        subTextVi: `Đếm ngón tay: 4 ngón tay thêm 1 ngón tay`,
        subTextEn: `4 plus 1`,
        audioTextVi: `4 ngón tay thêm 1 ngón tay nữa là bằng mấy nào bé yêu?`,
        audioTextEn: `4 + 1 = 5`,
        emojiOrImage: '🖐️',
        extraOptions: [`Bằng 5`, `Bằng 6`, `Bằng 3`],
      },
    ];

    mathTitle = `Cộng Trừ Đếm Ngón Tay (4-6 Tuổi): Phạm Vi 10`;
    mathSubtitle = `Học tính cộng trừ trực quan: Hướng dẫn bé xòe và gập ngón tay trong phạm vi 10!`;
  } else if (ageGroup === '7-9') {
    // 7-9 tuổi: Học phép tính cộng 2 chữ số và Bảng cửu chương
    // safeDay decides which multiplication table to focus on (bảng 2, 3, 4, 5, 6, 7, 8, 9)
    const tableNum = (safeDay % 6) + 2; // e.g. 2, 3, 4, 5, 6, 7
    const addA = 24 + safeDay * 5; // e.g. 24, 29, 34...
    const addB = 15 + safeDay * 3; // e.g. 15, 18, 21...
    const addSum = addA + addB;

    const addC = 36 + safeDay * 4;
    const addD = 27;
    const addSum2 = addC + addD;

    mathItems = [
      {
        id: `math-7-9-add1-${safeDay}`,
        display: `${addA} + ${addB} = ?`,
        subTextVi: `Phép cộng 2 chữ số: ${addA} + ${addB}`,
        subTextEn: `2-digit addition: ${addA} + ${addB}`,
        audioTextVi: `Phép tính cộng hai chữ số: ${addA} cộng ${addB} bằng bao nhiêu? Bé đặt tính theo hàng đơn vị và hàng chục nhé!`,
        audioTextEn: `${addA} plus ${addB}`,
        emojiOrImage: '➕',
        extraOptions: [
          `${addSum}`,
          `${addSum + 2}`,
          `${addSum - 2}`,
        ],
      },
      {
        id: `math-7-9-mul1-${safeDay}`,
        display: `${tableNum} × 3 = ?`,
        subTextVi: `Bảng cửu chương ${tableNum}: ${tableNum} nhân 3`,
        subTextEn: `Multiplication table of ${tableNum}`,
        audioTextVi: `Bảng cửu chương ${tableNum}: ${tableNum} nhân 3 bằng bao nhiêu?`,
        audioTextEn: `${tableNum} times 3`,
        emojiOrImage: '✖️',
        extraOptions: [
          `${tableNum * 3}`,
          `${tableNum * 3 + tableNum}`,
          `${Math.max(1, tableNum * 3 - tableNum)}`,
        ],
      },
      {
        id: `math-7-9-add2-${safeDay}`,
        display: `${addC} + ${addD} = ?`,
        subTextVi: `Phép cộng 2 chữ số có nhớ: ${addC} + ${addD}`,
        subTextEn: `2-digit addition with carry`,
        audioTextVi: `Phép cộng hai chữ số: ${addC} cộng ${addD} bằng bao nhiêu?`,
        audioTextEn: `${addC} + ${addD}`,
        emojiOrImage: '➕',
        extraOptions: [
          `${addSum2}`,
          `${addSum2 + 10}`,
          `${addSum2 - 1}`,
        ],
      },
      {
        id: `math-7-9-mul2-${safeDay}`,
        display: `${tableNum} × 6 = ?`,
        subTextVi: `Bảng cửu chương ${tableNum}: ${tableNum} nhân 6`,
        subTextEn: `Multiplication table of ${tableNum}`,
        audioTextVi: `Bảng cửu chương ${tableNum}: ${tableNum} nhân 6 bằng mấy?`,
        audioTextEn: `${tableNum} times 6`,
        emojiOrImage: '✖️',
        extraOptions: [
          `${tableNum * 6}`,
          `${tableNum * 5}`,
          `${tableNum * 7}`,
        ],
      },
      {
        id: `math-7-9-mul3-${safeDay}`,
        display: `${tableNum} × 9 = ?`,
        subTextVi: `Bảng cửu chương ${tableNum}: ${tableNum} nhân 9`,
        subTextEn: `Multiplication table of ${tableNum}`,
        audioTextVi: `Bảng cửu chương ${tableNum}: ${tableNum} nhân 9 bằng bao nhiêu nào?`,
        audioTextEn: `${tableNum} times 9`,
        emojiOrImage: '✖️',
        extraOptions: [
          `${tableNum * 9}`,
          `${tableNum * 8}`,
          `${tableNum * 9 + tableNum}`,
        ],
      },
    ];

    mathTitle = `Cộng 2 Chữ Số & Bảng Cửu Chương ${tableNum} (7-9 Tuổi)`;
    mathSubtitle = `Rèn luyện đặt tính cộng 2 chữ số và học thuộc bảng cửu chương ${tableNum}!`;
  } else {
    // 10-12 tuổi: Phép tính cộng, trừ, nhân, chia 2 chữ số
    const num1 = 48 + safeDay * 4;
    const num2 = 25 + safeDay * 3;
    const addAns = num1 + num2;

    const sub1 = 86 + safeDay * 2;
    const sub2 = 39 + safeDay;
    const subAns = sub1 - sub2;

    const mul1 = 14 + safeDay;
    const mul2 = 12;
    const mulAns = mul1 * mul2;

    const divFactor = 12 + safeDay;
    const divDividend = divFactor * 4; // e.g. 48, 52...
    const divAns = 4;

    mathItems = [
      {
        id: `math-10-12-add-${safeDay}`,
        display: `${num1} + ${num2} = ?`,
        subTextVi: `Phép cộng 2 chữ số: ${num1} + ${num2}`,
        subTextEn: `2-digit addition`,
        audioTextVi: `Phép tính cộng hai chữ số: ${num1} cộng ${num2} bằng bao nhiêu?`,
        audioTextEn: `${num1} + ${num2}`,
        emojiOrImage: '➕',
        extraOptions: [
          `${addAns}`,
          `${addAns + 10}`,
          `${addAns - 2}`,
        ],
      },
      {
        id: `math-10-12-sub-${safeDay}`,
        display: `${sub1} - ${sub2} = ?`,
        subTextVi: `Phép trừ 2 chữ số có nhớ: ${sub1} - ${sub2}`,
        subTextEn: `2-digit subtraction with borrow`,
        audioTextVi: `Phép tính trừ hai chữ số: ${sub1} trừ ${sub2} bằng bao nhiêu?`,
        audioTextEn: `${sub1} - ${sub2}`,
        emojiOrImage: '➖',
        extraOptions: [
          `${subAns}`,
          `${subAns + 5}`,
          `${subAns - 10}`,
        ],
      },
      {
        id: `math-10-12-mul-${safeDay}`,
        display: `${mul1} × ${mul2} = ?`,
        subTextVi: `Phép nhân 2 chữ số: ${mul1} × ${mul2}`,
        subTextEn: `2-digit multiplication: ${mul1} × ${mul2}`,
        audioTextVi: `Phép tính nhân hai chữ số: ${mul1} nhân ${mul2} bằng bao nhiêu? Bé đặt tính nhân hai hàng nhé!`,
        audioTextEn: `${mul1} * ${mul2}`,
        emojiOrImage: '✖️',
        extraOptions: [
          `${mulAns}`,
          `${mulAns + 12}`,
          `${mulAns - 24}`,
        ],
      },
      {
        id: `math-10-12-div-${safeDay}`,
        display: `${divDividend} ÷ ${divFactor} = ?`,
        subTextVi: `Phép chia cho số có 2 chữ số: ${divDividend} ÷ ${divFactor}`,
        subTextEn: `2-digit division: ${divDividend} / ${divFactor}`,
        audioTextVi: `Phép tính chia cho số có hai chữ số: ${divDividend} chia cho ${divFactor} bằng mấy?`,
        audioTextEn: `${divDividend} / ${divFactor}`,
        emojiOrImage: '➗',
        extraOptions: [
          `${divAns}`,
          `${divAns + 1}`,
          `${divAns + 2}`,
        ],
      },
      {
        id: `math-10-12-mixed-${safeDay}`,
        display: `(${num1} - ${num2}) + ${mul1} = ?`,
        subTextVi: `Biểu thức kết hợp phép tính hai chữ số`,
        subTextEn: `Order of operations`,
        audioTextVi: `Tính giá trị biểu thức: mở ngoặc ${num1} trừ ${num2} đóng ngoặc, rồi cộng thêm ${mul1} bằng mấy?`,
        audioTextEn: `Mixed operations`,
        emojiOrImage: '🧠',
        extraOptions: [
          `${(num1 - num2) + mul1}`,
          `${(num1 - num2) + mul1 + 5}`,
          `${(num1 - num2) + mul1 - 10}`,
        ],
      },
    ];

    mathTitle = `Phép Tính 2 Chữ Số: Cộng, Trừ, Nhân, Chia (10-12 Tuổi)`;
    mathSubtitle = `Chinh phục 4 phép tính: Cộng, Trừ, Nhân và Chia số có 2 chữ số chuẩn xác!`;
  }

  const dailyMathLesson: Lesson = {
    id: `daily-math-day-${safeDay}`,
    subjectId: 'math',
    ageGroup: ageGroup,
    titleVi: mathTitle,
    titleEn: `Daily Math Lesson`,
    subtitleVi: mathSubtitle,
    subtitleEn: `Count and solve problems`,
    difficulty: ageGroup === '1-3' ? 'easy' : ageGroup === '4-6' ? 'easy' : 'medium',
    gameType: 'quiz',
    starsRequired: 0,
    rewardStars: 4,
    icon: '🔢',
    accentColor: 'from-emerald-500 to-teal-500',
    items: mathItems,
  };

  // 3. Daily English Vocabulary Lesson: 5 từ vựng cơ bản mỗi ngày (Đồ vật, Màu sắc, Con vật)
  const enDayData = DAILY_ENGLISH_VOCABULARY[safeDay] || DAILY_ENGLISH_VOCABULARY[0];
  const englishItems: LessonItem[] = enDayData.words.map((w, idx) => ({
    id: `daily-en-${safeDay}-${idx}`,
    display: w.wordEn,
    subTextVi: `${w.meaningVi} (${w.category})`,
    subTextEn: `${w.wordEn} ${w.phonicsEn}`,
    audioTextVi: w.audioVi,
    audioTextEn: `${w.wordEn}. ${w.audioEn}`,
    emojiOrImage: w.emoji,
    category: w.category,
    extraOptions: [w.wordEn, 'Star', 'Tree'],
  }));

  const dailyEnglishLesson: Lesson = {
    id: `daily-en-day-${safeDay}`,
    subjectId: 'english',
    ageGroup: ageGroup,
    titleVi: `Tiếng Anh Cơ Bản: ${enDayData.themeVi}`,
    titleEn: `English Basics: ${enDayData.themeEn}`,
    subtitleVi: `Mỗi ngày học 5 từ vựng tiếng Anh cơ bản: Đồ vật, Màu sắc và Con vật thân thuộc!`,
    subtitleEn: `Learn 5 basic English words daily: Objects, Colors, and Animals`,
    difficulty: 'easy',
    gameType: 'flashcard',
    starsRequired: 0,
    rewardStars: 5,
    icon: '🔤',
    accentColor: 'from-indigo-500 to-purple-500',
    items: englishItems,
  };

  const learningLessons = [dailyVietnameseLesson, dailyMathLesson, dailyEnglishLesson];

  // ========================================================
  // PHẦN 2: ÔN TẬP BÀI HỌC THEO NGÀY (4 PHẦN CHUẨN YÊU CẦU)
  // ========================================================

  // 2.1 Ôn thẻ trí nhớ (5 chữ cái hôm nay)
  const flashReviewLesson: Lesson = {
    id: `rev-flash-lesson-${safeDay}`,
    subjectId: 'vietnamese',
    ageGroup: ageGroup,
    titleVi: `Ôn Thẻ Trí Nhớ: Chữ ${letterList.join(', ')}`,
    titleEn: `Flashcard Memory Review`,
    subtitleVi: `Bé lật thẻ và đọc to lại chuẩn từng chữ cái mới qua chữ tiếp theo!`,
    subtitleEn: `Read aloud to flip cards`,
    difficulty: 'easy',
    gameType: 'flashcard',
    starsRequired: 0,
    rewardStars: 4,
    icon: '🃏',
    accentColor: 'from-amber-400 to-orange-400',
    items: todayLettersItems,
  };

  // 2.2 Đố vui nhẹ nhàng: TỪ 10 CÂU HỎI TRỞ LÊN (Đồng bộ với 5 chữ & từ vựng ngày)
  const quiz10Items: LessonItem[] = [];
  moduleInfo.letters.forEach((l) => {
    l.words.slice(0, 2).forEach((w, wIdx) => {
      // Create options: correct option first, then other distractors
      const otherLetters = moduleInfo.letters.filter((ol) => ol.letter !== l.letter);
      const wrongOpt1 = otherLetters[0]?.words[0]?.word || 'Cây Bút';
      const wrongOpt2 = otherLetters[1]?.words[0]?.word || 'Bông Hoa';

      quiz10Items.push({
        id: `quiz-item-${l.letter}-${wIdx}`,
        display: w.word,
        subTextVi: `Hình ảnh nào có chứa chữ ${l.letter}?`,
        subTextEn: `Which picture has letter ${l.letter}?`,
        audioTextVi: `Bé hãy tìm xem: Trong chữ ${l.letter}, có từ nào nè?`,
        audioTextEn: `Find the word for letter ${l.letter}`,
        emojiOrImage: w.emoji,
        extraOptions: [w.word, wrongOpt1, wrongOpt2],
      });
    });
  });

  // Ensure at least 10 quiz questions
  while (quiz10Items.length < 10) {
    const idx = quiz10Items.length % moduleInfo.letters.length;
    const l = moduleInfo.letters[idx];
    const w = l.words[2 % l.words.length];
    quiz10Items.push({
      id: `quiz-item-extra-${quiz10Items.length}`,
      display: w.word,
      subTextVi: `Tìm từ vựng bắt đầu bằng chữ ${l.letter}:`,
      subTextEn: `Find word for letter ${l.letter}`,
      audioTextVi: `Bé chọn đúng hình ảnh có chữ ${l.letter} nha!`,
      audioTextEn: `Choose matching image`,
      emojiOrImage: w.emoji,
      extraOptions: [w.word, 'Quả Bóng', 'Mặt Trời'],
    });
  }

  const quizReviewLesson: Lesson = {
    id: `rev-quiz-lesson-${safeDay}`,
    subjectId: 'vietnamese',
    ageGroup: ageGroup,
    titleVi: `Đố Vui Củng Cố 10 Câu: Chữ ${letterList.join(', ')}`,
    titleEn: `Daily 10 Quiz Questions`,
    subtitleVi: `Bộ 10 câu hỏi đố vui nhẹ nhàng đồng bộ cùng nội dung học hôm nay!`,
    subtitleEn: `10 gentle questions on today's letters`,
    difficulty: 'easy',
    gameType: 'quiz',
    starsRequired: 0,
    rewardStars: 5,
    icon: '🧠',
    accentColor: 'from-amber-400 to-orange-500',
    items: quiz10Items.slice(0, 10),
  };

  // 2.3 Phát âm chuẩn 10 vật dụng mỗi ngày (Bỏ giọng miền Nam, giọng Bắc chuẩn)
  const pronounce10Items: LessonItem[] = [];
  moduleInfo.letters.forEach((l) => {
    l.words.slice(0, 2).forEach((w, wIdx) => {
      pronounce10Items.push({
        id: `pronounce-${l.letter}-${wIdx}`,
        display: w.word,
        subTextVi: w.word,
        subTextEn: `Pronounce ${w.word}`,
        audioTextVi: `Bé phát âm theo cô giáo nhé: ${w.word}!`,
        audioTextEn: w.word,
        emojiOrImage: w.emoji,
      });
    });
  });

  while (pronounce10Items.length < 10) {
    const l = moduleInfo.letters[pronounce10Items.length % moduleInfo.letters.length];
    const w = l.words[3 % l.words.length];
    pronounce10Items.push({
      id: `pronounce-extra-${pronounce10Items.length}`,
      display: w.word,
      subTextVi: w.word,
      subTextEn: `Pronounce ${w.word}`,
      audioTextVi: `Bé đọc to rõ ràng: ${w.word}!`,
      audioTextEn: w.word,
      emojiOrImage: w.emoji,
    });
  }

  const speakReviewLesson: Lesson = {
    id: `rev-pronounce-lesson-${safeDay}`,
    subjectId: 'vietnamese',
    ageGroup: ageGroup,
    titleVi: `Luyện Phát Âm Chuẩn 10 Vật Dụng Hôm Nay`,
    titleEn: `Standard Northern Pronunciation (10 Items)`,
    subtitleVi: `Bé nói vào micro, hệ thống chấm điểm phát âm chuẩn giọng Bắc Bộ GD&ĐT!`,
    subtitleEn: `Real-time pronunciation evaluation`,
    difficulty: 'easy',
    gameType: 'speak_pronounce',
    starsRequired: 0,
    rewardStars: 5,
    icon: '🎙️',
    accentColor: 'from-violet-500 to-purple-600',
    items: pronounce10Items.slice(0, 10),
  };

  // 2.4 Ôn nét vẽ: Vẽ 5 - 6 chữ mỗi ngày theo các chữ đã học bắt đầu từ chữ A
  const traceItems: LessonItem[] = moduleInfo.letters.map((l) => {
    const sampleWord = l.words[0];
    return {
      id: `trace-${l.letter}`,
      display: l.letter,
      subTextVi: `${l.nameVi} (${sampleWord.word})`,
      subTextEn: `Trace ${l.letter}`,
      audioTextVi: `Bé tập tô chữ ${l.letter} theo đường chấm nhé!`,
      audioTextEn: `Trace letter ${l.letter}`,
      emojiOrImage: sampleWord.emoji,
    };
  });

  const traceReviewLesson: Lesson = {
    id: `rev-trace-lesson-${safeDay}`,
    subjectId: 'vietnamese',
    ageGroup: ageGroup,
    titleVi: `Ôn Nét Tô Vẽ: ${letterList.join(', ')}`,
    titleEn: `Letter Tracing (5-6 Letters)`,
    subtitleVi: `Tập tô ${letterList.length} chữ cái hôm nay với cọ màu lấp lánh và đường kẻ ô li!`,
    subtitleEn: `Trace today's letters`,
    difficulty: 'easy',
    gameType: 'tracing',
    starsRequired: 0,
    rewardStars: 4,
    icon: '✍️',
    accentColor: 'from-pink-500 to-rose-500',
    items: traceItems,
  };

  const reviewItems = [
    {
      id: `rev-flash-${safeDay}`,
      type: 'flashcard' as const,
      titleVi: 'Ôn Thẻ Trí Nhớ 5 Chữ Cái',
      subtitleVi: `Lật thẻ củng cố 5 chữ cái (${letterList.join(', ')}). Bé đọc lại đúng mới qua chữ tiếp theo!`,
      icon: '🃏',
      rewardStars: 4,
      lesson: flashReviewLesson,
    },
    {
      id: `rev-quiz-${safeDay}`,
      type: 'quiz' as const,
      titleVi: 'Đố Vui Củng Cố 10 Câu',
      subtitleVi: `10 câu hỏi đố vui nhẹ nhàng kiểm tra trí nhớ đồng bộ theo chữ ${letterList.join(', ')}!`,
      icon: '🧠',
      rewardStars: 5,
      lesson: quizReviewLesson,
    },
    {
      id: `rev-pronounce-${safeDay}`,
      type: 'pronounce' as const,
      titleVi: 'Phát Âm Chuẩn 10 Vật Dụng',
      subtitleVi: `Luyện nói tròn vành rõ chữ 10 đồ vật/từ vựng chuẩn giọng Bắc cùng cô giáo!`,
      icon: '🎙️',
      rewardStars: 5,
      lesson: speakReviewLesson,
    },
    {
      id: `rev-trace-${safeDay}`,
      type: 'tracing' as const,
      titleVi: `Ôn Nét Vẽ ${letterList.length} Chữ Hôm Nay`,
      subtitleVi: `Tô nét ${letterList.join(', ')} theo chuẩn ô li mầm non với cọ màu sắc cầu vồng!`,
      icon: '✍️',
      rewardStars: 4,
      lesson: traceReviewLesson,
    },
  ];

  // ========================================================
  // PHẦN 3: GAME TÍCH ĐIỂM THEO NGÀY (ĐỒNG BỘ 100% THEO NGÀY)
  // ========================================================

  // 3.1 Sách tô màu sáng tạo: 5 loại khác nhau (Con vật, Chữ cái, Trái cây, Phương tiện, Thiên nhiên)
  const coloring5Items: LessonItem[] = [
    {
      id: `color-item-1`,
      display: moduleInfo.letters[0]?.letter || 'A',
      subTextVi: `Chữ Cái: Chữ ${moduleInfo.letters[0]?.letter || 'A'}`,
      subTextEn: `Letter Template`,
      audioTextVi: `Bé chọn màu tô chữ ${moduleInfo.letters[0]?.letter || 'A'} nhé!`,
      audioTextEn: `Color Letter`,
      emojiOrImage: '🅰️',
      category: 'Chữ Cái',
    },
    {
      id: `color-item-2`,
      display: 'Con Vật',
      subTextVi: `Con Vật: ${moduleInfo.letters[0]?.words[1]?.word || 'Con Cá'}`,
      subTextEn: `Animal Template`,
      audioTextVi: `Bé tô màu bạn ${moduleInfo.letters[0]?.words[1]?.word || 'Con Cá'} đáng yêu nhé!`,
      audioTextEn: `Color Animal`,
      emojiOrImage: moduleInfo.letters[0]?.words[1]?.emoji || '🐟',
      category: 'Con Vật',
    },
    {
      id: `color-item-3`,
      display: 'Trái Cây',
      subTextVi: `Trái Cây: ${moduleInfo.letters[0]?.words[0]?.word || 'Quả Cam'}`,
      subTextEn: `Fruit Template`,
      audioTextVi: `Bé chọn sắc màu tươi tắn tô ${moduleInfo.letters[0]?.words[0]?.word || 'Quả Cam'} nhé!`,
      audioTextEn: `Color Fruit`,
      emojiOrImage: moduleInfo.letters[0]?.words[0]?.emoji || '🍊',
      category: 'Trái Cây',
    },
    {
      id: `color-item-4`,
      display: 'Phương Tiện',
      subTextVi: `Phương Tiện: Xe Hơi Bon Bon 🚗`,
      subTextEn: `Vehicle Template`,
      audioTextVi: `Bé hãy chọn màu sắc yêu thích và tự do tô màu chiếc xe hơi thật đẹp nhé!`,
      audioTextEn: `Color Vehicle`,
      emojiOrImage: '🚗',
      category: 'Phương Tiện',
    },
    {
      id: `color-item-5`,
      display: 'Thiên Nhiên',
      subTextVi: `Thiên Nhiên: Cầu Vồng Rực Rỡ 🌈`,
      subTextEn: `Nature Template`,
      audioTextVi: `Bé hãy tô sắc màu rực rỡ cho bức tranh thiên nhiên cầu vồng nhé!`,
      audioTextEn: `Color Nature`,
      emojiOrImage: '🌈',
      category: 'Thiên Nhiên',
    },
  ];

  const coloringLesson: Lesson = {
    id: `game-coloring-${safeDay}`,
    subjectId: 'vietnamese',
    ageGroup: ageGroup,
    titleVi: 'Sách Tô Màu Sáng Tạo (5 Loại)',
    titleEn: 'Coloring Book (5 Themes)',
    subtitleVi: 'Tô màu 5 loại tranh: Chữ cái, Con vật, Trái cây, Xe cộ, Thiên nhiên rực rỡ!',
    subtitleEn: 'Creative coloring book with 5 themes',
    difficulty: 'easy',
    gameType: 'coloring',
    starsRequired: 0,
    rewardStars: 4,
    icon: '🎨',
    accentColor: 'from-pink-400 to-rose-400',
    items: coloring5Items,
  };

  // 3.2 Đoàn tàu xếp chữ cái: Ghép 10 từ vựng mỗi ngày + có hướng dẫn đánh vần sau khi ghép xong
  const train10Items: LessonItem[] = [];
  moduleInfo.letters.forEach((l) => {
    l.words.slice(0, 2).forEach((w, wIdx) => {
      // Pick clean single word representation for letter train (e.g. "Cam", "Cá", "Áo", "Bé")
      const cleanWord = w.word.split(' ').pop() || w.word;
      train10Items.push({
        id: `train-${l.letter}-${wIdx}`,
        display: cleanWord.toUpperCase(),
        subTextVi: cleanWord,
        subTextEn: `Word: ${cleanWord}`,
        audioTextVi: w.spellingPhonics || `${cleanWord}`,
        audioTextEn: cleanWord,
        emojiOrImage: w.emoji,
      });
    });
  });

  while (train10Items.length < 10) {
    const l = moduleInfo.letters[train10Items.length % moduleInfo.letters.length];
    const w = l.words[2 % l.words.length];
    const cleanWord = w.word.split(' ').pop() || w.word;
    train10Items.push({
      id: `train-extra-${train10Items.length}`,
      display: cleanWord.toUpperCase(),
      subTextVi: cleanWord,
      subTextEn: `Word: ${cleanWord}`,
      audioTextVi: w.spellingPhonics || `${cleanWord}`,
      audioTextEn: cleanWord,
      emojiOrImage: w.emoji,
    });
  }

  const trainLesson: Lesson = {
    id: `game-train-${safeDay}`,
    subjectId: 'vietnamese',
    ageGroup: ageGroup,
    titleVi: 'Đoàn Tàu Xếp Chữ Cái (10 Từ Vựng)',
    titleEn: 'Letter Train Builder (10 Words)',
    subtitleVi: 'Ghép 10 từ vựng của ngày hôm nay, sau đó có phần hướng dẫn đánh vần chuẩn từng âm!',
    subtitleEn: 'Build 10 words with step-by-step phonics spelling guide',
    difficulty: 'easy',
    gameType: 'letter_train',
    starsRequired: 0,
    rewardStars: 5,
    icon: '🚂',
    accentColor: 'from-emerald-400 to-teal-500',
    items: train10Items.slice(0, 10),
  };

  // 3.3 Truyện tranh tương tác: 10 câu hỏi tương tác mỗi ngày, sửa lỗi chọn đáp án đúng!
  const story10Pages: LessonItem[] = [];
  moduleInfo.letters.forEach((l) => {
    l.words.slice(0, 2).forEach((w, wIdx) => {
      const correctWord = w.word;
      const otherLetters = moduleInfo.letters.filter((ol) => ol.letter !== l.letter);
      const wrongWord = otherLetters[0]?.words[0]?.word || 'Cây Bút';

      story10Pages.push({
        id: `story-page-${l.letter}-${wIdx}`,
        display: correctWord,
        subTextVi: `Bé cùng khám phá chữ ${l.letter}: Trong bức tranh xinh đẹp này có ${correctWord} nè!`,
        subTextEn: `Discover letter ${l.letter} with ${correctWord}`,
        audioTextVi: `Bé ơi, hãy nhìn xem trong tranh có bạn nào hay vật gì nha! Đó là ${correctWord}!`,
        audioTextEn: `Look at ${correctWord}`,
        emojiOrImage: w.emoji,
        extraOptions: [correctWord, wrongWord],
      });
    });
  });

  while (story10Pages.length < 10) {
    const l = moduleInfo.letters[story10Pages.length % moduleInfo.letters.length];
    const w = l.words[3 % l.words.length];
    story10Pages.push({
      id: `story-page-extra-${story10Pages.length}`,
      display: w.word,
      subTextVi: `Bé cùng đọc câu chuyện vui về chữ ${l.letter} và ${w.word}!`,
      subTextEn: `Story page with ${w.word}`,
      audioTextVi: `Hãy lắng nghe câu chuyện về ${w.word} nhé bé!`,
      audioTextEn: `Listen to story of ${w.word}`,
      emojiOrImage: w.emoji,
      extraOptions: [w.word, 'Bạn Gấu Nhỏ'],
    });
  }

  const storyLesson: Lesson = {
    id: `game-story-${safeDay}`,
    subjectId: 'vietnamese',
    ageGroup: ageGroup,
    titleVi: 'Truyện Tranh Tương Tác (10 Câu Hỏi)',
    titleEn: 'Interactive Story (10 Questions)',
    subtitleVi: 'Đọc truyện có giọng đọc cô giáo và 10 câu hỏi tương tác chọn đáp án đúng ghi điểm!',
    subtitleEn: '10 interactive story question pages',
    difficulty: 'easy',
    gameType: 'interactive_story',
    starsRequired: 0,
    rewardStars: 5,
    icon: '📖',
    accentColor: 'from-amber-400 to-orange-500',
    items: story10Pages.slice(0, 10),
  };

  // 3.4 Bong bóng diệu kỳ: 5 - 6 chữ cái của ngày hôm nay
  const bubbleItems: LessonItem[] = moduleInfo.letters.map((l) => ({
    id: `bubble-let-${l.letter}`,
    display: l.letter,
    subTextVi: `Chữ ${l.letter} (${l.words[0].word})`,
    subTextEn: `Letter ${l.letter}`,
    audioTextVi: `Bé chạm vỡ bong bóng chữ ${l.letter} nhé!`,
    audioTextEn: `Pop letter ${l.letter}`,
    emojiOrImage: l.words[0].emoji,
  }));

  const bubbleLesson: Lesson = {
    id: `game-bubble-${safeDay}`,
    subjectId: 'vietnamese',
    ageGroup: ageGroup,
    titleVi: `Bong Bóng Diệu Kỳ: ${letterList.join(', ')}`,
    titleEn: `Magic Bubble Pop (${letterList.length} Letters)`,
    subtitleVi: `Chạm vỡ các bong bóng chứa đúng ${letterList.length} chữ cái của ngày (${letterList.join(', ')})!`,
    subtitleEn: `Pop bubbles matching today's letters`,
    difficulty: 'easy',
    gameType: 'bubble_pop',
    starsRequired: 0,
    rewardStars: 4,
    icon: '🎈',
    accentColor: 'from-amber-400 to-rose-400',
    items: bubbleItems,
  };

  // 3.5 Lật thẻ trí nhớ: 10 lượt trở lên (10 cặp thẻ từ vựng của ngày)
  const match10Items: LessonItem[] = [];
  moduleInfo.letters.forEach((l) => {
    l.words.slice(0, 2).forEach((w, wIdx) => {
      match10Items.push({
        id: `match-${l.letter}-${wIdx}`,
        display: l.letter,
        subTextVi: w.word,
        subTextEn: `Pair for ${l.letter}`,
        audioTextVi: `Chính xác! Chữ ${l.letter} tương ứng với ${w.word}!`,
        audioTextEn: w.word,
        emojiOrImage: w.emoji,
      });
    });
  });

  while (match10Items.length < 10) {
    const l = moduleInfo.letters[match10Items.length % moduleInfo.letters.length];
    const w = l.words[3 % l.words.length];
    match10Items.push({
      id: `match-extra-${match10Items.length}`,
      display: l.letter,
      subTextVi: w.word,
      subTextEn: `Pair for ${l.letter}`,
      audioTextVi: `Ghép đúng rồi! Chữ ${l.letter} và ${w.word}!`,
      audioTextEn: w.word,
      emojiOrImage: w.emoji,
    });
  }

  const matchLesson: Lesson = {
    id: `game-match-${safeDay}`,
    subjectId: 'vietnamese',
    ageGroup: ageGroup,
    titleVi: 'Lật Thẻ Ghép Cặp Trí Nhớ (10 Cặp)',
    titleEn: 'Memory Match Cards (10 Pairs)',
    subtitleVi: 'Thử thách trí nhớ ghép đôi 10 thẻ chữ cái và hình ảnh tương ứng!',
    subtitleEn: 'Match 10 pairs of letters and pictures',
    difficulty: 'easy',
    gameType: 'matching',
    starsRequired: 0,
    rewardStars: 5,
    icon: '🃏',
    accentColor: 'from-blue-400 to-indigo-500',
    items: match10Items.slice(0, 10),
  };

  // 3.6 Tô nét tỏa sáng: 5-6 chữ cái của ngày với bút kim tuyến
  const traceGlitterLesson: Lesson = {
    id: `game-trace-${safeDay}`,
    subjectId: 'vietnamese',
    ageGroup: ageGroup,
    titleVi: `Tập Tô Nét Chữ Tỏa Sáng: ${letterList.join(', ')}`,
    titleEn: `Glitter Tracing (${letterList.length} Letters)`,
    subtitleVi: `Tô ${letterList.length} chữ cái với bút màu kim tuyến rực rỡ và âm thanh vui nhộn!`,
    subtitleEn: `Glitter trace today's letters`,
    difficulty: 'easy',
    gameType: 'tracing',
    starsRequired: 0,
    rewardStars: 4,
    icon: '✍️',
    accentColor: 'from-pink-400 to-fuchsia-500',
    items: traceItems,
  };

  const pointGames = [
    {
      id: 'game-coloring-book',
      gameType: 'coloring' as const,
      titleVi: 'Sách Tô Màu Sáng Tạo',
      descVi: '5 loại tranh tô màu khác nhau: Con vật, Chữ cái, Trái cây, Xe cộ & Thiên nhiên!',
      icon: '🎨',
      rewardStars: 4,
      color: 'from-pink-400 to-rose-400',
      lesson: coloringLesson,
    },
    {
      id: 'game-letter-train',
      gameType: 'letter_train' as const,
      titleVi: 'Đoàn Tàu Xếp Chữ Cái',
      descVi: 'Ghép 10 từ vựng mỗi ngày và xem cô giáo hướng dẫn đánh vần sau khi ghép xong!',
      icon: '🚂',
      rewardStars: 5,
      color: 'from-emerald-400 to-teal-500',
      lesson: trainLesson,
    },
    {
      id: 'game-interactive-story',
      gameType: 'interactive_story' as const,
      titleVi: 'Truyện Tranh Tương Tác',
      descVi: '10 trang truyện tương tác có giọng đọc chuẩn Bắc và câu hỏi chọn đáp án đúng ghi điểm!',
      icon: '📖',
      rewardStars: 5,
      color: 'from-amber-400 to-orange-500',
      lesson: storyLesson,
    },
    {
      id: 'game-bubble-pop',
      gameType: 'bubble_pop' as const,
      titleVi: 'Bong Bóng Diệu Kỳ',
      descVi: `Bé chạm vỡ bóng chứa đúng ${letterList.length} chữ cái (${letterList.join(', ')}) để ghi điểm!`,
      icon: '🎈',
      rewardStars: 4,
      color: 'from-amber-400 to-rose-400',
      lesson: bubbleLesson,
    },
    {
      id: 'game-matching-cards',
      gameType: 'matching' as const,
      titleVi: 'Lật Thẻ Ghép Cặp Trí Nhớ',
      descVi: 'Lật tìm 10 cặp thẻ bài hình ảnh và chữ cái tương ứng nhau để chiến thắng!',
      icon: '🃏',
      rewardStars: 5,
      color: 'from-blue-400 to-indigo-500',
      lesson: matchLesson,
    },
    {
      id: 'game-glitter-tracing',
      gameType: 'tracing' as const,
      titleVi: 'Tập Tô Nét Chữ Tỏa Sáng',
      descVi: `Tô ${letterList.length} chữ cái (${letterList.join(', ')}) với bút kim tuyến lấp lánh rực rỡ!`,
      icon: '✍️',
      rewardStars: 4,
      color: 'from-pink-400 to-fuchsia-500',
      lesson: traceGlitterLesson,
    },
  ];

  return {
    dayIndex: safeDay,
    dayNameVi: moduleInfo.dayNameVi,
    dayShortVi: moduleInfo.dayShortVi,
    themeVi: moduleInfo.themeVi,
    icon: moduleInfo.icon,
    currentLetters: letterList,
    learningLessons,
    reviewItems,
    pointGames,
  };
}

export function isDailyReviewDoneToday(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    return localStorage.getItem('bvk_daily_review_completed_date_v1') === todayStr;
  } catch {
    return false;
  }
}

export function markDailyReviewDoneToday(): void {
  if (typeof window === 'undefined') return;
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    localStorage.setItem('bvk_daily_review_completed_date_v1', todayStr);
  } catch {}
}
