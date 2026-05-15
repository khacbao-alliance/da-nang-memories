"use client";

import { useEffect, useRef, useCallback } from "react";
import { Camera, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { MemoryDay } from "@/types";

interface Props {
  selectedDay: number;
  onSelectDay: (day: number) => void;
  days: MemoryDay[];
  totalMemories: number;
  onUploadClick: () => void;
}

const ITEM_W = 92;
const GAP = 10;
const SNAP = ITEM_W + GAP; // 102px per step

export default function AppHeader({
  selectedDay,
  onSelectDay,
  days,
  totalMemories,
  onUploadClick,
}: Props) {
  const N = days.length; // 4
  // Infinite clone array: [DayN_clone, Day1, Day2, ..., DayN, Day1_clone]
  const cloned = [days[N - 1], ...days, days[0]];

  const CONTAINER_W = 310;
  const SIDE_PAD = (CONTAINER_W - ITEM_W) / 2;

  const scrollRef = useRef<HTMLDivElement>(null);
  const skipSync = useRef(false);
  const isWrapping = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(false);

  const scrollTo = useCallback((dayNum: number, smooth: boolean) => {
    scrollRef.current?.scrollTo({
      left: dayNum * SNAP,
      behavior: smooth ? "smooth" : "instant",
    });
  }, []);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      scrollTo(selectedDay, false);
      return;
    }
    if (skipSync.current) {
      skipSync.current = false;
      return;
    }
    scrollTo(selectedDay, true);
  }, [selectedDay, scrollTo]);

  const handleScroll = useCallback(() => {
    if (isWrapping.current) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (!scrollRef.current || isWrapping.current) return;
      const idx = Math.round(scrollRef.current.scrollLeft / SNAP);

      if (idx === 0) {
        isWrapping.current = true;
        skipSync.current = true;
        onSelectDay(days[N - 1].day_number);
        scrollRef.current.scrollTo({ left: N * SNAP, behavior: "instant" });
        setTimeout(() => { isWrapping.current = false; }, 50);
      } else if (idx === N + 1) {
        isWrapping.current = true;
        skipSync.current = true;
        onSelectDay(days[0].day_number);
        scrollRef.current.scrollTo({ left: SNAP, behavior: "instant" });
        setTimeout(() => { isWrapping.current = false; }, 50);
      } else {
        const dayNum = days[idx - 1]?.day_number;
        if (dayNum !== undefined && dayNum !== selectedDay) {
          skipSync.current = true;
          onSelectDay(dayNum);
        }
      }
    }, 80);
  }, [days, N, selectedDay, onSelectDay]);

  const goLeft = () => {
    if (selectedDay === 1) {
      skipSync.current = true;
      onSelectDay(days[N - 1].day_number);
      scrollRef.current?.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      onSelectDay(selectedDay - 1);
    }
  };

  const goRight = () => {
    if (selectedDay === N) {
      skipSync.current = true;
      onSelectDay(days[0].day_number);
      scrollRef.current?.scrollTo({ left: (N + 1) * SNAP, behavior: "smooth" });
    } else {
      onSelectDay(selectedDay + 1);
    }
  };

  return (
    <header className="bg-white border-b border-rose-100/80 z-40 flex-shrink-0">

      {/* ── Top row: brand + (desktop) carousel + actions ── */}
      <div className="flex items-center px-4 sm:px-6 h-12 sm:h-[72px] gap-3 sm:gap-5">

        {/* Brand */}
        <div className="flex-shrink-0 flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
            <Camera size={15} className="text-rose-400" />
          </div>
          <div className="leading-none">
            <p className="text-[13px] sm:text-[14px] font-bold text-gray-800 tracking-tight">Da Nang Memories</p>
            <p className="hidden sm:flex items-center gap-1 text-[11px] text-rose-300 font-medium mt-1">
              <MapPin size={9} />
              Chuyến đi công ty 2026
            </p>
          </div>
        </div>

        <div className="hidden sm:block w-px h-8 bg-rose-100 flex-shrink-0" />

        {/* ── Infinite day carousel (desktop only) ── */}
        <div className="hidden sm:flex flex-1 items-center justify-center gap-2">
          <button
            onClick={goLeft}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full
                       text-rose-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
          >
            <ChevronLeft size={18} />
          </button>

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="overflow-x-auto scrollbar-hide flex items-center flex-shrink-0"
            style={{
              width: CONTAINER_W,
              gap: GAP,
              scrollSnapType: "x mandatory",
              paddingLeft: SIDE_PAD,
              paddingRight: SIDE_PAD,
            }}
          >
            {cloned.map((day, i) => {
              const isActive = day.day_number === selectedDay;
              return (
                <button
                  key={`${i}-d${day.day_number}`}
                  onClick={() => {
                    skipSync.current = true;
                    onSelectDay(day.day_number);
                    scrollRef.current?.scrollTo({ left: i * SNAP, behavior: "smooth" });
                  }}
                  className="relative flex-shrink-0 py-2 rounded-xl text-center transition-colors duration-150"
                  style={{ width: ITEM_W, scrollSnapAlign: "center" }}
                >
                  {isActive && (
                    <span className="absolute inset-0 bg-rose-50 rounded-xl border border-rose-200 shadow-sm shadow-rose-100" />
                  )}
                  <span
                    className={`relative block text-sm font-semibold leading-none transition-colors duration-150 ${
                      isActive ? "text-rose-600" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    Ngày {day.day_number}
                  </span>
                  <span
                    className={`relative block text-[10px] mt-1 leading-none transition-colors duration-150 ${
                      isActive ? "text-rose-400" : "text-gray-300"
                    }`}
                  >
                    {day.date}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={goRight}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full
                       text-rose-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="hidden sm:block w-px h-8 bg-rose-100 flex-shrink-0" />

        {/* ── Actions ── */}
        <div className="ml-auto sm:ml-0 flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {totalMemories > 0 && (
            <span className="hidden sm:inline text-xs text-gray-400">
              <span className="font-semibold text-gray-600">{totalMemories}</span> kỷ niệm
            </span>
          )}
          <button
            onClick={onUploadClick}
            className="flex items-center gap-1.5 bg-rose-500 text-white text-sm font-semibold
                       px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl hover:bg-rose-600 active:scale-95 transition-all
                       shadow-sm shadow-rose-200 whitespace-nowrap"
          >
            <Camera size={14} />
            Chia sẻ
          </button>
        </div>
      </div>

      {/* ── Mobile: day tabs row ── */}
      <div className="sm:hidden flex border-t border-rose-50">
        {days.map((day) => (
          <button
            key={day.day_number}
            onClick={() => onSelectDay(day.day_number)}
            className={`flex-1 py-2.5 text-xs font-semibold transition-colors border-b-2 ${
              selectedDay === day.day_number
                ? "text-rose-600 border-rose-500 bg-rose-50/60"
                : "text-gray-400 border-transparent"
            }`}
          >
            Ngày {day.day_number}
          </button>
        ))}
      </div>
    </header>
  );
}
