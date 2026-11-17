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

// Keep this short: 2–4 tiles.
export const beyond: BeyondItem[] = [
  {
    icon: "🏋️",
    title: "Powerlifting",
    blurb: "Member of Blue Devil Barbells. I like the gym so much I built an AI coach and ran a regression study on it.",
  },
  {
    icon: "🏎️",
    title: "Mario Kart",
    blurb: "Bowser Jr. main. Questionable lines, unwavering confidence.",
  },
  {
    icon: "🤝",
    title: "Community",
    blurb: "Treasurer of Lambda Phi Epsilon and a member of the Vietnamese Student Association.",
  },
];
