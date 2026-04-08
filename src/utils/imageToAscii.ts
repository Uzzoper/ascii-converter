export const CHAR_ASPECT_RATIO = 0.5;

export const CHARSETS: Record<string, string> = {
  Classic: " .,:+=#S%?*@",
  Blocks: " ░▒▓█",
  Detailed: " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
  Minimal: " .:+=#",
};

export interface AsciiOptions {
  maxWidth?: number;
  charset?: string;
}

export async function imageToAscii(
  imageSrc: string,
  options: AsciiOptions = {}
): Promise<string> {
  const maxWidth = options.maxWidth ?? 120;
  const charset = options.charset ?? CHARSETS.Classic;

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

  const lines: string[] = [];

  for (let y = 0; y < height; y++) {
    const lineChars: string[] = [];
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const luma = pixelLumas[idx];

      const normalized = lumaRange === 0 ? luma / 255 : (luma - minLuma) / lumaRange;

      const charIndex = Math.floor(
        normalized * (charset.length - 1)
      );

      lineChars.push(charset[charIndex]);
    }
    lines.push(lineChars.join(""));
  }

  return lines.join("\n");
}
