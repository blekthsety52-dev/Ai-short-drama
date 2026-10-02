import React, { useState } from 'react';
import { Crown, Flame, Play, Star, Eye, Bookmark, TrendingUp } from 'lucide-react';
import { useDrama } from '../../context/DramaContext';

export const RankingsView: React.FC = () => {
  const { dramas, playDramaEpisode, toggleMyList, wallet } = useDrama();
  const [filterPeriod, setFilterPeriod] = useState<'Daily' | 'Weekly' | 'AllTime'>('Daily');

  // Sort by rating & views
  const rankedDramas = [...dramas].sort((a, b) => (a.isTopRanked || 99) - (b.isTopRanked || 99));

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] pb-24 md:pb-12 max-w-5xl mx-auto px-3 sm:px-6 pt-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-transparent border border-amber-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-6 h-6 text-amber-400 fill-amber-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white">Top 10 Drama Leaderboard</h1>
          </div>
          <p className="text-xs text-zinc-300">
            Most watched viral short drama series ranked by real-time viewer heat
          </p>
        </div>

        {/* Period Filter */}
        <div className="flex items-center p-1 rounded-full bg-black/40 border border-white/10 self-start sm:self-auto">
          {(['Daily', 'Weekly', 'AllTime'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setFilterPeriod(period)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                filterPeriod === period
                  ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {period === 'Daily' ? 'Today' : period === 'Weekly' ? 'This Week' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {rankedDramas.slice(0, 3).map((drama, idx) => {
          const rank = idx + 1;
          const badgeColor =
            rank === 1
              ? 'from-amber-400 to-yellow-500 text-black border-amber-300'
              : rank === 2
              ? 'from-slate-200 to-zinc-400 text-black border-slate-300'
              : 'from-amber-600 to-orange-700 text-white border-amber-600';

          return (
            <div
              key={drama.id}
              onClick={() => playDramaEpisode(drama.id, 1)}
              className="relative p-4 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/50 transition-all flex flex-col justify-between group cursor-pointer"
            >
              {/* Rank number badge */}
              <div
                className={`absolute -top-2.5 left-4 px-3 py-0.5 rounded-full font-black text-xs uppercase bg-gradient-to-r ${badgeColor} border shadow-lg flex items-center gap-1`}
              >
                <Crown className="w-3.5 h-3.5 fill-current" />
                <span>TOP {rank}</span>
              </div>

              <div className="flex gap-3 pt-3">
                <div className="w-20 aspect-[2/3] rounded-2xl overflow-hidden bg-black flex-shrink-0 shadow-md">
                  <img
                    src={drama.poster}
                    alt={drama.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 text-[11px] text-rose-400 font-bold mb-0.5">
                    <Flame className="w-3.5 h-3.5 fill-rose-400" />
                    <span>Heat {drama.views}</span>
                  </div>
                  <h3 className="text-sm font-black text-white group-hover:text-amber-300 truncate transition-colors">
                    {drama.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">
                    {drama.tagline}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-zinc-400">
                    <span className="text-amber-300 font-bold">★ {drama.rating}</span>
                    <span>·</span>
                    <span>{drama.totalEpisodes} EP</span>
                  </div>
                </div>
              </div>

              <button className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-400 hover:to-yellow-400 hover:text-black border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all">
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Stream Ep 1 Now</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Ranks 4 to 10 List */}
      <div className="space-y-2.5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
          Rankings #4 — #10
        </h2>

        {rankedDramas.slice(3).map((drama, idx) => {
          const rank = idx + 4;
          return (
            <div
              key={drama.id}
              onClick={() => playDramaEpisode(drama.id, 1)}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-400/40 flex items-center gap-3 transition-all cursor-pointer group"
            >
              {/* Rank number */}
              <div className="w-8 font-black text-lg text-center text-zinc-400 group-hover:text-cyan-400 transition-colors">
                #{rank}
              </div>

              {/* Thumbnail */}
              <div className="w-12 h-16 rounded-xl overflow-hidden bg-black flex-shrink-0">
                <img
                  src={drama.poster}
                  alt={drama.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Info */}
              <div className="flex-1 truncate">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white/10 text-zinc-300">
                    {drama.genres[0]}
                  </span>
                  <span className="text-[10px] text-amber-300 font-bold">★ {drama.rating}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 truncate">
                  {drama.title}
                </h4>
                <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                  {drama.tagline}
                </p>
              </div>

              {/* Heat and button */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-rose-400" />
                    {drama.views}
                  </span>
                  <span className="text-[10px] text-zinc-500">{drama.totalEpisodes} Episodes</span>
                </div>

                <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-300 group-hover:bg-cyan-500 group-hover:text-black flex items-center justify-center transition-colors">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
