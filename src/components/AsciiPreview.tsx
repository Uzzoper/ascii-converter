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
          className="w-full max-w-full overflow-auto p-4 bg-surface border border-foreground rounded-lg text-foreground font-mono container-height content-max-height text-ascii"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
          onClick={closeFullscreen}
        >
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 z-50 p-2 border border-foreground/50 rounded-lg text-foreground hover:bg-accent hover:border-accent hover:text-background transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <pre
            className="overflow-auto p-8 text-foreground font-mono max-w-[95vw] content-fullscreen-height animate-[fadeIn_0.2s_ease-out] text-ascii"
            onClick={(e) => e.stopPropagation()}
          >
            {ascii}
          </pre>
        </div>
      )}
    </>
  );
}
