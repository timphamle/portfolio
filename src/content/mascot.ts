// Speech-bubble lines for the allay. Edit freely.

/**
 * A current update for the allay to share. When set, it opens with this on page load
 * (instead of the first general line) and mentions it again when clicked.
 * Set `until` (YYYY-MM-DD) to stop showing it after that day, or set it to null.
 */
export const currentUpdate: { text: string; until?: string } | null = {
  text: "psst, Tim's studying abroad at UNSW in Sydney right now 🦘",
};

export const mascotLines = {
  // Rotates when you click the allay or pause scrolling. The first is the greeting
  // when there's no current update.
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

/** The update text if it is set and not past its `until` date, else null. */
export function activeUpdate(now = new Date()): string | null {
  if (!currentUpdate) return null;
  if (currentUpdate.until && now > new Date(`${currentUpdate.until}T23:59:59`)) return null;
  return currentUpdate.text;
}
