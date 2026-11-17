import type { Education, SkillGroup, BeyondItem } from "./types";

export const education: Education = {
  school: "Duke University",
  degree: "B.S. Computer Science & Statistical Science (Double Major)",
  location: "Durham, NC",
  grad: "Expected May 2028",
  gpa: "3.8 / 4.0",
  coursework: [
    {
      area: "Systems & Algorithms",
      courses: ["Data Structures & Algorithms", "Algorithm Design & Analysis", "Computer Architecture"],
    },
    {
      area: "ML & Statistics",
      courses: ["Applied Machine Learning", "Statistical Modeling"],
    },
  ],
  activities: [
    "Duke Applied Machine Learning",
    "Lambda Phi Epsilon (Treasurer)",
    "Vietnamese Student Association",
    "Blue Devil Barbells Powerlifting Club",
  ],
};

export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: ["Python", "Java", "Go", "TypeScript", "JavaScript", "R", "SQL", "C", "MIPS Assembly", "HTML/CSS"],
  },
  {
    label: "Frameworks & Libraries",
    items: ["Spring Boot", "Node.js", "Express", "React", "React Native", "Streamlit", "Shiny", "Pandas", "scikit-learn", "PyTorch", "XGBoost", "Sentence Transformers"],
  },
  {
    label: "Cloud & DevOps",
    items: ["AWS (ECS, Lambda, CloudWatch)", "Terraform", "Docker", "Git", "GitLab CI/CD", "JFrog", "Splunk", "Snyk"],
  },
  {
    label: "Data & APIs",
    items: ["MongoDB", "REST APIs", "OpenAI API", "LiteLLM"],
  },
];

// Connections between skills for the 3D skills graph. Every skill is already linked to
// its own group; these add the cross-links (what you've actually used together).
// Names must match the skills above exactly.
export const skillLinks: [string, string][] = [
  // Python data / ML stack
  ["Python", "Pandas"],
  ["Python", "scikit-learn"],
  ["Python", "PyTorch"],
  ["Python", "XGBoost"],
  ["Python", "Streamlit"],
  ["Python", "Sentence Transformers"],
  ["Python", "LiteLLM"],
  ["Python", "OpenAI API"],
  ["SQL", "Pandas"],
  ["R", "Shiny"],
  // RAG (myGymBro)
  ["Sentence Transformers", "LiteLLM"],
  ["LiteLLM", "OpenAI API"],
  ["Streamlit", "LiteLLM"],
  // Java / backend (State Farm, Subscription API)
  ["Java", "Spring Boot"],
  ["Spring Boot", "REST APIs"],
  ["Spring Boot", "Docker"],
  ["Spring Boot", "AWS (ECS, Lambda, CloudWatch)"],
  ["Go", "REST APIs"],
  // JavaScript / web (YOLO Fund)
  ["JavaScript", "React"],
  ["JavaScript", "Node.js"],
  ["JavaScript", "Express"],
  ["JavaScript", "React Native"],
  ["TypeScript", "React"],
  ["TypeScript", "Node.js"],
  ["HTML/CSS", "React"],
  ["Express", "MongoDB"],
  ["Express", "REST APIs"],
  ["Node.js", "MongoDB"],
  // Low level
  ["C", "MIPS Assembly"],
  // Cloud & delivery
  ["Docker", "AWS (ECS, Lambda, CloudWatch)"],
  ["Terraform", "AWS (ECS, Lambda, CloudWatch)"],
  ["GitLab CI/CD", "Docker"],
  ["GitLab CI/CD", "JFrog"],
  ["GitLab CI/CD", "Snyk"],
  ["GitLab CI/CD", "Git"],
  ["Splunk", "AWS (ECS, Lambda, CloudWatch)"],
  ["Java", "Snyk"],
];

// Keep this short: 2–4 tiles.
export const beyond: BeyondItem[] = [
  {
    icon: "🏋️",
    title: "Powerlifting",
    blurb: "Member of Blue Devil Barbells. I like the gym so much I built an AI coach and ran a regression study on it.",
  },
  {
    icon: "🎾",
    title: "Racket Sports",
    blurb: "Any racket sport and I'm there: Tennis, Pickleball, and Ping-pong.",
  },
  {
    icon: "🤝",
    title: "Community",
    blurb: "Treasurer of Lambda Phi Epsilon and a member of the Vietnamese Student Association.",
  },
];
