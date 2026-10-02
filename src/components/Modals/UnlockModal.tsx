import React, { useState } from 'react';
import { X, Lock, Sparkles, Coins, Zap, PlayCircle, CheckCircle2 } from 'lucide-react';
import { useDrama } from '../../context/DramaContext';

export const UnlockModal: React.FC = () => {
  const {
    currentDrama,
    pendingUnlockEpisode,
    isUnlockModalOpen,
    setIsUnlockModalOpen,
    unlockEpisode,
    unlockAllEpisodes,
    setIsCoinStoreOpen,
    addCoins,
    wallet,
  } = useDrama();

  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(3);

  if (!isUnlockModalOpen || !pendingUnlockEpisode) return null;

  const cost = 20;
  const hasEnoughCoins = wallet.coins >= cost;

  const handleWatchAd = () => {
    setIsWatchingAd(true);
    setAdCountdown(3);
    const timer = setInterval(() => {
      setAdCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsWatchingAd(false);
          addCoins(20);
          unlockEpisode(currentDrama.id, pendingUnlockEpisode);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm bg-[#11131e] border border-amber-500/30 rounded-3xl p-6 shadow-2xl relative text-center flex flex-col items-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsUnlockModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Lock badge */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500/20 to-rose-500/20 border border-amber-400/40 flex items-center justify-center mb-3">
          <Lock className="w-8 h-8 text-amber-400" />
        </div>

        <h3 className="text-lg font-black text-white">Unlock Episode {pendingUnlockEpisode}</h3>
        <p className="text-xs text-zinc-400 mt-1 max-w-xs">
          Continue watching the cliffhanger confrontation in{' '}
          <span className="text-zinc-200 font-semibold">{currentDrama.title}</span>
        </p>

        {/* Current Balance */}
        <div className="mt-4 px-4 py-1.5 rounded-full bg-black/40 border border-white/10 flex items-center gap-2">
          <span className="text-xs text-zinc-400">Current Balance:</span>
          <span className="text-sm font-black text-amber-300 flex items-center gap-1">
            🪙 {wallet.coins} Coins
          </span>
        </div>

        {/* Actions Stack */}
        <div className="w-full space-y-2.5 mt-5">
          {/* Unlock single episode button */}
          <button
            onClick={() => {
              if (hasEnoughCoins) {
                unlockEpisode(currentDrama.id, pendingUnlockEpisode);
              } else {
                setIsUnlockModalOpen(false);
                setIsCoinStoreOpen(true);
              }
            }}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-between transition-transform active:scale-95 cursor-pointer bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black shadow-lg shadow-amber-500/20"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 fill-black" />
              <span>Unlock Episode {pendingUnlockEpisode}</span>
            </div>
            <span className="font-extrabold bg-black/20 px-2 py-0.5 rounded">
              {cost} 🪙
            </span>
          </button>

          {/* Unlock all episodes with discount */}
          <button
            onClick={() => {
              if (wallet.coins >= 199) {
                unlockAllEpisodes(currentDrama.id);
              } else {
                setIsUnlockModalOpen(false);
                setIsCoinStoreOpen(true);
              }
            }}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-between border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-200 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              <div className="text-left">
                <span className="block">Unlock All Episodes</span>
                <span className="text-[10px] text-cyan-400">Save 40% Coins</span>
              </div>
            </div>
            <span className="font-extrabold bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-400/30">
              199 🪙
            </span>
          </button>

          {/* Watch Ad Free Option */}
          <button
            onClick={handleWatchAd}
            disabled={isWatchingAd}
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer"
          >
            <PlayCircle className="w-4 h-4 text-rose-400" />
            <span>
              {isWatchingAd
                ? `Simulating Sponsor Clip (${adCountdown}s)...`
                : 'Watch 3s Ad Trailer (Free +20 Coins)'}
            </span>
          </button>
        </div>

        {/* Coin Store Link */}
        <button
          onClick={() => {
            setIsUnlockModalOpen(false);
            setIsCoinStoreOpen(true);
          }}
          className="mt-4 text-xs font-semibold text-amber-400 hover:text-amber-300 underline cursor-pointer"
        >
          Need more coins? Open Coin Store & Daily Rewards →
        </button>
      </div>
    </div>
  );
};
