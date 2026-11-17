import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/content/projects";
import { ProjectLayout } from "@/components/project/ProjectLayout";

// Static export: one HTML page per project, generated at build time.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return { title: project.title, description: project.tagline };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const i = projects.indexOf(project);
  const next = projects[(i + 1) % projects.length];
  return <ProjectLayout project={project} next={next.slug === project.slug ? undefined : next} />;
}
