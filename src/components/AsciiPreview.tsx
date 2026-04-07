"use client";

import { Download } from "lucide-react";

interface Props {
  ascii: string;
  onDownload: () => void;
}

export default function AsciiPreview({ ascii, onDownload }: Props) {
  return (
    <div className="flex flex-col w-full max-w-3xl gap-4">
      <pre
        style={{ fontSize: "10px", lineHeight: 1 }}
        className="overflow-auto p-4 bg-[#111] border border-[#00ff41] rounded-lg text-[#00ff41] font-mono"
      >
        {ascii}
      </pre>
      <div className="flex justify-end">
        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-4 py-2 border border-[#00ff41] rounded-lg text-[#00ff41] font-mono text-sm hover:bg-[#ffb000] hover:border-[#ffb000] hover:text-[#0a0a0a] transition-colors"
        >
          <Download className="w-4 h-4" />
          Download .txt
        </button>
      </div>
    </div>
  );
}
