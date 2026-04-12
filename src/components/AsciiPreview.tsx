"use client";

import { useFullscreen } from "@/hooks/useFullscreen";
import ActionButtons from "./ActionButtons";

interface Props {
  ascii: string;
  onDownload: () => void;
  onExportPng: () => void;
  fontSize: number;
}

export default function AsciiPreview({ ascii, onDownload, onExportPng, fontSize }: Props) {
  const { open, FullscreenOverlay } = useFullscreen();

  return (
    <>
      <div className="flex flex-col w-full gap-4">
        <pre
          style={{ fontSize: `${fontSize}px`, lineHeight: 1 }}
          className="w-full max-w-full overflow-auto p-4 bg-surface border border-foreground rounded-lg text-foreground font-mono container-height content-max-height"
        >
          {ascii}
        </pre>
        <ActionButtons
          ascii={ascii}
          onDownload={onDownload}
          onExportPng={onExportPng}
          onFullscreen={open}
        />
      </div>

      <FullscreenOverlay>
        <pre
          style={{ fontSize: `${fontSize}px`, lineHeight: 1 }}
          className="overflow-auto p-8 text-foreground font-mono max-w-[95vw] content-fullscreen-height animate-[fadeIn_0.2s_ease-out]"
        >
          {ascii}
        </pre>
      </FullscreenOverlay>
    </>
  );
}
