import type { Settings, WordEntry } from "../types";
import { WordRow } from "./WordRow";

interface WordTableProps {
  words: WordEntry[];
  settings: Settings;
  favorites: Set<string>;
  openId: string | null;
  onToggleOpen: (id: string) => void;
  onToggleFav: (id: string) => void;
  onSpeak: (word: string) => void;
}

/**
 * Single shared horizontal table — reused across Dictionary, Favorites
 * and History views. Columns line up across every row (table layout),
 * with the Meaning column flexing to fill remaining width.
 */
export function WordTable({
  words,
  settings,
  favorites,
  openId,
  onToggleOpen,
  onToggleFav,
  onSpeak,
}: WordTableProps) {
  return (
    <table className="dict-table">
      <thead>
        <tr>
          <th className="col-word">Từ</th>
          {settings.showIpa && <th className="col-ipa">Phiên âm</th>}
          {settings.showPos && <th className="col-pos">Loại từ</th>}
          <th className="col-meaning">Nghĩa</th>
          <th className="col-actions">
            <span className="sr-only">Hành động</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {words.map((w) => (
          <WordRow
            key={w.id}
            entry={w}
            showIpa={settings.showIpa}
            showPos={settings.showPos}
            isFav={favorites.has(w.id)}
            isOpen={openId === w.id}
            onToggleOpen={onToggleOpen}
            onToggleFav={onToggleFav}
            onSpeak={onSpeak}
          />
        ))}
      </tbody>
    </table>
  );
}
