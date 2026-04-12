const FONT_SIZE = 14;
const LINE_HEIGHT = 1.0;
const FONT_FAMILY = "'Courier New', 'Consolas', 'Monaco', monospace";
const BG_COLOR = "#0a0a0a";
const FG_COLOR = "#00ff41";
const PADDING = 10;

export async function asciiToPng(ascii: string): Promise<Blob> {
  const lines = ascii.split("\n");
  const maxCols = Math.max(...lines.map((l) => l.length));
  const textWidth = maxCols * FONT_SIZE * 0.6;
  const textHeight = lines.length * FONT_SIZE * LINE_HEIGHT;

  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(textWidth) + PADDING * 2;
  canvas.height = Math.ceil(textHeight) + PADDING * 2;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = FG_COLOR;
  ctx.font = `${FONT_SIZE}px ${FONT_FAMILY}`;
  ctx.textBaseline = "top";

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], PADDING, PADDING + i * FONT_SIZE * LINE_HEIGHT);
  }

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to create PNG"));
      },
      "image/png"
    )
  );
}
