import { BookText, History, Star, Settings as SettingsIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ViewKey } from "../types";

interface BottomNavProps {
  view: ViewKey;
  onChange: (view: ViewKey) => void;
}

const ITEMS: Array<{ key: ViewKey; label: string; icon: LucideIcon }> = [
  { key: "dictionary", label: "Từ điển", icon: BookText },
  { key: "favorites", label: "Yêu thích", icon: Star },
  { key: "history", label: "Lịch sử", icon: History },
  { key: "settings", label: "Cài đặt", icon: SettingsIcon },
];

/** Material Design 3 navigation bar — pill indicator, hairline top border, no shadow. */
export function BottomNav({ view, onChange }: BottomNavProps) {
  return (
    <nav className="nav-bar" aria-label="Điều hướng chính">
      {ITEMS.map(({ key, label, icon: Icon }) => {
        const active = view === key;
        return (
          <button
            key={key}
            type="button"
            className={`nav-item${active ? " is-active" : ""}`}
            onClick={() => onChange(key)}
            aria-current={active ? "page" : undefined}
          >
            <span className="nav-pill">
              <Icon strokeWidth={active ? 2.4 : 2} />
            </span>
            <span className="nav-label">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
