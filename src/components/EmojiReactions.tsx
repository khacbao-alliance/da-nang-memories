"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Plus } from "lucide-react";
import { Reaction } from "@/types";
import dynamic from "next/dynamic";
import { Theme } from "emoji-picker-react";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface Props {
  mediaId: string;
  onReact?: (emoji: string) => void;
}

function getUserName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("uploaderName");
}

export function groupReactions(reactions: Reaction[]): { emoji: string; count: number }[] {
  const map = new Map<string, number>();
  for (const r of reactions) map.set(r.emoji, (map.get(r.emoji) ?? 0) + 1);
  return Array.from(map.entries()).map(([emoji, count]) => ({ emoji, count }));
}

export default function EmojiReactions({ mediaId, onReact }: Props) {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [namePrompt, setNamePrompt] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [pendingEmoji, setPendingEmoji] = useState<string | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const fetchReactions = useCallback(async () => {
    try {
      const res = await fetch(`/api/reactions?mediaId=${mediaId}`);
      if (res.ok) setReactions(await res.json());
    } catch {}
  }, [mediaId]);

  useEffect(() => { fetchReactions(); }, [fetchReactions]);

  useEffect(() => {
    if (!showPicker) return;
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showPicker]);

  const doReact = async (emoji: string, userName: string) => {
    // Optimistic update — always add, never toggle
    setReactions(prev => [
      ...prev,
      { id: `opt-${Date.now()}`, media_id: mediaId, emoji, created_by: userName, created_at: new Date().toISOString() },
    ]);
    onReact?.(emoji);

    await fetch("/api/reactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ media_id: mediaId, emoji, created_by: userName }),
    }).catch(() => {});

    fetchReactions();
  };

  const withName = (emoji: string) => {
    const userName = getUserName();
    if (!userName) { setPendingEmoji(emoji); setNamePrompt(true); return; }
    doReact(emoji, userName);
  };

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setShowPicker(false);
    withName(emojiData.emoji);
  };

  const handleNameSubmit = () => {
    const name = nameInput.trim();
    if (!name) return;
    localStorage.setItem("uploaderName", name);
    setNamePrompt(false);
    setNameInput("");
    if (pendingEmoji) { doReact(pendingEmoji, name); setPendingEmoji(null); }
  };

  const grouped = groupReactions(reactions);

  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-3">
      {grouped.map(({ emoji, count }) => (
        <button
          key={emoji}
          onClick={() => withName(emoji)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-sm border bg-white/10 border-white/20 text-white/80 hover:bg-white/25 active:scale-90 transition-all select-none"
        >
          <span>{emoji}</span>
          <span className="text-xs font-medium">{count}</span>
        </button>
      ))}

      <div className="relative" ref={pickerRef}>
        <button
          onClick={() => setShowPicker(v => !v)}
          className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-all"
        >
          <Plus size={14} />
        </button>
        {showPicker && (
          <div className="absolute bottom-10 left-0 z-50 scale-90 origin-bottom-left">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme={Theme.DARK}
              height={350}
              width={300}
              skinTonesDisabled
              previewConfig={{ showPreview: false }}
            />
          </div>
        )}
      </div>

      {namePrompt && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/70 rounded-2xl">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-5 w-64 shadow-2xl">
            <p className="text-white text-sm font-medium mb-3">Nhập tên của bạn để react</p>
            <input
              autoFocus
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleNameSubmit()}
              placeholder="Tên của bạn..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/40 outline-none focus:border-indigo-400"
            />
            <div className="flex gap-2 mt-3">
              <button onClick={handleNameSubmit} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg py-2 transition-colors">
                Xác nhận
              </button>
              <button onClick={() => { setNamePrompt(false); setPendingEmoji(null); }} className="flex-1 bg-white/10 hover:bg-white/20 text-white/70 text-sm rounded-lg py-2 transition-colors">
                Huỷ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
