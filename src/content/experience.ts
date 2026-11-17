import type { Experience } from "./types";

// Newest first.
export const experience: Experience[] = [
  {
    company: "DraftKings",
    role: "Software Engineering Intern",
    start: "June 2027",
    end: "Aug 2027",
    location: "Boston, MA",
    url: "https://www.draftkings.com",
    bullets: [
      "TBD"
    ],
    tech: ["TBD"],
  },
  {
    company: "State Farm",
    role: "Software Engineering Intern",
    start: "May 2026",
    end: "Aug 2026",
    location: "Bloomington, IL",
    url: "https://www.statefarm.com",
    bullets: [
      "Integrated Swift sidecar services across 12 Credit Card Service Java REST APIs on AWS ECS and Lambda, reducing average response latency by 54%.",
      "Remediated 30 Snyk vulnerabilities across 3 REST APIs (critical findings → 0) and supported ~4 deployments/week via GitLab CI/CD, JFrog, CloudWatch, and Splunk.",
      "Launched a technical wiki for engineering workflows and shipped a Go Slack bot in 24 hours that automates pre-meeting icebreakers for a 5-person team.",
    ],
    tech: ["Java", "Spring Boot", "Go", "AWS ECS", "AWS Lambda", "GitLab CI/CD", "Snyk", "Splunk"],
  },
  {
    company: "Duke University Data+",
    role: "Data Science Intern",
    start: "May 2025",
    end: "Jul 2025",
    location: "Durham, NC",
    url: "https://www.polarizationlab.com/",
    bullets: [
      "Built a Streamlit web app to visualize public-opinion trends across 5,521 survey respondents.",
      "Performed data preprocessing, quality assessment, and survey-weighted analysis in R and Python.",
      "Presented a research poster to 400+ attendees, turning analysis into clear visuals and takeaways.",
    ],
    tech: ["Python", "R", "Streamlit", "Pandas"],
  },
];
