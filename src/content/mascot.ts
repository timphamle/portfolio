// Speech-bubble lines for the mascot. Edit freely.
export const mascotLines = {
  // The first one greets visitors on page load; the rest rotate in when the reader pauses.
  general: [
    "hi! i'm Tim's allay",
    "i fetch things. like projects →",
    "PR'd today 💪",
    "ask Tim about RAG pipelines",
    "first place, finance track. just saying 🏆",
  ],
  // Shown when a section scrolls into view.
  sections: {
    about: "that's my guy ↗",
    experience: "54% faster APIs. not bad.",
    projects: "click a card for the deep dive →",
    education: "duke, double major. nerd.",
    beyond: "yes, he's a gym rat",
  } as Record<string, string>,
};
