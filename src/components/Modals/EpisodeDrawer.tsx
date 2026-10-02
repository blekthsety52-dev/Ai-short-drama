import React, { useState } from 'react';
import { X, Lock, CheckCircle2, Play, Sparkles, Zap } from 'lucide-react';
import { useDrama } from '../../context/DramaContext';

export const EpisodeDrawer: React.FC = () => {
  const {
    currentDrama,
    currentEpisodeNumber,
    isEpisodeDrawerOpen,
    setIsEpisodeDrawerOpen,
    playDramaEpisode,
    isEpisodeUnlocked,
    unlockAllEpisodes,
    wallet,
  } = useDrama();

  const [activeTabRange, setActiveTabRange] = useState<number>(0);

  if (!isEpisodeDrawerOpen) return null;

  const episodes = currentDrama.episodes;
  const pageSize = 30;
  const totalTabs = Math.ceil(episodes.length / pageSize);

  const displayedEpisodes = episodes.slice(
    activeTabRange * pageSize,
    (activeTabRange + 1) * pageSize
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#0e101a] border border-white/10 rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Episodes Selection</h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Total {currentDrama.totalEpisodes}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 truncate max-w-xs">
              {currentDrama.title}
            </p>
          </div>
          <button
            onClick={() => setIsEpisodeDrawerOpen(false)}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab ranges for 1-30, 31-60... */}
        {totalTabs > 1 && (
          <div className="flex gap-2 px-4 py-2 border-b border-white/5 overflow-x-auto no-scrollbar">
            {Array.from({ length: totalTabs }).map((_, i) => {
              const start = i * pageSize + 1;
              const end = Math.min((i + 1) * pageSize, episodes.length);
              const isActive = activeTabRange === i;
              return (
                <button
                  key={i}
                  onClick={() => setActiveTabRange(i)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  {start}-{end}
                </button>
              );
            })}
          </div>
        )}

        {/* Episodes Grid */}
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-5 gap-2.5">
          {displayedEpisodes.map((ep) => {
            const isPlaying = ep.number === currentEpisodeNumber;
            const unlocked = isEpisodeUnlocked(currentDrama.id, ep.number);

            return (
              <button
                key={ep.id}
                onClick={() => {
                  playDramaEpisode(currentDrama.id, ep.number);
                  if (unlocked) {
                    setIsEpisodeDrawerOpen(false);
                  }
                }}
                className={`relative h-14 rounded-xl flex flex-col items-center justify-center font-bold transition-all cursor-pointer border ${
                  isPlaying
                    ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-md shadow-cyan-500/25 scale-[1.03]'
                    : unlocked
                    ? 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                    : 'bg-black/40 hover:bg-black/60 text-zinc-400 border-white/5'
                }`}
              >
                {/* Playing indicator or lock */}
                <div className="flex items-center gap-1">
                  <span className="text-sm">{ep.number}</span>
                  {!unlocked && <Lock className="w-3 h-3 text-amber-400" />}
                </div>

                <span className="text-[10px] font-normal text-zinc-400">
                  {isPlaying ? 'Playing' : ep.number <= 5 ? 'Free' : '20 🪙'}
                </span>

                {isPlaying && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Unlock All Banner */}
        <div className="p-4 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-cyan-500/10 border-t border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Unlock All Episodes</span>
              <span className="text-[10px] text-zinc-400">Save 40% coins & binge without interruption</span>
            </div>
          </div>
          <button
            onClick={() => {
              unlockAllEpisodes(currentDrama.id);
            }}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black text-xs font-extrabold flex items-center gap-1 shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <span>199 🪙</span>
            <span>Unlock</span>
          </button>
        </div>
      </div>
    </div>
  );
};
