"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Play, User } from "lucide-react";
import { Media } from "@/types";
import { formatDateShort } from "@/lib/utils";

interface Props {
  media: Media;
  index: number;
  onClick: () => void;
}

export default function MediaCard({ media, index, onClick }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current && media.media_type === "video") {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current && media.media_type === "video") {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex-shrink-0 w-[240px] sm:w-[260px] rounded-2xl overflow-hidden cursor-pointer relative group bg-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300"
      style={{ aspectRatio: "4/5" }}
    >
      {/* Media */}
      {media.media_type === "image" ? (
        <img
          src={media.cloudinary_url}
          alt={media.caption || "Memory"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          loading="lazy"
        />
      ) : (
        <>
          <video
            ref={videoRef}
            src={media.cloudinary_url}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
          />
          {/* Play icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center group-hover:bg-black/20 transition-colors">
              <Play size={22} fill="white" className="text-white ml-1" />
            </div>
          </div>
        </>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      {/* Hover ring */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-indigo-300/50 transition-all duration-300" />

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        {media.caption && (
          <p className="text-white text-sm font-medium leading-snug line-clamp-2 mb-3">
            {media.caption}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <User size={11} className="text-white/80" />
            </div>
            <span className="text-white/60 text-xs truncate max-w-[100px]">
              {media.uploaded_by}
            </span>
          </div>
          <span className="text-white/30 text-[11px]">
            {formatDateShort(media.created_at)}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
