export interface SubtitleCue {
  start: number;
  end: number;
  text: string;
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  duration: number; // in seconds
  videoUrl: string;
  isLocked: boolean;
  coinCost: number;
  synopsis: string;
  subtitles?: Record<string, SubtitleCue[]>; // 'en', 'es', 'id'
}

export interface CommentItem {
  id: string;
  user: string;
  avatar: string;
  badge?: string;
  text: string;
  likes: number;
  isLiked?: boolean;
  timestamp: string;
  episodeNumber: number;
}

export interface Drama {
  id: string;
  title: string;
  originalTitle?: string;
  tagline: string;
  description: string;
  poster: string;
  genres: string[];
  tags: string[];
  rating: number;
  views: string;
  totalEpisodes: number;
  status: 'Completed' | 'Updating';
  releaseYear: number;
  cast: string[];
  director: string;
  isTrending?: boolean;
  isTopRanked?: number;
  likesCount: number;
  bookmarksCount: number;
  commentsCount: number;
  episodes: Episode[];
  comments: CommentItem[];
}

export interface UserWallet {
  coins: number;
  vipActive: boolean;
  vipExpiry: string;
  unlockedEpisodes: Record<string, number[]>; // dramaId -> array of episode numbers
  likedDramas: string[];
  likedEpisodes: Record<string, number[]>; // dramaId -> array of episode numbers
  myList: string[];
  watchHistory: Array<{
    dramaId: string;
    episodeNumber: number;
    timestamp: number;
    progressSeconds: number;
    totalSeconds: number;
  }>;
  lastCheckInDate: string;
  consecutiveCheckInDays: number;
}

export type DramaCategory = 
  | 'All'
  | 'Billionaire'
  | 'Revenge'
  | 'Werewolf & Fantasy'
  | 'Secret Identity'
  | 'Female Boss'
  | 'Historical & Rebirth'
  | 'Urban Suspense';
