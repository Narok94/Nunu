import React, { useState } from 'react';
import { WelcomeScreen } from './components/welcome/WelcomeScreen';
import { AdventureMapScreen } from './components/adventure/AdventureMapScreen';
import { FeedThePetGame } from './games/feed-the-pet/FeedThePetGame';
import { ShapeSorterGame } from './games/shape-sorter/ShapeSorterGame';
import { CountingGame } from './games/counting/CountingGame';
import { MatchingGame } from './games/matching/MatchingGame';
import { MemoryGame } from './games/memory/MemoryGame';
import { PaintingGame } from './games/painting/PaintingGame';
import { AnimalHabitatsGame } from './games/animal-habitats/AnimalHabitatsGame';
import { PatternGame } from './games/patterns/PatternGame';
import { SizeOrderingGame } from './games/size-ordering/SizeOrderingGame';
import { NunuCarGame } from './games/nunu-car/NunuCarGame';
import { ParentModal } from './components/common/ParentModal';
import { OrientationPrompt } from './components/common/OrientationPrompt';
import {
  loadAdventureProgress,
  saveAdventureProgress,
  resetAdventureProgress,
  JARDIM_DA_NUNU,
} from './data/adventureData';
import { AdventureNode, UserAdventureProgress } from './types';

type ScreenState =
  | 'welcome'
  | 'map'
  | 'feed-the-pet'
  | 'shapes'
  | 'counting'
  | 'matching'
  | 'memory'
  | 'painting'
  | 'animal-habitats'
  | 'patterns'
  | 'size-ordering'
  | 'nunu-car';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('welcome');
  const [progress, setProgress] = useState<UserAdventureProgress>(() => loadAdventureProgress());
  const [justCompletedNodeId, setJustCompletedNodeId] = useState<string | null>(null);
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);

  // Handle Play tap from Welcome Screen
  const handlePlayFromWelcome = () => {
    setCurrentScreen('map');
  };

  // Handle selecting any node from the trail (no blocking!)
  const handleSelectNode = (node: AdventureNode) => {
    setJustCompletedNodeId(null);
    const targetScreen = (node.minigameId || node.id) as ScreenState;
    setCurrentScreen(targetScreen);
  };

  // Handle completion of an activity
  const handleCompleteActivity = (nodeId: string, _starsEarned: number) => {
    setProgress((prev) => {
      const isFirstCompletion = !prev.completedNodeIds.includes(nodeId);
      const nodeIndex = JARDIM_DA_NUNU.nodes.findIndex((n) => n.id === nodeId);
      const targetIndex = nodeIndex >= 0 ? nodeIndex : prev.currentNodeIndex;
      const nextUnlocked = Math.max(prev.unlockedNodeIndex, targetIndex + 1);
      const updatedCompleted = isFirstCompletion
        ? [...prev.completedNodeIds, nodeId]
        : prev.completedNodeIds;

      const updated: UserAdventureProgress = {
        unlockedNodeIndex: nextUnlocked,
        currentNodeIndex: targetIndex, // Nunu moves to celebrate at the completed node!
        // Only award new star on first completion to maintain persistent progress
        starsCount: isFirstCompletion ? prev.starsCount + 1 : prev.starsCount,
        completedNodeIds: updatedCompleted,
      };

      saveAdventureProgress(updated);
      return updated;
    });

    setJustCompletedNodeId(nodeId);
  };

  // Handle resetting progress via parental gate
  const handleResetProgress = () => {
    const fresh = resetAdventureProgress();
    setProgress(fresh);
    setJustCompletedNodeId(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-800 flex flex-col relative overflow-x-hidden selection:bg-rose-100">
      {/* Visual orientation prompt shown when device is held in portrait */}
      <OrientationPrompt />

      {/* Screen 1: Welcome Screen (Logo, Nunu mascot, Scenery, Big Breathing PLAY Button) */}
      {currentScreen === 'welcome' && (
        <WelcomeScreen
          onPlay={handlePlayFromWelcome}
          onOpenParentsGate={() => setIsParentModalOpen(true)}
        />
      )}

      {/* Screen 2: Adventure Trail Map (Jardim da Nunu, Winding Path, 10 Freely Selectable Nodes) */}
      {currentScreen === 'map' && (
        <AdventureMapScreen
          progress={progress}
          onSelectNode={handleSelectNode}
          onBackToWelcome={() => setCurrentScreen('welcome')}
          onOpenParentsGate={() => setIsParentModalOpen(true)}
          justCompletedNodeId={justCompletedNodeId}
        />
      )}

      {/* 1. Feed The Pet ("Alimente o Bichinho") */}
      {currentScreen === 'feed-the-pet' && (
        <main className="flex-1 flex flex-col min-h-[100dvh]">
          <FeedThePetGame
            onBackToHome={() => setCurrentScreen('map')}
            onCompleteActivity={(stars) => handleCompleteActivity('feed-the-pet', stars)}
            onOpenParentsGate={() => setIsParentModalOpen(true)}
          />
        </main>
      )}

      {/* 2. Shape Sorter ("Encaixe as Formas") */}
      {currentScreen === 'shapes' && (
        <main className="flex-1 flex flex-col min-h-[100dvh]">
          <ShapeSorterGame
            onBackToHome={() => setCurrentScreen('map')}
            onCompleteActivity={(stars) => handleCompleteActivity('shapes', stars)}
            onOpenParentsGate={() => setIsParentModalOpen(true)}
          />
        </main>
      )}

      {/* 3. Counting ("Conte os Bichinhos") */}
      {currentScreen === 'counting' && (
        <main className="flex-1 flex flex-col min-h-[100dvh]">
          <CountingGame
            onBackToHome={() => setCurrentScreen('map')}
            onCompleteActivity={(stars) => handleCompleteActivity('counting', stars)}
            onOpenParentsGate={() => setIsParentModalOpen(true)}
          />
        </main>
      )}

      {/* 4. Matching ("Combine os Iguais") */}
      {currentScreen === 'matching' && (
        <main className="flex-1 flex flex-col min-h-[100dvh]">
          <MatchingGame
            onBackToHome={() => setCurrentScreen('map')}
            onCompleteActivity={(stars) => handleCompleteActivity('matching', stars)}
            onOpenParentsGate={() => setIsParentModalOpen(true)}
          />
        </main>
      )}

      {/* 5. Memory ("Jogo da Memória") */}
      {currentScreen === 'memory' && (
        <main className="flex-1 flex flex-col min-h-[100dvh]">
          <MemoryGame
            onBackToHome={() => setCurrentScreen('map')}
            onCompleteActivity={(stars) => handleCompleteActivity('memory', stars)}
            onOpenParentsGate={() => setIsParentModalOpen(true)}
          />
        </main>
      )}

      {/* 6. Painting ("Vamos Pintar") */}
      {currentScreen === 'painting' && (
        <main className="flex-1 flex flex-col min-h-[100dvh]">
          <PaintingGame
            onBackToHome={() => setCurrentScreen('map')}
            onCompleteActivity={(stars) => handleCompleteActivity('painting', stars)}
            onOpenParentsGate={() => setIsParentModalOpen(true)}
          />
        </main>
      )}

      {/* 7. Animal Habitats ("Animais e Lugares") */}
      {currentScreen === 'animal-habitats' && (
        <main className="flex-1 flex flex-col min-h-[100dvh]">
          <AnimalHabitatsGame
            onBackToHome={() => setCurrentScreen('map')}
            onCompleteActivity={(stars) => handleCompleteActivity('animal-habitats', stars)}
            onOpenParentsGate={() => setIsParentModalOpen(true)}
          />
        </main>
      )}

      {/* 8. Patterns ("Complete o Padrão") */}
      {currentScreen === 'patterns' && (
        <main className="flex-1 flex flex-col min-h-[100dvh]">
          <PatternGame
            onBackToHome={() => setCurrentScreen('map')}
            onCompleteActivity={(stars) => handleCompleteActivity('patterns', stars)}
            onOpenParentsGate={() => setIsParentModalOpen(true)}
          />
        </main>
      )}

      {/* 9. Size Ordering ("Organize por Tamanho") */}
      {currentScreen === 'size-ordering' && (
        <main className="flex-1 flex flex-col min-h-[100dvh]">
          <SizeOrderingGame
            onBackToHome={() => setCurrentScreen('map')}
            onCompleteActivity={(stars) => handleCompleteActivity('size-ordering', stars)}
            onOpenParentsGate={() => setIsParentModalOpen(true)}
          />
        </main>
      )}

      {/* 10. Nunu Car ("Carrinho da Nunu") */}
      {currentScreen === 'nunu-car' && (
        <main className="flex-1 flex flex-col min-h-[100dvh]">
          <NunuCarGame
            onBackToHome={() => setCurrentScreen('map')}
            onCompleteActivity={(stars) => handleCompleteActivity('nunu-car', stars)}
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
