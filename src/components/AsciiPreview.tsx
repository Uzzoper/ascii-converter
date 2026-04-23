"use client";

import { Fragment, ReactNode } from "react";
import { AsciiFrame, asciiLineToRuns } from "@/utils/asciiFrame";
import { useFullscreen } from "@/hooks/useFullscreen";
import ActionButtons from "./ActionButtons";

interface Props {
  asciiFrame: AsciiFrame;
  ascii: string;
  onDownload: () => void;
  onExportPng: () => void;
  fontSize: number;
}

function renderAsciiFrame(frame: AsciiFrame): ReactNode {
  return frame.lines.map((line, lineIndex) => (
    <Fragment key={lineIndex}>
      {asciiLineToRuns(line).map((run, runIndex) => (
        <span key={`${lineIndex}-${runIndex}`} style={run.color ? { color: run.color } : undefined}>
          {run.text}
        </span>
      ))}
      {lineIndex < frame.lines.length - 1 ? "\n" : null}
    </Fragment>
  ));
}

export default function AsciiPreview({ asciiFrame, ascii, onDownload, onExportPng, fontSize }: Props) {
  const { open, FullscreenOverlay } = useFullscreen();

  return (
    <>
      <div className="flex flex-col w-full gap-4">
        <pre
          style={{ fontSize: `${fontSize}px`, lineHeight: 1 }}
          className="w-full max-w-full overflow-auto p-4 bg-surface border border-foreground rounded-lg text-foreground font-mono container-height content-max-height"
        >
          {renderAsciiFrame(asciiFrame)}
        </pre>
        <ActionButtons
          asciiFrame={asciiFrame}
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
          {renderAsciiFrame(asciiFrame)}
        </pre>
      </FullscreenOverlay>
    </>
  );
}
