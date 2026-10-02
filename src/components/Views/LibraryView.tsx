import React, { useState } from 'react';
import { Bookmark, Clock, Heart, Play, Trash2, Eye, Star } from 'lucide-react';
import { useDrama } from '../../context/DramaContext';

export const LibraryView: React.FC = () => {
  const { dramas, wallet, playDramaEpisode, toggleMyList } = useDrama();
  const [activeTab, setActiveTab] = useState<'history' | 'saved' | 'liked'>('history');

  const savedDramas = dramas.filter((d) => wallet.myList.includes(d.id));
  const likedDramas = dramas.filter((d) => wallet.likedDramas.includes(d.id));

  // Match history entries with drama data
  const historyItems = wallet.watchHistory
    .map((h) => {
      const drama = dramas.find((d) => d.id === h.dramaId);
      return drama ? { ...h, drama } : null;
    })
    .filter(Boolean) as Array<{
    dramaId: string;
    episodeNumber: number;
    timestamp: number;
    progressSeconds: number;
    totalSeconds: number;
    drama: (typeof dramas)[0];
  }>;

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] pb-24 md:pb-12 max-w-5xl mx-auto px-3 sm:px-6 pt-4 space-y-6">
      {/* Header */}
      <div className="p-5 rounded-3xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">My Theater Library</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Continue where you left off or explore your saved drama bookmarks
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 rounded-full bg-black/40 border border-white/10 self-start sm:self-auto">
          {[
            { id: 'history', label: 'History', icon: <Clock className="w-3.5 h-3.5" /> },
            { id: 'saved', label: 'Saved List', icon: <Bookmark className="w-3.5 h-3.5" /> },
            { id: 'liked', label: 'Liked', icon: <Heart className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: WATCH HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
            Continue Watching ({historyItems.length})
          </h2>

          {historyItems.length === 0 ? (
            <div className="text-center py-16 rounded-3xl bg-white/2 border border-white/5 space-y-3">
              <Clock className="w-10 h-10 text-zinc-600 mx-auto" />
              <p className="text-sm font-bold text-zinc-400">No watch history yet</p>
              <p className="text-xs text-zinc-500">
                Start watching trending vertical dramas and they will appear here!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {historyItems.map((item) => {
                const percent = Math.min(
                  100,
                  Math.round((item.progressSeconds / (item.totalSeconds || 80)) * 100)
                );
                return (
                  <div
                    key={`${item.dramaId}_${item.episodeNumber}`}
                    onClick={() => playDramaEpisode(item.dramaId, item.episodeNumber)}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/50 flex gap-3 transition-all cursor-pointer group"
                  >
                    <div className="relative w-20 aspect-[2/3] rounded-xl overflow-hidden bg-black flex-shrink-0">
                      <img
                        src={item.drama.poster}
                        alt={item.drama.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10">
                        <Play className="w-5 h-5 fill-white text-white drop-shadow" />
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wide">
                          Watched EP {item.episodeNumber}
                        </span>
                        <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 truncate mt-0.5">
                          {item.drama.title}
                        </h4>
                        <span className="text-[11px] text-zinc-400 block mt-1">
                          Progress: {percent}%
                        </span>
                      </div>

                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-2">
                        <div
                          className="bg-cyan-400 h-full rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAVED LIST */}
      {activeTab === 'saved' && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
            Saved Dramas ({savedDramas.length})
          </h2>

          {savedDramas.length === 0 ? (
            <div className="text-center py-16 rounded-3xl bg-white/2 border border-white/5 space-y-3">
              <Bookmark className="w-10 h-10 text-zinc-600 mx-auto" />
              <p className="text-sm font-bold text-zinc-400">Your list is empty</p>
              <p className="text-xs text-zinc-500">
                Click the Bookmark icon on any drama to add it to your personal list.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {savedDramas.map((drama) => (
                <div
                  key={drama.id}
                  onClick={() => playDramaEpisode(drama.id, 1)}
                  className="group relative flex flex-col rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-cyan-400/60 transition-all cursor-pointer"
                >
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-black">
                    <img
                      src={drama.poster}
                      alt={drama.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-amber-300 text-[10px] font-bold">
                      ★ {drama.rating}
                    </div>
                  </div>
                  <div className="p-2.5 flex flex-col justify-between flex-1">
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                      {drama.title}
                    </h4>
                    <span className="text-[10px] text-zinc-400 mt-1">
                      {drama.totalEpisodes} Episodes
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LIKED DRAMAS */}
      {activeTab === 'liked' && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
            Liked Series ({likedDramas.length})
          </h2>

          {likedDramas.length === 0 ? (
            <div className="text-center py-16 rounded-3xl bg-white/2 border border-white/5 space-y-3">
              <Heart className="w-10 h-10 text-zinc-600 mx-auto" />
              <p className="text-sm font-bold text-zinc-400">No liked dramas yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {likedDramas.map((drama) => (
                <div
                  key={drama.id}
                  onClick={() => playDramaEpisode(drama.id, 1)}
                  className="group relative flex flex-col rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-rose-400/60 transition-all cursor-pointer"
                >
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-black">
                    <img
                      src={drama.poster}
                      alt={drama.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-2.5">
                    <h4 className="text-xs font-bold text-white group-hover:text-rose-300 truncate">
                      {drama.title}
                    </h4>
                    <span className="text-[10px] text-zinc-400 mt-1 block">
                      {drama.totalEpisodes} Episodes
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
