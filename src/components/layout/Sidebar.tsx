"use client";

import Link from "next/link";
import type { Profile } from "@/content/types";
import { useActiveSection } from "@/components/effects/ActiveSection";
import { MuteToggle } from "@/components/effects/MuteToggle";
import { Mascot } from "@/components/mascot/Mascot";
import { GitHubIcon, LinkedInIcon, MailIcon, ArrowUpRight } from "@/components/ui/icons";

export interface NavItem {
  id: string;
  label: string;
}

/** Sticky left column: intro, section nav, resume, mascot, socials. */
export function Sidebar({ profile, nav }: { profile: Profile; nav: NavItem[] }) {
  return (
    <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-[48%] lg:flex-col lg:justify-between lg:py-24">
      <div>
        <div className="flex items-center gap-8">
          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            <Link href="/">{profile.name}</Link>
          </h1>
          <Mascot size={52} />
        </div>
        <h2 className="mt-3 text-lg font-medium tracking-tight text-ink sm:text-xl">{profile.role}</h2>
        <p className="mt-4 max-w-xs leading-normal">{profile.tagline}</p>

        {profile.resumePath && (
          <a
            href={profile.resumePath}
            target="_blank"
            rel="noreferrer noopener"
            className="group mt-6 inline-flex items-center gap-1.5 rounded-full border border-accent/60 px-4 py-2 text-sm font-medium text-accent transition hover:bg-accent-soft"
          >
            View Resume
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        )}

        <SectionNav items={nav} />
      </div>

      <div className="mt-10 lg:mt-0">
        <SocialLinks profile={profile} />
      </div>
    </header>
  );
}

function SectionNav({ items }: { items: NavItem[] }) {
  const active = useActiveSection();
  return (
    <nav className="hidden lg:block" aria-label="In-page jump links">
      <ul className="mt-14 w-max">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a href={`#${item.id}`} className="group flex items-center py-3" aria-current={isActive ? "true" : undefined}>
                <span
                  className={`mr-4 h-px transition-all motion-reduce:transition-none ${
                    isActive ? "w-16 bg-accent" : "w-8 bg-faint group-hover:w-16 group-hover:bg-ink"
                  }`}
                />
                <span
                  className={`text-xs font-bold uppercase tracking-widest ${
                    isActive ? "text-ink" : "text-faint group-hover:text-ink"
                  }`}
                >
                  {item.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function SocialLinks({ profile }: { profile: Profile }) {
  const links = [
    { href: profile.socials.github, label: "GitHub", Icon: GitHubIcon },
    { href: profile.socials.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: `mailto:${profile.email}`, label: "Email", Icon: MailIcon },
  ];
  return (
    <ul className="flex items-center gap-5" aria-label="Social media">
      {links.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={label}
            title={label}
            className="block text-muted transition hover:text-ink"
          >
            <Icon className="h-6 w-6" />
          </a>
        </li>
      ))}
      <li className="ml-1">
        <MuteToggle />
      </li>
    </ul>
  );
}
