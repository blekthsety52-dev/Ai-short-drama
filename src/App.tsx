/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DramaProvider, useDrama } from './context/DramaContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { ForYouFeed } from './components/Views/ForYouFeed';
import { DiscoverView } from './components/Views/DiscoverView';
import { RankingsView } from './components/Views/RankingsView';
import { RewardsView } from './components/Views/RewardsView';
import { LibraryView } from './components/Views/LibraryView';
import { EpisodeDrawer } from './components/Modals/EpisodeDrawer';
import { CommentsDrawer } from './components/Modals/CommentsDrawer';
import { UnlockModal } from './components/Modals/UnlockModal';
import { CoinStoreModal } from './components/Modals/CoinStoreModal';
import { ShareModal } from './components/Modals/ShareModal';
import { DramaInfoModal } from './components/Modals/DramaInfoModal';
import { SearchModal } from './components/Modals/SearchModal';

const DramaAppContent: React.FC = () => {
  const { viewTab } = useDrama();

  return (
    <div className="min-h-screen bg-[#07080c] text-[#f1f3f9] flex flex-col relative select-none">
      {/* Top sticky brand navbar */}
      <Navbar />

      {/* Main active view container */}
      <main className="flex-1 flex flex-col">
        {(viewTab === 'foryou' || viewTab === 'player') && <ForYouFeed />}
        {viewTab === 'discover' && <DiscoverView />}
        {viewTab === 'rankings' && <RankingsView />}
        {viewTab === 'rewards' && <RewardsView />}
        {viewTab === 'library' && <LibraryView />}
      </main>

      {/* Mobile-first bottom navigation bar */}
      <BottomNav />

      {/* Global Interactive Modals & Drawers */}
      <EpisodeDrawer />
      <CommentsDrawer />
      <UnlockModal />
      <CoinStoreModal />
      <ShareModal />
      <DramaInfoModal />
      <SearchModal />
    </div>
  );
};

export default function App() {
  return (
    <DramaProvider>
      <DramaAppContent />
    </DramaProvider>
  );
}
