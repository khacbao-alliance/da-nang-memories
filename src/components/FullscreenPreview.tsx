"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, User, Pencil, Trash2, Check, XCircle } from "lucide-react";
import { Media, Reaction } from "@/types";
import { formatDate } from "@/lib/utils";
import EmojiReactions from "@/components/EmojiReactions";

interface FloatItem {
  id: number;
  emoji: string;
  x: number;
  driftX: number;
  rotate: number;
  scale: number;
  duration: number;
}

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
  onDelete?: (mediaId: string) => void;
  onEditCaption?: (mediaId: string, caption: string) => void;
  onReactionAdded?: () => void;
}

export default function FullscreenPreview({
  isOpen, media, onClose, onPrev, onNext,
  hasPrev, hasNext, currentIndex, total,
  onDelete, onEditCaption, onReactionAdded,
}: Props) {
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [floats, setFloats] = useState<FloatItem[]>([]);
  const floatIdRef = useRef(0);
  const floatTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const editInputRef = useRef<HTMLInputElement>(null);

  const clearPendingFloats = useCallback(() => {
    floatTimeoutsRef.current.forEach(t => clearTimeout(t));
    floatTimeoutsRef.current = [];
  }, []);

  const spawnFloats = useCallback((emojis: string[], stagger = 0) => {
    const items: FloatItem[] = emojis.map(emoji => ({
      id: floatIdRef.current++,
      emoji,
      x: (Math.random() - 0.5) * 360,
      driftX: (Math.random() - 0.5) * 100,
      rotate: (Math.random() - 0.5) * 60,
      scale: 1.1 + Math.random() * 0.8,
      duration: 2.6 + Math.random() * 1.2,
    }));

    if (stagger > 0) {
      items.forEach((item, i) => {
        const t = setTimeout(() => {
          setFloats(prev => [...prev, item]);
          floatTimeoutsRef.current = floatTimeoutsRef.current.filter(x => x !== t);
        }, i * stagger);
        floatTimeoutsRef.current.push(t);
      });
    } else {
      setFloats(prev => [...prev, ...items]);
    }
  }, []);

  const removeFloat = useCallback((id: number) => {
    setFloats(prev => prev.filter(f => f.id !== id));
  }, []);

  // Spawn floats when a new photo opens
  useEffect(() => {
    if (!isOpen || !media) {
      clearPendingFloats();
      setFloats([]);
      return;
    }
    clearPendingFloats();
    setFloats([]);
    setEditMode(false);
    setConfirmDelete(false);
    setEditValue("");

    let cancelled = false;
    fetch(`/api/reactions?mediaId=${media.id}`)
      .then(r => r.ok ? r.json() : [])
      .then((reactions: Reaction[]) => {
        if (cancelled || !reactions.length) return;
        const emojis = reactions.slice(0, 24).map(r => r.emoji);
        spawnFloats(emojis, 120);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      clearPendingFloats();
    };
  }, [isOpen, media?.id, spawnFloats, clearPendingFloats]);

  useEffect(() => {
    if (editMode && editInputRef.current) editInputRef.current.focus();
  }, [editMode]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (editMode) {
        if (e.key === "Escape") { setEditMode(false); setEditValue(""); }
        return;
      }
      if (confirmDelete) { if (e.key === "Escape") setConfirmDelete(false); return; }
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, hasPrev, hasNext, onClose, onPrev, onNext, editMode, confirmDelete]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const saveEdit = async () => {
    if (!media) return;
    setIsSaving(true);
    try {
      await fetch(`/api/media/${media.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: editValue.trim() }),
      });
      onEditCaption?.(media.id, editValue.trim());
    } catch {}
    setIsSaving(false);
    setEditMode(false);
  };

  const handleDelete = async () => {
    if (!media) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/media/${media.id}`, { method: "DELETE" });
      onDelete?.(media.id);
    } catch {}
    setIsDeleting(false);
    setConfirmDelete(false);
  };

  return (
    <AnimatePresence>
      {isOpen && media && (
        <motion.div
          key="fullscreen-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/96 backdrop-blur-2xl overflow-hidden"
          onClick={() => { if (!editMode && !confirmDelete) onClose(); }}
        >
          {/* ── Floating emoji particles — fly fully outside the image ── */}
          <div className="pointer-events-none fixed inset-0 z-[55] overflow-hidden">
            <AnimatePresence>
              {floats.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 0, x: item.x, scale: 0.3, rotate: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    y: "-110vh",
                    x: item.x + item.driftX,
                    scale: [0.3, item.scale, item.scale * 0.85],
                    rotate: item.rotate,
                  }}
                  exit={{}}
                  transition={{
                    duration: item.duration,
                    ease: [0.2, 0.55, 0.25, 1],
                    opacity: { duration: item.duration, times: [0, 0.08, 0.78, 1] },
                    scale: { duration: item.duration, times: [0, 0.22, 1], ease: "backOut" },
                  }}
                  onAnimationComplete={() => removeFloat(item.id)}
                  className="absolute bottom-20 left-1/2 text-4xl sm:text-5xl select-none"
                  style={{
                    translateX: "-50%",
                    filter: "drop-shadow(0 6px 18px rgba(255,255,255,0.22)) drop-shadow(0 2px 6px rgba(0,0,0,0.4))",
                    willChange: "transform, opacity",
                  }}
                >
                  {item.emoji}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-colors"
          >
            <X size={18} />
          </button>

          {/* Counter */}
          <div className="absolute top-3 sm:top-5 left-1/2 -translate-x-1/2 z-20 bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-3 sm:px-4 py-1 sm:py-1.5">
            <span className="text-white/80 text-[11px] sm:text-xs">{currentIndex + 1} / {total}</span>
          </div>

          {/* Delete */}
          <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-20">
            {!confirmDelete ? (
              <button
                onClick={e => { e.stopPropagation(); setConfirmDelete(true); }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/50 hover:text-red-400 hover:border-red-400/40 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            ) : (
              <div
                className="flex items-center gap-2 bg-black/70 backdrop-blur-md border border-red-500/40 rounded-full px-3 py-1.5"
                onClick={e => e.stopPropagation()}
              >
                <span className="text-white/80 text-xs">Xóa ảnh này?</span>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-xs bg-red-600 hover:bg-red-500 text-white px-2 py-0.5 rounded-full transition-colors disabled:opacity-50"
                >
                  {isDeleting ? "..." : "Xóa"}
                </button>
                <button onClick={() => setConfirmDelete(false)} className="text-white/50 hover:text-white/80 transition-colors">
                  <XCircle size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Prev */}
          {hasPrev && (
            <button
              onClick={e => { e.stopPropagation(); onPrev(); }}
              className="absolute left-1.5 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-colors hover:scale-110 active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Media + caption */}
          <div
            className="relative flex flex-col items-center w-full max-h-[100svh] px-3 sm:px-20 pt-14 pb-4 sm:py-16 overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <motion.div
              key={media.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0"
            >
              {media.media_type === "image" ? (
                <img
                  src={media.cloudinary_url}
                  alt={media.caption || "Memory"}
                  className="max-h-[55vh] sm:max-h-[65vh] max-w-[calc(100vw-24px)] sm:max-w-[80vw] object-contain rounded-xl shadow-2xl"
                />
              ) : (
                <video
                  src={media.cloudinary_url}
                  controls
                  autoPlay
                  className="max-h-[55vh] sm:max-h-[65vh] max-w-[calc(100vw-24px)] sm:max-w-[80vw] rounded-xl shadow-2xl"
                />
              )}
            </motion.div>

            <motion.div
              key={`caption-${media.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 sm:mt-5 text-center max-w-lg w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/60 backdrop-blur-sm rounded-2xl border border-white/10 flex-shrink-0"
            >
              {/* Caption row */}
              <div className="flex items-start justify-center gap-2 mb-2">
                {editMode ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      ref={editInputRef}
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") { setEditMode(false); setEditValue(""); } }}
                      className="flex-1 bg-white/10 border border-white/30 rounded-lg px-3 py-1.5 text-white text-sm outline-none focus:border-indigo-400 placeholder:text-white/30"
                      placeholder="Nhập caption..."
                    />
                    <button onClick={saveEdit} disabled={isSaving} className="text-green-400 hover:text-green-300 transition-colors disabled:opacity-50">
                      <Check size={16} />
                    </button>
                    <button onClick={() => { setEditMode(false); setEditValue(""); }} className="text-white/40 hover:text-white/70 transition-colors">
                      <XCircle size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    {media.caption
                      ? <p className="text-white text-sm sm:text-base font-semibold drop-shadow flex-1">{media.caption}</p>
                      : <p className="text-white/30 text-sm italic flex-1">Chưa có caption</p>
                    }
                    <button
                      onClick={() => { setEditValue(media.caption ?? ""); setEditMode(true); }}
                      className="shrink-0 text-white/30 hover:text-white/70 transition-colors mt-0.5"
                    >
                      <Pencil size={13} />
                    </button>
                  </>
                )}
              </div>

              {/* Uploader + date */}
              <div className="flex items-center justify-center gap-3 text-white/70 text-xs sm:text-sm">
                <span className="flex items-center gap-1">
                  <User size={12} />
                  {media.uploaded_by}
                </span>
                <span>·</span>
                <span>{formatDate(media.created_at)}</span>
              </div>

              {/* Reactions */}
              <div className="relative">
                <EmojiReactions
                  mediaId={media.id}
                  onReact={emoji => { spawnFloats([emoji, emoji, emoji, emoji], 80); onReactionAdded?.(); }}
                />
              </div>
            </motion.div>
          </div>

          {/* Next */}
          {hasNext && (
            <button
              onClick={e => { e.stopPropagation(); onNext(); }}
              className="absolute right-1.5 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-colors hover:scale-110 active:scale-95"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
