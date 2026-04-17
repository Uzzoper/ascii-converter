"use client";

import { CHARSETS } from "@/utils/imageToAscii";
import { useI18n } from "@/i18n/I18nProvider";

interface Props {
  maxWidth: number;
  charset: string;
  structure: boolean;
  fontSize: number;
  onMaxWidthChange: (value: number) => void;
  onCharsetChange: (value: string) => void;
  onStructureChange: (value: boolean) => void;
  onFontSizeChange: (value: number) => void;
}

export default function ConversionControls({
  maxWidth,
  charset,
  structure,
  fontSize,
  onMaxWidthChange,
  onCharsetChange,
  onStructureChange,
  onFontSizeChange,
}: Props) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col w-full gap-4 p-4 border border-border-subtle rounded-lg bg-surface">
      <div className="flex flex-col gap-2">
        <label className="font-mono text-sm text-foreground">
          {t("controls.resolution", { n: maxWidth })}
        </label>
        <input
          type="range"
          min={20}
          max={200}
          value={maxWidth}
          onChange={(e) => onMaxWidthChange(Number(e.target.value))}
          className="w-full accent-foreground"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-mono text-sm text-foreground">
          {t("controls.fontSize", { n: fontSize })}
        </label>
        <input
          type="range"
          min={6}
          max={24}
          value={fontSize}
          onChange={(e) => onFontSizeChange(Number(e.target.value))}
          className="w-full accent-foreground"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-mono text-sm text-foreground">{t("controls.charset")}</label>
        <div className="grid grid-cols-2 lg:flex gap-2">
          {Object.keys(CHARSETS).map((name) => (
            <button
              key={name}
              onClick={() => onCharsetChange(name)}
              className={`
                lg:flex-1 px-3 py-1.5 border rounded font-mono text-xs transition-colors
                ${charset === name
                  ? "btn-toggle-active"
                  : "btn-toggle-inactive"
                }
              `}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {charset === "Detailed" && (
        <div className="flex flex-col gap-2">
          <label className="font-mono text-sm text-foreground">
            {t("controls.structure")}
          </label>
          <button
            onClick={() => onStructureChange(!structure)}
            className={`
              px-3 py-1.5 border rounded font-mono text-xs transition-colors
              ${structure
                ? "btn-toggle-active"
                : "btn-toggle-inactive"
              }
            `}
          >
            {structure ? t("controls.structure_on") : t("controls.structure_off")}
          </button>
        </div>
      )}
    </div>
  );
}
