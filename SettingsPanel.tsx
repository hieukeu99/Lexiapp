import type { ReactNode } from "react";
import type { Density, Settings, Theme } from "../types";
import { DICTIONARY } from "../data/dictionary";

interface SettingsPanelProps {
  settings: Settings;
  onChange: (partial: Partial<Settings>) => void;
}

export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  return (
    <div className="scroll-area h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl px-6 py-8">
        <SectionTitle>Tùy chỉnh hiển thị</SectionTitle>
        <div style={{ borderTop: "1px solid var(--divider)" }}>
          <Row title="Giao diện" desc="Chế độ sáng hoặc tối">
            <Segmented
              value={settings.theme}
              options={[
                { v: "light" as Theme, l: "Sáng" },
                { v: "dark" as Theme, l: "Tối" },
              ]}
              onChange={(v) => onChange({ theme: v })}
            />
          </Row>
          <Row title="Mật độ danh sách" desc="Chế độ gọn hiển thị nhiều từ hơn">
            <Segmented<Density>
              value={settings.density}
              options={[
                { v: "comfortable", l: "Thoải mái" },
                { v: "compact", l: "Gọn" },
              ]}
              onChange={(v) => onChange({ density: v })}
            />
          </Row>
          <Row title="Phiên âm (IPA)" desc="Hiển thị cột phiên âm trong danh sách">
            <Switch
              on={settings.showIpa}
              onChange={() => onChange({ showIpa: !settings.showIpa })}
            />
          </Row>
          <Row title="Từ loại" desc="Hiển thị nhãn từ loại trong danh sách">
            <Switch
              on={settings.showPos}
              onChange={() => onChange({ showPos: !settings.showPos })}
            />
          </Row>
        </div>

        <p
          className="mt-8 text-[13px] leading-relaxed"
          style={{ color: "var(--on-surface-3)" }}
        >
          Lexi · từ điển Anh–Việt · {DICTIONARY.length} mục từ · bản xem trước thiết kế.
        </p>
      </div>
    </div>
  );
}

function Row({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: ReactNode;
}) {
  return (
    <div
      className="row py-4"
      style={{ borderBottom: "1px solid var(--divider)" }}
    >
      <div className="min-w-0">
        <div className="text-[15px] font-medium" style={{ color: "var(--on-surface)" }}>
          {title}
        </div>
        {desc && (
          <div className="text-[13px]" style={{ color: "var(--on-surface-2)" }}>
            {desc}
          </div>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2
      className="mb-2 text-[12px] font-semibold uppercase"
      style={{ letterSpacing: "0.08em", color: "var(--on-surface-3)" }}
    >
      {children}
    </h2>
  );
}

function Switch({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      className="switch"
      data-on={on}
      aria-pressed={on}
      onClick={onChange}
      aria-label="Bật / tắt"
    />
  );
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: Array<{ v: T; l: string }>;
  onChange: (v: T) => void;
}) {
  return (
    <div className="seg">
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          className={o.v === value ? "is-on" : ""}
          onClick={() => onChange(o.v)}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
}
