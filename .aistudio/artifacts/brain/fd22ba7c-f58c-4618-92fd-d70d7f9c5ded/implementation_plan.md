# Nâng Cấp Hệ Thống Giọng Đọc Chuẩn Tiếng Việt (Bắc & Nam)

Khắc phục triệt để lỗi phát âm sai từ vựng (từ "bé" bị đọc nhầm thành "mớ" hoặc "ba"), chuẩn hóa cách phát âm bảng chữ cái theo đúng phương pháp đánh vần lớp 1 của Bộ GD&ĐT, và bổ sung tùy chọn linh hoạt giữa **Giọng Chuẩn Bắc (Hà Nội)** và **Giọng Chuẩn Nam (Sài Gòn)** với ngữ điệu truyền cảm, ấm áp.

## Quyết Định Sau Khảo Sát Ý Kiến Phụ Huynh

> [!IMPORTANT]
> Dựa trên phản hồi trực tiếp của phụ huynh trong quá trình khảo sát:
> - **Vùng miền**: Cho phép phụ huynh/bé tùy chọn linh hoạt giữa **Giọng Chuẩn Bắc** và **Giọng Chuẩn Nam** bất cứ lúc nào qua thanh điều khiển âm thanh 1-chạm.
> - **Chuẩn phát âm chữ cái**: Phát âm theo đúng **âm đánh vần lớp 1** (Ví dụ: Chữ B đọc là *"Bờ"*, C đọc là *"Cờ"*, D đọc là *"Dờ"*... không đọc dài dòng hay sai âm).
> - **Tốc độ & Ngữ điệu**: Tốc độ vừa phải (rate 0.88 - 0.92), cao độ ấm áp truyền cảm như cô giáo mầm non, tròn vành rõ chữ, tuyệt đối không nuốt âm.

---

## 1. Nguyên Nhân Gốc Rễ & Giải Pháp Kỹ Thuật

### 1.1. Vì sao từ "Bé" bị đọc thành "mớ" hoặc "ba"?
1. **Quy tắc thay thế phương ngữ thô sơ (`formatSouthernDialect`)**: Việc tự động thay thế chuỗi regex (như `bố` -> `ba`, `bảo` -> `kêu`, `quả` -> `trái`) trong một số ngữ cảnh câu hoặc tên riêng bị ghi đè không kiểm soát, dẫn đến câu chứa chữ "bé", "bố" hoặc âm tiết bị biến dạng thành "ba" hoặc "mớ".
2. **Thiếu từ điển âm vần chuẩn**: Khi phát âm chữ cái độc lập 'B', hệ thống trước đây ghép chuỗi *"Chữ Bờ. Bờ"* hoặc chọn nhầm voice mặc định của trình duyệt không hỗ trợ dấu thanh điệu tiếng Việt, dẫn đến âm thanh bị bóp méo thành "mớ" hoặc "bà".
3. **Giọng đọc trình duyệt (Web Speech API) thiếu cơ chế kiểm tra giọng tiếng Việt hợp lệ**: Nếu máy tính/điện thoại không có sẵn voice `vi-VN`, trình duyệt tự ép qua voice tiếng Anh đọc "B" thành "bee" / "bi" hoặc phát âm sai dấu nặng, ngã, sắc.

### 1.2. Giải pháp triệt để
- **Xóa bỏ các hàm replace chuỗi tự động gây lỗi ngữ nghĩa**: Văn bản tiếng Việt của bài học được giữ nguyên vẹn chính tả chuẩn xác 100%.
- **Xây dựng Từ điển Ngữ âm Đánh vần Lớp 1 (`VI_PHONICS_GRADE1_MAP`)**:
  - A -> *"A"*, Ă -> *"Á"*, Â -> *"Ớ"*
  - B -> *"Bờ"*, C -> *"Cờ"*, D -> *"Dờ"*, Đ -> *"Đờ"*
  - E -> *"E"*, Ê -> *"Ê"*, G -> *"Gờ"*, H -> *"Hờ"*
  - I -> *"I"*, K -> *"Cờ (Ca)"*, L -> *"Lờ"*, M -> *"Mờ"*, N -> *"Nờ"*
  - O -> *"O"*, Ô -> *"Ô"*, Ơ -> *"Ơ"*, P -> *"Pờ"*, Q -> *"Cờ (Cu)"*
  - R -> *"Rờ"*, S -> *"Sờ"*, T -> *"Tờ"*, U -> *"U"*, Ư -> *"Ư"*
  - V -> *"Vờ"*, X -> *"Xờ"*, Y -> *"I"*
- **Hệ thống TTS Kép (Hybrid Intelligent Speech)**:
  - **Tùy chọn Giọng Bắc / Nam**: Lưu trong `AppContext` và `localStorage` (giữ nguyên khi bé học lại).
  - **Động cơ 1 - Web Speech chuẩn hóa**: Tự động nhận diện voice tiếng Việt chất lượng cao (Google tiếng Việt, Microsoft HoaiMy/NamMinh, Apple Linh...), tự động điều chỉnh tốc độ 0.9, pitch 1.05 chuẩn cô giáo mầm non.
  - **Động cơ 2 - AI Cô Giáo Mầm Non (Server-side Gemini TTS)**: Hỗ trợ tạo file âm thanh trong trẻo, tự nhiên, đúng ngữ điệu ru bé và dạy học chuẩn mực khi có kết nối mạng.

---

## 2. Thiết Kế Giao Diện & Trải Nghiệm Người Dùng (UX/UI)

### 2.1. Bộ Điều Khiển Giọng Đọc 1-Chạm (`VoiceSettingsBar` / `AudioSelectorModal`)
- **Vị trí**: Nằm gọn gàng trên thanh tiêu đề ứng dụng (Header) và có trong phần Cài Đặt của Phụ Huynh.
- **Nút chuyển đổi nhanh**:
  - `[🌸 Giọng Miền Bắc]` (Chuẩn Hà Nội / SGK)
  - `[🌴 Giọng Miền Nam]` (Thân thương, ngọt ngào)
- **Thanh tinh chỉnh tốc độ**: Chậm rãi (dành cho bé 1-2 tuổi) | Vừa phải (chuẩn 3-5 tuổi) | Tự nhiên.
- **Nút "Nghe thử giọng mẫu"**: Phát ngay câu chào mẫu: *"Xin chào bé yêu! Chúc bé học thật vui nghen!"* để ba mẹ nghe thử và ưng ý ngay lập tức.

### 2.2. Trải nghiệm trong các bài học và trò chơi
- **Bài học chữ cái**: Khi bé chạm vào chữ B -> Loa phát vang rõ ràng: **"Bờ"** (hoặc tùy chọn phát kèm từ minh họa như **"Bờ - Bé ngoan"**).
- **Trò chơi Luyện Nói (Speak & Pronounce)**: Hiển thị hướng dẫn phát âm theo vùng miền đã chọn mà không ép buộc bé, chấp nhận cả hai cách phát âm Bắc - Nam chuẩn.
- **Lời khen thưởng**: Tự động đồng bộ theo vùng miền đã chọn (Bắc: *"Bé giỏi quá! Tuyệt vời lắm!"* | Nam: *"Bé giỏi quá xá luôn nè! Xuất sắc nghen!"*).

---

## 3. Kiến Trúc Kỹ Thuật & Luồng Dữ Liệu

```
┌─────────────────────────────────────────────────────────────┐
│                      Giao Diện Người Dùng                   │
│   [Header Voice Switcher]  [Flashcard]  [Bảng Chữ Cái]      │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   AppContext (Trạng Thái)                   │
│  - voiceRegion: 'north' | 'south'                           │
│  - speechRate: 0.85 - 0.95                                  │
│  - phonicsMode: 'grade1_spelling' ('Bờ', 'Cờ', 'Dờ')        │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  src/utils/audio.ts (Mới)                   │
│  ┌─────────────────────────┐   ┌──────────────────────────┐ │
│  │  VI_PHONICS_GRADE1_MAP  │   │  speakText() & speakPhonics│ │
│  │  (Âm chuẩn Bộ GD&ĐT)    │   │  (Lọc giọng Bắc / Nam)   │ │
│  └─────────────────────────┘   └─────────────┬────────────┘ │
└──────────────────────────────────────────────┼──────────────┘
                                               │
                        ┌──────────────────────┴──────────────────────┐
                        ▼                                             ▼
         ┌─────────────────────────────┐               ┌─────────────────────────────┐
         │  Web Speech API (Trình duyệt)│               │  Gemini TTS API (/api/tts)  │
         │  - Voice vi-VN chuẩn        │               │  - Giọng cô giáo Bắc/Nam    │
         │  - Fallback mượt mà         │               │  - Chuẩn âm điệu Việt Nam   │
         └─────────────────────────────┘               └─────────────────────────────┘
```

---

## 4. Kế Hoạch Triển Khai Chi Tiết

1. **Bước 1: Cập nhật `src/types/index.ts` & `src/context/AppContext.tsx`**
   - Thêm `voiceRegion: 'north' | 'south'` vào trạng thái ứng dụng và lưu vào `localStorage`.
   - Thêm hàm `setVoiceRegion` để mọi màn hình đều có thể kích hoạt đổi giọng ngay lập tức.

2. **Bước 2: Viết lại `src/utils/audio.ts`**
   - Loại bỏ toàn bộ các logic regex thay thế từ nguy hiểm khiến "bé" biến thành "ba" hay "mớ".
   - Tạo bảng `VI_GRADE1_PHONICS` chuẩn hóa 29 chữ cái + chữ ghép (CH, GH, GI, KH, NH, PH, TH, TR, QU, NG, NGH).
   - Tối ưu hàm `speakLetter` chỉ phát âm đánh vần gọn gàng ("Bờ", "Cờ", "Dờ",...).
   - Bổ sung bộ lọc chọn đúng Voice Bắc / Voice Nam trong danh sách Web Speech của hệ điều hành.

3. **Bước 3: Nâng cấp Backend TTS (`server.ts`)**
   - Hỗ trợ thêm tham số `region: 'north' | 'south'` cho endpoint `/api/tts/speak-voice`.
   - Giọng Bắc: Giọng cô giáo Hà Nội phát âm chuẩn Tiếng Việt mầm non, thanh thoát, rõ tiếng.
   - Giọng Nam: Giọng cô giáo miền Nam ấm áp, nhẹ nhàng, truyền cảm.

4. **Bước 4: Bổ sung thanh công cụ chuyển đổi giọng nhanh (`VoiceSelector.tsx`)**
   - Tích hợp nút chuyển đổi Giọng Bắc / Nam kèm biểu tượng trực quan trên Header và trong phần cài đặt cha mẹ.
   - Nút test thử giọng ngay tại chỗ để phụ huynh kiểm tra chất lượng phát âm.

5. **Bước 5: Kiểm thử và xác minh**
   - Kiểm tra kỹ việc đọc chữ "B", từ "Bé", "Em bé", "Bé ngoan", các số đếm và toàn bộ bảng chữ cái.
   - Đảm bảo `compile_applet` và `lint_applet` đạt 100% không có lỗi.
