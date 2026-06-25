import { useState, type ReactNode } from "react";
import { ArrowDownAZ, ArrowUpAZ, Check } from "lucide-react";
import type { POS, SortKey } from "../types";
import { POS_LABEL } from "../types";

interface FilterBarProps {
  posCounts: Record<POS, number>;
  total: number;
  activePos: "all" | POS;
  onPosChange: (pos: "all" | POS) => void;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
}

const POS_ORDER: POS[] = [
  "noun",
  "verb",
  "adjective",
  "adverb",
  "preposition",
  "conjunction",
];

/** Compact filter (part-of-speech chips) + sort menu. Height ~36px. */
export function FilterBar({
  posCounts,
  total,
  activePos,
  onPosChange,
  sort,
  onSortChange,
}: FilterBarProps) {
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <div className="no-scrollbar -mx-1 flex flex-1 items-center gap-2 overflow-x-auto px-1 py-0.5">
        <Chip active={activePos === "all"} onClick={() => onPosChange("all")}>
          Tất cả<span className="chip-count">{total}</span>
        </Chip>
        {POS_ORDER.map((p) => (
          <Chip key={p} active={activePos === p} onClick={() => onPosChange(p)}>
            {POS_LABEL[p]}
            <span className="chip-count">{posCounts[p] ?? 0}</span>
          </Chip>
        ))}
      </div>

      <div className="relative shrink-0">
        <button
          type="button"
          className="chip"
          onClick={() => setSortOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={sortOpen}
        >
          {sort === "alpha-asc" ? (
            <ArrowDownAZ size={15} />
          ) : (
            <ArrowUpAZ size={15} />
          )}
          <span className="hidden sm:inline">
            {sort === "alpha-asc" ? "A → Z" : "Z → A"}
          </span>
        </button>
        {sortOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setSortOpen(false)} />
            <div className="menu" role="menu">
              <SortItem
                active={sort === "alpha-asc"}
                onClick={() => {
                  onSortChange("alpha-asc");
                  setSortOpen(false);
                }}
                icon={<ArrowDownAZ size={16} className="mi-icon" />}
                label="Tên A → Z"
              />
              <SortItem
                active={sort === "alpha-desc"}
                onClick={() => {
                  onSortChange("alpha-desc");
                  setSortOpen(false);
                }}
                icon={<ArrowUpAZ size={16} className="mi-icon" />}
                label="Tên Z → A"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`chip${active ? " is-active" : ""}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

function SortItem({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button type="button" className="menu-item" role="menuitem" onClick={onClick}>
      {icon}
      <span>{label}</span>
      {active && (
        <Check size={15} className="ml-auto" style={{ color: "var(--primary)" }} />
      )}
    </button>
  );
}
