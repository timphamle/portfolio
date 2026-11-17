// Speech-bubble lines for the mascot. Edit freely.
export const mascotName = "Allay";

export const mascotLines = {
  // Shown when you click the mascot, in a rotating order.
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
