export const CHAR_ASPECT_RATIO = 0.5;

const CHARSET = "@#S%?*+;:,. ";

export interface AsciiOptions {
  maxWidth?: number;
}

export async function imageToAscii(
  imageSrc: string,
  options: AsciiOptions = {}
): Promise<string> {
  const maxWidth = options.maxWidth ?? 120;

  const img = new Image();
  img.src = imageSrc;
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Failed to load image"));
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

  const lines: string[] = [];

  for (let y = 0; y < height; y++) {
    const lineChars: string[] = [];
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * 4;
      const r = pixels[offset];
      const g = pixels[offset + 1];
      const b = pixels[offset + 2];

      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      const charIndex = Math.floor(
        (luminance / 255) * (CHARSET.length - 1)
      );

      lineChars.push(CHARSET[charIndex]);
    }
    lines.push(lineChars.join(""));
  }

  return lines.join("\n");
}
