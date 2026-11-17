"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

/**
 * Soft "pop" on every link / button click.
 * On by default, quiet, synthesized with Web Audio (no audio file to load),
 * and the viewer's mute choice is remembered in localStorage.
 */

const VOLUME = 0.05; // keep it subtle
const STORAGE_KEY = "pop-sound-muted";

interface SoundCtx {
  muted: boolean;
  toggleMuted: () => void;
  pop: () => void;
}

const Ctx = createContext<SoundCtx>({ muted: false, toggleMuted: () => {}, pop: () => {} });
export const useSound = () => useContext(Ctx);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const mutedRef = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) === "1";
      setMuted(saved);
      mutedRef.current = saved;
    } catch {}
  }, []);

  const play = useCallback(() => {
    try {
      audio.current ??= new AudioContext();
      const ac = audio.current;
      const t = ac.currentTime;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(260, t + 0.07);
      gain.gain.setValueAtTime(VOLUME, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      osc.connect(gain).connect(ac.destination);
      osc.start(t);
      osc.stop(t + 0.1);
    } catch {}
  }, []);

  const pop = useCallback(() => {
    if (!mutedRef.current) play();
  }, [play]);

  const toggleMuted = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {}
    if (!next) play(); // confirm sound is back on
  }, [play]);

  // Any click on a link or button pops (elements can opt out with data-no-pop).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest("a, button");
      if (target && !target.hasAttribute("data-no-pop")) pop();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pop]);

  return <Ctx.Provider value={{ muted, toggleMuted, pop }}>{children}</Ctx.Provider>;
}
