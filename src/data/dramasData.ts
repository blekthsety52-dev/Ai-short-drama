import { DRAMA_POSTERS } from '../assets/images';
import { Drama, UserWallet } from '../types/drama';

// Sample video streams that are verified to load smoothly in modern browsers
const SAMPLE_VIDEOS = [
  'https://vjs.zencdn.net/v/oceans.mp4',
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  'https://media.w3.org/2010/05/sintel/trailer.mp4',
];

const generateSubtitles = (dramaTitle: string, epNum: number) => {
  return {
    en: [
      { start: 0.5, end: 3.5, text: `[Suspenseful music plays] You think you can humiliate me in my own city?` },
      { start: 3.8, end: 7.2, text: `Do you have any idea who is standing in front of you right now?!` },
      { start: 7.5, end: 11.0, text: `Guards! Escort this fraud out of the Grand Hotel banquet immediately!` },
      { start: 11.5, end: 15.0, text: `Wait... look at the crest engraved on that black card... It's the Royal Dragon Crest!` },
      { start: 15.5, end: 19.5, text: `Impossible! The Dragon King has been vanished for five long years...` },
      { start: 20.0, end: 24.5, text: `Is it really him?! Madam, we made a catastrophic mistake!` },
      { start: 25.0, end: 29.5, text: `Five years ago, you threw me into the rain. Today, I bought your entire dynasty.` },
      { start: 30.0, end: 34.0, text: `What will happen when the real contract is revealed? Find out in the next episode!` }
    ],
    es: [
      { start: 0.5, end: 3.5, text: `[Música de suspenso] ¿Crees que puedes humillarme en mi propia ciudad?` },
      { start: 3.8, end: 7.2, text: `¡¿Tienes alguna idea de quién está parado frente a ti?!` },
      { start: 7.5, end: 11.0, text: `¡Guardias! ¡Saquen a este fraude del banquete inmediatamente!` },
      { start: 11.5, end: 15.0, text: `Espera... mira el escudo en esa tarjeta negra... ¡Es el Dragón Real!` },
      { start: 15.5, end: 19.5, text: `¡Imposible! El Rey Dragón desapareció hace cinco largos años...` },
      { start: 20.0, end: 24.5, text: `¡¿De verdad es él?! ¡Señora, cometimos un error catastrófico!` },
      { start: 25.0, end: 29.5, text: `Hace cinco años me dejaste en la lluvia. Hoy compré todo tu imperio.` },
      { start: 30.0, end: 34.0, text: `¿Qué pasará cuando se revele el contrato real? ¡Descúbrelo en el próximo episodio!` }
    ],
    id: [
      { start: 0.5, end: 3.5, text: `[Musik menegangkan] Kamu pikir bisa mempermalukan aku di kotaku sendiri?` },
      { start: 3.8, end: 7.2, text: `Apakah kamu tahu siapa yang sebenarnya berdiri di depanmu?!` },
      { start: 7.5, end: 11.0, text: `Penjaga! Usir orang ini dari perjamuan sekarang juga!` },
      { start: 11.5, end: 15.0, text: `Tunggu... lambang di kartu hitam itu... Lambang Naga Kerajaan!` },
      { start: 15.5, end: 19.5, text: `Mustahil! Raja Naga telah menghilang selama 5 tahun lamanya...` },
      { start: 20.0, end: 24.5, text: `Apakah dia benar-benar Raja Naga?! Nyonya, kita telah melakukan kesalahan fatal!` },
      { start: 25.0, end: 29.5, text: `Lima tahun lalu kau mencampakkanku. Hari ini, aku membeli seluruh keluargamu.` },
      { start: 30.0, end: 34.0, text: `Rahasia apa lagi yang akan terbongkar? Lanjut ke episode berikutnya!` }
    ]
  };
};

const createEpisodeList = (count: number, dramaTitle: string, baseId: string) => {
  return Array.from({ length: count }, (_, idx) => {
    const num = idx + 1;
    const isLocked = num > 5; // Episodes 1-5 free!
    const videoUrl = SAMPLE_VIDEOS[(num - 1) % SAMPLE_VIDEOS.length];
    return {
      id: `${baseId}-ep-${num}`,
      number: num,
      title: num === 1 
        ? 'The Disgraceful Return'
        : num === 2
        ? 'A Slap to the Aristocrats'
        : num === 3
        ? 'The Billion-Dollar Black Card'
        : num === 4
        ? 'The Hidden Identity Revealed'
        : num === 5
        ? 'Reckoning at the Penthouse'
        : `Episode ${num}: Shocking Confrontation Part ${num}`,
      duration: 65 + (num * 3) % 45, // between 65s and 110s
      videoUrl,
      isLocked,
      coinCost: 20,
      synopsis: `In episode ${num}, tensions reach a boiling point as unexpected secrets shake the family empire to its foundation.`,
      subtitles: generateSubtitles(dramaTitle, num),
    };
  });
};

export const INITIAL_DRAMAS: Drama[] = [
  {
    id: 'drama-billionaire-heiress',
    title: 'The Double Life of the Billionaire Heiress',
    originalTitle: 'Billionaire Heiress',
    tagline: 'She cleaned their floors by day. She bought their empire by midnight.',
    description: 'After being cast out by her greedy adoptive family and humiliated by her snobbish ex-fiancé, Chloe Vanderbilt reclaims her hidden identity as the sole heiress to the trillion-dollar Global Apex Conglomerate. Disguised as an ordinary catering server, she arrives at the city’s most elite gala to deliver the ultimate payback.',
    poster: DRAMA_POSTERS.billionaireHeiress,
    genres: ['Billionaire', 'Revenge', 'Female Boss'],
    tags: ['Secret Identity', 'Sweet Revenge', 'Plot Twist', 'High Society'],
    rating: 9.8,
    views: '54.2M',
    totalEpisodes: 68,
    status: 'Completed',
    releaseYear: 2026,
    cast: ['Elena Vance', 'Alexander Hayes', 'Victoria Sterling'],
    director: 'Marcus Lin',
    isTrending: true,
    isTopRanked: 1,
    likesCount: 382400,
    bookmarksCount: 94100,
    commentsCount: 14200,
    episodes: createEpisodeList(68, 'The Double Life of the Billionaire Heiress', 'billionaire-heiress'),
    comments: [
      {
        id: 'c1',
        user: 'DramaLover99',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        badge: 'VIP Member',
        text: 'WHEN SHE SLAPPED HIM WITH THE CENTURION BLACK CARD I GASPED SO LOUD!! Best female lead ever! 🔥👑',
        likes: 3840,
        isLiked: true,
        timestamp: '10m ago',
        episodeNumber: 3
      },
      {
        id: 'c2',
        user: 'Leo_V',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        text: 'The pacing in this drama is insane, zero filler scenes. Binged 30 episodes in one sitting!',
        likes: 1290,
        timestamp: '1h ago',
        episodeNumber: 5
      },
      {
        id: 'c3',
        user: 'Sarah_K',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        badge: 'Top Fan',
        text: 'Her mother-in-law\'s facial expression when the real president walked in... pure cinema 🤣💀',
        likes: 852,
        timestamp: '3h ago',
        episodeNumber: 4
      }
    ]
  },
  {
    id: 'drama-shadow-king',
    title: 'Return of the Shadow Dragon King',
    originalTitle: 'Shadow Dragon King',
    tagline: 'Five years of silence. One night to reclaim the underworld.',
    description: 'Treated as a useless live-in son-in-law for five miserable years, Ethan endured endless beatings and ridicule while secretly protecting his wife. But when his daughter’s life is threatened, the dormant Dragon Seal activates. His nine divine generals return to kneel before him: The King has awakened.',
    poster: DRAMA_POSTERS.shadowKing,
    genres: ['Revenge', 'Secret Identity', 'Urban Suspense'],
    tags: ['Dragon King', 'Son-In-Law Comeback', 'Action Thriller', 'Badass Protagonist'],
    rating: 9.9,
    views: '68.7M',
    totalEpisodes: 72,
    status: 'Completed',
    releaseYear: 2026,
    cast: ['Kenji Sato', 'Mia Chen', 'Victor Vance'],
    director: 'David Wu',
    isTrending: true,
    isTopRanked: 2,
    likesCount: 512000,
    bookmarksCount: 148000,
    commentsCount: 22800,
    episodes: createEpisodeList(72, 'Return of the Shadow Dragon King', 'shadow-king'),
    comments: [
      {
        id: 'c4',
        user: 'MaxPower',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        badge: 'VIP Member',
        text: 'The 100 black Maybachs arriving at the funeral gave me goosebumps! Ethan is an absolute beast!!',
        likes: 4210,
        timestamp: '25m ago',
        episodeNumber: 5
      },
      {
        id: 'c5',
        user: 'Claire_R',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
        text: 'Finally a son-in-law drama where the male lead actually fights back instead of waiting for 50 episodes! 10/10',
        likes: 980,
        timestamp: '2h ago',
        episodeNumber: 2
      }
    ]
  },
  {
    id: 'drama-alpha-surrogate',
    title: 'The Alpha\'s Secret Surrogate',
    originalTitle: 'Alpha Surrogate',
    tagline: 'A royal contract. A forbidden mate. A prophecy that cannot be silenced.',
    description: 'Desperate to pay for her younger sister’s life-saving surgery, innocent human student Freya agrees to be the surrogate for Alpha Nicholas of the Obsidian Pack. What neither of them anticipated is that the sacred moon goddess marked Freya as the Alpha\'s true fated mate.',
    poster: DRAMA_POSTERS.alphaSurrogate,
    genres: ['Werewolf & Fantasy', 'Billionaire'],
    tags: ['Fated Mates', 'Alpha Romance', 'Forbidden Love', 'Paranormal'],
    rating: 9.7,
    views: '43.1M',
    totalEpisodes: 55,
    status: 'Completed',
    releaseYear: 2026,
    cast: ['Damian Vance', 'Aria Montgomery', 'Rowan Sterling'],
    director: 'Claire Henderson',
    isTrending: true,
    isTopRanked: 3,
    likesCount: 298000,
    bookmarksCount: 88400,
    commentsCount: 11900,
    episodes: createEpisodeList(55, 'The Alpha\'s Secret Surrogate', 'alpha-surrogate'),
    comments: [
      {
        id: 'c6',
        user: 'MoonGoddess',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        badge: 'VIP Member',
        text: 'The chemistry between Nicholas and Freya is off the charts! That rain scene in Ep 4 made my heart race!',
        likes: 2150,
        timestamp: '40m ago',
        episodeNumber: 4
      }
    ]
  },
  {
    id: 'drama-cold-ceo',
    title: 'Contract Marriage with the Cold CEO',
    originalTitle: 'Cold CEO Marriage',
    tagline: 'We agreed to three rules: No touching, no falling in love, and strictly business.',
    description: 'To save her family’s floral company from hostile takeover, cheerful botanist Lily signs a one-year marriage agreement with notorious ruthless billionaire CEO Julian Stone. He is cold, calculating, and avoids women at all costs. But soon, Julian starts breaking every rule in his own contract.',
    poster: DRAMA_POSTERS.coldCeo,
    genres: ['Billionaire', 'Female Boss'],
    tags: ['Enemies to Lovers', 'Fake Marriage', 'Possessive CEO', 'Slow Burn'],
    rating: 9.6,
    views: '39.8M',
    totalEpisodes: 60,
    status: 'Completed',
    releaseYear: 2026,
    cast: ['Lucas Bradley', 'Hanna Song', 'Julian Vance'],
    director: 'Sarah Yoon',
    isTrending: false,
    isTopRanked: 4,
    likesCount: 245000,
    bookmarksCount: 72100,
    commentsCount: 8400,
    episodes: createEpisodeList(60, 'Contract Marriage with the Cold CEO', 'cold-ceo'),
    comments: [
      {
        id: 'c7',
        user: 'RomanceJunkie',
        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80',
        text: 'He bought the whole restaurant just so she wouldn\'t have to wait in line. Julian you are down bad!! 😂❤️',
        likes: 1840,
        timestamp: '5h ago',
        episodeNumber: 3
      }
    ]
  },
  {
    id: 'drama-divorced-queen',
    title: 'Divorced & Unstoppable: Rise of the Queen',
    originalTitle: 'Rise of the Queen',
    tagline: 'He threw the divorce papers in her face. Three days later, she bought his firm.',
    description: 'For three years, Natasha gave up her career to be the perfect submissive housewife to billionaire Lucas Hayes. The moment his childhood sweetheart returned, Lucas demanded a divorce with zero alimony. Smiling calmly, Natasha signed the papers. What Lucas never knew: Natasha is the anonymous venture capitalist holding 51% of his parent company.',
    poster: DRAMA_POSTERS.divorcedQueen,
    genres: ['Female Boss', 'Revenge', 'Billionaire'],
    tags: ['Strong Female Lead', 'Ex-Husband Regret', 'Corporate Warfare', 'Glow Up'],
    rating: 9.8,
    views: '47.5M',
    totalEpisodes: 65,
    status: 'Completed',
    releaseYear: 2026,
    cast: ['Natasha Romanova', 'Liam Hemsworth', 'Jessica Albright'],
    director: 'Evelyn Taylor',
    isTrending: true,
    isTopRanked: 5,
    likesCount: 341000,
    bookmarksCount: 96000,
    commentsCount: 15300,
    episodes: createEpisodeList(65, 'Divorced & Unstoppable', 'divorced-queen'),
    comments: [
      {
        id: 'c8',
        user: 'GirlPower2026',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        badge: 'VIP Member',
        text: 'The regret on Lucas\'s face when she walked into the shareholder meeting as the Board Chairman!! PURE SATISFACTION!!',
        likes: 3120,
        timestamp: '15m ago',
        episodeNumber: 1
      }
    ]
  },
  {
    id: 'drama-palace-reborn',
    title: 'Reborn in the Forbidden Palace',
    originalTitle: 'Empress Rebirth',
    tagline: 'Poisoned by the Emperor and betrayed by her sister. In this life, she claims the throne.',
    description: 'Betrayed by the sister she loved and poisoned on the day her son was murdered, Empress Shen Ruo dies in agonizing despair. By miraculous fate, she wakes up ten years earlier—on the morning of the Imperial Consort Selection. Armed with knowledge of every treachery and battle to come, Shen Ruo smiles. This time, none of them will survive.',
    poster: DRAMA_POSTERS.palaceReborn,
    genres: ['Historical & Rebirth', 'Revenge'],
    tags: ['Reincarnation', 'Palace Intrigue', 'Ruthless Empress', 'Mastermind'],
    rating: 9.9,
    views: '51.9M',
    totalEpisodes: 80,
    status: 'Completed',
    releaseYear: 2026,
    cast: ['Shen Ling', 'Prince Zhao', 'Consort Yu'],
    director: 'Zhang Weiping',
    isTrending: true,
    isTopRanked: 6,
    likesCount: 420000,
    bookmarksCount: 112000,
    commentsCount: 18900,
    episodes: createEpisodeList(80, 'Reborn in the Forbidden Palace', 'palace-reborn'),
    comments: [
      {
        id: 'c9',
        user: 'HistoryBuff_9',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        text: 'The mind games here put Game of Thrones to shame. Every scheme she executes is brilliant ♟️👑',
        likes: 2790,
        timestamp: '30m ago',
        episodeNumber: 4
      }
    ]
  }
];

export const INITIAL_USER_WALLET: UserWallet = {
  coins: 160,
  vipActive: true,
  vipExpiry: '2026-12-31',
  unlockedEpisodes: {
    'drama-billionaire-heiress': [1, 2, 3, 4, 5, 6, 7], // 6 and 7 unlocked by user
    'drama-shadow-king': [1, 2, 3, 4, 5, 6],
    'drama-alpha-surrogate': [1, 2, 3, 4, 5],
    'drama-cold-ceo': [1, 2, 3, 4, 5],
    'drama-divorced-queen': [1, 2, 3, 4, 5],
    'drama-palace-reborn': [1, 2, 3, 4, 5]
  },
  likedDramas: ['drama-billionaire-heiress', 'drama-shadow-king'],
  likedEpisodes: {
    'drama-billionaire-heiress': [1, 3]
  },
  myList: ['drama-billionaire-heiress', 'drama-divorced-queen', 'drama-palace-reborn'],
  watchHistory: [
    {
      dramaId: 'drama-billionaire-heiress',
      episodeNumber: 3,
      timestamp: Date.now() - 3600000,
      progressSeconds: 42,
      totalSeconds: 74
    },
    {
      dramaId: 'drama-shadow-king',
      episodeNumber: 2,
      timestamp: Date.now() - 86400000,
      progressSeconds: 68,
      totalSeconds: 71
    }
  ],
  lastCheckInDate: '',
  consecutiveCheckInDays: 3
};
