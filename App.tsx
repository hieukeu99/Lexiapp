import { useEffect, useMemo, useState, type ReactNode } from "react";
import { BookText, History, Moon, SearchX, Star, Sun } from "lucide-react";
import { cn } from "./utils/cn";
import { DICTIONARY } from "./data/dictionary";
import {
  DEFAULT_SETTINGS,
  type POS,
  type Settings,
  type SortKey,
  type ViewKey,
  type WordEntry,
} from "./types";
import { SearchBar } from "./components/SearchBar";
import { FilterBar } from "./components/FilterBar";
import { WordTable } from "./components/WordTable";
import { BottomNav } from "./components/BottomNav";
import { SettingsPanel } from "./components/SettingsPanel";

export default function App() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [query, setQuery] = useState("");
  const [pos, setPos] = useState<"all" | POS>("all");
  const [sort, setSort] = useState<SortKey>("alpha-asc");
  const [view, setView] = useState<ViewKey>("dictionary");
  const [favorites, setFavorites] = useState<Set<string>>(
    () => new Set(["beautiful", "freedom", "happy"]),
  );
  const [history, setHistory] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  /* theme token on <html> */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", settings.theme);
  }, [settings.theme]);

  /* lookups */
  const byId = useMemo(() => {
    const m: Record<string, WordEntry> = {};
    for (const w of DICTIONARY) m[w.id] = w;
    return m;
  }, []);

  const posCounts = useMemo(() => {
    const c: Record<POS, number> = {
      noun: 0,
      verb: 0,
      adjective: 0,
      adverb: 0,
      preposition: 0,
      conjunction: 0,
    };
    for (const w of DICTIONARY) c[w.pos] += 1;
    return c;
  }, []);

  /* base list per view */
  const base = useMemo<WordEntry[]>(() => {
    if (view === "favorites") return DICTIONARY.filter((w) => favorites.has(w.id));
    if (view === "history")
      return history.map((id) => byId[id]).filter(Boolean) as WordEntry[];
    return DICTIONARY;
  }, [view, favorites, history, byId]);

  /* search + pos filter + sort pipeline */
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = base.filter((w) => {
      if (pos !== "all" && w.pos !== pos) return false;
      if (!q) return true;
      return (
        w.word.toLowerCase().includes(q) ||
        w.meaning.toLowerCase().includes(q) ||
        w.ipa.replace(/[\\/]/g, "").includes(q)
      );
    });
    if (view !== "history") {
      list = [...list].sort((a, b) => {
        const r = a.word.localeCompare(b.word, "en");
        return sort === "alpha-desc" ? -r : r;
      });
    }
    return list;
  }, [base, query, pos, sort, view]);

  /* handlers */
  const updateSettings = (partial: Partial<Settings>) =>
    setSettings((s) => ({ ...s, ...partial }));

  const toggleFav = (id: string) =>
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleOpen = (id: string) => {
    if (openId === id) {
      setOpenId(null);
      return;
    }
    setOpenId(id);
    setHistory((h) => [id, ...h.filter((x) => x !== id)]);
  };

  const speak = (word: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = "en-US";
    u.rate = 0.92;
    synth.speak(u);
  };

  const changeView = (v: ViewKey) => {
    setView(v);
    setOpenId(null);
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col",
        settings.density === "compact" && "density-compact",
      )}
    >
      {/* ---- App bar (stays put; main scrolls) ---- */}
      <header
        className="z-20 shrink-0 border-b"
        style={{ borderColor: "var(--divider)", background: "var(--surface)" }}
      >
        <div className="flex items-center justify-between px-6 pt-3 pb-2 sm:px-8 lg:px-12">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
            >
              <BookText size={18} strokeWidth={2.2} />
            </span>
            <div className="flex items-baseline gap-2">
              <span
                className="text-[17px] font-bold tracking-tight"
                style={{ color: "var(--on-surface)" }}
              >
                Lexi
              </span>
              <span className="text-[12px]" style={{ color: "var(--on-surface-3)" }}>
                Từ điển Anh–Việt
              </span>
            </div>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={() =>
              updateSettings({ theme: settings.theme === "light" ? "dark" : "light" })
            }
            aria-label="Đổi giao diện sáng / tối"
          >
            {settings.theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>

        {view !== "settings" && (
          <div className="px-6 pb-3 sm:px-8 lg:px-12">
            <div className="space-y-2.5">
              <SearchBar value={query} onChange={setQuery} />
              <FilterBar
                posCounts={posCounts}
                total={DICTIONARY.length}
                activePos={pos}
                onPosChange={setPos}
                sort={sort}
                onSortChange={setSort}
              />
            </div>
          </div>
        )}
      </header>

      {/* ---- Content ---- */}
      <main className="scroll-area min-h-0 flex-1 overflow-y-auto">
        {view === "settings" ? (
          <SettingsPanel settings={settings} onChange={updateSettings} />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={emptyIcon(view, query)}
            title={emptyTitle(view, query)}
            desc={emptyDesc(view, query)}
          />
        ) : (
          <div className="px-6 pb-10 sm:px-8 lg:px-12">
            <WordTable
              words={visible}
              settings={settings}
              favorites={favorites}
              openId={openId}
              onToggleOpen={toggleOpen}
              onToggleFav={toggleFav}
              onSpeak={speak}
            />
          </div>
        )}
      </main>

      {/* ---- Material 3 bottom navigation ---- */}
      <BottomNav view={view} onChange={changeView} />
    </div>
  );
}

/* ---------- Empty states ---------- */

function EmptyState({
  icon,
  title,
  desc,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-16 text-center">
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
        style={{ background: "var(--surface-2)", color: "var(--on-surface-3)" }}
      >
        {icon}
      </div>
      <div
        className="text-[17px] font-semibold"
        style={{ color: "var(--on-surface)" }}
      >
        {title}
      </div>
      <div
        className="mt-1 max-w-xs text-[14px]"
        style={{ color: "var(--on-surface-2)" }}
      >
        {desc}
      </div>
    </div>
  );
}

function emptyIcon(view: ViewKey, query: string): ReactNode {
  if (query.trim() !== "") return <SearchX size={26} />;
  if (view === "favorites") return <Star size={26} />;
  return <History size={26} />;
}

function emptyTitle(view: ViewKey, query: string): string {
  if (query.trim() !== "") return "Không tìm thấy kết quả";
  if (view === "favorites") return "Chưa có từ yêu thích";
  return "Chưa có lịch sử";
}

function emptyDesc(view: ViewKey, query: string): string {
  if (query.trim() !== "") return `Không có từ nào khớp với “${query.trim()}”.`;
  if (view === "favorites")
    return "Nhấn biểu tượng sao bên cạnh mỗi từ để lưu vào đây.";
  return "Mở bất kỳ từ nào trong từ điển, từ đó sẽ xuất hiện tại đây.";
}
