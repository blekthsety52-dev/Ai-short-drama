import React, { useState } from 'react';
import { Gift, Coins, Crown, Sparkles, CheckCircle2, RotateCw, Play, Share2, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useDrama } from '../../context/DramaContext';

export const RewardsView: React.FC = () => {
  const { wallet, claimDailyCheckIn, addCoins, setIsCoinStoreOpen } = useDrama();
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const isClaimedToday = wallet.lastCheckInDate === today;

  const handleClaim = () => {
    const res = claimDailyCheckIn();
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinResult(null);

    const outcomes = [30, 60, 80, 100, 150, 200];
    const prize = outcomes[Math.floor(Math.random() * outcomes.length)];

    setTimeout(() => {
      setIsSpinning(false);
      setSpinResult(prize);
      addCoins(prize);
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ffd700', '#00f0ff', '#ff007f'],
      });
    }, 1800);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] pb-24 md:pb-12 max-w-4xl mx-auto px-3 sm:px-6 pt-4 space-y-6">
      {/* Wallet Balance Hero Card */}
      <div className="relative p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-rose-500/15 to-purple-600/20 border border-amber-500/30 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 p-1 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/30">
            🪙
          </div>
          <div>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Coin Balance
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-white">{wallet.coins}</span>
              <span className="text-xs text-zinc-400 font-semibold">Coins Available</span>
            </div>
            <p className="text-[11px] text-zinc-300 mt-0.5">
              Use coins to unlock exclusive cliffhanger episodes instantly!
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsCoinStoreOpen(true)}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold text-xs shadow-md shadow-amber-500/20 cursor-pointer"
          >
            Get More Coins
          </button>
        </div>
      </div>

      {/* 7-Day Check-In Calendar */}
      <section className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-rose-400" />
              <span>7-Day Continuous Check-in</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Check in daily for higher rewards. Earn +150 Coins on Day 7!
            </p>
          </div>
          <span className="text-xs font-bold text-amber-300">
            Day {wallet.consecutiveCheckInDays} / 7
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {[
            { day: 1, amount: 30 },
            { day: 2, amount: 40 },
            { day: 3, amount: 50 },
            { day: 4, amount: 60 },
            { day: 5, amount: 70 },
            { day: 6, amount: 80 },
            { day: 7, amount: 150, super: true },
          ].map((item) => {
            const isPast = item.day < wallet.consecutiveCheckInDays;
            const isCurrent = item.day === wallet.consecutiveCheckInDays;
            const isToday = isCurrent && isClaimedToday;

            return (
              <div
                key={item.day}
                className={`relative p-3 rounded-2xl flex flex-col items-center justify-center border text-center transition-all ${
                  isToday || isPast
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    : isCurrent
                    ? 'bg-amber-500/25 border-amber-400 text-amber-200 ring-2 ring-amber-400/40 shadow-lg'
                    : item.super
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    : 'bg-white/5 border-white/5 text-zinc-400'
                }`}
              >
                <span className="text-[10px] font-bold">Day {item.day}</span>
                <span className="text-xl my-1">{item.super ? '🎁' : '🪙'}</span>
                <span className="text-xs font-extrabold">+{item.amount}</span>
                {isPast && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute top-1 right-1" />
                )}
              </div>
            );
          })}
        </div>

        {feedback && (
          <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-center text-xs font-bold text-cyan-200 animate-in fade-in">
            {feedback}
          </div>
        )}

        <button
          onClick={handleClaim}
          disabled={isClaimedToday}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:opacity-95 disabled:opacity-50 text-black font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 transition-all active:scale-98"
        >
          <Sparkles className="w-4 h-4 fill-black" />
          <span>
            {isClaimedToday
              ? 'Checked In Today ✓ (Return Tomorrow for Next Bonus)'
              : 'Claim Today\'s Coins!'}
          </span>
        </button>
      </section>

      {/* Lucky Spin Wheel Section */}
      <section className="p-6 rounded-3xl bg-gradient-to-tr from-cyan-950/40 to-indigo-950/40 border border-cyan-500/30 flex flex-col items-center text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
          Ai Short Drama Lucky Wheel
        </span>
        <h3 className="text-lg font-black text-white mt-1">Spin to Win Up to 200 Coins</h3>

        <div className="my-5 relative flex items-center justify-center">
          <div
            className={`w-32 h-32 rounded-full border-4 border-cyan-400/60 flex items-center justify-center bg-black/60 shadow-2xl ${
              isSpinning ? 'animate-spin' : ''
            }`}
          >
            <span className="text-4xl">🎡</span>
          </div>
        </div>

        {spinResult && (
          <div className="mb-4 px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-extrabold text-sm">
            🎉 Congratulations! You received +{spinResult} Coins!
          </div>
        )}

        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className="px-8 py-3 rounded-full bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-400/30 transition-transform active:scale-95 cursor-pointer"
        >
          <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
          <span>{isSpinning ? 'Spinning Wheel...' : 'Spin Wheel (Free)'}</span>
        </button>
      </section>

      {/* Daily Free Missions */}
      <section className="space-y-3">
        <h2 className="text-base font-extrabold text-white">Daily Free Missions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
                <Play className="w-5 h-5 fill-rose-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Watch Sponsor Clip</h4>
                <p className="text-[11px] text-zinc-400">Watch short sponsor clip</p>
              </div>
            </div>
            <button
              onClick={() => addCoins(25)}
              className="px-3.5 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs cursor-pointer"
            >
              +25 🪙
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Invite Friends</h4>
                <p className="text-[11px] text-zinc-400">Share drama with drama lovers</p>
              </div>
            </div>
            <button
              onClick={() => addCoins(50)}
              className="px-3.5 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs cursor-pointer"
            >
              +50 🪙
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
