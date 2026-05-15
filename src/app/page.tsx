"use client";

import { useState, useEffect, useCallback } from "react";
import AppHeader from "@/components/AppHeader";
import FlipbookViewer from "@/components/FlipbookViewer";
import FullscreenPreview from "@/components/FullscreenPreview";
import UploadModal from "@/components/UploadModal";
import { Media } from "@/types";
import { MEMORY_DAYS } from "@/lib/mock-data";

export default function Home() {
  const [selectedDay, setSelectedDay] = useState(1);
  const [media, setMedia] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [reactionRefreshKey, setReactionRefreshKey] = useState(0);

  const fetchMedia = useCallback(async (day: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/media?day=${day}`);
      const data = res.ok ? await res.json() : [];
      setMedia(Array.isArray(data) ? data : []);
    } catch {
      setMedia([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia(selectedDay);
  }, [selectedDay, fetchMedia]);

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    setFullscreenIndex(null);
  };

  const handleClose = () => setFullscreenIndex(null);
  const handlePrev = () => setFullscreenIndex((i) => (i !== null && i > 0 ? i - 1 : i));
  const handleNext = () => setFullscreenIndex((i) => (i !== null && i < media.length - 1 ? i + 1 : i));

  const handleDelete = (mediaId: string) => {
    setMedia((prev) => {
      const updated = prev.filter((m) => m.id !== mediaId);
      // Adjust fullscreen index after deletion
      setFullscreenIndex((i) => {
        if (i === null) return null;
        if (updated.length === 0) return null;
        return Math.min(i, updated.length - 1);
      });
      return updated;
    });
  };

  const handleEditCaption = (mediaId: string, caption: string) => {
    setMedia((prev) => prev.map((m) => (m.id === mediaId ? { ...m, caption } : m)));
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-[#f5f7fa]">

      {/* ── Compact header ── */}
      <AppHeader
        selectedDay={selectedDay}
        onSelectDay={handleSelectDay}
        days={MEMORY_DAYS}
        totalMemories={media.length}
        onUploadClick={() => setIsUploadOpen(true)}
      />

      {/* ── Flipbook — fills all remaining height ── */}
      <main className="flex-1 overflow-hidden">
        <FlipbookViewer
          key={selectedDay}
          media={media}
          isLoading={isLoading}
          onOpenFullscreen={(idx) => setFullscreenIndex(idx)}
          reactionRefreshKey={reactionRefreshKey}
        />
      </main>

      <FullscreenPreview
        isOpen={fullscreenIndex !== null}
        media={fullscreenIndex !== null ? media[fullscreenIndex] ?? null : null}
        onClose={handleClose}
        onPrev={handlePrev}
        onNext={handleNext}
        hasPrev={fullscreenIndex !== null && fullscreenIndex > 0}
        hasNext={fullscreenIndex !== null && fullscreenIndex < media.length - 1}
        currentIndex={fullscreenIndex ?? 0}
        total={media.length}
        onDelete={handleDelete}
        onEditCaption={handleEditCaption}
        onReactionAdded={() => setReactionRefreshKey(k => k + 1)}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={() => {
          setIsUploadOpen(false);
          fetchMedia(selectedDay);
        }}
        selectedDay={selectedDay}
      />
    </div>
  );
}
