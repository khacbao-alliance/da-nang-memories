"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";
import MediaCard from "./MediaCard";
import { Media } from "@/types";

interface Props {
  media: Media[];
  isLoading: boolean;
  onOpenMedia: (media: Media, index: number) => void;
}

function SkeletonCard({ index }: { index: number }) {
  return (
    <div
      className="flex-shrink-0 w-[260px] rounded-2xl bg-gray-200 animate-pulse"
      style={{ animationDelay: `${index * 0.1}s`, aspectRatio: "4/5" }}
    />
  );
}

export default function MediaCarousel({ media, isLoading, onOpenMedia }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative py-10 bg-[#f5f7fa]">
      <div className="max-w-5xl mx-auto px-4">
        {/* Section label */}
        <div className="flex items-center justify-between mb-6 px-2">
          <p className="text-gray-400 text-xs tracking-widest uppercase">
            {isLoading ? "Đang tải..." : `${media.length} kỷ niệm`}
          </p>
        </div>
      </div>

      {/* Carousel container */}
      <div className="relative group">
        {/* Left nav */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-500 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Scroll area */}
        <div
          ref={scrollRef}
          className="flex gap-4 px-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        >
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} index={i} />)
          ) : media.length === 0 ? (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full flex flex-col items-center justify-center py-20 text-center px-6"
              >
                <Camera size={40} className="text-gray-300 mb-4" />
                <p className="text-gray-400 text-base font-medium">Chưa có kỷ niệm nào</p>
                <p className="text-gray-300 text-sm mt-1">Hãy là người đầu tiên chia sẻ!</p>
              </motion.div>
            </AnimatePresence>
          ) : (
            <AnimatePresence>
              {media.map((item, idx) => (
                <MediaCard
                  key={item.id}
                  media={item}
                  index={idx}
                  onClick={() => onOpenMedia(item, idx)}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Right nav */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-500 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
