// Domain types & shared constants for the Lexi dictionary.

export type POS =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "preposition"
  | "conjunction";

export interface WordEntry {
  id: string;
  word: string;
  ipa: string;
  pos: POS;
  meaning: string; // Vietnamese gloss
  example?: string; // English example
  exampleVi?: string; // Vietnamese example translation
}

export type SortKey = "alpha-asc" | "alpha-desc";
export type ViewKey = "dictionary" | "favorites" | "history" | "settings";
export type Theme = "light" | "dark";
export type Density = "comfortable" | "compact";

export interface Settings {
  theme: Theme;
  density: Density;
  showIpa: boolean;
  showPos: boolean;
}

/** Vietnamese label for a part of speech — used in filter chips. */
export const POS_LABEL: Record<POS, string> = {
  noun: "Danh từ",
  verb: "Động từ",
  adjective: "Tính từ",
  adverb: "Trạng từ",
  preposition: "Giới từ",
  conjunction: "Liên từ",
};

/** Compact dictionary-style abbreviation shown in the row (small, no badge). */
export const POS_ABBR: Record<POS, string> = {
  noun: "n.",
  verb: "v.",
  adjective: "adj.",
  adverb: "adv.",
  preposition: "prep.",
  conjunction: "conj.",
};

export const DEFAULT_SETTINGS: Settings = {
  theme: "light",
  density: "comfortable",
  showIpa: true,
  showPos: true,
};
