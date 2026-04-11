"use client";

import ActionButtons from "./ActionButtons";

interface Props {
  ascii: string;
  onDownload: () => void;
}

export default function AsciiPreview({ ascii, onDownload }: Props) {
  return (
    <div className="flex flex-col w-full gap-4">
      <pre
        style={{ fontSize: "10px", lineHeight: 1 }}
        className="w-full max-w-full overflow-auto p-4 bg-[#111] border border-[#00ff41] rounded-lg text-[#00ff41] font-mono h-[50vh] lg:h-[75vh] min-h-[400px] max-h-[85vh]"
      >
        {ascii}
      </pre>
      <ActionButtons ascii={ascii} onDownload={onDownload} />
    </div>
  );
}
