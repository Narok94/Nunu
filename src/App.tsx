import React, { useState } from 'react';
import { WelcomeScreen } from './components/welcome/WelcomeScreen';
import { AdventureMapScreen } from './components/adventure/AdventureMapScreen';
import { FeedThePetGame } from './games/feed-the-pet/FeedThePetGame';
import { ParentModal } from './components/common/ParentModal';
import {
  loadAdventureProgress,
  saveAdventureProgress,
  resetAdventureProgress,
} from './data/adventureData';
import { AdventureNode, UserAdventureProgress } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'map' | 'feed-the-pet'>('welcome');
  const [progress, setProgress] = useState<UserAdventureProgress>(() => loadAdventureProgress());
  const [justCompletedNodeId, setJustCompletedNodeId] = useState<string | null>(null);
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);

  // Handle Play tap from Welcome Screen
  const handlePlayFromWelcome = () => {
    setCurrentScreen('map');
  };

  // Handle selecting an unlocked node from the trail
  const handleSelectNode = (node: AdventureNode) => {
    if (node.id === 'feed-the-pet') {
      setJustCompletedNodeId(null);
      setCurrentScreen('feed-the-pet');
    }
  };

  // Handle completion of an activity
  const handleCompleteActivity = (starsEarned: number) => {
    setProgress((prev) => {
      const nextUnlocked = Math.min(Math.max(prev.unlockedNodeIndex, 1), 5);
      const updatedCompleted = prev.completedNodeIds.includes('feed-the-pet')
        ? prev.completedNodeIds
        : [...prev.completedNodeIds, 'feed-the-pet'];

      const updated: UserAdventureProgress = {
        unlockedNodeIndex: nextUnlocked,
        currentNodeIndex: nextUnlocked,
        starsCount: prev.starsCount + Math.max(starsEarned, 1),
        completedNodeIds: updatedCompleted,
      };

      saveAdventureProgress(updated);
      return updated;
    });

    setJustCompletedNodeId('feed-the-pet');
  };

  // Handle resetting progress via parental gate
  const handleResetProgress = () => {
    const fresh = resetAdventureProgress();
    setProgress(fresh);
    setJustCompletedNodeId(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-800 flex flex-col relative overflow-x-hidden selection:bg-rose-100">
      {/* Screen 1: Welcome Screen (Logo, Nunu mascot, Scenery, Big Breathing PLAY Button) */}
      {currentScreen === 'welcome' && (
        <WelcomeScreen
          onPlay={handlePlayFromWelcome}
          onOpenParentsGate={() => setIsParentModalOpen(true)}
        />
      )}

      {/* Screen 2: Adventure Trail Map (Jardim da Nunu, Winding Path, Large Nodes, Nunu Companion) */}
      {currentScreen === 'map' && (
        <AdventureMapScreen
          progress={progress}
          onSelectNode={handleSelectNode}
          onBackToWelcome={() => setCurrentScreen('welcome')}
          onOpenParentsGate={() => setIsParentModalOpen(true)}
          justCompletedNodeId={justCompletedNodeId}
        />
      )}

      {/* Screen 3: Activity Screen (Immersive "Jardim da Nunu" Scene) */}
      {currentScreen === 'feed-the-pet' && (
        <main className="flex-1 flex flex-col min-h-[100dvh]">
          <FeedThePetGame
            onBackToHome={() => setCurrentScreen('map')}
            onCompleteActivity={handleCompleteActivity}
            onOpenParentsGate={() => setIsParentModalOpen(true)}
          />
        </main>
      )}

      {/* Parents Protected Gate Modal */}
      <ParentModal
        isOpen={isParentModalOpen}
        onClose={() => setIsParentModalOpen(false)}
        onResetProgress={handleResetProgress}
      />
    </div>
  );
}
