"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, User } from "lucide-react";
import { Media } from "@/types";
import { formatDate } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  media: Media | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  currentIndex: number;
  total: number;
}

export default function FullscreenPreview({
  isOpen,
  media,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  currentIndex,
  total,
}: Props) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, hasPrev, hasNext, onClose, onPrev, onNext]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && media && (
        <motion.div
          key="fullscreen-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/96 backdrop-blur-2xl"
          onClick={onClose}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full glass flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 glass rounded-full px-4 py-1.5">
            <span className="text-white/50 text-xs">
              {currentIndex + 1} / {total}
            </span>
          </div>

          {/* Prev */}
          {hasPrev && (
            <button
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass flex items-center justify-center text-white/60 hover:text-white transition-colors hover:scale-110 active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Media */}
          <motion.div
            key={media.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="relative flex flex-col items-center max-h-screen px-4 sm:px-20 py-10 sm:py-16"
            onClick={(e) => e.stopPropagation()}
          >
            {media.media_type === "image" ? (
              <img
                src={media.cloudinary_url}
                alt={media.caption || "Memory"}
                className="max-h-[65vh] sm:max-h-[72vh] max-w-[92vw] sm:max-w-[80vw] object-contain rounded-xl shadow-2xl"
              />
            ) : (
              <video
                src={media.cloudinary_url}
                controls
                autoPlay
                className="max-h-[65vh] sm:max-h-[72vh] max-w-[92vw] sm:max-w-[80vw] rounded-xl shadow-2xl"
              />
            )}

            {/* Caption + meta */}
            <div className="mt-4 sm:mt-5 text-center max-w-lg px-2">
              {media.caption && (
                <p className="text-white text-sm sm:text-base font-medium mb-2">{media.caption}</p>
              )}
              <div className="flex items-center justify-center gap-3 text-white/60 text-xs sm:text-sm">
                <span className="flex items-center gap-1">
                  <User size={12} />
                  {media.uploaded_by}
                </span>
                <span>·</span>
                <span>{formatDate(media.created_at)}</span>
              </div>
            </div>
          </motion.div>

          {/* Next */}
          {hasNext && (
            <button
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass flex items-center justify-center text-white/60 hover:text-white transition-colors hover:scale-110 active:scale-95"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
