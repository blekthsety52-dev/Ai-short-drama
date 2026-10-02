import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageSquare, Send, Twitter, Facebook } from 'lucide-react';
import { useDrama } from '../../context/DramaContext';

export const ShareModal: React.FC = () => {
  const { currentDrama, currentEpisodeNumber, isShareModalOpen, setIsShareModalOpen } = useDrama();
  const [copied, setCopied] = useState(false);

  if (!isShareModalOpen) return null;

  const shareUrl = window.location.href;
  const shareText = `Watch "${currentDrama.title}" EP ${currentEpisodeNumber} on Ai Short Drama! Total suspense! 🔥`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentDrama.title,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User dismissed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm bg-[#10121d] border border-white/10 rounded-3xl p-5 shadow-2xl relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span>Share Drama</span>
          </h3>
          <button
            onClick={() => setIsShareModalOpen(false)}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drama Preview Card */}
        <div className="my-4 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
          <img
            src={currentDrama.poster}
            alt={currentDrama.title}
            className="w-12 h-16 object-cover rounded-xl border border-white/10 flex-shrink-0"
          />
          <div className="truncate">
            <h4 className="text-xs font-bold text-white truncate">{currentDrama.title}</h4>
            <span className="text-[10px] text-cyan-300 font-semibold block mt-0.5">
              Episode {currentEpisodeNumber} / {currentDrama.totalEpisodes}
            </span>
            <span className="text-[10px] text-zinc-400">★ {currentDrama.rating} · {currentDrama.views}</span>
          </div>
        </div>

        {/* Quick Social Share Buttons */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <button
            onClick={handleWebShare}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-zinc-300 hover:text-white"
          >
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold">Share</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-zinc-300 hover:text-white"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </div>
            <span className="text-[10px] font-semibold">{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={() => {
              const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
                `${shareText} ${shareUrl}`
              )}`;
              window.open(url, '_blank');
            }}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-zinc-300 hover:text-white"
          >
            <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold">WhatsApp</span>
          </button>

          <button
            onClick={() => {
              const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                shareText
              )}&url=${encodeURIComponent(shareUrl)}`;
              window.open(url, '_blank');
            }}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-zinc-300 hover:text-white"
          >
            <div className="w-10 h-10 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Twitter className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold">X / Twitter</span>
          </button>
        </div>

        {/* Copy Link field */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-black/40 border border-white/10">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="bg-transparent text-[11px] text-zinc-400 flex-1 px-2 focus:outline-none truncate"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-colors cursor-pointer"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
};
