import { describe, it, expect, vi, beforeEach } from 'vitest';
import { imageToAscii, CHARSETS, CHAR_ASPECT_RATIO } from './imageToAscii';

const createMockContext = () => ({
  drawImage: vi.fn(),
  getImageData: vi.fn().mockReturnValue({ data: new Uint8ClampedArray(0) }),
});

const createMockCanvas = (initialWidth = 0, initialHeight = 0) => {
  const ctx = createMockContext();
  let width = initialWidth;
  let height = initialHeight;
  return {
    get width() { return width; },
    set width(v) { width = v; },
    get height() { return height; },
    set height(v) { height = v; },
    getContext: vi.fn().mockReturnValue(ctx),
    _ctx: ctx,
    _setSize: (w: number, h: number) => { width = w; height = h; },
  };
};

const createMockPixelData = (width: number, height: number, color: number[]) => {
  const pixels = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    pixels[i * 4] = color[0];     // R
    pixels[i * 4 + 1] = color[1]; // G
    pixels[i * 4 + 2] = color[2]; // B
    pixels[i * 4 + 3] = color[3]; // A
  }
  return pixels;
};

describe('imageToAscii', () => {
  let mockCanvas: ReturnType<typeof createMockCanvas>;
  let mockContext: ReturnType<typeof createMockContext>;
  let mockDimensions = { width: 100, height: 50 };

  beforeEach(() => {
    vi.clearAllMocks();
    mockDimensions = { width: 100, height: 50 };

    mockCanvas = createMockCanvas(10, 5);
    mockContext = mockCanvas._ctx;

    vi.stubGlobal('Image', class MockImage {
      get width() { return mockDimensions.width; }
      get height() { return mockDimensions.height; }
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      constructor() {
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 0);
      }
    });

    vi.stubGlobal('document', {
      createElement: vi.fn((tag: string) => {
        if (tag === 'canvas') {
          return mockCanvas;
        }
        return {};
      }),
    });
  });

  it('uniform black image uses first char (lumaRange === 0 fallback)', async () => {
    const maxWidth = 10;
    const expectedWidth = 10;
    const expectedHeight = Math.floor(expectedWidth * (50/100) * CHAR_ASPECT_RATIO);

    mockContext.getImageData.mockReturnValue({
      data: createMockPixelData(expectedWidth, expectedHeight, [0, 0, 0, 255]),
    });

    const result = await imageToAscii('valid-image-src', {
      charset: ' .:',
      maxWidth,
    });

    expect(result[0]).toBe(' ');
  });

  it('uniform white image uses first char (lumaRange === 0 fallback)', async () => {
    const maxWidth = 10;
    const expectedWidth = 10;
    const expectedHeight = Math.floor(expectedWidth * (50/100) * CHAR_ASPECT_RATIO);

    mockContext.getImageData.mockReturnValue({
      data: createMockPixelData(expectedWidth, expectedHeight, [255, 255, 255, 255]),
    });

    const result = await imageToAscii('valid-image-src', {
      charset: ' .:',
      maxWidth,
    });

    expect(result[0]).toBe(' ');
  });

  it('applies maxWidth constraint', async () => {
    const maxWidth = 20;
    const expectedHeight = Math.floor(maxWidth * (50/100) * CHAR_ASPECT_RATIO);

    mockContext.getImageData.mockReturnValue({
      data: createMockPixelData(maxWidth, expectedHeight, [128, 128, 128, 255]),
    });

    const result = await imageToAscii('valid-image-src', { maxWidth });

    const lines = result.split('\n');
    expect(lines[0].length).toBe(maxWidth);
    expect(lines.length).toBe(expectedHeight);
  });

  it('uses different charset produces different output', async () => {
    const maxWidth = 10;
    const expectedHeight = Math.floor(maxWidth * (50/100) * CHAR_ASPECT_RATIO);

    const mixedPixels = new Uint8ClampedArray(maxWidth * expectedHeight * 4);
    for (let i = 0; i < maxWidth * expectedHeight; i++) {
      mixedPixels[i * 4] = i % 2 === 0 ? 50 : 200;
      mixedPixels[i * 4 + 1] = i % 2 === 0 ? 50 : 200;
      mixedPixels[i * 4 + 2] = i % 2 === 0 ? 50 : 200;
      mixedPixels[i * 4 + 3] = 255;
    }

    mockContext.getImageData.mockReturnValue({
      data: mixedPixels,
    });

    const resultClassic = await imageToAscii('valid-image-src', {
      charset: CHARSETS.Classic,
      maxWidth
    });

    const resultBlocks = await imageToAscii('valid-image-src', {
      charset: CHARSETS.Blocks,
      maxWidth
    });

    expect(resultClassic).not.toBe(resultBlocks);
  });

  it('throws on invalid image', async () => {
    vi.stubGlobal('Image', class MockImageError {
      width = 100;
      height = 50;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      constructor() {
        setTimeout(() => {
          if (this.onerror) this.onerror();
        }, 0);
      }
    });

    await expect(imageToAscii('invalid-src')).rejects.toThrow('Failed to load image');
  });

  it('throws when canvas context is unavailable', async () => {
    mockCanvas.getContext.mockReturnValue(null);

    await expect(imageToAscii('valid-src')).rejects.toThrow('Failed to get canvas context');
  });

  it('verifies luma coefficients (Green is brighter than Red)', async () => {
    const charset = ' ._#'; 

    const redPixels = new Uint8ClampedArray(10 * 5 * 4);
    for (let i = 0; i < 10 * 5; i++) {
      redPixels[i * 4] = i % 2 === 0 ? 255 : 0;
      redPixels[i * 4 + 1] = 0;
      redPixels[i * 4 + 2] = 0;
      redPixels[i * 4 + 3] = 255;
    }

    mockCanvas._setSize(10, 5);
    mockContext.getImageData.mockReturnValueOnce({ data: redPixels });
    const redResult = await imageToAscii('src', { maxWidth: 10, charset });

    const greenPixels = new Uint8ClampedArray(10 * 5 * 4);
    for (let i = 0; i < 10 * 5; i++) {
      greenPixels[i * 4] = 0;
      greenPixels[i * 4 + 1] = i % 2 === 0 ? 255 : 0;
      greenPixels[i * 4 + 2] = 0;
      greenPixels[i * 4 + 3] = 255;
    }

    mockCanvas._setSize(10, 5);
    mockContext.getImageData.mockReturnValueOnce({ data: greenPixels });
    const greenResult = await imageToAscii('src', { maxWidth: 10, charset });

    const redChar = redResult[0];
    const greenChar = greenResult[0];

    expect(redChar).not.toBe(greenChar);
  });

  it('handles uniform color fallback (lumaRange === 0)', async () => {
    mockCanvas._setSize(10, 2);
    
    mockContext.getImageData.mockReturnValue({
      data: createMockPixelData(10, 2, [127, 127, 127, 255]),
    });

    const charset = '0123456789';
    const result = await imageToAscii('src', { maxWidth: 10, charset });

    const allChars = result.replace(/\n/g, '');
    const firstChar = allChars[0];
    expect(allChars.split('').every(c => c === firstChar)).toBe(true);
  });

  it('applies contrast normalization for mixed pixels', async () => {
    const maxWidth = 10;
    const expectedHeight = 2;
    
    mockCanvas._setSize(maxWidth, expectedHeight);
    
    const pixels = new Uint8ClampedArray(maxWidth * expectedHeight * 4);
    pixels[0] = 0; pixels[1] = 0; pixels[2] = 0; pixels[3] = 255;
    pixels[4] = 255; pixels[5] = 255; pixels[6] = 255; pixels[7] = 255;

    mockContext.getImageData.mockReturnValue({ data: pixels });

    const result = await imageToAscii('src', { charset: 'AB', maxWidth });

    expect(result).toContain('A');
    expect(result).toContain('B');
  });

  it('respects different aspect ratios', async () => {
    mockDimensions.width = 100;
    mockDimensions.height = 200;

    const maxWidth = 50;
    const expectedHeight = Math.floor(maxWidth * (200 / 100) * CHAR_ASPECT_RATIO);

    mockCanvas._setSize(maxWidth, expectedHeight);
    mockContext.getImageData.mockReturnValue({
      data: createMockPixelData(maxWidth, expectedHeight, [100, 100, 100, 255]),
    });

    const result = await imageToAscii('valid-image-src', { maxWidth });
    const lines = result.split('\n');

    expect(lines.length).toBe(expectedHeight);
  });
});