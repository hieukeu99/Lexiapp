import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

/** Slim 48px search field — border only, no shadow. */
export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-wrap">
      <Search
        size={18}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--on-surface-3)]"
      />
      <input
        className="search-input"
        type="text"
        inputMode="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tìm từ, nghĩa hoặc phiên âm…"
        aria-label="Tìm kiếm từ vựng"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
      />
      {value !== "" && (
        <button
          type="button"
          className="icon-btn absolute right-1.5 top-1/2 -translate-y-1/2"
          onClick={() => onChange("")}
          aria-label="Xóa tìm kiếm"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
