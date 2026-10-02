import React, { useState } from 'react';
import { Search, X, Play, Star, Flame, Eye } from 'lucide-react';
import { useDrama } from '../../context/DramaContext';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    dramas,
    playDramaEpisode,
  } = useDrama();

  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const hotSearches = [
    'Billionaire',
    'Revenge',
    'Dragon King',
    'Werewolf Alpha',
    'Cold CEO',
    'Empress Rebirth',
    'Divorced Queen',
  ];

  const filteredDramas = query.trim()
    ? dramas.filter((d) => {
        const q = query.toLowerCase();
        return (
          d.title.toLowerCase().includes(q) ||
          d.tagline.toLowerCase().includes(q) ||
          d.genres.some((g) => g.toLowerCase().includes(q)) ||
          d.tags.some((t) => t.toLowerCase().includes(q)) ||
          d.cast.some((c) => c.toLowerCase().includes(q))
        );
      })
    : dramas;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#0e101a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in slide-in-from-top-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input header */}
        <div className="p-3.5 border-b border-white/10 flex items-center gap-2.5">
          <Search className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles, actors, tropes (e.g. Billionaire, Alpha)..."
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-zinc-400 hover:text-white text-xs cursor-pointer px-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hot searches chips */}
        <div className="px-4 py-2.5 bg-white/2 border-b border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1 uppercase flex-shrink-0">
            <Flame className="w-3 h-3 fill-rose-400" />
            Hot:
          </span>
          {hotSearches.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-0.8 rounded-full bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 text-[11px] text-zinc-300 whitespace-nowrap transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2.5">
          {filteredDramas.length === 0 ? (
            <div className="text-center py-10 text-zinc-500 text-xs">
              No matching short dramas found for "{query}".
            </div>
          ) : (
            filteredDramas.map((drama) => (
              <div
                key={drama.id}
                onClick={() => {
                  playDramaEpisode(drama.id, 1);
                  setIsSearchOpen(false);
                }}
                className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 flex items-center gap-3 transition-all cursor-pointer group"
              >
                <img
                  src={drama.poster}
                  alt={drama.title}
                  className="w-14 h-18 object-cover rounded-xl border border-white/10 flex-shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 truncate">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {drama.genres[0]}
                    </span>
                    <span className="text-[10px] text-amber-300 font-bold flex items-center gap-0.5">
                      ★ {drama.rating}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-cyan-300">
                    {drama.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                    {drama.tagline}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-500">
                    <span>{drama.totalEpisodes} Episodes</span>
                    <span>·</span>
                    <span>{drama.views} views</span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black flex items-center justify-center transition-colors flex-shrink-0">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
