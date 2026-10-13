import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AgeGroup } from '../types';
import {
  BarChart3,
  Mail,
  Sparkles,
  Settings,
  ArrowLeft,
  Clock,
  Star,
  CheckCircle2,
  Calendar,
  Send,
  Printer,
  Brain,
  BookOpen,
  HelpCircle,
  Shield,
  Smartphone,
  Save,
  Download,
  Upload,
  RefreshCw,
  Gift,
  Trash2,
} from 'lucide-react';
import { playClickSound, playSuccessSound, speakText, speakLetter } from '../utils/audio';
import { ParentRewardManager } from './ParentRewardManager';

export const ParentDashboard: React.FC = () => {
  const {
    profile,
    updateProfile,
    parentSettings,
    updateParentSettings,
    voiceDialect,
    setVoiceDialect,
    logs,
    rewards,
    goHome,
    language,
    syncDataToServer,
    loadDataFromServer,
    syncStatus,
    resetAllPointsAndProgress,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'analytics' | 'rewards' | 'weekly_email' | 'ai_assistant' | 'settings'>('analytics');

  // AI states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  const [aiBedtimeStory, setAiBedtimeStory] = useState<{ title: string; story: string } | null>(null);
  const [parentQuestion, setParentQuestion] = useState('');
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);

  // Email test sending state
  const [emailSending, setEmailSending] = useState(false);
  const [emailSuccessMsg, setEmailSuccessMsg] = useState<string | null>(null);

  // Sync inputs
  const [inputSyncCode, setInputSyncCode] = useState(parentSettings.syncCode);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Subject masteries
  const getSubjectCount = (subj: string) => {
    return logs.filter((l) => l.subjectId === subj).length;
  };

  const viCount = getSubjectCount('vietnamese');
  const mathCount = getSubjectCount('math');
  const enCount = getSubjectCount('english');
  const totalCompleted = profile.completedLessonIds.length;

  // AI Action 1: Lộ trình cá nhân hóa
  const handleGenerateAiPath = async () => {
    setAiLoading(true);
    playClickSound();
    try {
      const res = await fetch('/api/gemini/recommend-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ageGroup: profile.ageGroup,
          childName: profile.name,
          completedLessons: profile.completedLessonIds,
          totalStars: profile.totalStars,
          weakSkills: ['Nhận diện thanh điệu hỏi/ngã', 'Phép cộng trực quan trên 5'],
        }),
      });
      const data = await res.json();
      setAiRecommendation(data);
      playSuccessSound();
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  // AI Action 2: Truyện kể đêm
  const handleGenerateBedtimeStory = async () => {
    setAiLoading(true);
    playClickSound();
    try {
      const res = await fetch('/api/gemini/bedtime-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName: profile.name,
          ageGroup: profile.ageGroup,
          learnedWords: ['Chữ A (Quả cam)', 'Số 3 (Ngôi sao)', 'Bạn Gấu bông', 'Apple'],
        }),
      });
      const data = await res.json();
      setAiBedtimeStory(data);
      playSuccessSound();
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  // AI Action 3: Tư vấn giáo dục mầm non
  const handleAskAdvice = async () => {
    if (!parentQuestion.trim()) return;
    setAiLoading(true);
    playClickSound();
    try {
      const res = await fetch('/api/gemini/parent-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: parentQuestion,
          ageGroup: profile.ageGroup,
          childStrengths: 'Rất thích hình ảnh sinh động và tiếng động vật',
          childChallenges: 'Hay bị xao nhãng sau 10 phút',
        }),
      });
      const data = await res.json();
      setAiAdvice(data.advice);
      playSuccessSound();
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  // Send Test Weekly Email
  const handleSendTestWeeklyEmail = async () => {
    setEmailSending(true);
    setEmailSuccessMsg(null);
    playClickSound();
    try {
      const summary = {
        childName: profile.name,
        ageGroup: profile.ageGroup,
        totalStars: profile.totalStars,
        completedCount: totalCompleted,
        studyTimePastWeek: logs.reduce((acc, curr) => acc + curr.durationMinutes, 0),
        strengths: 'Tiếng Việt và phát âm tiếng Anh chuẩn',
      };
      const res = await fetch('/api/reports/send-weekly-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: parentSettings.parentEmail,
          reportSummary: summary,
        }),
      });
      const data = await res.json();
      setEmailSuccessMsg(data.message || 'Đã gửi báo cáo tuần thành công!');
      playSuccessSound();
    } catch (e) {
      setEmailSuccessMsg('Không thể gửi email lúc này. Vui lòng thử lại!');
    } finally {
      setEmailSending(false);
    }
  };

  // Cloud Sync
  const handleSaveToCloud = async () => {
    playClickSound();
    const success = await syncDataToServer();
    setSyncFeedback(
      success
        ? (language === 'vi' ? 'Đã lưu dữ liệu lên đám mây thành công!' : 'Saved to cloud successfully!')
        : (language === 'vi' ? 'Lỗi khi lưu lên đám mây.' : 'Failed to save to cloud.')
    );
    setTimeout(() => setSyncFeedback(null), 3000);
  };

  const handleLoadFromCloud = async () => {
    if (!inputSyncCode.trim()) return;
    playClickSound();
    const success = await loadDataFromServer(inputSyncCode.trim());
    setSyncFeedback(
      success
        ? (language === 'vi' ? 'Đã đồng bộ dữ liệu từ thiết bị khác!' : 'Synced data from other device!')
        : (language === 'vi' ? 'Không tìm thấy dữ liệu với mã này.' : 'Data not found with this code.')
    );
    setTimeout(() => setSyncFeedback(null), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playClickSound();
              goHome();
            }}
            className="p-2.5 rounded-2xl bg-white shadow-sm hover:bg-slate-50 text-slate-700 font-bold flex items-center gap-1.5 text-xs border border-slate-200 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'vi' ? 'Quay lại học' : 'Back'}</span>
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
              <span>👨‍👩‍👧</span>
              <span>{language === 'vi' ? 'Bảng Điều Khiển Phụ Huynh' : 'Parent Dashboard'}</span>
            </h1>
            <p className="text-xs text-slate-500 font-semibold">
              {language === 'vi'
                ? 'Theo dõi tiến độ, báo cáo tuần, tùy chỉnh lộ trình & Trí tuệ nhân tạo'
                : 'Analytics, weekly reports, curriculum settings & AI Personalization'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-2xl bg-amber-100 text-amber-900 text-xs font-black border border-amber-200">
            {profile.name} • {profile.ageGroup} {language === 'vi' ? 'tuổi' : 'yrs'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'analytics'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-amber-600" />
          <span>{language === 'vi' ? 'Tiến Độ Chi Tiết' : 'Analytics'}</span>
        </button>

        <button
          onClick={() => setActiveTab('weekly_email')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'weekly_email'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Mail className="w-4 h-4 text-rose-500" />
          <span>{language === 'vi' ? 'Báo Cáo Email Tuần' : 'Weekly Digest'}</span>
        </button>

        <button
          onClick={() => setActiveTab('ai_assistant')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'ai_assistant'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Brain className="w-4 h-4 text-purple-600" />
          <span>{language === 'vi' ? 'Trợ Lý AI Gemini' : 'AI Advisor'}</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'settings'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4 text-blue-600" />
          <span>{language === 'vi' ? 'Lộ Trình & Bảo Mật' : 'Settings & Sync'}</span>
        </button>
      </div>

      {/* TAB 1: ANALYTICS & LEARNING LOGS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {language === 'vi' ? 'Tổng Sao Tích Lũy' : 'Total Stars'}
              </span>
              <div className="text-3xl font-black text-amber-500 mt-1 flex items-center justify-center gap-1">
                <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                <span>{profile.totalStars}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {language === 'vi' ? 'Bài Đã Hoàn Thành' : 'Completed Lessons'}
              </span>
              <div className="text-3xl font-black text-emerald-600 mt-1">
                {totalCompleted}
              </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {language === 'vi' ? 'Chuỗi Ngày Học' : 'Daily Streak'}
              </span>
              <div className="text-3xl font-black text-orange-500 mt-1">
                {profile.activeStreakDays} {language === 'vi' ? 'ngày' : 'days'}
              </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {language === 'vi' ? 'Quà Đã Đổi' : 'Rewards Claimed'}
              </span>
              <div className="text-3xl font-black text-purple-600 mt-1">
                {rewards.filter((r) => !!r.claimedAt).length}
              </div>
            </div>
          </div>

          {/* Subject Mastery Distribution */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-slate-800 text-base">
              {language === 'vi' ? 'Năng Lực & Phân Bổ Môn Học' : 'Subject Competencies'}
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>🅰️ {language === 'vi' ? 'Tiếng Việt' : 'Vietnamese'}</span>
                  <span>{viCount} {language === 'vi' ? 'lượt học' : 'sessions'}</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${Math.min(100, viCount * 25)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>🔢 {language === 'vi' ? 'Toán Học Mầm Non' : 'Preschool Math'}</span>
                  <span>{mathCount} {language === 'vi' ? 'lượt học' : 'sessions'}</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, mathCount * 25)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>🔤 {language === 'vi' ? 'Tiếng Anh Thiếu Nhi' : 'Kids English'}</span>
                  <span>{enCount} {language === 'vi' ? 'lượt học' : 'sessions'}</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, enCount * 25)}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Learning Sessions Log */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-black text-slate-800 text-base mb-3">
              {language === 'vi' ? 'Nhật Ký Học Tập 7 Ngày Qua' : 'Recent 7-Day Activity'}
            </h3>

            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1">
              {logs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{log.lessonTitle}</span>
                    <span className="text-slate-400 ml-2">({log.date})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-semibold">{log.durationMinutes}p</span>
                    <span className="font-black text-amber-600">+{log.starsEarned} ⭐</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WEEKLY EMAIL DIGEST */}
      {activeTab === 'weekly_email' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-rose-500 to-amber-500 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-2">
                <Mail className="w-3.5 h-3.5" />
                {language === 'vi' ? 'Tự Động Gửi Email Định Kỳ' : 'Automated Email Digest'}
              </span>
              <h2 className="text-2xl font-black">
                {language === 'vi' ? 'Báo Cáo Hàng Tuần Cho Cha Mẹ' : 'Weekly Parent Progress Email'}
              </h2>
              <p className="text-sm text-rose-100 mt-1 max-w-xl">
                {language === 'vi'
                  ? `Hệ thống tự động tổng hợp kết quả học tập của bé ${profile.name} và gửi về email: ${parentSettings.parentEmail} vào 20:00 tối Chủ Nhật hàng tuần.`
                  : `Automated weekly progress digest is dispatched to ${parentSettings.parentEmail} every Sunday at 20:00.`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <button
                onClick={handleSendTestWeeklyEmail}
                disabled={emailSending}
                className="py-3 px-5 rounded-2xl bg-white text-slate-900 hover:bg-rose-50 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-rose-600" />
                <span>{emailSending ? (language === 'vi' ? 'Đang gửi...' : 'Sending...') : (language === 'vi' ? 'Gửi Bản Thử Nghiệm Ngay' : 'Send Test Digest Now')}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="py-3 px-4 rounded-2xl bg-rose-900/40 hover:bg-rose-900/60 text-white font-bold text-xs border border-white/30 transition-all flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>{language === 'vi' ? 'In Báo Cáo' : 'Print / PDF'}</span>
              </button>
            </div>
          </div>

          {emailSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{emailSuccessMsg}</span>
            </div>
          )}

          {/* Email Preview Template */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-md p-6 max-w-2xl mx-auto space-y-5 print:border-none print:shadow-none">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Mẫu Email Định Kỳ Gửi Cha Mẹ
                </span>
                <h3 className="text-lg font-black text-slate-800">
                  💌 Báo Cáo Tuần: Bé {profile.name} ({profile.ageGroup} Tuổi)
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                {new Date().toLocaleDateString('vi-VN')}
              </span>
            </div>

            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
              <h4 className="font-black text-amber-900 text-sm mb-1">
                🌟 Tóm Tắt Tuần Vừa Qua:
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                Bé {profile.name} đã hoàn thành xuất sắc <strong>{totalCompleted} bài học</strong>, tích lũy thêm <strong>{profile.totalStars} ngôi sao vàng</strong> và duy trì chuỗi học tập <strong>{profile.activeStreakDays} ngày liên tiếp</strong>!
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 block">Tiếng Việt</span>
                <span className="text-lg font-black text-rose-600 mt-1 block">Tốt ({viCount})</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 block">Toán Mầm Non</span>
                <span className="text-lg font-black text-emerald-600 mt-1 block">Khá ({mathCount})</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 block">Tiếng Anh</span>
                <span className="text-lg font-black text-indigo-600 mt-1 block">Tự Tin ({enCount})</span>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200">
              <h4 className="font-black text-purple-900 text-sm mb-1">
                💡 Lời Khuyên Cho Ba Mẹ Tuần Tới:
              </h4>
              <p className="text-xs text-purple-800 leading-relaxed">
                Bé thể hiện sự hứng thú đặc biệt với các trò chơi bắt bóng bóng và phát âm từ vựng. Ở nhà, ba mẹ có thể cùng bé đếm hoa quả trong tủ lạnh và khen thưởng bằng những cái ôm ấm áp để duy trì niềm vui tự nhiên nhé!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI GEMINI ASSISTANT & ADAPTIVE PATH */}
      {activeTab === 'ai_assistant' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Gemini 3.8 Flash Engine
              </span>
              <h2 className="text-2xl font-black">
                {language === 'vi' ? 'Trí Tuệ Nhân Tạo Cá Nhân Hóa' : 'AI Adaptive Curriculum & Stories'}
              </h2>
              <p className="text-sm text-purple-100 mt-1 max-w-xl">
                {language === 'vi'
                  ? 'Phân tích khả năng của từng bé theo chuẩn Bộ GD&ĐT Việt Nam, gợi ý hoạt động ngoài đời thực và sáng tác truyện kể trước giờ ngủ.'
                  : 'Tailored pedagogical adaptation and sweet bedtime memory stories based on what child learned today.'}
              </p>
            </div>
          </div>

          {/* AI Feature 1: Adaptive Learning Path Recommendation */}
          <div className="bg-white p-6 rounded-3xl border-2 border-purple-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <span>{language === 'vi' ? 'Lộ Trình Cá Nhân Hóa 3 Ngày Tiếp Theo' : '3-Day Personalized Path'}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'vi' ? 'AI đề xuất dựa trên số sao và bài bé đã hoàn thành' : 'Generated by Gemini AI based on child performance'}
                </p>
              </div>

              <button
                onClick={handleGenerateAiPath}
                disabled={aiLoading}
                className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{aiLoading ? (language === 'vi' ? 'Đang phân tích...' : 'Analyzing...') : (language === 'vi' ? 'Tạo Lộ Trình Mới' : 'Generate Path')}</span>
              </button>
            </div>

            {aiRecommendation && (
              <div className="space-y-3 pt-2 animate-fade-in">
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900">
                  💖 {aiRecommendation.cheerMessage}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {aiRecommendation.recommendedLessons?.map((item: any, i: number) => (
                    <div key={i} className="p-4 rounded-2xl border border-purple-200 bg-purple-50/50">
                      <span className="px-2 py-0.5 rounded-md bg-purple-200 text-purple-800 text-[10px] font-black uppercase">
                        {item.subject}
                      </span>
                      <h4 className="font-black text-sm text-slate-800 mt-2">{item.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">{item.focusSkill}</p>
                      <span className="text-[11px] text-purple-600 font-semibold mt-2 block">
                        Độ khó: {item.difficulty}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                  <strong>🌱 Hoạt động ngoài đời thực cùng con:</strong> {aiRecommendation.realLifeActivity}
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
                  <strong>🎁 Phần thưởng gần gũi gợi ý:</strong> {aiRecommendation.rewardSuggestion}
                </div>
              </div>
            )}
          </div>

          {/* AI Feature 2: Bedtime Story Generator */}
          <div className="bg-white p-6 rounded-3xl border-2 border-indigo-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <span>{language === 'vi' ? 'Truyện Kể Đêm Diệu Kỳ' : 'Bedtime Story Generator'}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'vi' ? 'Lồng ghép các từ vựng bé vừa học hôm nay vào một câu chuyện êm dịu' : 'Weaves today’s learned words into a soothing bedtime tale'}
                </p>
              </div>

              <button
                onClick={handleGenerateBedtimeStory}
                disabled={aiLoading}
                className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{language === 'vi' ? 'Sáng Tác Truyện Ngủ Ngon' : 'Create Bedtime Tale'}</span>
              </button>
            </div>

            {aiBedtimeStory && (
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 animate-fade-in space-y-2">
                <h4 className="font-black text-base text-indigo-950">
                  📖 {aiBedtimeStory.title}
                </h4>
                <p className="text-xs sm:text-sm text-indigo-900 leading-relaxed whitespace-pre-line font-medium">
                  {aiBedtimeStory.story}
                </p>
              </div>
            )}
          </div>

          {/* AI Feature 3: Parent Pedagogical Advisor */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-3">
            <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-500" />
              <span>{language === 'vi' ? 'Hỏi Chuyên Gia Giáo Dục Mầm Non' : 'Ask Early Education Advisor'}</span>
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={parentQuestion}
                onChange={(e) => setParentQuestion(e.target.value)}
                placeholder={
                  language === 'vi'
                    ? 'VD: Làm sao để rèn cho bé ngồi yên học 15 phút mà không chán?'
                    : 'e.g., How to keep toddler focused for 15 minutes?'
                }
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={handleAskAdvice}
                disabled={aiLoading || !parentQuestion.trim()}
                className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all disabled:opacity-40"
              >
                {language === 'vi' ? 'Gửi câu hỏi' : 'Ask'}
              </button>
            </div>

            {aiAdvice && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line font-medium mt-3">
                {aiAdvice}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: SETTINGS, SCREEN TIME & MULTI-DEVICE SYNC */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Child Profile & Age Customization */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-slate-800 text-base">
              {language === 'vi' ? 'Hồ Sơ Của Bé & Độ Tuổi' : 'Child Profile & Age'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">
                  {language === 'vi' ? 'Tên gọi thân mật của bé:' : 'Child Nickname:'}
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-sm font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">
                  {language === 'vi' ? 'Lộ trình lứa tuổi:' : 'Age Curriculum:'}
                </label>
                <select
                  value={profile.ageGroup}
                  onChange={(e) => updateProfile({ ageGroup: e.target.value as AgeGroup })}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-sm font-bold focus:outline-none focus:border-amber-500 bg-white"
                >
                  <option value="1-2">1 - 2 Tuổi (Nhà Trẻ / Khám Phá Giác Quan)</option>
                  <option value="3-4">3 - 4 Tuổi (Mầm - Chồi / Phát Triển)</option>
                  <option value="4-5">4 - 5 Tuổi (Lá - Tiền Tiểu Học Vào Lớp 1)</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                    {language === 'vi' ? 'Lựa chọn Giọng Đọc Chuẩn Cho Bé' : 'Standard Voice Selection'}
                  </label>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    {voiceDialect === 'northern' ? '🌸 Đang dùng: Giọng Chuẩn Bắc' : '🌴 Đang dùng: Giọng Chuẩn Nam'}
                  </span>
                </div>

                {/* Persistent Dialect Toggle Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Nam (Mặc định) */}
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setVoiceDialect('southern');
                      speakText('Xin chào ba mẹ và bé cưng! Giọng đọc chuẩn Nam ngọt ngào đã được áp dụng.', 'vi', parentSettings.speechRate || 0.88, 'southern');
                    }}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between ${
                      voiceDialect === 'southern'
                        ? 'border-amber-500 bg-amber-50/80 shadow-md ring-2 ring-amber-200'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🌴</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-sm text-slate-900">Giọng Chuẩn Nam</span>
                            <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-900">
                              Mặc định
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">Sài Gòn • Thân thương, ấm áp</div>
                        </div>
                      </div>
                      {voiceDialect === 'southern' && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase">
                          Đang bật
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-[11px] text-amber-900/80 bg-white/70 rounded-xl p-2 font-medium">
                      Giọng Nam Bộ gần gũi, dịu dàng, giữ nguyên âm vần giáo dục chuẩn không nuốt âm.
                    </div>
                  </button>

                  {/* Bắc */}
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setVoiceDialect('northern');
                      speakText('Xin chào bố mẹ và bé yêu! Giọng đọc chuẩn Bắc theo sách giáo khoa đã được áp dụng.', 'vi', parentSettings.speechRate || 0.88, 'northern');
                    }}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between ${
                      voiceDialect === 'northern'
                        ? 'border-rose-500 bg-rose-50/80 shadow-md ring-2 ring-rose-200'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🌸</span>
                        <div>
                          <div className="font-black text-sm text-slate-900">Giọng Chuẩn Bắc</div>
                          <div className="text-[11px] text-slate-500 font-medium">Hà Nội • SGK Bộ GD&ĐT</div>
                        </div>
                      </div>
                      {voiceDialect === 'northern' && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase">
                          Đang bật
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-[11px] text-rose-900/80 bg-white/70 rounded-xl p-2 font-medium">
                      Phát âm chuẩn âm vần lớp 1, thanh điệu rõ ràng, đọc từ &quot;bé&quot; tròn vành rõ chữ.
                    </div>
                  </button>
                </div>

                {/* Quick Auditory Test Bench */}
                <div className="flex flex-wrap items-center gap-2 pt-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-600">Thử giọng đọc:</span>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      const greeting =
                        voiceDialect === 'northern'
                          ? 'Xin chào bố mẹ và bé yêu! Chúc bé học thật chăm ngoan nhé!'
                          : 'Xin chào ba mẹ và bé cưng! Chúc bé học thật vui và giỏi giang nghen!';
                      speakText(greeting, 'vi', parentSettings.speechRate || 0.88, voiceDialect);
                    }}
                    className="py-1.5 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <span>🔊</span>
                    <span>Nghe lời chào</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      speakLetter('B', 'phonics', false, voiceDialect);
                    }}
                    className="py-1.5 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <span>🅰️</span>
                    <span>Đánh vần chữ B (&quot;Bờ&quot;)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      const phrase = voiceDialect === 'northern' ? 'Bé ngoan học giỏi' : 'Bé cưng học giỏi';
                      speakText(phrase, 'vi', parentSettings.speechRate || 0.88, voiceDialect);
                    }}
                    className="py-1.5 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <span>👶</span>
                    <span>Đọc từ &quot;Bé&quot;</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 italic">
                  {language === 'vi'
                    ? 'Tùy chọn được lưu vĩnh viễn trên thiết bị và đồng bộ tự động cho toàn bộ bài học, trò chơi và âm thanh chúc mừng.'
                    : 'Dialect selection is saved permanently and applies to all lessons, games, and celebration audio.'}
                </p>
              </div>
            </div>
          </div>

          {/* Screen Time & Habit Reminders */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-slate-800 text-base">
              {language === 'vi' ? 'Giới Hạn Màn Hình & Nhắc Nhở Thông Minh' : 'Screen Time & Smart Habits'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">
                  {language === 'vi' ? 'Giới hạn thời gian học mỗi ngày:' : 'Daily Screen Time Limit:'}
                </label>
                <select
                  value={parentSettings.screenTimeLimitMinutes}
                  onChange={(e) =>
                    updateParentSettings({ screenTimeLimitMinutes: parseInt(e.target.value, 10) })
                  }
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-sm font-bold focus:outline-none focus:border-amber-500 bg-white"
                >
                  <option value={15}>15 phút (Khuyến nghị cho bé 1-2 tuổi)</option>
                  <option value={20}>20 phút (Chuẩn mầm non)</option>
                  <option value={25}>25 phút</option>
                  <option value={30}>30 phút</option>
                  <option value={0}>Không giới hạn</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">
                  {language === 'vi' ? 'Giờ nhắc học hàng ngày:' : 'Daily Habit Reminder Time:'}
                </label>
                <input
                  type="time"
                  value={parentSettings.dailyReminderTime}
                  onChange={(e) => updateParentSettings({ dailyReminderTime: e.target.value })}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-sm font-bold focus:outline-none focus:border-amber-500 bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 block mb-1">
                  {language === 'vi' ? 'Email phụ huynh nhận báo cáo tuần:' : 'Parent Email for Weekly Reports:'}
                </label>
                <input
                  type="email"
                  value={parentSettings.parentEmail}
                  onChange={(e) => updateParentSettings({ parentEmail: e.target.value })}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-sm font-bold focus:outline-none focus:border-amber-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Parental Security (PIN & Math Gate) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-600" />
              <span>{language === 'vi' ? 'Khóa Bảo Mật Phụ Huynh' : 'Parental Security Lock'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">
                  {language === 'vi' ? 'Mã PIN bảo mật (4 số):' : '4-Digit PIN Code:'}
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={parentSettings.pinCode}
                  onChange={(e) => updateParentSettings({ pinCode: e.target.value })}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-sm font-bold focus:outline-none focus:border-amber-500 bg-white tracking-widest"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={parentSettings.useMathGate}
                    onChange={(e) => updateParentSettings({ useMathGate: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                  <span>{language === 'vi' ? 'Bật phép toán chống trẻ em bấm nhầm' : 'Enable math security gate'}</span>
                </label>
              </div>
            </div>
          </div>

          {/* Multi-Device Realtime Cloud Sync */}
          <div className="bg-white p-6 rounded-3xl border-2 border-emerald-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <span>{language === 'vi' ? 'Đồng Bộ Hóa Đa Thiết Bị' : 'Multi-Device Cloud Sync'}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'vi'
                    ? 'Đồng bộ tiến độ giữa điện thoại mẹ và máy tính bảng của bé bằng Mã Gia Đình'
                    : 'Sync progress across phones and tablets with Family Sync Code'}
                </p>
              </div>

              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                {syncStatus === 'syncing' ? 'Đang đồng bộ...' : syncStatus === 'synced' ? 'Đã đồng bộ ✓' : 'Sẵn sàng'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={inputSyncCode}
                onChange={(e) => setInputSyncCode(e.target.value.toUpperCase())}
                placeholder="Mã gia đình (VD: BAP2026)"
                className="py-2.5 px-4 rounded-xl border border-slate-300 text-sm font-black tracking-wider uppercase focus:outline-none focus:border-emerald-500"
              />

              <button
                onClick={handleSaveToCloud}
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
              >
                <Upload className="w-4 h-4" />
                <span>{language === 'vi' ? 'Lưu Lên Đám Mây' : 'Save To Cloud'}</span>
              </button>

              <button
                onClick={handleLoadFromCloud}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'vi' ? 'Khôi Phục Vào Máy Này' : 'Restore Data'}</span>
              </button>
            </div>

            {syncFeedback && (
              <p className="text-xs font-bold text-emerald-700 animate-fade-in">
                {syncFeedback}
              </p>
            )}
          </div>

          {/* Reset All Points & Progress (Xóa hết điểm để bắt đầu mới / chạy online) */}
          <div className="bg-red-50/60 p-6 rounded-3xl border-2 border-red-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-red-950 text-base flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-red-600" />
                  <span>{language === 'vi' ? 'Đặt Lại Toàn Bộ Điểm & Tiến Độ' : 'Reset All Points & Progress'}</span>
                </h3>
                <p className="text-xs text-red-700/80">
                  {language === 'vi'
                    ? 'Xóa toàn bộ số sao thưởng tích lũy, bài học đã hoàn thành và huy hiệu để bé bắt đầu lại từ đầu hoặc thử nghiệm trên nền tảng mới (GitHub/Vercel).'
                    : 'Clear all accumulated star points, completed lesson records and badges to start fresh.'}
                </p>
              </div>
            </div>

            <div className="pt-1 flex items-center gap-3">
              <button
                onClick={() => {
                  playClickSound();
                  if (window.confirm('Ba Mẹ có chắc chắn muốn XÓA HẾT ĐIỂM và tiến độ của bé không? Hành động này sẽ đưa số sao về 0.')) {
                    resetAllPointsAndProgress();
                    playSuccessSound();
                    alert('Đã xóa hết điểm thành công! Số sao và tiến độ đã được đưa về 0 để bé học lại từ đầu.');
                  }
                }}
                className="py-2.5 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center gap-2 transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>{language === 'vi' ? 'Xóa Hết Điểm & Tiến Độ Về 0' : 'Reset All Points to 0'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
