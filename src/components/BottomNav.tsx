import React from 'react';
import { Flame, Film, Crown, Gift, Bookmark } from 'lucide-react';
import { useDrama, ViewTab } from '../context/DramaContext';

export const BottomNav: React.FC = () => {
  const { viewTab, setViewTab, wallet } = useDrama();
  const isTodayCheckedIn = wallet.lastCheckInDate === new Date().toISOString().split('T')[0];

  const tabs: { id: ViewTab; label: string; icon: React.ReactNode; badge?: boolean }[] = [
    { id: 'foryou', label: 'For You', icon: <Flame className="w-5 h-5" /> },
    { id: 'discover', label: 'Theater', icon: <Film className="w-5 h-5" /> },
    { id: 'rankings', label: 'Top 10', icon: <Crown className="w-5 h-5" /> },
    {
      id: 'rewards',
      label: 'Rewards',
      icon: <Gift className="w-5 h-5" />,
      badge: !isTodayCheckedIn,
    },
    { id: 'library', label: 'My List', icon: <Bookmark className="w-5 h-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07080c]/95 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom,0px)]">
      <div className="grid grid-cols-5 h-14 items-center">
        {tabs.map((tab) => {
          const isActive = viewTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setViewTab(tab.id)}
              className={`relative flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
                isActive ? 'text-cyan-400' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}
                {tab.badge && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-rose-500" />
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium tracking-tight ${
                  isActive ? 'font-bold text-cyan-400' : 'text-zinc-400'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute top-0 w-8 h-[2px] bg-gradient-to-r from-cyan-400 to-rose-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
