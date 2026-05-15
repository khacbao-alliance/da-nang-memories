"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { MemoryDay } from "@/types";

interface Props {
  selectedDay: number;
  onSelectDay: (day: number) => void;
  days: MemoryDay[];
}

const DAY_SUBTITLES: Record<number, string> = {
  1: "Khởi hành & Ấn tượng đầu tiên",
  2: "Cầu Vàng & Ngày ở Biển",
  3: "Phiêu lưu Hội An",
  4: "Khoảnh khắc cuối & Chia tay",
};

export default function DayNavigator({ selectedDay, onSelectDay, days }: Props) {
  const handlePrev = () => { if (selectedDay > 1) onSelectDay(selectedDay - 1); };
  const handleNext = () => { if (selectedDay < days.length) onSelectDay(selectedDay + 1); };

  return (
    <section className="bg-white border-b border-gray-100 flex items-center justify-center min-h-[42vh] py-12">
      <div className="text-center px-6 w-full max-w-2xl mx-auto">

        {/* Label */}
        <div className="flex items-center justify-center gap-1.5 text-gray-400 text-xs uppercase tracking-widest font-medium mb-8">
          <MapPin size={12} className="text-indigo-400" />
          Chọn ngày để xem kỷ niệm
        </div>

        {/* Tabs + arrows */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={handlePrev}
            disabled={selectedDay <= 1}
            className="p-2.5 rounded-full border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300 hover:shadow-sm disabled:opacity-25 transition-all"
          >
            <ChevronLeft size={18} />
          </button>

          {days.map((day) => (
            <button
              key={day.day_number}
              onClick={() => onSelectDay(day.day_number)}
              className="relative flex flex-col items-center px-8 py-4 rounded-2xl transition-all duration-200 min-w-[96px]"
            >
              {selectedDay === day.day_number && (
                <motion.div
                  layoutId="dayPill"
                  className="absolute inset-0 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {selectedDay !== day.day_number && (
                <div className="absolute inset-0 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100 transition-colors" />
              )}
              <span
                className={`relative text-base font-bold transition-colors ${
                  selectedDay === day.day_number ? "text-white" : "text-gray-700"
                }`}
              >
                Ngày {day.day_number}
              </span>
              <span
                className={`relative text-xs mt-1 transition-colors ${
                  selectedDay === day.day_number ? "text-indigo-200" : "text-gray-400"
                }`}
              >
                {day.date}
              </span>
            </button>
          ))}

          <button
            onClick={handleNext}
            disabled={selectedDay >= days.length}
            className="p-2.5 rounded-full border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300 hover:shadow-sm disabled:opacity-25 transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Day subtitle */}
        <motion.p
          key={selectedDay}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-gray-500 text-sm font-medium mt-7"
        >
          {DAY_SUBTITLES[selectedDay]}
        </motion.p>
      </div>
    </section>
  );
}
