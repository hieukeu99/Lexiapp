import { useState } from "react";
import { Copy, MoreVertical, Star, Volume2 } from "lucide-react";
import type { WordEntry } from "../types";
import { POS_ABBR } from "../types";

interface WordRowProps {
  entry: WordEntry;
  showIpa: boolean;
  showPos: boolean;
  isFav: boolean;
  isOpen: boolean;
  onToggleOpen: (id: string) => void;
  onToggleFav: (id: string) => void;
  onSpeak: (word: string) => void;
}

function copyText(text: string) {
  try {
    void navigator.clipboard?.writeText(text);
  } catch {
    /* clipboard unavailable */
  }
}

export function WordRow({
  entry,
  showIpa,
  showPos,
  isFav,
  isOpen,
  onToggleOpen,
  onToggleFav,
  onSpeak,
}: WordRowProps) {
  const colSpan = 3 + (showIpa ? 1 : 0) + (showPos ? 1 : 0);

  return (
    <>
      <tr
        className={`word-row${isOpen ? " is-open" : ""}`}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-label={`${entry.word} — ${entry.meaning}`}
        onClick={() => onToggleOpen(entry.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggleOpen(entry.id);
          }
        }}
      >
        <td className="col-word">
          <span className="dict-headword">{entry.word}</span>
        </td>

        {showIpa && (
          <td className="col-ipa">
            <button
              type="button"
              className="ipa-btn"
              onClick={(e) => {
                e.stopPropagation();
                onSpeak(entry.word);
              }}
              aria-label={`Phát âm ${entry.word}`}
            >
              <span className="dict-ipa">{entry.ipa}</span>
              <Volume2 className="spk" />
            </button>
          </td>
        )}

        {showPos && (
          <td className="col-pos">
            <span className="dict-pos">{POS_ABBR[entry.pos]}</span>
          </td>
        )}

        <td className="col-meaning">
          <span className="dict-meaning">{entry.meaning}</span>
        </td>

        <td className="col-actions">
          <button
            type="button"
            className={`icon-btn${isFav ? " is-fav" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFav(entry.id);
            }}
            aria-pressed={isFav}
            aria-label={isFav ? "Bỏ yêu thích" : "Thêm yêu thích"}
          >
            <Star size={18} fill={isFav ? "currentColor" : "none"} />
          </button>

          <MoreButton
            entry={entry}
            isFav={isFav}
            onToggleFav={onToggleFav}
            onSpeak={onSpeak}
          />
        </td>
      </tr>

      {isOpen && (
        <tr className="detail-row">
          <td colSpan={colSpan}>
            {entry.example ? (
              <div>
                <div
                  className="mb-1 text-[11px] font-semibold uppercase"
                  style={{ letterSpacing: "0.08em", color: "var(--on-surface-3)" }}
                >
                  Ví dụ
                </div>
                <div
                  className="text-[15px]"
                  style={{ color: "var(--on-surface)" }}
                >
                  {entry.example}
                </div>
                {entry.exampleVi && (
                  <div
                    className="mt-0.5 text-[14px]"
                    style={{ color: "var(--on-surface-2)" }}
                  >
                    {entry.exampleVi}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-[14px]" style={{ color: "var(--on-surface-2)" }}>
                Chưa có ví dụ cho từ này.
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

interface MoreButtonProps {
  entry: WordEntry;
  isFav: boolean;
  onToggleFav: (id: string) => void;
  onSpeak: (word: string) => void;
}

function MoreButton({ entry, isFav, onToggleFav, onSpeak }: MoreButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block align-middle">
      <button
        type="button"
        className="icon-btn"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Tùy chọn khác"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          />
          <div className="menu" role="menu" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="menu-item"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onSpeak(entry.word);
              }}
            >
              <Volume2 size={16} className="mi-icon" />
              Phát âm
            </button>
            <button
              type="button"
              className="menu-item"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onToggleFav(entry.id);
              }}
            >
              <Star size={16} className="mi-icon" />
              {isFav ? "Bỏ yêu thích" : "Thêm yêu thích"}
            </button>
            <button
              type="button"
              className="menu-item"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                copyText(entry.word);
              }}
            >
              <Copy size={16} className="mi-icon" />
              Sao chép từ
            </button>
            <button
              type="button"
              className="menu-item"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                copyText(entry.meaning);
              }}
            >
              <Copy size={16} className="mi-icon" />
              Sao chép nghĩa
            </button>
          </div>
        </>
      )}
    </div>
  );
}
