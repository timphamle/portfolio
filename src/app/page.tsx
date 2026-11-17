import { profile } from "@/content/profile";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
import { education, skills, beyond } from "@/content/education";
import { ActiveSectionProvider } from "@/components/effects/ActiveSection";
import { SiteShell, Footer } from "@/components/layout/SiteShell";
import { Sidebar, type NavItem } from "@/components/layout/Sidebar";
import { Section, HoverGroup } from "@/components/layout/Section";
import { ExperienceCard } from "@/components/cards/ExperienceCard";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { EducationCard, SkillGroups, BeyondTiles } from "@/components/cards/EducationCard";
import { RichText } from "@/components/ui/primitives";

// Order here = order on the page and in the left nav.
const nav: NavItem[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "beyond", label: "Beyond" },
];

export default function Home() {
  return (
    <ActiveSectionProvider ids={nav.map((n) => n.id)}>
      <SiteShell>
        <Sidebar profile={profile} nav={nav} />

        <main id="content" className="pt-24 lg:w-[52%] lg:py-24">
          <Section id="about" title="About">
            <div className="space-y-4">
              {profile.about.map((p) => (
                <p key={p}>
                  <RichText text={p} />
                </p>
              ))}
            </div>
          </Section>

          <Section id="experience" title="Experience">
            <HoverGroup>
              {experience.map((job) => (
                <ExperienceCard key={job.company + job.start} job={job} />
              ))}
            </HoverGroup>
          </Section>

          <Section id="projects" title="Projects">
            <HoverGroup>
              {projects.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </HoverGroup>
          </Section>

          <Section id="education" title="Education">
            <EducationCard edu={education} />
            <div className="mt-10">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-ink">Skills</h3>
              <SkillGroups groups={skills} />
            </div>
          </Section>

          <Section id="beyond" title="Beyond the Code">
            <BeyondTiles items={beyond} />
          </Section>

          <Footer />
        </main>
      </SiteShell>
    </ActiveSectionProvider>
  );
}
