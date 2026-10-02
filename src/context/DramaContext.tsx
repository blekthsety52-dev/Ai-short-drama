import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Drama, Episode, UserWallet, DramaCategory } from '../types/drama';
import { INITIAL_DRAMAS, INITIAL_USER_WALLET } from '../data/dramasData';

export type ViewTab = 'foryou' | 'discover' | 'rankings' | 'rewards' | 'library' | 'player';

interface DramaContextType {
  dramas: Drama[];
  currentDrama: Drama;
  currentEpisodeNumber: number;
  currentEpisode: Episode;
  viewTab: ViewTab;
  setViewTab: (tab: ViewTab) => void;
  selectedCategory: DramaCategory;
  setSelectedCategory: (cat: DramaCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  
  // Navigation actions
  playDramaEpisode: (dramaId: string, episodeNum?: number) => void;
  nextEpisode: () => boolean;
  prevEpisode: () => boolean;
  nextDrama: () => void;
  prevDrama: () => void;
  
  // Player drawer states
  isEpisodeDrawerOpen: boolean;
  setIsEpisodeDrawerOpen: (open: boolean) => void;
  isCommentsDrawerOpen: boolean;
  setIsCommentsDrawerOpen: (open: boolean) => void;
  isInfoDrawerOpen: boolean;
  setIsInfoDrawerOpen: (open: boolean) => void;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  isUnlockModalOpen: boolean;
  setIsUnlockModalOpen: (open: boolean) => void;
  pendingUnlockEpisode: number | null;
  setPendingUnlockEpisode: (epNum: number | null) => void;
  isCoinStoreOpen: boolean;
  setIsCoinStoreOpen: (open: boolean) => void;
  
  // Player playback controls & preferences
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  subtitleLanguage: 'en' | 'es' | 'id' | 'off';
  setSubtitleLanguage: (lang: 'en' | 'es' | 'id' | 'off') => void;
  videoQuality: '1080P' | '720P' | '480P';
  setVideoQuality: (q: '1080P' | '720P' | '480P') => void;
  autoPlayNext: boolean;
  setAutoPlayNext: (val: boolean) => void;
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
  
  // User wallet & interactions
  wallet: UserWallet;
  toggleLikeEpisode: (dramaId: string, episodeNumber: number) => void;
  toggleMyList: (dramaId: string) => void;
  unlockEpisode: (dramaId: string, episodeNumber: number) => boolean;
  unlockAllEpisodes: (dramaId: string) => boolean;
  addCoins: (amount: number, reason?: string) => void;
  claimDailyCheckIn: () => { success: boolean; coins: number; message: string };
  recordHistory: (dramaId: string, episodeNumber: number, progressSeconds: number, totalSeconds: number) => void;
  addComment: (dramaId: string, episodeNumber: number, text: string) => void;
  likeComment: (dramaId: string, commentId: string) => void;
  isEpisodeUnlocked: (dramaId: string, episodeNumber: number) => boolean;
}

const DramaContext = createContext<DramaContextType | undefined>(undefined);

const STORAGE_WALLET_KEY = 'ai_short_drama_wallet_v1';
const STORAGE_LIKES_KEY = 'ai_short_drama_likes_v1';

export const DramaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dramas, setDramas] = useState<Drama[]>(() => {
    return INITIAL_DRAMAS;
  });

  const [currentDramaId, setCurrentDramaId] = useState<string>(INITIAL_DRAMAS[0].id);
  const [currentEpisodeNumber, setCurrentEpisodeNumber] = useState<number>(1);
  const [viewTab, setViewTab] = useState<ViewTab>('foryou');
  const [selectedCategory, setSelectedCategory] = useState<DramaCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Modals & drawers
  const [isEpisodeDrawerOpen, setIsEpisodeDrawerOpen] = useState(false);
  const [isCommentsDrawerOpen, setIsCommentsDrawerOpen] = useState(false);
  const [isInfoDrawerOpen, setIsInfoDrawerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [pendingUnlockEpisode, setPendingUnlockEpisode] = useState<number | null>(null);
  const [isCoinStoreOpen, setIsCoinStoreOpen] = useState(false);

  // Playback settings
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [subtitleLanguage, setSubtitleLanguage] = useState<'en' | 'es' | 'id' | 'off'>('en');
  const [videoQuality, setVideoQuality] = useState<'1080P' | '720P' | '480P'>('1080P');
  const [autoPlayNext, setAutoPlayNext] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // User wallet state
  const [wallet, setWallet] = useState<UserWallet>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_WALLET_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback to initial
    }
    return INITIAL_USER_WALLET;
  });

  // Save wallet to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_WALLET_KEY, JSON.stringify(wallet));
    } catch (e) {
      console.warn('Unable to save wallet to localStorage', e);
    }
  }, [wallet]);

  const currentDrama = dramas.find((d) => d.id === currentDramaId) || dramas[0];
  const currentEpisode =
    currentDrama.episodes.find((ep) => ep.number === currentEpisodeNumber) ||
    currentDrama.episodes[0];

  const isEpisodeUnlocked = (dramaId: string, episodeNum: number): boolean => {
    if (episodeNum <= 5) return true; // first 5 episodes always free
    const unlocked = wallet.unlockedEpisodes[dramaId] || [];
    return unlocked.includes(episodeNum);
  };

  const playDramaEpisode = (dramaId: string, episodeNum: number = 1) => {
    const targetDrama = dramas.find((d) => d.id === dramaId);
    if (!targetDrama) return;

    if (!isEpisodeUnlocked(dramaId, episodeNum)) {
      setPendingUnlockEpisode(episodeNum);
      setIsUnlockModalOpen(true);
      return;
    }

    setCurrentDramaId(dramaId);
    setCurrentEpisodeNumber(episodeNum);
    setViewTab('player');
    // Close drawers on drama switch
    setIsEpisodeDrawerOpen(false);
    setIsCommentsDrawerOpen(false);
    setIsInfoDrawerOpen(false);
  };

  const nextEpisode = (): boolean => {
    const nextNum = currentEpisodeNumber + 1;
    if (nextNum > currentDrama.totalEpisodes) {
      // Advance to next drama
      nextDrama();
      return true;
    }

    if (!isEpisodeUnlocked(currentDrama.id, nextNum)) {
      setPendingUnlockEpisode(nextNum);
      setIsUnlockModalOpen(true);
      return false;
    }

    setCurrentEpisodeNumber(nextNum);
    return true;
  };

  const prevEpisode = (): boolean => {
    if (currentEpisodeNumber <= 1) return false;
    setCurrentEpisodeNumber(currentEpisodeNumber - 1);
    return true;
  };

  const nextDrama = () => {
    const currentIndex = dramas.findIndex((d) => d.id === currentDramaId);
    const nextIdx = (currentIndex + 1) % dramas.length;
    setCurrentDramaId(dramas[nextIdx].id);
    setCurrentEpisodeNumber(1);
  };

  const prevDrama = () => {
    const currentIndex = dramas.findIndex((d) => d.id === currentDramaId);
    const prevIdx = (currentIndex - 1 + dramas.length) % dramas.length;
    setCurrentDramaId(dramas[prevIdx].id);
    setCurrentEpisodeNumber(1);
  };

  const toggleLikeEpisode = (dramaId: string, episodeNumber: number) => {
    setWallet((prev) => {
      const epLikes = prev.likedEpisodes[dramaId] || [];
      const isAlreadyLiked = epLikes.includes(episodeNumber);
      const newEpLikes = isAlreadyLiked
        ? epLikes.filter((n) => n !== episodeNumber)
        : [...epLikes, episodeNumber];

      return {
        ...prev,
        likedEpisodes: {
          ...prev.likedEpisodes,
          [dramaId]: newEpLikes,
        },
      };
    });

    setDramas((prev) =>
      prev.map((d) => {
        if (d.id === dramaId) {
          const isLiked = wallet.likedEpisodes[dramaId]?.includes(episodeNumber);
          return {
            ...d,
            likesCount: isLiked ? d.likesCount - 1 : d.likesCount + 1,
          };
        }
        return d;
      })
    );
  };

  const toggleMyList = (dramaId: string) => {
    setWallet((prev) => {
      const inList = prev.myList.includes(dramaId);
      const newList = inList
        ? prev.myList.filter((id) => id !== dramaId)
        : [...prev.myList, dramaId];
      return {
        ...prev,
        myList: newList,
      };
    });

    setDramas((prev) =>
      prev.map((d) => {
        if (d.id === dramaId) {
          const inList = wallet.myList.includes(dramaId);
          return {
            ...d,
            bookmarksCount: inList ? d.bookmarksCount - 1 : d.bookmarksCount + 1,
          };
        }
        return d;
      })
    );
  };

  const unlockEpisode = (dramaId: string, episodeNumber: number): boolean => {
    const cost = 20;
    if (wallet.coins < cost) {
      setIsUnlockModalOpen(false);
      setIsCoinStoreOpen(true);
      return false;
    }

    setWallet((prev) => {
      const currentList = prev.unlockedEpisodes[dramaId] || [];
      if (currentList.includes(episodeNumber)) return prev;
      return {
        ...prev,
        coins: prev.coins - cost,
        unlockedEpisodes: {
          ...prev.unlockedEpisodes,
          [dramaId]: [...currentList, episodeNumber],
        },
      };
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#00e5ff', '#ff007f', '#ffd700'],
    });

    setIsUnlockModalOpen(false);
    setPendingUnlockEpisode(null);
    setCurrentEpisodeNumber(episodeNumber);
    return true;
  };

  const unlockAllEpisodes = (dramaId: string): boolean => {
    const drama = dramas.find((d) => d.id === dramaId);
    if (!drama) return false;
    const cost = 199;
    if (wallet.coins < cost) {
      setIsUnlockModalOpen(false);
      setIsCoinStoreOpen(true);
      return false;
    }

    const allEpNums = Array.from({ length: drama.totalEpisodes }, (_, i) => i + 1);

    setWallet((prev) => ({
      ...prev,
      coins: prev.coins - cost,
      unlockedEpisodes: {
        ...prev.unlockedEpisodes,
        [dramaId]: allEpNums,
      },
    }));

    confetti({
      particleCount: 90,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#00e5ff', '#ff007f', '#ffd700'],
    });

    setIsUnlockModalOpen(false);
    return true;
  };

  const addCoins = (amount: number) => {
    setWallet((prev) => ({
      ...prev,
      coins: prev.coins + amount,
    }));
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#ffd700', '#ffb703'],
    });
  };

  const claimDailyCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    if (wallet.lastCheckInDate === today) {
      return { success: false, coins: 0, message: 'Already checked in today! Come back tomorrow.' };
    }

    const consecutive = (wallet.consecutiveCheckInDays % 7) + 1;
    const bonusCoins = 30 + consecutive * 10;

    setWallet((prev) => ({
      ...prev,
      coins: prev.coins + bonusCoins,
      lastCheckInDate: today,
      consecutiveCheckInDays: consecutive,
    }));

    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#ffd700', '#00e5ff', '#ff007f'],
    });

    return {
      success: true,
      coins: bonusCoins,
      message: `Checked in Day ${consecutive}! Earned +${bonusCoins} Coins!`,
    };
  };

  const recordHistory = (
    dramaId: string,
    episodeNumber: number,
    progressSeconds: number,
    totalSeconds: number
  ) => {
    setWallet((prev) => {
      const filtered = prev.watchHistory.filter(
        (h) => !(h.dramaId === dramaId && h.episodeNumber === episodeNumber)
      );
      return {
        ...prev,
        watchHistory: [
          {
            dramaId,
            episodeNumber,
            timestamp: Date.now(),
            progressSeconds: Math.floor(progressSeconds),
            totalSeconds: Math.floor(totalSeconds),
          },
          ...filtered.slice(0, 30),
        ],
      };
    });
  };

  const addComment = (dramaId: string, episodeNumber: number, text: string) => {
    if (!text.trim()) return;
    const newComment = {
      id: `c_${Date.now()}`,
      user: 'You (VIP)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      badge: 'VIP Member',
      text: text.trim(),
      likes: 1,
      isLiked: true,
      timestamp: 'Just now',
      episodeNumber,
    };

    setDramas((prev) =>
      prev.map((d) => {
        if (d.id === dramaId) {
          return {
            ...d,
            commentsCount: d.commentsCount + 1,
            comments: [newComment, ...d.comments],
          };
        }
        return d;
      })
    );
  };

  const likeComment = (dramaId: string, commentId: string) => {
    setDramas((prev) =>
      prev.map((d) => {
        if (d.id === dramaId) {
          return {
            ...d,
            comments: d.comments.map((c) => {
              if (c.id === commentId) {
                const nowLiked = !c.isLiked;
                return {
                  ...c,
                  isLiked: nowLiked,
                  likes: nowLiked ? c.likes + 1 : c.likes - 1,
                };
              }
              return c;
            }),
          };
        }
        return d;
      })
    );
  };

  return (
    <DramaContext.Provider
      value={{
        dramas,
        currentDrama,
        currentEpisodeNumber,
        currentEpisode,
        viewTab,
        setViewTab,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        playDramaEpisode,
        nextEpisode,
        prevEpisode,
        nextDrama,
        prevDrama,
        isEpisodeDrawerOpen,
        setIsEpisodeDrawerOpen,
        isCommentsDrawerOpen,
        setIsCommentsDrawerOpen,
        isInfoDrawerOpen,
        setIsInfoDrawerOpen,
        isShareModalOpen,
        setIsShareModalOpen,
        isUnlockModalOpen,
        setIsUnlockModalOpen,
        pendingUnlockEpisode,
        setPendingUnlockEpisode,
        isCoinStoreOpen,
        setIsCoinStoreOpen,
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
        unlockEpisode,
        unlockAllEpisodes,
        addCoins,
        claimDailyCheckIn,
        recordHistory,
        addComment,
        likeComment,
        isEpisodeUnlocked,
      }}
    >
      {children}
    </DramaContext.Provider>
  );
};

export const useDrama = () => {
  const ctx = useContext(DramaContext);
  if (!ctx) throw new Error('useDrama must be used within DramaProvider');
  return ctx;
};
