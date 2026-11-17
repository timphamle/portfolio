"use client";

import { useSound } from "./SoundProvider";

export function MuteToggle({ className = "" }: { className?: string }) {
  const { muted, toggleMuted } = useSound();
  return (
    <button
      type="button"
      data-no-pop
      onClick={toggleMuted}
      aria-pressed={!muted}
      aria-label={muted ? "Turn click sounds on" : "Turn click sounds off"}
      title={muted ? "Sound off" : "Sound on"}
      className={`rounded-full p-2 text-muted transition hover:bg-white/5 hover:text-ink ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M11 5 6 9H3v6h3l5 4V5z" />
        {muted ? (
          <path d="m22 9-6 6M16 9l6 6" />
        ) : (
          <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
        )}
      </svg>
    </button>
  );
}
