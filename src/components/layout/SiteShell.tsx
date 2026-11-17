/** Page frame: centered, two columns on desktop, one on mobile. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10 mx-auto min-h-screen max-w-screen-xl px-6 py-12 font-sans md:px-12 md:py-20 lg:px-24 lg:py-0">
      <a
        href="#content"
        className="absolute left-0 top-0 block -translate-x-full rounded bg-accent px-4 py-3 text-sm font-bold uppercase tracking-widest text-bg focus-visible:translate-x-0"
      >
        Skip to content
      </a>
      <div className="lg:flex lg:justify-between lg:gap-4">{children}</div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="max-w-md pb-16 text-sm text-faint sm:pb-0">
      <p>
        Built with Next.js, TypeScript and Tailwind CSS, deployed on Cloudflare. Source on{" "}
        <a
          href="https://github.com/timphamle/portfolio"
          target="_blank"
          rel="noreferrer noopener"
          className="font-medium text-muted hover:text-accent"
        >
          GitHub
        </a>
        .
      </p>
    </footer>
  );
}
