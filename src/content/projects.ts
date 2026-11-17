import type { Project } from "./types";

// Featured projects, in display order. Each one gets a card on the home page
// and a deep-dive page at /projects/<slug>/ built from `detail`.
export const projects: Project[] = [
  {
    slug: "mygymbro",
    title: "myGymBro",
    tagline: "An AI fitness coach that combines your workout logs, a 132-source RAG knowledge base, and next-weight prediction models.",
    date: "Apr 2026 – Present",
    metric: { value: "132", label: "RAG sources" },
    tech: ["Python", "Streamlit", "RAG", "Sentence Transformers", "XGBoost", "LiteLLM"],
    links: [
      { kind: "live", label: "Live app", href: "https://mygymbroduke.streamlit.app/" },
      { kind: "github", label: "GitHub", href: "https://github.com/timphamle/myGymBro" },
      { kind: "video", label: "Demo video", href: "https://youtu.be/6ITeRZiAfHg" },
      { kind: "video", label: "Technical walkthrough", href: "https://youtu.be/IhFlE3sCBrs" },
    ],
    detail: {
      role: "Solo developer",
      team: "1",
      tldr: [
        "A Streamlit app where you log workouts and set goals, then chat with a coach that actually knows your history.",
        "Retrieval-augmented generation over 132 strength-training sources using all-MiniLM-L6-v2 embeddings plus metadata-aware re-ranking.",
        "Three next-weight prediction models (rule-based baseline, XGBoost, per-category XGBoost) trained on 721 workouts, evaluated on a 420-row held-out split.",
      ],
      problem: [
        "Most workout trackers are good at storing sets and reps but give no actionable coaching. Generic chatbots give advice, but they don't know what you lifted last week.",
        "myGymBro joins the two: user state (logs, profile, goals, equipment), fitness knowledge (RAG), and predictive modeling (what weight should I try next?).",
      ],
      architecture: [
        { step: "Log", detail: "Workout Logger page captures exercise, sets, reps, weight, RPE and RIR into a per-session store." },
        { step: "Profile", detail: "Goal, experience level, equipment access and weekly frequency become structured training context." },
        { step: "Retrieve", detail: "The question is embedded with all-MiniLM-L6-v2; top chunks are re-ranked by metadata tags, trusted domains and low-value-text filters." },
        { step: "Predict", detail: "For progression questions, a hybrid of the baseline and XGBoost models estimates the next working weight." },
        { step: "Generate", detail: "Retrieved context, recent history and predictions are sent as system context to the LLM (via LiteLLM); the reply is streamed back to the chat." },
      ],
      stack: [
        {
          group: "App",
          items: [
            { name: "Streamlit", why: "Fast multi-page UI for a data-heavy app without a separate frontend." },
            { name: "LiteLLM", why: "One interface across model providers; easy to swap models." },
          ],
        },
        {
          group: "ML",
          items: [
            { name: "Sentence Transformers", why: "Lightweight embeddings that run cheaply for retrieval." },
            { name: "XGBoost", why: "Strong tabular baseline for next-weight regression." },
            { name: "Pandas / scikit-learn", why: "Cleaning, feature building and evaluation." },
          ],
        },
      ],
      challenges: [
        {
          title: "Making the coach feel integrated",
          body: "Passing retrieved context as system-level app context (instead of pasting it into the user message) stopped replies like \"based on the context you provided\" and made the assistant feel like part of the app.",
        },
        {
          title: "When the simple model wins",
          body: "The rule-based baseline had the best MAE and within-2.5/5/10 lb accuracy because real lifters progress in discrete plate jumps; XGBoost had the lowest RMSE. The shipped app picks between them based on how much history a user has logged.",
        },
        {
          title: "Noisy retrieval",
          body: "YouTube transcripts are full of filler. Re-ranking on trusted domains and down-weighting phrases like \"thanks for watching\" noticeably improved the chunks the coach sees.",
        },
      ],
      results: [
        { value: "132", label: "knowledge-base sources" },
        { value: "721", label: "training workouts" },
        { value: "420", label: "held-out test rows" },
        { value: "3", label: "models compared" },
      ],
      next: [
        "Persist user data across sessions with auth and a real database.",
        "Collect RPE/RIR in the seed data so progression models can use effort signals.",
        "Add an evaluation harness for coach answers, not just weight predictions.",
      ],
    },
  },
  {
    slug: "yolo-fund",
    title: "YOLO Fund",
    tagline: "A MERN investment marketplace connecting early-stage founders and investors, built in 24 hours.",
    date: "Feb 2025",
    award: "1st Place · Finance Track · HackDuke 2025",
    metric: { value: "250+", label: "pitch attendees" },
    tech: ["MongoDB", "Express", "React", "Node.js"],
    links: [{ kind: "github", label: "Team repo", href: "https://github.com/tkgit-make/hackduke2025" }],
    detail: {
      role: "Team lead · backend & auth",
      team: "4",
      tldr: [
        "Led a 4-person team to build a full-stack investment marketplace in 24 hours at HackDuke 2025.",
        "Built the MongoDB backend services and authentication for secure login.",
        "Pitched to 250+ attendees and won 1st Place in the Finance Track.",
      ],
      problem: ["TODO: who it's for and what pain it solves for founders and investors."],
      architecture: [
        { step: "Client", detail: "React frontend for browsing and listing opportunities. (TODO: confirm)" },
        { step: "API", detail: "Express server exposing marketplace and auth routes." },
        { step: "Data", detail: "MongoDB collections for users, startups and investments." },
      ],
      stack: [
        {
          group: "Full stack",
          items: [
            { name: "MongoDB", why: "Flexible documents for fast iteration during a hackathon." },
            { name: "Express / Node.js", why: "One language across the stack for a 4-person team." },
            { name: "React", why: "TODO" },
          ],
        },
      ],
      challenges: [{ title: "TODO", body: "TODO: the hardest technical problem in the 24 hours and how you solved it." }],
      results: [
        { value: "1st", label: "Finance Track" },
        { value: "24h", label: "build time" },
        { value: "250+", label: "pitch attendees" },
      ],
      next: ["TODO"],
    },
  },
  {
    slug: "powerlifting-regression",
    title: "Powerlifting Performance Regression",
    tagline: "Which factors best predict a lifter's best squat, bench and deadlift? GLS models on 1,154 IPF World University Cup records.",
    date: "Oct 2025 – Dec 2025",
    metric: { value: "1,154", label: "competition records" },
    tech: ["R", "nlme", "tidyverse", "GLS Regression"],
    links: [
      { kind: "docs", label: "Report", href: "https://timphamle.github.io/powerlifting-regression-analysis/" },
      { kind: "github", label: "GitHub", href: "https://github.com/timphamle/powerlifting-regression-analysis" },
    ],
    detail: {
      role: "Co-author",
      team: "2",
      tldr: [
        "Analyzed 1,154 records from 8 years of the IPF World University Powerlifting Cup.",
        "Fit generalized least squares models that allow variance to differ by sex, compared with BIC, RMSE and out-of-sample R².",
        "Bench press is the only lift where bodyweight's effect differs meaningfully between men and women.",
      ],
      problem: [
        "What is the most parsimonious combination of bodyweight, sex, age and home-country advantage that predicts a lifter's best squat, bench and deadlift?",
      ],
      architecture: [
        { step: "Collect", detail: "Filtered the OpenPowerlifting dataset to World University Powerlifting Cup meets (2017–2019, 2021–2025)." },
        { step: "Explore", detail: "Correlation analysis and diagnostics showed unequal variance between sexes." },
        { step: "Model", detail: "Univariate GLS models per lift with a sex-specific variance structure (nlme)." },
        { step: "Select", detail: "Iteratively refined predictors, comparing BIC, RMSE and out-of-sample R²." },
      ],
      stack: [
        {
          group: "Analysis",
          items: [
            { name: "R + nlme", why: "GLS with flexible variance structures." },
            { name: "tidyverse / broom", why: "Clean data wrangling and tidy model outputs." },
            { name: "patchwork / corrplot", why: "Publication-quality figures." },
          ],
        },
      ],
      challenges: [
        {
          title: "Heteroscedasticity by sex",
          body: "Ordinary least squares assumes equal variance, but spread in lifts differs between men and women. GLS with a sex-specific variance function fixed the residual pattern.",
        },
      ],
      results: [
        { value: "1,154", label: "records" },
        { value: "8", label: "years of meets" },
        { value: "3", label: "lifts modeled" },
      ],
      next: ["Add attempt-selection strategy and training-age data if available."],
    },
  },
  {
    slug: "subscription-api",
    title: "Subscription Management API",
    tagline: "A Spring Boot REST API for users, subscriptions and their payment methods, containerized with Docker.",
    date: "2026",
    tech: ["Java 21", "Spring Boot", "Maven", "Docker"],
    links: [{ kind: "github", label: "GitHub", href: "https://github.com/timphamle/subscription-management-api" }],
    detail: {
      role: "Solo developer",
      team: "1",
      tldr: [
        "Layered controller → service → model design with REST endpoints for users, subscriptions and nested payment methods.",
        "Runs locally with the Maven wrapper or in Docker with a configurable PORT.",
      ],
      problem: ["Practice building the kind of service-oriented REST API used in production fintech systems."],
      architecture: [
        { step: "Controller", detail: "UserController and SubscriptionController map HTTP routes like /subscriptions/{id}/payment-method." },
        { step: "Service", detail: "Business logic for creating, fetching and deleting resources." },
        { step: "Storage", detail: "In-memory lists for now; resets on restart." },
      ],
      stack: [
        {
          group: "Backend",
          items: [
            { name: "Spring Boot", why: "Industry-standard Java framework for REST services." },
            { name: "Docker", why: "Same runtime everywhere; easy to deploy." },
          ],
        },
      ],
      challenges: [{ title: "TODO", body: "TODO" }],
      results: [{ value: "11", label: "REST endpoints" }],
      next: [
        "Persist to PostgreSQL with Spring Data JPA.",
        "Return proper 404s and validation errors instead of null.",
        "Auto-generate IDs and add integration tests.",
      ],
    },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
