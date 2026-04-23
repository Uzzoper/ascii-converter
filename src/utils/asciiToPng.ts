import { AsciiFrame, asciiFrameToText, asciiLineToRuns } from "./asciiFrame";

const FONT_SIZE = 14;
const LINE_HEIGHT = 1.0;
const PADDING = 10;

function getThemeColor(variableName: string, fallback: string): string {
  if (typeof document === "undefined" || typeof getComputedStyle !== "function") {
    return fallback;
  }

  const color = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();

  return color || fallback;
}

function getFontFamily(): string {
  if (typeof document === "undefined" || typeof getComputedStyle !== "function") {
    return "monospace";
  }

  return getComputedStyle(document.body).fontFamily || "monospace";
}

export async function asciiToPng(input: string | AsciiFrame): Promise<Blob> {
  const ascii = typeof input === "string" ? input : asciiFrameToText(input);
  const lines = ascii.split("\n");
  const fontFamily = getFontFamily();
  const backgroundColor = getThemeColor("--color-background", "#0a0a0a");
  const foregroundColor = getThemeColor("--color-foreground", "#00ff41");
  const measurementCanvas = document.createElement("canvas");
  const measurementContext = measurementCanvas.getContext("2d");

  if (!measurementContext) throw new Error("Failed to get canvas context");

  measurementContext.font = `${FONT_SIZE}px ${fontFamily}`;

  const textWidth = Math.max(...lines.map((line) => measurementContext.measureText(line).width));
  const textHeight = lines.length * FONT_SIZE * LINE_HEIGHT;

  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(textWidth) + PADDING * 2;
  canvas.height = Math.ceil(textHeight) + PADDING * 2;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `${FONT_SIZE}px ${fontFamily}`;
  ctx.textBaseline = "top";

  if (typeof input === "string") {
    ctx.fillStyle = foregroundColor;

    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], PADDING, PADDING + i * FONT_SIZE * LINE_HEIGHT);
    }
  } else {
    for (let i = 0; i < input.lines.length; i++) {
      const y = PADDING + i * FONT_SIZE * LINE_HEIGHT;
      let x = PADDING;

      for (const run of asciiLineToRuns(input.lines[i])) {
        ctx.fillStyle = run.color ?? foregroundColor;
        ctx.fillText(run.text, x, y);
        x += ctx.measureText(run.text).width;
      }
    }
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
