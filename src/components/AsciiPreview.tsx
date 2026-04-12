"use client";

import { useFullscreen } from "@/hooks/useFullscreen";
import ActionButtons from "./ActionButtons";

interface Props {
  ascii: string;
  onDownload: () => void;
}

export default function AsciiPreview({ ascii, onDownload }: Props) {
  const { open, FullscreenOverlay } = useFullscreen();

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
          onFullscreen={open}
        />
      </div>

      <FullscreenOverlay>
        <pre
          className="overflow-auto p-8 text-foreground font-mono max-w-[95vw] content-fullscreen-height animate-[fadeIn_0.2s_ease-out] text-ascii"
        >
          {ascii}
        </pre>
      </FullscreenOverlay>
    </>
  );
}
