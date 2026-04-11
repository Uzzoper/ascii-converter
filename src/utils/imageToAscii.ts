export const CHAR_ASPECT_RATIO = 0.5;

export const CHARSETS: Record<string, string> = {
  Classic: " .,:+=#S%?*@",
  Blocks: " ░▒▓█",
  Detailed: " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
  Minimal: " .:+=#",
};

const STRUCT_FLAT = " .'`^\",:;";
const STRUCT_HORIZ = "-=";
const STRUCT_VERT = "|!ilI";
const STRUCT_DIAG_F = "/";
const STRUCT_DIAG_B = "\\";
const STRUCT_CROSS = "+*";
const STRUCT_DENSE = "#MW&8%B@$";

export interface AsciiOptions {
  maxWidth?: number;
  charset?: string;
  structure?: boolean;
}

function computeSobel(
  luma: Float32Array,
  width: number,
  height: number,
  x: number,
  y: number
): { gx: number; gy: number; magnitude: number } {
  if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
    return { gx: 0, gy: 0, magnitude: 0 };
  }

  const p = (dx: number, dy: number) => luma[(y + dy) * width + (x + dx)];

  // Sobel 3x3: Gx detects vertical edges, Gy detects horizontal edges
  const gx =
    -p(-1, -1) + p(1, -1) +
    -2 * p(-1, 0) + 2 * p(1, 0) +
    -p(-1, 1) + p(1, 1);

  const gy =
    -p(-1, -1) - 2 * p(0, -1) - p(1, -1) +
    p(-1, 1) + 2 * p(0, 1) + p(1, 1);

  return { gx, gy, magnitude: Math.sqrt(gx * gx + gy * gy) };
}

function structureChar(
  luma: number,
  normalizedLuma: number,
  gx: number,
  gy: number,
  magnitude: number,
  flatCharset: string
): string {
  const MAG_THRESHOLD = 60;
  const DENSE_THRESHOLD = 180;

  if (magnitude < MAG_THRESHOLD) {
    const idx = Math.floor(normalizedLuma * (flatCharset.length - 1));
    return flatCharset[idx];
  }
  if (magnitude > DENSE_THRESHOLD) {
    const idx = Math.floor(normalizedLuma * (STRUCT_DENSE.length - 1));
    return STRUCT_DENSE[idx];
  }
  const absGx = Math.abs(gx);
  const absGy = Math.abs(gy);
  // ratio > 2 → Gx dominates (vertical edge), < 0.5 → Gy dominates (horizontal edge)
  const ratio = absGx / (absGy + 1);

  let charset: string;

  if (ratio > 2) {
    charset = STRUCT_VERT;
  } else if (ratio < 0.5) {
    charset = STRUCT_HORIZ;
  } else {
    const sameSign = (gx > 0 && gy > 0) || (gx < 0 && gy < 0);
    if (sameSign) {
      charset = STRUCT_DIAG_F;
    } else {
      charset = STRUCT_DIAG_B;
    }

    if (absGx > MAG_THRESHOLD && absGy > MAG_THRESHOLD) {
      charset = STRUCT_CROSS;
    }
  }

  return charset[Math.floor(normalizedLuma * (charset.length - 1))];
}

export async function imageToAscii(
  imageSrc: string,
  options: AsciiOptions = {}
): Promise<string> {
  const maxWidth = options.maxWidth ?? 120;
  const charset = options.charset ?? CHARSETS.Classic;
  const structure = options.structure ?? false;

  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageSrc;
  });

  const aspectRatio = img.height / img.width;
  const width = Math.min(img.width, maxWidth);
  const height = Math.floor(width * aspectRatio * CHAR_ASPECT_RATIO);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  ctx.drawImage(img, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  let minLuma = 255;
  let maxLuma = 0;
  const pixelLumas = new Float32Array(width * height);

  for (let i = 0; i < width * height; i++) {
    const offset = i * 4;
    const r = pixels[offset];
    const g = pixels[offset + 1];
    const b = pixels[offset + 2];

    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    pixelLumas[i] = luma;

    if (luma < minLuma) minLuma = luma;
    if (luma > maxLuma) maxLuma = luma;
  }

  const lumaRange = maxLuma - minLuma;

  const useStructure = structure && charset === CHARSETS.Detailed;

  let sobelGx: Float32Array | null = null;
  let sobelGy: Float32Array | null = null;
  let sobelMag: Float32Array | null = null;

  if (useStructure) {
    sobelGx = new Float32Array(width * height);
    sobelGy = new Float32Array(width * height);
    sobelMag = new Float32Array(width * height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const { gx, gy, magnitude } = computeSobel(pixelLumas, width, height, x, y);
        sobelGx[idx] = gx;
        sobelGy[idx] = gy;
        sobelMag[idx] = magnitude;
      }
    }
  }

  const lines: string[] = [];

  for (let y = 0; y < height; y++) {
    const lineChars: string[] = [];
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const luma = pixelLumas[idx];
      const normalized = lumaRange === 0 ? 0 : (luma - minLuma) / lumaRange;

      let char: string;

      if (useStructure && sobelGx && sobelGy && sobelMag) {
        char = structureChar(
          luma,
          normalized,
          sobelGx[idx],
          sobelGy[idx],
          sobelMag[idx],
          STRUCT_FLAT
        );
      } else {
        const charIndex = Math.floor(normalized * (charset.length - 1));
        char = charset[charIndex];
      }

      lineChars.push(char);
    }
    lines.push(lineChars.join(""));
  }

  return lines.join("\n");
}
