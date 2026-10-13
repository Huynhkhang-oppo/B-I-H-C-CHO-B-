import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { SubjectLessonList } from './components/SubjectLessonList';
import { FlashcardGame } from './components/games/FlashcardGame';
import { BubblePopGame } from './components/games/BubblePopGame';
import { MatchingGame } from './components/games/MatchingGame';
import { TracingCanvasGame } from './components/games/TracingCanvasGame';
import { QuizGame } from './components/games/QuizGame';
import { AnimalFeederGame } from './components/games/AnimalFeederGame';
import { SpeakAndPronounceGame } from './components/games/SpeakAndPronounceGame';
import { ColoringBookGame } from './components/games/ColoringBookGame';
import { LetterTrainGame } from './components/games/LetterTrainGame';
import { InteractiveStoryGame } from './components/games/InteractiveStoryGame';
import { ParentDashboard } from './components/ParentDashboard';
import { ParentalGateModal } from './components/ParentalGateModal';
import { ScreenTimeAlertModal } from './components/ScreenTimeAlertModal';
import { CustomRewardProposalModal } from './components/CustomRewardProposalModal';
import { RewardStoreModal } from './components/RewardStoreModal';
import { NumberExplorerModal } from './components/NumberExplorerModal';
import { AlphabetExplorerModal } from './components/AlphabetExplorerModal';
import { EditChildProfileModal } from './components/EditChildProfileModal';
import { CelebrationFeedbackModal } from './components/CelebrationFeedbackModal';
import { OfflineStatusIndicator } from './components/OfflineStatusIndicator';
import { VoiceControlModal } from './components/VoiceControlModal';

const AppContent: React.FC = () => {
  const {
    activeScreen,
    currentLesson,
    finishCurrentLesson,
    goHome,
    isNumberExplorerOpen,
    setNumberExplorerOpen,
    isAlphabetExplorerOpen,
    setAlphabetExplorerOpen,
    isEditProfileOpen,
    setEditProfileOpen,
    isVoiceModalOpen,
    setVoiceModalOpen,
    isCelebrationModalOpen,
    celebrationData,
    closeCelebrationModal,
    setCustomRewardModalOpen,
  } = useApp();

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeDashboard />;
      case 'subject':
        return <SubjectLessonList />;
      case 'lesson': {
        if (!currentLesson) return <HomeDashboard />;
        switch (currentLesson.gameType) {
          case 'flashcard':
            return (
              <FlashcardGame
                lesson={currentLesson}
                onFinish={finishCurrentLesson}
                onBack={goHome}
              />
            );
          case 'bubble_pop':
            return (
              <BubblePopGame
                lesson={currentLesson}
                onFinish={finishCurrentLesson}
                onBack={goHome}
              />
            );
          case 'matching':
            return (
              <MatchingGame
                lesson={currentLesson}
                onFinish={finishCurrentLesson}
                onBack={goHome}
              />
            );
          case 'tracing':
            return (
              <TracingCanvasGame
                lesson={currentLesson}
                onFinish={finishCurrentLesson}
                onBack={goHome}
              />
            );
          case 'quiz':
            return (
              <QuizGame
                lesson={currentLesson}
                onFinish={finishCurrentLesson}
                onBack={goHome}
              />
            );
          case 'feeding':
            return (
              <AnimalFeederGame
                lesson={currentLesson}
                onFinish={finishCurrentLesson}
                onBack={goHome}
              />
            );
          case 'speak_pronounce':
            return (
              <SpeakAndPronounceGame
                lesson={currentLesson}
                onFinish={finishCurrentLesson}
                onBack={goHome}
              />
            );
          case 'coloring':
            return (
              <ColoringBookGame
                lesson={currentLesson}
                onFinish={finishCurrentLesson}
                onBack={goHome}
              />
            );
          case 'letter_train':
            return (
              <LetterTrainGame
                lesson={currentLesson}
                onFinish={finishCurrentLesson}
                onBack={goHome}
              />
            );
          case 'interactive_story':
            return (
              <InteractiveStoryGame
                lesson={currentLesson}
                onFinish={finishCurrentLesson}
                onBack={goHome}
              />
            );
          default:
            return (
              <FlashcardGame
                lesson={currentLesson}
                onFinish={finishCurrentLesson}
                onBack={goHome}
              />
            );
        }
      }
      case 'parent':
        return <ParentDashboard />;
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/40 text-slate-800">
      <Navbar />
      <main className="flex-1 pb-12 animate-fade-in">{renderActiveScreen()}</main>

      {/* Global Modals */}
      <ParentalGateModal />
      <ScreenTimeAlertModal />
      <CustomRewardProposalModal />
      <RewardStoreModal />
      <NumberExplorerModal
        isOpen={isNumberExplorerOpen}
        onClose={() => setNumberExplorerOpen(false)}
      />
      <AlphabetExplorerModal
        isOpen={isAlphabetExplorerOpen}
        onClose={() => setAlphabetExplorerOpen(false)}
      />
      <EditChildProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setEditProfileOpen(false)}
      />
      <VoiceControlModal
        isOpen={isVoiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
      />

      {/* Cheerful Southern Vietnamese TTS Celebration Feedback */}
      {celebrationData && (
        <CelebrationFeedbackModal
          isOpen={isCelebrationModalOpen}
          onClose={closeCelebrationModal}
          celebrationText={celebrationData.text}
          starsEarned={celebrationData.starsEarned}
          lessonTitle={celebrationData.lessonTitle}
          isHardLevel={celebrationData.isHardLevel}
          onOpenDreamBox={() => setCustomRewardModalOpen(true)}
        />
      )}

      {/* Offline Status Indicator in UI */}
      <OfflineStatusIndicator />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
