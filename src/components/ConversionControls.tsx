"use client";

import { CHARSETS } from "@/utils/imageToAscii";

interface Props {
  maxWidth: number;
  charset: string;
  structure: boolean;
  onMaxWidthChange: (value: number) => void;
  onCharsetChange: (value: string) => void;
  onStructureChange: (value: boolean) => void;
}

export default function ConversionControls({
  maxWidth,
  charset,
  structure,
  onMaxWidthChange,
  onCharsetChange,
  onStructureChange,
}: Props) {
  return (
    <div className="flex flex-col w-full gap-4 p-4 border border-[#00ff41]/30 rounded-lg bg-[#111]">
      <div className="flex flex-col gap-2">
        <label className="font-mono text-sm text-[#00ff41]">
          Resolution: {maxWidth} chars
        </label>
        <input
          type="range"
          min={20}
          max={200}
          value={maxWidth}
          onChange={(e) => onMaxWidthChange(Number(e.target.value))}
          className="w-full accent-[#00ff41]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-mono text-sm text-[#00ff41]">Charset</label>
        <div className="grid grid-cols-2 lg:flex gap-2">
          {Object.keys(CHARSETS).map((name) => (
            <button
              key={name}
              onClick={() => onCharsetChange(name)}
              className={`
                lg:flex-1 px-3 py-1.5 border rounded font-mono text-xs transition-colors
                ${charset === name
                  ? "border-[#00ff41] bg-[#00ff41]/20 text-[#00ff41]"
                  : "border-[#00ff41]/30 text-[#00ff41]/50 hover:border-[#ffb000] hover:text-[#ffb000]"
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
          <label className="font-mono text-sm text-[#00ff41]">
            Structure Mode
          </label>
          <button
            onClick={() => onStructureChange(!structure)}
            className={`
              px-3 py-1.5 border rounded font-mono text-xs transition-colors
              ${structure
                ? "border-[#00ff41] bg-[#00ff41]/20 text-[#00ff41]"
                : "border-[#00ff41]/30 text-[#00ff41]/50 hover:border-[#ffb000] hover:text-[#ffb000]"
              }
            `}
          >
            {structure ? "ON" : "OFF"}
          </button>
        </div>
      )}
    </div>
  );
}
