import React, { useState } from 'react';
import { X, Heart, Send, Sparkles } from 'lucide-react';
import { useDrama } from '../../context/DramaContext';

export const CommentsDrawer: React.FC = () => {
  const {
    currentDrama,
    currentEpisodeNumber,
    isCommentsDrawerOpen,
    setIsCommentsDrawerOpen,
    addComment,
    likeComment,
  } = useDrama();

  const [inputVal, setInputVal] = useState('');

  if (!isCommentsDrawerOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    addComment(currentDrama.id, currentEpisodeNumber, inputVal);
    setInputVal('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#0e101a] border border-white/10 rounded-t-3xl sm:rounded-2xl shadow-2xl h-[75vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Comments</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {currentDrama.comments.length}
            </span>
          </div>
          <button
            onClick={() => setIsCommentsDrawerOpen(false)}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentDrama.comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 group">
              <img
                src={comment.avatar}
                alt={comment.user}
                className="w-9 h-9 rounded-full object-cover border border-white/15 flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-zinc-200">{comment.user}</span>
                    {comment.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-gradient-to-r from-amber-500 to-rose-500 text-black">
                        {comment.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-500">{comment.timestamp}</span>
                </div>

                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  {comment.text}
                </p>

                <div className="flex items-center gap-3 mt-1.5">
                  <button
                    onClick={() => likeComment(currentDrama.id, comment.id)}
                    className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-rose-400 cursor-pointer"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        comment.isLiked ? 'fill-rose-500 text-rose-500' : ''
                      }`}
                    />
                    <span>{comment.likes}</span>
                  </button>
                  <span className="text-[10px] text-zinc-500">
                    Ep {comment.episodeNumber}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="p-3 border-t border-white/10 bg-[#0a0c13] flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={`Say something about Ep ${currentEpisodeNumber}...`}
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="w-9 h-9 rounded-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black flex items-center justify-center cursor-pointer transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
