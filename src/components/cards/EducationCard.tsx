import type { Education, SkillGroup, BeyondItem } from "@/content/types";
import { TechList } from "@/components/ui/primitives";

export function EducationCard({ edu }: { edu: Education }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4">
          <h3 className="text-base font-medium text-ink">{edu.school}</h3>
          <span className="font-mono text-xs font-semibold uppercase tracking-wide text-faint">{edu.grad}</span>
        </div>
        <p className="text-sm">{edu.degree}</p>
        {edu.gpa && (
          <p className="mt-1 text-sm">
            GPA <span className="font-mono font-semibold text-shell">{edu.gpa}</span>
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {edu.coursework.map((g) => (
          <CourseworkGroup key={g.area} area={g.area} courses={g.courses} />
        ))}
      </div>

      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-faint">Involvement</h4>
        <p className="text-sm">{edu.activities.join(" · ")}</p>
      </div>
    </div>
  );
}

export function CourseworkGroup({ area, courses }: { area: string; courses: string[] }) {
  return (
    <div className="rounded-lg border border-white/5 bg-bg-raised/50 p-4">
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-faint">{area}</h4>
      <ul className="space-y-1 text-sm">
        {courses.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </div>
  );
}

export function SkillGroups({ groups }: { groups: SkillGroup[] }) {
  return (
    <div className="space-y-5">
      {groups.map((g) => (
        <div key={g.label}>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-faint">{g.label}</h4>
          <TechList items={g.items} label={g.label} />
        </div>
      ))}
    </div>
  );
}

export function BeyondTiles({ items }: { items: BeyondItem[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {items.map((b) => (
        <li key={b.title} className="rounded-lg border border-white/5 bg-bg-raised/50 p-4 transition hover:border-accent/30">
          <div className="text-2xl" aria-hidden>
            {b.icon}
          </div>
          <h3 className="mt-2 text-sm font-medium text-ink">{b.title}</h3>
          <p className="mt-1 text-sm leading-snug">{b.blurb}</p>
        </li>
      ))}
    </ul>
  );
}
