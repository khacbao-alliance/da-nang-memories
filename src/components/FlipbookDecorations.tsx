"use client";

import { motion } from "framer-motion";

export default function FlipbookDecorations() {
  return (
    <div className="hidden lg:block absolute inset-0 pointer-events-none overflow-hidden z-0">

      {/* ─────────── Airplane flying across — BEHIND flipcard ─────────── */}
      <motion.div
        className="absolute top-[10%]"
        initial={{ x: "-12vw" }}
        animate={{ x: "112vw" }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
      >
        <motion.div
          className="relative"
          animate={{ y: [0, -8, 0, 6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-4xl xl:text-5xl inline-block" style={{ filter: "drop-shadow(0 6px 10px rgba(99,102,241,0.18))" }}>
            ✈️
          </span>
          {/* Trailing cloud puffs */}
          <span className="absolute top-2 -left-7 text-xl xl:text-2xl opacity-50">☁️</span>
          <span className="absolute top-4 -left-14 text-base xl:text-lg opacity-30">☁️</span>
          <span className="absolute top-1 -left-20 text-sm opacity-20">☁️</span>
        </motion.div>
      </motion.div>

      {/* ─────────── LEFT SIDE — Đà Nẵng beach destination ─────────── */}
      <div className="absolute left-4 xl:left-10 bottom-0 w-[180px] xl:w-[220px] h-full">

        {/* Sun rotating */}
        <motion.div
          className="absolute top-[16%] left-6 text-5xl xl:text-6xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          style={{ filter: "drop-shadow(0 0 20px rgba(251,191,36,0.4))" }}
        >
          ☀️
        </motion.div>

        {/* Drifting clouds */}
        <motion.div
          className="absolute top-[28%] left-20 text-2xl opacity-70"
          animate={{ x: [0, 24, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        >
          ☁️
        </motion.div>
        <motion.div
          className="absolute top-[10%] left-24 text-lg opacity-50"
          animate={{ x: [0, -18, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          ☁️
        </motion.div>

        {/* Seagulls flying */}
        <motion.div
          className="absolute top-[44%] text-2xl"
          animate={{ x: [-10, 180, -10], y: [0, -12, 0, 8, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        >
          🕊️
        </motion.div>
        <motion.div
          className="absolute top-[52%] text-lg"
          animate={{ x: [140, -20, 140], y: [0, 10, 0, -6, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        >
          🕊️
        </motion.div>

        {/* Kite flying high up with string */}
        <motion.div
          className="absolute top-[6%] right-2 text-2xl"
          animate={{ rotate: [-15, 15, -15], x: [0, 8, 0], y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          🪁
        </motion.div>

        {/* (Sea moved out to its own dedicated zone between beach and dev team) */}

        {/* Palm trees swaying */}
        <motion.div
          className="absolute bottom-[16%] left-0 text-6xl xl:text-7xl"
          animate={{ rotate: [-4, 4, -4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "bottom center" }}
        >
          🌴
        </motion.div>
        <motion.div
          className="absolute bottom-[6%] left-24 text-5xl xl:text-6xl"
          animate={{ rotate: [4, -4, 4] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
          style={{ transformOrigin: "bottom center" }}
        >
          🌴
        </motion.div>

        {/* Sand gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-[14%] bg-gradient-to-t from-amber-100/70 via-amber-50/40 to-transparent" />

        {/* Surfer on sand */}
        <motion.div
          className="absolute bottom-[4%] left-12 text-3xl"
          animate={{ rotate: [-10, -16, -10], y: [0, -2, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          🏄
        </motion.div>

        {/* Beach umbrella tilting */}
        <motion.div
          className="absolute bottom-[8%] right-2 text-4xl"
          animate={{ rotate: [-6, 4, -6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "bottom center" }}
        >
          🏖️
        </motion.div>

        {/* Cocktail bobbing on the sand */}
        <motion.div
          className="absolute bottom-[2%] right-10 text-xl"
          animate={{ y: [0, -3, 0], rotate: [-4, 4, -4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          🍹
        </motion.div>

        {/* Crab walking sideways */}
        <motion.div
          className="absolute bottom-[3%] left-2 text-base"
          animate={{ x: [0, 14, 0], rotate: [0, -5, 0, 5, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          🦀
        </motion.div>

        {/* Shells */}
        <span className="absolute bottom-[1%] left-20 text-sm opacity-80">🐚</span>
        <span className="absolute bottom-[2%] right-20 text-xs opacity-70">🌟</span>

        {/* Beach welcome label — top banner so it doesn't sit on the sea */}
        <motion.div
          className="absolute top-1 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm border border-amber-100 z-10"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs font-semibold text-amber-700 whitespace-nowrap">🏝️ Đà Nẵng</span>
        </motion.div>
      </div>

      {/* ─────────── MIDDLE — Sea (1.5× beach width, right next to it) ─────────── */}
      <div className="absolute bottom-0 left-[200px] xl:left-[260px] w-[270px] xl:w-[330px] h-[22%]">

        {/* Sea gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-200/35 via-sky-300/45 to-blue-500/50 rounded-t-2xl overflow-hidden">
          {/* Shimmer lines */}
          <motion.div
            className="absolute top-[18%] left-0 right-0 h-px bg-white/40"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-[42%] left-0 right-0 h-px bg-white/30"
            animate={{ opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.div
            className="absolute top-[68%] left-0 right-0 h-px bg-white/25"
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </div>

        {/* Boat sailing left → right across the sea */}
        <motion.div
          className="absolute top-[16%] left-2 text-3xl"
          animate={{ x: [0, 200, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.span
            className="inline-block"
            animate={{ rotate: [-3, 3, -3], y: [0, -2, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            ⛵
          </motion.span>
        </motion.div>

        {/* Speedboat going the other way */}
        <motion.div
          className="absolute top-[48%] right-4 text-2xl"
          animate={{ x: [0, -180, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        >
          🚤
        </motion.div>

        {/* Dolphin jumping out — first spot */}
        <motion.div
          className="absolute top-[40%] left-[30%] text-3xl"
          animate={{ y: [0, -28, 0], rotate: [0, -25, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut", repeatDelay: 3 }}
        >
          🐬
        </motion.div>
        <motion.div
          className="absolute top-[60%] left-[28%] text-lg"
          animate={{ opacity: [0, 0.8, 0], scale: [0.6, 1.2, 0.6] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut", repeatDelay: 3, delay: 0.25 }}
        >
          🌊
        </motion.div>

        {/* Second dolphin elsewhere */}
        <motion.div
          className="absolute top-[36%] left-[65%] text-2xl"
          animate={{ y: [0, -22, 0], rotate: [0, 20, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut", repeatDelay: 4, delay: 1.5 }}
        >
          🐬
        </motion.div>

        {/* Fish poking out */}
        <motion.div
          className="absolute top-[68%] left-[48%] text-base"
          animate={{ y: [0, -10, 0], opacity: [0.4, 1, 0.4], rotate: [-10, 10, -10] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          🐟
        </motion.div>

        {/* Flamingo float drifting near right shore */}
        <motion.div
          className="absolute top-[70%] right-6 text-2xl"
          animate={{ x: [0, -14, 0], rotate: [-4, 4, -4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          🦩
        </motion.div>

        {/* Distant tiny sailboat on horizon */}
        <motion.div
          className="absolute top-[6%] left-[40%] text-xs opacity-70"
          animate={{ x: [0, -80, 0] }}
          transition={{ duration: 32, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          ⛵
        </motion.div>
      </div>

      {/* ─────────── RIGHT SIDE — Dev team departing ─────────── */}
      <div className="absolute right-4 xl:right-10 bottom-0 w-[200px] xl:w-[240px] h-full">

        {/* Hot air balloon floating slowly upward */}
        <motion.div
          className="absolute top-[36%] right-2 text-3xl"
          animate={{ y: [0, -16, 0], x: [0, 4, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          🎈
        </motion.div>

        {/* Hotel in the distance */}
        <motion.div
          className="absolute top-[6%] left-2 text-2xl opacity-90"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          🏨
        </motion.div>
        <span className="absolute top-[8%] left-12 text-lg opacity-80">🏢</span>

        {/* Speech bubble */}
        <motion.div
          className="absolute top-[22%] right-6 bg-white rounded-2xl px-3 py-1.5 shadow-md border border-indigo-100"
          animate={{ y: [0, -5, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs font-bold text-indigo-600 whitespace-nowrap">Đi thôi! 🎉</span>
          <span className="absolute -bottom-1 left-6 w-2 h-2 bg-white border-r border-b border-indigo-100 rotate-45" />
        </motion.div>

        {/* Floating camera */}
        <motion.div
          className="absolute top-[14%] right-20 text-3xl"
          animate={{ y: [0, -10, 0], rotate: [-6, 6, -6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          📷
        </motion.div>

        {/* Floating ticket */}
        <motion.div
          className="absolute top-[42%] right-24 text-2xl"
          animate={{ y: [0, 8, 0], rotate: [8, -8, 8] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          🎫
        </motion.div>

        {/* Map/compass */}
        <motion.div
          className="absolute top-[50%] right-4 text-2xl"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          🧭
        </motion.div>

        {/* Dev walking group — bobbing in place */}
        <div className="absolute bottom-[14%] right-2 flex items-end gap-0.5">
          <motion.span
            className="text-4xl xl:text-5xl inline-block"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.55, repeat: Infinity, ease: "easeInOut" }}
          >
            👨‍💻
          </motion.span>
          <motion.span
            className="text-4xl xl:text-5xl inline-block"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.55, repeat: Infinity, ease: "easeInOut", delay: 0.18 }}
          >
            👩‍💻
          </motion.span>
          <motion.span
            className="text-4xl xl:text-5xl inline-block"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.55, repeat: Infinity, ease: "easeInOut", delay: 0.36 }}
          >
            🧑‍💻
          </motion.span>
        </div>

        {/* Rolling suitcases */}
        <motion.span
          className="absolute bottom-[12%] right-2 text-2xl inline-block"
          animate={{ y: [0, -2, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 0.55, repeat: Infinity, ease: "easeInOut" }}
        >
          🧳
        </motion.span>
        <motion.span
          className="absolute bottom-[12%] right-16 text-2xl inline-block"
          animate={{ y: [0, -2, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 0.55, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        >
          🧳
        </motion.span>
        <motion.span
          className="absolute bottom-[12%] right-28 text-xl inline-block opacity-90"
          animate={{ y: [0, -2, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 0.55, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
        >
          🎒
        </motion.span>

        {/* Dashed road line */}
        <div className="absolute bottom-[8%] left-0 right-0 border-t-2 border-dashed border-gray-300/50" />

        {/* Taxi driving along the road */}
        <motion.div
          className="absolute bottom-[2%] text-2xl"
          animate={{ x: [220, -40, 220] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          🚕
        </motion.div>

        {/* Folded map floating near devs */}
        <motion.div
          className="absolute top-[58%] right-2 text-xl"
          animate={{ y: [0, -6, 0], rotate: [-8, 8, -8] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        >
          🗺️
        </motion.div>

        {/* Sparkle/ping for excitement */}
        <motion.span
          className="absolute top-[30%] right-32 text-sm"
          animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          ✨
        </motion.span>
        <motion.span
          className="absolute top-[20%] right-2 text-sm"
          animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
        >
          ⭐
        </motion.span>

        {/* Tiny dust puffs behind walkers */}
        <motion.span
          className="absolute bottom-[14%] right-32 text-sm opacity-40"
          animate={{ opacity: [0.5, 0, 0.5], x: [0, -10, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          💨
        </motion.span>
      </div>
    </div>
  );
}
