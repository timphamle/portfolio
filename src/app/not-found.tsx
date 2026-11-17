import { AllaySprite } from "@/components/mascot/AllaySprite";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <AllaySprite size={112} className="animate-bob drop-shadow-[0_0_12px_rgba(92,194,242,0.55)]" />
      <h1 className="mt-6 font-mono text-5xl font-bold text-ink">404</h1>
      <p className="mt-3">The allay searched everywhere. This page doesn&apos;t exist.</p>
      <Link href="/" className="mt-6 rounded-full border border-accent/60 px-4 py-2 text-sm font-medium text-accent hover:bg-accent-soft">
        Back home
      </Link>
    </main>
  );
}
