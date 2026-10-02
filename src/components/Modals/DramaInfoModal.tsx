import React from 'react';
import { X, Play, Bookmark, Star, Eye, Calendar, User, Film, Share2 } from 'lucide-react';
import { useDrama } from '../../context/DramaContext';

export const DramaInfoModal: React.FC = () => {
  const {
    currentDrama,
    isInfoDrawerOpen,
    setIsInfoDrawerOpen,
    playDramaEpisode,
    toggleMyList,
    setIsShareModalOpen,
    wallet,
    dramas,
  } = useDrama();

  if (!isInfoDrawerOpen) return null;

  const isBookmarked = wallet.myList.includes(currentDrama.id);
  const relatedDramas = dramas.filter((d) => d.id !== currentDrama.id).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#0e101a] border border-white/10 rounded-3xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner with Drama Poster Backdrop */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden flex-shrink-0">
          <img
            src={currentDrama.poster}
            alt={currentDrama.title}
            className="w-full h-full object-cover filter brightness-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e101a] via-[#0e101a]/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={() => setIsInfoDrawerOpen(false)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Overlay titles */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div className="pr-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-rose-500 text-[10px] font-extrabold uppercase text-white">
                  {currentDrama.status}
                </span>
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  {currentDrama.rating}
                </span>
                <span className="text-xs text-zinc-300 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-zinc-400" />
                  {currentDrama.views}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                {currentDrama.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Scrollable details */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* Quick Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsInfoDrawerOpen(false);
                playDramaEpisode(currentDrama.id, 1);
              }}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Watch From Episode 1</span>
            </button>

            <button
              onClick={() => toggleMyList(currentDrama.id)}
              className={`p-3 rounded-xl border flex items-center justify-center cursor-pointer transition-colors ${
                isBookmarked
                  ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
              title="Add to My List"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={() => {
                setIsInfoDrawerOpen(false);
                setIsShareModalOpen(true);
              }}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 flex items-center justify-center cursor-pointer"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Tagline */}
          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20">
            <p className="text-xs italic text-cyan-200 font-medium">"{currentDrama.tagline}"</p>
          </div>

          {/* Synopsis */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Synopsis
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {currentDrama.description}
            </p>
          </div>

          {/* Genres & Tags */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Categories & Themes
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {currentDrama.genres.map((g) => (
                <span
                  key={g}
                  className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold"
                >
                  {g}
                </span>
              ))}
              {currentDrama.tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Cast & Director */}
          <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-white/10">
            <div>
              <span className="text-zinc-500 block">Director</span>
              <span className="text-zinc-200 font-semibold">{currentDrama.director}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Total Episodes</span>
              <span className="text-zinc-200 font-semibold">
                {currentDrama.totalEpisodes} Episodes (~1-2m each)
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-zinc-500 block">Starring Cast</span>
              <span className="text-zinc-200 font-semibold">
                {currentDrama.cast.join(', ')}
              </span>
            </div>
          </div>

          {/* Related Dramas */}
          <div className="pt-2 border-t border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              You May Also Like
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {relatedDramas.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    playDramaEpisode(rel.id, 1);
                    setIsInfoDrawerOpen(false);
                  }}
                  className="group cursor-pointer flex flex-col"
                >
                  <div className="aspect-[2/3] rounded-xl overflow-hidden border border-white/10 group-hover:border-cyan-400 transition-all mb-1">
                    <img
                      src={rel.poster}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-zinc-200 truncate group-hover:text-cyan-300">
                    {rel.title}
                  </span>
                  <span className="text-[10px] text-zinc-500">★ {rel.rating}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
