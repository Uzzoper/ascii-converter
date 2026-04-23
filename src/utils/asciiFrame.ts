export type AsciiColorMode = "mono" | "color";

export interface AsciiCell {
  char: string;
  color?: string;
}

export interface AsciiFrame {
  width: number;
  height: number;
  lines: AsciiCell[][];
}

export interface AsciiRun {
  text: string;
  color?: string;
}

const COLOR_MERGE_TOLERANCE = 36;

export function asciiFrameToText(frame: AsciiFrame): string {
  return frame.lines.map((line) => line.map((cell) => cell.char).join("")).join("\n");
}

interface MutableAsciiRun extends AsciiRun {
  redSum?: number;
  greenSum?: number;
  blueSum?: number;
  colorCount: number;
}

function rgbToHex(red: number, green: number, blue: number): string {
  return `#${[red, green, blue]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

function parseHexColor(color?: string): [number, number, number] | null {
  if (!color) {
    return null;
  }

  const hex = color.startsWith("#") ? color.slice(1) : color;

  if (hex.length !== 6) {
    return null;
  }

  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);

  if ([red, green, blue].some((value) => Number.isNaN(value))) {
    return null;
  }

  return [red, green, blue];
}

function colorsAreClose(run: MutableAsciiRun, nextColor?: string): boolean {
  if (!run.color || !nextColor) {
    return run.color === nextColor;
  }

  const nextRgb = parseHexColor(nextColor);

  if (!nextRgb || run.redSum === undefined || run.greenSum === undefined || run.blueSum === undefined) {
    return run.color === nextColor;
  }

  const avgRed = run.redSum / run.colorCount;
  const avgGreen = run.greenSum / run.colorCount;
  const avgBlue = run.blueSum / run.colorCount;
  const [nextRed, nextGreen, nextBlue] = nextRgb;

  const distanceSquared =
    (avgRed - nextRed) ** 2 +
    (avgGreen - nextGreen) ** 2 +
    (avgBlue - nextBlue) ** 2;

  return distanceSquared <= COLOR_MERGE_TOLERANCE ** 2;
}

function createRun(char: string, color?: string): MutableAsciiRun {
  const rgb = parseHexColor(color);

  if (!rgb) {
    return {
      text: char,
      color,
      colorCount: 0,
    };
  }

  return {
    text: char,
    color,
    redSum: rgb[0],
    greenSum: rgb[1],
    blueSum: rgb[2],
    colorCount: 1,
  };
}

function appendCell(run: MutableAsciiRun, char: string, color?: string): void {
  run.text += char;

  const rgb = parseHexColor(color);

  if (!rgb || run.redSum === undefined || run.greenSum === undefined || run.blueSum === undefined) {
    return;
  }

  run.redSum += rgb[0];
  run.greenSum += rgb[1];
  run.blueSum += rgb[2];
  run.colorCount += 1;

  run.color = rgbToHex(
    Math.round(run.redSum / run.colorCount),
    Math.round(run.greenSum / run.colorCount),
    Math.round(run.blueSum / run.colorCount)
  );
}

export function asciiLineToRuns(line: AsciiCell[]): AsciiRun[] {
  const runs: MutableAsciiRun[] = [];

  for (const cell of line) {
    const previousRun = runs[runs.length - 1];

    if (previousRun && colorsAreClose(previousRun, cell.color)) {
      appendCell(previousRun, cell.char, cell.color);
      continue;
    }

    runs.push(createRun(cell.char, cell.color));
  }

  return runs.map(({ text, color }) => ({ text, color }));
}

export function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function asciiFrameToHtml(frame: AsciiFrame): string {
  const lineMarkup = frame.lines
    .map((line) =>
      asciiLineToRuns(line)
        .map((run) => {
          const content = escapeHtml(run.text);

          if (!run.color) {
            return content;
          }

          return `<span style="color: ${run.color};">${content}</span>`;
        })
        .join("")
    )
    .join("\n");

  // Use hardcoded values for better compatibility when pasted into external apps
  const style = [
    "font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace",
    "white-space: pre",
    "color: #00ff41", // Default foreground
    "background: #0a0a0a", // Default background
    "padding: 1rem",
    "border-radius: 0.5rem",
    "line-height: 1",
  ].join("; ");

  return `<pre style="${style}">${lineMarkup}</pre>`;
}
