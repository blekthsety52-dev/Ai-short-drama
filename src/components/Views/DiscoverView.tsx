import React, { useState } from 'react';
import { Play, Star, Eye, Bookmark, Flame, Zap, ChevronRight, Info } from 'lucide-react';
import { useDrama } from '../../context/DramaContext';
import { DramaCategory } from '../../types/drama';

export const DiscoverView: React.FC = () => {
  const {
    dramas,
    playDramaEpisode,
    selectedCategory,
    setSelectedCategory,
    toggleMyList,
    wallet,
    setIsInfoDrawerOpen,
  } = useDrama();

  const [heroIndex, setHeroIndex] = useState<number>(0);
  const heroDrama = dramas[heroIndex] || dramas[0];
  const isHeroBookmarked = wallet.myList.includes(heroDrama.id);

  const categories: DramaCategory[] = [
    'All',
    'Billionaire',
    'Revenge',
    'Werewolf & Fantasy',
    'Secret Identity',
    'Female Boss',
    'Historical & Rebirth',
  ];

  const filteredDramas =
    selectedCategory === 'All'
      ? dramas
      : dramas.filter(
          (d) =>
            d.genres.includes(selectedCategory) ||
            d.tags.some((t) => t.toLowerCase().includes(selectedCategory.toLowerCase()))
        );

  const billionaireDramas = dramas.filter((d) => d.genres.includes('Billionaire'));
  const revengeDramas = dramas.filter((d) => d.genres.includes('Revenge'));
  const fantasyDramas = dramas.filter(
    (d) => d.genres.includes('Werewolf & Fantasy') || d.genres.includes('Historical & Rebirth')
  );

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] pb-24 md:pb-12 max-w-7xl mx-auto px-3 sm:px-6 pt-4 space-y-6">
      {/* Hero Billboard Banner */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black min-h-[360px] sm:min-h-[420px] flex items-end">
        {/* Backdrop image */}
        <img
          src={heroDrama.poster}
          alt={heroDrama.title}
          className="absolute inset-0 w-full h-full object-cover filter brightness-50 sm:brightness-60 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-[#07080c]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080c]/90 via-[#07080c]/40 to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 p-5 sm:p-8 max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-black text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-md shadow-rose-500/30">
              <Flame className="w-3 h-3 fill-white" />
              HOT DRAMA
            </span>
            <span className="text-amber-300 font-extrabold text-xs flex items-center gap-1">
              ★ {heroDrama.rating}
            </span>
            <span className="text-zinc-300 text-xs font-semibold">
              · {heroDrama.views} Views
            </span>
            <span className="text-cyan-300 text-xs font-semibold">
              · {heroDrama.totalEpisodes} Episodes
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            {heroDrama.title}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-relaxed">
            {heroDrama.description}
          </p>

          {/* Hero Actions */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              onClick={() => playDramaEpisode(heroDrama.id, 1)}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-transform active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Watch Now (Free)</span>
            </button>

            <button
              onClick={() => toggleMyList(heroDrama.id)}
              className={`px-4 py-3 rounded-full font-bold text-xs sm:text-sm flex items-center gap-1.5 border transition-all cursor-pointer ${
                isHeroBookmarked
                  ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                  : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isHeroBookmarked ? 'fill-amber-400' : ''}`} />
              <span>{isHeroBookmarked ? 'In My List' : 'Add to List'}</span>
            </button>

            <button
              onClick={() => {
                playDramaEpisode(heroDrama.id, 1);
                setIsInfoDrawerOpen(true);
              }}
              className="px-4 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs sm:text-sm flex items-center gap-1 cursor-pointer"
            >
              <Info className="w-4 h-4" />
              <span>Synopsis</span>
            </button>
          </div>
        </div>

        {/* Hero Selector Dots */}
        <div className="absolute top-4 right-4 z-10 flex gap-1.5">
          {dramas.slice(0, 4).map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIndex(i)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                heroIndex === i ? 'w-6 bg-cyan-400' : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
              title={`Switch to Drama ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-black shadow-md shadow-white/20 scale-105'
                  : 'bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* SECTION 1: Trending Now Grid / Carousel */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-base sm:text-lg font-black text-white">Trending Short Dramas</h2>
          </div>
          <span className="text-xs text-zinc-400 font-semibold">
            {filteredDramas.length} series
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredDramas.map((drama) => (
            <div
              key={drama.id}
              onClick={() => playDramaEpisode(drama.id, 1)}
              className="group relative flex flex-col rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-cyan-400/60 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 cursor-pointer"
            >
              {/* Poster 2:3 vertical aspect */}
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
                <img
                  src={drama.poster}
                  alt={drama.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Gradient shade */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Rating Badge */}
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur border border-white/20 text-amber-300 font-bold text-[10px] flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                  <span>{drama.rating}</span>
                </div>

                {/* Episodes count */}
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur border border-white/20 text-cyan-300 font-bold text-[10px]">
                  {drama.totalEpisodes} EP
                </div>

                {/* Hover Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-lg shadow-cyan-400/50 scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-5 h-5 fill-black ml-0.5" />
                  </div>
                </div>

                {/* Bottom stats inside poster */}
                <div className="absolute bottom-2 left-2 right-2 text-white">
                  <span className="text-[10px] font-semibold text-zinc-300 flex items-center gap-1">
                    <Eye className="w-3 h-3 text-zinc-400" />
                    {drama.views}
                  </span>
                </div>
              </div>

              {/* Title & Tagline */}
              <div className="p-2.5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
                    {drama.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                    {drama.tagline}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5">
                  <span className="text-[10px] font-semibold text-rose-400">
                    {drama.genres[0]}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-medium">Free Ep 1-5</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Billionaire & High Society Rows */}
      {billionaireDramas.length > 0 && (
        <section className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">💎</span>
              <h2 className="text-base sm:text-lg font-black text-white">
                Billionaire & High Society Scandals
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {billionaireDramas.map((drama) => (
              <div
                key={drama.id}
                onClick={() => playDramaEpisode(drama.id, 1)}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 flex gap-3 transition-all cursor-pointer group"
              >
                <div className="w-20 sm:w-24 aspect-[2/3] rounded-xl overflow-hidden bg-black flex-shrink-0">
                  <img
                    src={drama.poster}
                    alt={drama.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">
                      {drama.genres.join(' · ')}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1 mt-0.5">
                      {drama.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">
                      {drama.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-[10px] text-zinc-400">★ {drama.rating} ({drama.views})</span>
                    <button className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-bold text-[10px] group-hover:bg-amber-400 group-hover:text-black transition-colors flex items-center gap-1">
                      <Play className="w-3 h-3 fill-current" />
                      <span>Play</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 3: Secret Identity & Revenge */}
      {revengeDramas.length > 0 && (
        <section className="space-y-3 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚔️</span>
            <h2 className="text-base sm:text-lg font-black text-white">
              Ruthless Revenge & Slap to the Face
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {revengeDramas.map((drama) => (
              <div
                key={drama.id}
                onClick={() => playDramaEpisode(drama.id, 1)}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 flex gap-3 transition-all cursor-pointer group"
              >
                <div className="w-20 sm:w-24 aspect-[2/3] rounded-xl overflow-hidden bg-black flex-shrink-0">
                  <img
                    src={drama.poster}
                    alt={drama.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider">
                      {drama.genres.join(' · ')}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mt-0.5">
                      {drama.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">
                      {drama.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-[10px] text-zinc-400">★ {drama.rating} ({drama.views})</span>
                    <button className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 font-bold text-[10px] group-hover:bg-cyan-400 group-hover:text-black transition-colors flex items-center gap-1">
                      <Play className="w-3 h-3 fill-current" />
                      <span>Play</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
