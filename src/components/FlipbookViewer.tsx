"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, Camera, User, Smile } from "lucide-react";
import { Media, Reaction } from "@/types";
import { formatDateShort } from "@/lib/utils";
import { groupReactions } from "@/components/EmojiReactions";
import FlipbookDecorations from "@/components/FlipbookDecorations";

interface Props {
  media: Media[];
  isLoading: boolean;
  onOpenFullscreen: (index: number) => void;
  reactionRefreshKey?: number;
}

const PAGE_VARIANTS = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 80 : -80, rotateY: dir > 0 ? 14 : -14, scale: 0.94 }),
  center: { opacity: 1, x: 0, rotateY: 0, scale: 1 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -80 : 80, rotateY: dir > 0 ? -14 : 14, scale: 0.94 }),
};

export default function FlipbookViewer({ media, isLoading, onOpenFullscreen, reactionRefreshKey }: Props) {
  const [[pageIdx, dir], setPage] = useState([0, 0]);
  const [cardReactions, setCardReactions] = useState<{ emoji: string; count: number }[]>([]);

  useEffect(() => { setPage([0, 0]); }, [media]);

  const paginate = useCallback(
    (newDir: number) => {
      setPage(([prev]) => {
        const next = prev + newDir;
        if (next < 0 || next >= media.length) return [prev, 0];
        return [next, newDir];
      });
    },
    [media.length]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "ArrowRight") paginate(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [paginate]);

  const current = media[pageIdx];

  // Fetch reactions for current card — also re-fetches when reactionRefreshKey changes
  useEffect(() => {
    if (!current?.id) { setCardReactions([]); return; }
    fetch(`/api/reactions?mediaId=${current.id}`)
      .then(r => r.ok ? r.json() : [])
      .then((data: Reaction[]) => setCardReactions(groupReactions(data)))
      .catch(() => setCardReactions([]));
  }, [current?.id, reactionRefreshKey]);

  const hasPrev = pageIdx > 0;
  const hasNext = pageIdx < media.length - 1;
  const dotMedia = media.slice(0, 12);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-gray-200 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!media.length || !current) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
        <Camera size={40} className="text-gray-200" />
        <p className="text-gray-400 font-medium text-sm">Chưa có kỷ niệm nào</p>
        <p className="text-gray-300 text-xs">Hãy là người đầu tiên chia sẻ!</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col select-none overflow-hidden">

      {/* ── Main card area ── */}
      <div
        className="relative flex-1 flex items-center justify-center sm:gap-4 px-2 sm:px-8 overflow-hidden py-2 sm:py-4"
        style={{ perspective: 1400 }}
      >
        {/* Decorative side art + plane (desktop only, behind card) */}
        <FlipbookDecorations />

        {/* Prev button — desktop only */}
        <button
          onClick={() => paginate(-1)}
          disabled={!hasPrev}
          className="hidden sm:flex relative z-10 flex-shrink-0 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center text-gray-400 hover:text-gray-800 hover:shadow-lg hover:scale-105 disabled:opacity-20 transition-all duration-200"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Card wrapper — width-driven on mobile, height-driven on desktop, both keep 3/4 aspect ratio */}
        <div
          className="relative flex-shrink-0 w-[min(calc(100vw-24px),420px)] max-h-[calc(100svh-150px)] sm:w-auto sm:h-[min(calc(100svh-180px),680px)] sm:max-h-none sm:max-w-[calc(100vw-136px)]"
          style={{ aspectRatio: "3/4" }}
        >
          {/* Stacked pages behind */}
          {hasNext && (
            <div className="absolute inset-0 rounded-2xl bg-gray-100 pointer-events-none" style={{ transform: "translate(6px,6px)", zIndex: 0 }} />
          )}
          {pageIdx < media.length - 2 && (
            <div className="absolute inset-0 rounded-2xl bg-gray-50 border border-gray-100 pointer-events-none" style={{ transform: "translate(11px,11px)", zIndex: -1 }} />
          )}

          {/* Animated card */}
          <AnimatePresence initial={false} custom={dir} mode="wait">
            <motion.div
              key={pageIdx}
              custom={dir}
              variants={PAGE_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: [0.25, 0.82, 0.32, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.06}
              onDragEnd={(_, info) => {
                if (info.offset.x < -45 && hasNext) paginate(1);
                else if (info.offset.x > 45 && hasPrev) paginate(-1);
              }}
              className="absolute inset-0 bg-white rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing z-10"
              style={{
                boxShadow: "0 24px 64px -12px rgba(0,0,0,0.18), 0 8px 24px -8px rgba(0,0,0,0.10)",
                transformStyle: "preserve-3d",
              }}
              onClick={() => onOpenFullscreen(pageIdx)}
            >
              {/* ── Photo / video — 68% ── */}
              <div className="relative overflow-hidden" style={{ height: "68%" }}>
                {current.media_type === "image" ? (
                  <img
                    src={current.cloudinary_url}
                    alt={current.caption || "Memory"}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <video src={current.cloudinary_url} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                )}

                <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/12 to-transparent pointer-events-none" />

                <div className="absolute top-3 right-3 bg-white/88 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-semibold text-gray-600 shadow-sm">
                  {pageIdx + 1} / {media.length}
                </div>
                <div className="absolute top-3 left-3 bg-white/88 backdrop-blur-sm rounded-full p-1.5 shadow-sm">
                  <Maximize2 size={11} className="text-gray-500" />
                </div>
              </div>

              {/* ── Info strip — 32% ── */}
              <div className="flex flex-col justify-between px-3 sm:px-4 pt-2 sm:pt-2.5 pb-2.5 sm:pb-3 bg-white" style={{ height: "32%" }}>

                {/* Caption */}
                {current.caption ? (
                  <p className="text-gray-800 text-[13px] sm:text-sm font-medium leading-snug line-clamp-2">{current.caption}</p>
                ) : (
                  <p className="text-gray-300 text-[11px] sm:text-xs italic">Tap để xem và thêm caption...</p>
                )}

                {/* Reactions row */}
                <div className="flex items-center gap-1 min-h-[22px]">
                  {cardReactions.length > 0 ? (
                    <>
                      {cardReactions.slice(0, 5).map(({ emoji, count }) => (
                        <span
                          key={emoji}
                          className="flex items-center gap-0.5 bg-gray-50 border border-gray-100 rounded-full px-1.5 py-0.5 text-xs text-gray-600"
                        >
                          <span className="text-sm leading-none">{emoji}</span>
                          <span className="font-medium">{count}</span>
                        </span>
                      ))}
                      {cardReactions.length > 5 && (
                        <span className="text-gray-300 text-xs">+{cardReactions.length - 5}</span>
                      )}
                    </>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-300 text-xs">
                      <Smile size={12} />
                      Tap để react
                    </span>
                  )}
                </div>

                {/* Uploader + date */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
                      <User size={10} className="text-indigo-500" />
                    </div>
                    <span className="text-gray-500 text-[11px] sm:text-xs font-medium truncate">{current.uploaded_by}</span>
                  </div>
                  <span className="text-gray-300 text-[11px] sm:text-xs flex-shrink-0">{formatDateShort(current.created_at)}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Mobile overlay nav */}
          {hasPrev && (
            <button
              onClick={() => paginate(-1)}
              className="sm:hidden absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white active:scale-90 transition-transform"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          {hasNext && (
            <button
              onClick={() => paginate(1)}
              className="sm:hidden absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white active:scale-90 transition-transform"
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>

        {/* Next button — desktop only */}
        <button
          onClick={() => paginate(1)}
          disabled={!hasNext}
          className="hidden sm:flex relative z-10 flex-shrink-0 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center text-gray-400 hover:text-gray-800 hover:shadow-lg hover:scale-105 disabled:opacity-20 transition-all duration-200"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* ── Dot pagination ── */}
      <div className="flex-shrink-0 flex items-center justify-center gap-1.5 pb-3 pt-1">
        {dotMedia.map((_, i) => (
          <button
            key={i}
            onClick={() => setPage([i, i > pageIdx ? 1 : -1])}
            className={`rounded-full transition-all duration-200 ${
              i === pageIdx ? "w-5 h-1.5 bg-indigo-600" : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
        {media.length > 12 && (
          <span className="text-gray-300 text-xs ml-1">+{media.length - 12}</span>
        )}
      </div>
    </div>
  );
}
