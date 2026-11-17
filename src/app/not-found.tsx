import Link from "next/link";
import { MascotSprite } from "@/components/mascot/MascotSprite";

export default function NotFound() {
  return (
    <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <MascotSprite size={96} />
      <h1 className="mt-6 font-mono text-5xl font-bold text-ink">404</h1>
      <p className="mt-3">The allay searched everywhere. This page doesn&apos;t exist.</p>
      <Link href="/" className="mt-6 rounded-full border border-accent/60 px-4 py-2 text-sm font-medium text-accent hover:bg-accent-soft">
        Back home
      </Link>
    </main>
  );
}
