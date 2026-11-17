// Speech-bubble lines for the mascot. Edit freely.
export const mascotName = "Spike"; // placeholder name

export const mascotLines = {
  // Shown when you click the mascot, in a rotating order.
  general: [
    "hey! i'm Spike, Tim's sidekick 👋",
    "click around, the projects are the good part",
    "PR'd today 💪",
    "ask Tim about RAG pipelines",
    "first place, finance track. just saying 🏆",
  ],
  // Shown when a section is in view.
  sections: {
    about: "that's my guy ↗",
    experience: "54% faster APIs. not bad.",
    projects: "click a card for the deep dive →",
    education: "duke, double major. nerd.",
    beyond: "yes, i'm the mario kart main",
  } as Record<string, string>,
};
