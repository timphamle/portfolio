import { Reveal } from "@/components/effects/Reveal";

/**
 * Wrapper for every home-page section. On mobile the title sticks to the top
 * while you scroll the section; on desktop it's a plain heading with an accent
 * line (matching the left nav), since the nav already tracks your position.
 */
export function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-label={title} className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
      <div className="sticky top-0 z-20 -mx-6 mb-4 bg-bg/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:static lg:mx-0 lg:mb-8 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <h2 className="flex items-center text-sm font-bold uppercase tracking-widest text-ink">
          <span aria-hidden className="mr-4 hidden h-px w-8 bg-accent lg:inline-block" />
          {title}
        </h2>
      </div>
      <Reveal>{children}</Reveal>
    </section>
  );
}

/** Wrap a list of cards in this: hovering one card dims its siblings (desktop only). */
export function HoverGroup({ children }: { children: React.ReactNode }) {
  return <ol className="group/list">{children}</ol>;
}

/** Shared card frame with the lift + dim-siblings hover effect. */
export function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <li className="mb-12">
      <div className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:group-hover/list:opacity-50 lg:hover:!opacity-100">
        <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-white/[0.04] lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg" />
        {children}
      </div>
    </li>
  );
}
