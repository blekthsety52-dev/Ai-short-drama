import React from 'react';
import { Search, Coins, Crown, Sparkles, Flame, Film, Gift, Bookmark } from 'lucide-react';
import { useDrama, ViewTab } from '../context/DramaContext';
import { APP_LOGO } from '../assets/images';

export const Navbar: React.FC = () => {
  const {
    viewTab,
    setViewTab,
    setIsSearchOpen,
    setIsCoinStoreOpen,
    wallet,
  } = useDrama();

  const isTodayCheckedIn = wallet.lastCheckInDate === new Date().toISOString().split('T')[0];

  const navItems: { id: ViewTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'foryou', label: 'For You', icon: <Flame className="w-4 h-4" /> },
    { id: 'discover', label: 'Theater', icon: <Film className="w-4 h-4" /> },
    { id: 'rankings', label: 'Top 10', icon: <Crown className="w-4 h-4" /> },
    {
      id: 'rewards',
      label: 'Free Coins',
      icon: <Gift className="w-4 h-4" />,
      badge: !isTodayCheckedIn ? 'NEW' : undefined,
    },
    { id: 'library', label: 'My List', icon: <Bookmark className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07080c]/90 backdrop-blur-xl border-b border-white/8 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div
          onClick={() => setViewTab('foryou')}
          className="flex items-center gap-2.5 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="relative w-10 h-10 rounded-full p-[1.5px] bg-gradient-to-tr from-cyan-400 via-rose-500 to-indigo-500 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <img
              src={APP_LOGO}
              alt="Ai Short Drama Logo"
              className="w-full h-full object-cover rounded-full bg-black"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                Ai Short Drama
              </span>
              <span className="px-1.5 py-0.2 bg-gradient-to-r from-rose-500 to-cyan-500 text-[9px] font-bold uppercase rounded text-white tracking-wider">
                HD
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-medium hidden sm:block tracking-wide">
              Trending Mini-Series & Dramas
            </span>
          </div>
        </div>

        {/* Center Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
          {navItems.map((item) => {
            const isActive = viewTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setViewTab(item.id)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/90 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 bg-rose-500 text-[9px] font-extrabold text-white rounded-full animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons: Search + Coins + VIP */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Search dramas"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Coins Balance Pill */}
          <button
            onClick={() => setIsCoinStoreOpen(true)}
            className="group px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 to-yellow-500/10 hover:from-amber-500/25 hover:to-yellow-500/20 border border-amber-500/30 flex items-center gap-1.5 text-amber-300 transition-all cursor-pointer shadow-sm shadow-amber-500/10"
            title="Get more coins & Daily rewards"
          >
            <div className="w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold text-xs shadow-inner">
              🪙
            </div>
            <span className="font-bold text-xs tracking-tight text-amber-200">
              {wallet.coins}
            </span>
            <span className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-300 group-hover:bg-amber-400 group-hover:text-black flex items-center justify-center text-[10px] font-bold ml-0.5 transition-colors">
              +
            </span>
          </button>

          {/* VIP Pass Badge */}
          <button
            onClick={() => setIsCoinStoreOpen(true)}
            className="hidden sm:flex px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-500/20 to-purple-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold items-center gap-1 hover:border-rose-400 transition-all cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>VIP Pass</span>
          </button>
        </div>
      </div>
    </header>
  );
};
