"use client";

import { Info } from "lucide-react";

interface Props {
  show: boolean;
}

export default function CopyToast({ show }: Props) {
  if (!show) return null;

  return (
    <div className="flex items-center gap-1 text-xs text-[#00ff41] bg-[#111] px-2 py-1 rounded border border-[#00ff41]/30 whitespace-nowrap">
      <Info className="w-3 h-3" />
      Best in terminal or code editor
    </div>
  );
}
