"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Props {
  dayNumber: number;
  mediaCount: number;
}

export default function DaySummary({ dayNumber, mediaCount }: Props) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSummary(null);
    setIsLoading(true);

    const controller = new AbortController();
    fetch("/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dayNumber, mediaCount }),
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.summary) setSummary(data.summary);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [dayNumber, mediaCount]);

  return (
    <div className="px-4 sm:px-6 py-2">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-3 h-3 rounded-full bg-indigo-400/30 animate-pulse" />
            <div className="h-3 w-64 rounded-full bg-white/10 animate-pulse" />
          </motion.div>
        ) : summary ? (
          <motion.div
            key={`summary-${dayNumber}-${summary.slice(0, 20)}`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35 }}
            className="flex items-start gap-2"
          >
            <Sparkles size={13} className="text-indigo-400 mt-0.5 shrink-0" />
            <p className="text-white/60 text-xs sm:text-sm italic leading-relaxed">{summary}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
