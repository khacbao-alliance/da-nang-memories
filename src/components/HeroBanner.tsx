"use client";

import { motion } from "framer-motion";
import { Camera, Sparkles } from "lucide-react";

interface Props {
  onUploadClick: () => void;
  totalMemories: number;
}

export default function HeroBanner({ onUploadClick, totalMemories }: Props) {
  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-indigo-50/60 to-[#f5f7fa] pt-10 pb-8 border-b border-gray-100">
      {/* Subtle radial accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.2) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-white border border-indigo-100 text-indigo-500 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide mb-5 shadow-sm">
            <Sparkles size={12} />
            Chuyến đi công ty 2026
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2.5 tracking-tight leading-tight">
            Da Nang{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Memories
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-base font-light mb-7 tracking-wide">
            4 Ngày &nbsp;·&nbsp; 3 Đêm &nbsp;·&nbsp; Vô Vàn Kỷ Niệm
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <motion.button
              onClick={onUploadClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
            >
              <Camera size={15} />
              Chia sẻ kỷ niệm
            </motion.button>

            {totalMemories > 0 && (
              <div className="flex items-center gap-1.5 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-2.5">
                <span className="text-gray-800 text-sm font-semibold">{totalMemories}</span>
                <span className="text-gray-400 text-sm">kỷ niệm đã chia sẻ</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </header>
  );
}
