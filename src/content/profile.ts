import type { Profile } from "./types";

export const profile: Profile = {
  name: "Tim Le",
  role: "Software Engineer",
  tagline:
    "CS & Statistics @ Duke. I build backend services, data tools, and ML-powered apps that people actually use.",
  about: [
    "I'm a **Computer Science & Statistical Science** double major at **Duke University**. I like work that sits between solid backend engineering and data: making services faster, safer, and easier to reason about.",
    "Most recently I was a software engineering intern at **State Farm**, where I integrated sidecar services across 12 Java REST APIs on **AWS** and cut average latency by **54%**. Before that I built data tools at **Duke Data+**.",
    "Outside of class I'm usually under a barbell with **Blue Devil Barbells** or losing friendships in Mario Kart. I'm currently looking for **software engineering roles**.",
  ],
  email: "tim.le@duke.edu",
  socials: {
    github: "https://github.com/timphamle",
    linkedin: "https://www.linkedin.com/in/tim-pham-le/",
  },
  // TODO: drop a copy of your resume at public/resume.pdf (consider removing your phone number first).
  resumePath: "/resume.pdf",
  siteUrl: "https://timphamle.com",
};
