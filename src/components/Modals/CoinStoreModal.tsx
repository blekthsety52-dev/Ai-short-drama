import React, { useState } from 'react';
import {
  X,
  Coins,
  Crown,
  Sparkles,
  Gift,
  CheckCircle,
  Play,
  Share2,
  RotateCw,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useDrama } from '../../context/DramaContext';

export const CoinStoreModal: React.FC = () => {
  const {
    isCoinStoreOpen,
    setIsCoinStoreOpen,
    wallet,
    addCoins,
    claimDailyCheckIn,
  } = useDrama();

  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'checkin' | 'store' | 'tasks'>('checkin');
  const [claimFeedback, setClaimFeedback] = useState<string | null>(null);

  if (!isCoinStoreOpen) return null;

  const today = new Date().toISOString().split('T')[0];
  const isClaimedToday = wallet.lastCheckInDate === today;

  const handleClaim = () => {
    const res = claimDailyCheckIn();
    setClaimFeedback(res.message);
    setTimeout(() => setClaimFeedback(null), 3500);
  };

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinResult(null);

    const outcomes = [30, 50, 80, 100, 200];
    const prize = outcomes[Math.floor(Math.random() * outcomes.length)];

    setTimeout(() => {
      setIsSpinning(false);
      setSpinResult(prize);
      addCoins(prize);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffd700', '#00f0ff', '#ff007f'],
      });
    }, 1800);
  };

  const coinPackages = [
    {
      id: 'p1',
      coins: 100,
      bonus: 20,
      price: '$0.99',
      tag: 'Starter',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'p2',
      coins: 500,
      bonus: 150,
      price: '$4.99',
      tag: 'Popular',
      color: 'from-amber-500 to-rose-500',
    },
    {
      id: 'p3',
      coins: 1200,
      bonus: 500,
      price: '$9.99',
      tag: 'Best Value',
      color: 'from-rose-500 to-purple-600',
    },
    {
      id: 'p4',
      coins: 3000,
      bonus: 1500,
      price: '$19.99',
      tag: 'VIP Elite',
      color: 'from-yellow-400 to-amber-600',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#10121d] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Balance */}
        <div className="relative p-5 bg-gradient-to-br from-amber-600/20 via-rose-600/15 to-transparent border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 p-0.5 shadow-lg shadow-amber-500/30 flex items-center justify-center">
              <span className="text-2xl">🪙</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                My Drama Balance
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-white">{wallet.coins}</span>
                <span className="text-xs text-zinc-400 font-semibold">Coins</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsCoinStoreOpen(false)}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-white/10 bg-white/2">
          {[
            { id: 'checkin', label: '7-Day Check-in' },
            { id: 'tasks', label: 'Free Tasks & Wheel' },
            { id: 'store', label: 'Top-Up Store' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 text-xs font-bold transition-colors cursor-pointer text-center ${
                activeTab === tab.id
                  ? 'text-cyan-300 border-b-2 border-cyan-400 bg-white/5'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: 7-DAY CHECK-IN */}
          {activeTab === 'checkin' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-white">Daily Rewards</h4>
                  <p className="text-xs text-zinc-400">
                    Log in consecutively to unlock huge coin bonuses!
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-300">
                  Day {wallet.consecutiveCheckInDays} / 7
                </span>
              </div>

              {/* 7 Days Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {[
                  { day: 1, reward: 30 },
                  { day: 2, reward: 40 },
                  { day: 3, reward: 50 },
                  { day: 4, reward: 60 },
                  { day: 5, reward: 70 },
                  { day: 6, reward: 80 },
                  { day: 7, reward: 150, special: true },
                ].map((item) => {
                  const isPast = item.day < wallet.consecutiveCheckInDays;
                  const isCurrent = item.day === wallet.consecutiveCheckInDays;
                  const isTodayChecked = isCurrent && isClaimedToday;

                  return (
                    <div
                      key={item.day}
                      className={`relative p-2 rounded-xl flex flex-col items-center justify-center border text-center transition-all ${
                        isTodayChecked || isPast
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : isCurrent
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/40 animate-pulse'
                          : item.special
                          ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                          : 'bg-white/5 border-white/5 text-zinc-400'
                      }`}
                    >
                      <span className="text-[10px] font-bold">Day {item.day}</span>
                      <span className="text-lg my-0.5">{item.special ? '🎁' : '🪙'}</span>
                      <span className="text-[11px] font-extrabold">+{item.reward}</span>
                      {isPast && (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 absolute top-1 right-1" />
                      )}
                    </div>
                  );
                })}
              </div>

              {claimFeedback && (
                <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-center text-xs font-bold text-cyan-200">
                  {claimFeedback}
                </div>
              )}

              <button
                onClick={handleClaim}
                disabled={isClaimedToday}
                className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:opacity-90 disabled:opacity-50 text-black shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <Gift className="w-4 h-4 fill-black" />
                <span>
                  {isClaimedToday
                    ? 'Checked In Today (Come Back Tomorrow)'
                    : 'Claim Daily Check-In Coins'}
                </span>
              </button>
            </div>
          )}

          {/* TAB 2: FREE TASKS & WHEEL */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              {/* Lucky Spin Wheel */}
              <div className="p-4 rounded-2xl bg-gradient-to-tr from-cyan-950/40 to-indigo-950/40 border border-cyan-500/30 flex flex-col items-center text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  Lucky Drama Wheel
                </span>
                <p className="text-xs text-zinc-300 mt-0.5">
                  Spin every day to win up to 200 Free Coins!
                </p>

                <div className="my-4 relative flex items-center justify-center">
                  <div
                    className={`w-28 h-28 rounded-full border-4 border-cyan-400/50 flex items-center justify-center bg-black/60 shadow-xl ${
                      isSpinning ? 'animate-spin' : ''
                    }`}
                  >
                    <span className="text-3xl">🎡</span>
                  </div>
                </div>

                {spinResult && (
                  <div className="mb-3 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-extrabold border border-cyan-400">
                    🎉 Won +{spinResult} Coins!
                  </div>
                )}

                <button
                  onClick={handleSpinWheel}
                  disabled={isSpinning}
                  className="px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/30"
                >
                  <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                  <span>{isSpinning ? 'Spinning...' : 'Spin For Free'}</span>
                </button>
              </div>

              {/* Instant Free Task Cards */}
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400">
                      <Play className="w-4 h-4 fill-rose-400" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Watch Short Trailer
                      </span>
                      <span className="text-[10px] text-zinc-400">Watch 5s drama teaser</span>
                    </div>
                  </div>
                  <button
                    onClick={() => addCoins(25)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold cursor-pointer"
                  >
                    +25 🪙 Free
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Share Drama</span>
                      <span className="text-[10px] text-zinc-400">Share with drama friends</span>
                    </div>
                  </div>
                  <button
                    onClick={() => addCoins(50)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold cursor-pointer"
                  >
                    +50 🪙 Free
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TOP-UP STORE */}
          {activeTab === 'store' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                {coinPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between hover:border-amber-400/50 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        {pkg.tag}
                      </span>
                      <span className="text-xs text-emerald-400 font-bold">
                        +{pkg.bonus} Bonus
                      </span>
                    </div>

                    <div className="my-1">
                      <span className="text-xl font-black text-white">
                        {pkg.coins + pkg.bonus}
                      </span>
                      <span className="text-xs text-amber-300 ml-1">🪙</span>
                    </div>

                    <button
                      onClick={() => {
                        addCoins(pkg.coins + pkg.bonus);
                      }}
                      className="mt-2 w-full py-2 rounded-xl bg-white/10 hover:bg-amber-400 group-hover:bg-amber-500 group-hover:text-black font-bold text-xs text-white transition-colors cursor-pointer"
                    >
                      {pkg.price} (Simulate)
                    </button>
                  </div>
                ))}
              </div>

              {/* Unlimited VIP Pass Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-cyan-500/20 border border-rose-500/30 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-rose-400 fill-rose-400" />
                    <span className="text-xs font-black text-white">VIP Unlimited Pass</span>
                  </div>
                  <p className="text-[10px] text-zinc-300 mt-0.5">
                    Unlock all dramas & episodes without restrictions
                  </p>
                </div>
                <button
                  onClick={() => addCoins(999)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-extrabold text-xs cursor-pointer shadow-md shadow-rose-500/20"
                >
                  Activate VIP
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
