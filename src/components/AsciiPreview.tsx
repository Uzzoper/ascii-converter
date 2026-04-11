"use client";

import { useState, useCallback, useEffect } from "react";
import { X } from "lucide-react";
import ActionButtons from "./ActionButtons";

interface Props {
  ascii: string;
  onDownload: () => void;
}

export default function AsciiPreview({ ascii, onDownload }: Props) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const openFullscreen = useCallback(() => setIsFullscreen(true), []);
  const closeFullscreen = useCallback(() => setIsFullscreen(false), []);

  useEffect(() => {
    if (!isFullscreen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  return (
    <>
      <div className="flex flex-col w-full gap-4">
        <pre
          style={{ fontSize: "10px", lineHeight: 1 }}
          className="w-full max-w-full overflow-auto p-4 bg-[#111] border border-[#00ff41] rounded-lg text-[#00ff41] font-mono h-[50vh] lg:h-[75vh] min-h-[400px] max-h-[85vh]"
        >
          {ascii}
        </pre>
        <ActionButtons
          ascii={ascii}
          onDownload={onDownload}
          onFullscreen={openFullscreen}
        />
      </div>

      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/95 backdrop-blur-sm"
          onClick={closeFullscreen}
        >
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 z-50 p-2 border border-[#00ff41]/50 rounded-lg text-[#00ff41] hover:bg-[#ffb000] hover:border-[#ffb000] hover:text-[#0a0a0a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <pre
            style={{ fontSize: "10px", lineHeight: 1 }}
            className="overflow-auto p-8 text-[#00ff41] font-mono max-w-[95vw] max-h-[95vh] animate-[fadeIn_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {ascii}
          </pre>
        </div>
      )}
    </>
  );
}
