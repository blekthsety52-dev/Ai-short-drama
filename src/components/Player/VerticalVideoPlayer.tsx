import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  ListVideo,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Check,
  Plus,
  Sliders,
  Subtitles,
  FastForward,
  Info,
  ArrowLeft,
  Flame,
} from 'lucide-react';
import { useDrama } from '../../context/DramaContext';

interface HeartAnimation {
  id: number;
  x: number;
  y: number;
}

export const VerticalVideoPlayer: React.FC = () => {
  const {
    currentDrama,
    currentEpisodeNumber,
    currentEpisode,
    nextEpisode,
    prevEpisode,
    isEpisodeUnlocked,
    isEpisodeDrawerOpen,
    setIsEpisodeDrawerOpen,
    isCommentsDrawerOpen,
    setIsCommentsDrawerOpen,
    isInfoDrawerOpen,
    setIsInfoDrawerOpen,
    setIsShareModalOpen,
    setIsUnlockModalOpen,
    setPendingUnlockEpisode,
    playbackSpeed,
    setPlaybackSpeed,
    subtitleLanguage,
    setSubtitleLanguage,
    videoQuality,
    setVideoQuality,
    autoPlayNext,
    setAutoPlayNext,
    isMuted,
    setIsMuted,
    wallet,
    toggleLikeEpisode,
    toggleMyList,
    recordHistory,
    setViewTab,
  } = useDrama();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(currentEpisode?.duration || 75);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const [showSubMenu, setShowSubMenu] = useState<boolean>(false);
  const [showQualityMenu, setShowQualityMenu] = useState<boolean>(false);
  const [isDescExpanded, setIsDescExpanded] = useState<boolean>(false);
  const [hearts, setHearts] = useState<HeartAnimation[]>([]);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [showNextEpPrompt, setShowNextEpPrompt] = useState<boolean>(false);

  const isLiked =
    wallet.likedEpisodes[currentDrama.id]?.includes(currentEpisodeNumber) || false;
  const isBookmarked = wallet.myList.includes(currentDrama.id);

  // Sync video source on episode change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsLoading(true);
      setShowNextEpPrompt(false);
      videoRef.current.playbackRate = playbackSpeed;

      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay with audio was blocked; muted playback usually succeeds
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            }
          });
      }
    }
  }, [currentEpisodeNumber, currentDrama.id]);

  // Sync playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Sync muted
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Time update listener
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration || currentEpisode.duration || 75;
    setCurrentTime(current);
    setDuration(dur);

    // Prompt next episode when 8 seconds remaining
    if (dur - current <= 8 && dur > 10 && !showNextEpPrompt) {
      setShowNextEpPrompt(true);
    } else if (dur - current > 8 && showNextEpPrompt) {
      setShowNextEpPrompt(false);
    }

    // Record history every 5 seconds
    if (Math.floor(current) % 5 === 0) {
      recordHistory(currentDrama.id, currentEpisodeNumber, current, dur);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    recordHistory(currentDrama.id, currentEpisodeNumber, duration, duration);
    if (autoPlayNext) {
      const success = nextEpisode();
      if (!success) {
        // Locked episode will trigger unlock modal
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Double tap to like with animated heart
  const handleDoubleTap = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    let clientX = 0;
    let clientY = 0;

    if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    const rect = containerRef.current?.getBoundingClientRect();
    const x = rect ? clientX - rect.left : 150;
    const y = rect ? clientY - rect.top : 250;

    const newHeart: HeartAnimation = { id: Date.now(), x, y };
    setHearts((prev) => [...prev, newHeart]);

    if (!isLiked) {
      toggleLikeEpisode(currentDrama.id, currentEpisodeNumber);
    }

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 800);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowUp':
          e.preventDefault();
          prevEpisode();
          break;
        case 'ArrowDown':
          e.preventDefault();
          nextEpisode();
          break;
        case 'm':
        case 'M':
          setIsMuted(!isMuted);
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'ArrowLeft':
          if (videoRef.current) {
            videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
          }
          break;
        case 'ArrowRight':
          if (videoRef.current) {
            videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 5);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted, duration, currentEpisodeNumber]);

  // Touch Swipe for mobile gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;

    // Minimum swipe threshold of 60px
    if (Math.abs(diff) > 60) {
      if (diff > 0) {
        // Swiped UP -> Next Episode
        nextEpisode();
      } else {
        // Swiped DOWN -> Prev Episode
        prevEpisode();
      }
    }
    setTouchStartY(null);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Current subtitle cue
  const currentSubtitles = currentEpisode?.subtitles?.[subtitleLanguage] || [];
  const activeSubtitle = currentSubtitles.find(
    (cue) => currentTime >= cue.start && currentTime <= cue.end
  );

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] flex items-center justify-center bg-black overflow-hidden select-none">
      {/* Ambient background glow matching the drama poster */}
      <div
        className="absolute inset-0 opacity-25 filter blur-3xl scale-125 pointer-events-none transition-all duration-700"
        style={{
          backgroundImage: `url(${currentDrama.poster})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      />

      {/* Main 9:16 Portrait Theatre Container */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleTap}
        className="relative w-full h-full max-w-[430px] md:max-h-[860px] md:rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10 flex flex-col justify-between"
      >
        {/* HTML5 Video Element */}
        <div
          onClick={togglePlay}
          className="absolute inset-0 w-full h-full cursor-pointer z-0 bg-black flex items-center justify-center"
        >
          <video
            ref={videoRef}
            src={currentEpisode.videoUrl}
            poster={currentDrama.poster}
            playsInline
            loop={!autoPlayNext}
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            onWaiting={() => setIsLoading(true)}
            onPlaying={() => {
              setIsLoading(false);
              setIsPlaying(true);
            }}
            onLoadedData={() => setIsLoading(false)}
            className="w-full h-full object-cover"
          />

          {/* Fallback subtle cinematic visualizer shimmer when loading */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
              <div className="w-12 h-12 rounded-full border-3 border-cyan-400 border-t-transparent animate-spin" />
              <span className="text-xs font-semibold text-cyan-200 tracking-wider uppercase">
                Loading Episode {currentEpisodeNumber}...
              </span>
            </div>
          )}

          {/* Pause overlay icon */}
          {!isPlaying && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10 transition-opacity">
              <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white scale-110 transition-transform">
                <Play className="w-8 h-8 fill-white ml-1 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Double-tap Heart Burst Particles */}
        {hearts.map((h) => (
          <div
            key={h.id}
            style={{ left: h.x - 30, top: h.y - 30 }}
            className="absolute pointer-events-none z-30 animate-heart-burst"
          >
            <Heart className="w-16 h-16 text-rose-500 fill-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]" />
          </div>
        ))}

        {/* Top Header Controls Bar */}
        <div className="relative z-20 w-full p-3 sm:p-4 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-center justify-between text-white">
          <div className="flex items-center gap-2 max-w-[70%]">
            <button
              onClick={() => setViewTab('discover')}
              className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur border border-white/10 text-white cursor-pointer"
              title="Back to Theater"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold truncate text-white drop-shadow">
                  {currentDrama.title}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-cyan-300 font-medium">
                <span className="bg-cyan-500/20 px-1.5 py-0.2 rounded border border-cyan-500/30 text-cyan-300 font-bold">
                  EP {currentEpisodeNumber}
                </span>
                <span className="text-zinc-400">/ {currentDrama.totalEpisodes}</span>
              </div>
            </div>
          </div>

          {/* Quick Settings Pill */}
          <div className="flex items-center gap-1.5">
            {/* Speed Selector */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSpeedMenu(!showSpeedMenu);
                  setShowSubMenu(false);
                  setShowQualityMenu(false);
                }}
                className="px-2 py-1 rounded bg-black/40 hover:bg-black/60 backdrop-blur border border-white/15 text-[11px] font-bold text-zinc-200 cursor-pointer"
              >
                {playbackSpeed}x
              </button>
              {showSpeedMenu && (
                <div className="absolute right-0 top-8 bg-[#12141f] border border-white/15 rounded-lg shadow-xl py-1 z-30 min-w-[70px]">
                  {[0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setPlaybackSpeed(s);
                        setShowSpeedMenu(false);
                      }}
                      className={`w-full text-center px-2 py-1 text-xs font-semibold cursor-pointer ${
                        playbackSpeed === s ? 'text-cyan-400 bg-white/10' : 'text-zinc-300 hover:bg-white/5'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Subtitles CC Toggle */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSubMenu(!showSubMenu);
                  setShowSpeedMenu(false);
                  setShowQualityMenu(false);
                }}
                className={`p-1.5 rounded bg-black/40 hover:bg-black/60 backdrop-blur border text-[11px] font-bold cursor-pointer ${
                  subtitleLanguage !== 'off'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-white/15 text-zinc-400'
                }`}
                title="Subtitles (CC)"
              >
                <Subtitles className="w-3.5 h-3.5" />
              </button>
              {showSubMenu && (
                <div className="absolute right-0 top-8 bg-[#12141f] border border-white/15 rounded-lg shadow-xl py-1 z-30 min-w-[100px]">
                  {[
                    { id: 'en', label: 'English' },
                    { id: 'es', label: 'Español' },
                    { id: 'id', label: 'Bahasa ID' },
                    { id: 'off', label: 'Turn Off' },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setSubtitleLanguage(sub.id as any);
                        setShowSubMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-semibold cursor-pointer flex items-center justify-between ${
                        subtitleLanguage === sub.id ? 'text-cyan-400 bg-white/10' : 'text-zinc-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{sub.label}</span>
                      {subtitleLanguage === sub.id && <Check className="w-3 h-3 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mute Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur border border-white/15 text-zinc-200 cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Center: Subtitles Render Box */}
        {subtitleLanguage !== 'off' && activeSubtitle && (
          <div className="relative z-20 self-center max-w-[88%] text-center px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 shadow-lg mx-auto mb-2 pointer-events-none">
            <p className="text-xs sm:text-sm font-semibold text-white drop-shadow leading-relaxed">
              {activeSubtitle.text}
            </p>
          </div>
        )}

        {/* Floating "Next Episode" Prompt banner if near end */}
        {showNextEpPrompt && currentEpisodeNumber < currentDrama.totalEpisodes && (
          <div className="relative z-20 self-center mb-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-500/90 to-cyan-500/90 backdrop-blur border border-white/30 text-white text-xs font-bold flex items-center gap-2 shadow-lg animate-bounce">
            <span>Next Ep in 5s</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextEpisode();
              }}
              className="bg-white text-black px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase hover:bg-cyan-200 cursor-pointer"
            >
              Play Now
            </button>
          </div>
        )}

        {/* Bottom Section: Info + Right Action Bar + Scrubber */}
        <div className="relative z-20 w-full p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col gap-2">
          <div className="flex items-end justify-between gap-3">
            {/* Left: Drama info & tags */}
            <div className="flex-1 text-white pr-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-rose-500/80 text-[10px] font-extrabold tracking-wide uppercase text-white shadow-sm">
                  Trending #1
                </span>
                <span className="text-[11px] text-amber-300 font-bold flex items-center gap-0.5">
                  ★ {currentDrama.rating}
                </span>
                <span className="text-[11px] text-zinc-400">({currentDrama.views} views)</span>
              </div>

              <h2 className="text-sm sm:text-base font-extrabold tracking-tight drop-shadow">
                {currentDrama.title}
              </h2>

              <p
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className={`text-xs text-zinc-300 mt-1 cursor-pointer transition-all ${
                  isDescExpanded ? 'line-clamp-none' : 'line-clamp-2'
                }`}
              >
                {currentDrama.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {currentDrama.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/10 backdrop-blur border border-white/10 text-zinc-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Action Stack (DramaBox Signature Layout) */}
            <div className="flex flex-col items-center gap-3.5 pb-1">
              {/* Creator / Drama Avatar */}
              <div className="relative group">
                <div className="w-10 h-10 rounded-full border-2 border-white/80 overflow-hidden shadow-lg shadow-black/60">
                  <img
                    src={currentDrama.poster}
                    alt={currentDrama.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFollowing(!isFollowing);
                  }}
                  className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center shadow-md cursor-pointer transition-transform ${
                    isFollowing
                      ? 'bg-emerald-500 text-white'
                      : 'bg-rose-500 hover:scale-110 text-white'
                  }`}
                  title={isFollowing ? 'Following' : 'Follow Drama'}
                >
                  {isFollowing ? <Check className="w-2.5 h-2.5" /> : <Plus className="w-3 h-3" />}
                </button>
              </div>

              {/* Like Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLikeEpisode(currentDrama.id, currentEpisodeNumber);
                }}
                className="flex flex-col items-center gap-0.5 group cursor-pointer"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                    isLiked ? 'text-rose-500 bg-rose-500/20' : 'text-white bg-black/40 hover:bg-black/60'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'
                    }`}
                  />
                </div>
                <span className="text-[10px] font-bold text-white drop-shadow">
                  {Math.floor(currentDrama.likesCount / 1000)}k
                </span>
              </button>

              {/* Comments Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCommentsDrawerOpen(true);
                }}
                className="flex flex-col items-center gap-0.5 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-white drop-shadow">
                  {Math.floor(currentDrama.commentsCount / 1000)}k
                </span>
              </button>

              {/* Bookmark / My List */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMyList(currentDrama.id);
                }}
                className="flex flex-col items-center gap-0.5 group cursor-pointer"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                    isBookmarked
                      ? 'text-amber-400 bg-amber-400/20'
                      : 'text-white bg-black/40 hover:bg-black/60'
                  }`}
                >
                  <Bookmark
                    className={`w-5 h-5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : 'text-white'}`}
                  />
                </div>
                <span className="text-[10px] font-bold text-white drop-shadow">
                  {isBookmarked ? 'Saved' : 'Collect'}
                </span>
              </button>

              {/* Episodes Drawer Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEpisodeDrawerOpen(true);
                }}
                className="flex flex-col items-center gap-0.5 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500/30 to-blue-500/30 border border-cyan-400/40 hover:border-cyan-400 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
                  <ListVideo className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-cyan-300 drop-shadow">
                  EP {currentEpisodeNumber}
                </span>
              </button>

              {/* Share Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShareModalOpen(true);
                }}
                className="flex flex-col items-center gap-0.5 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-white drop-shadow">Share</span>
              </button>
            </div>
          </div>

          {/* Scrubber Progress Bar and Time */}
          <div className="w-full flex flex-col gap-1 pt-1">
            <div className="flex items-center justify-between text-[10px] font-semibold text-zinc-300 px-0.5">
              <span>{formatTime(currentTime)}</span>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1 cursor-pointer select-none text-[10px] text-zinc-400 hover:text-zinc-200">
                  <input
                    type="checkbox"
                    checked={autoPlayNext}
                    onChange={(e) => setAutoPlayNext(e.target.checked)}
                    className="accent-cyan-400 w-3 h-3 rounded"
                  />
                  <span>Auto Next</span>
                </label>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Slider track */}
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
            />
          </div>

          {/* Quick Episode Steppers (Desktop & Tablet) */}
          <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs">
            <button
              onClick={prevEpisode}
              disabled={currentEpisodeNumber <= 1}
              className="flex items-center gap-1 text-zinc-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronUp className="w-4 h-4" />
              <span>Prev EP</span>
            </button>

            <button
              onClick={() => setIsInfoDrawerOpen(true)}
              className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Drama Details</span>
            </button>

            <button
              onClick={nextEpisode}
              className="flex items-center gap-1 text-cyan-300 hover:text-cyan-200 font-bold cursor-pointer"
            >
              <span>Next EP</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
