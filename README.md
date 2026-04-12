# ASCII Converter

Web application that converts images to ASCII art directly in your browser. Free, fast, and private — no uploads to any server.

## Stack

- Next.js 16.2.2 + React 19 + TypeScript
- Tailwind CSS v4
- lucide-react for icons
- Canvas API for image processing
- Vercel Analytics for page view tracking

## Features

- Drag & drop or click to upload images
- Real-time ASCII conversion with 4 charsets
- Resolution control (20-200 chars width)
- Structure mode for edge-aware rendering (Detailed charset)
- Copy to clipboard / Download as .txt / Export as .png
- Fullscreen ASCII preview
- Dark hacker aesthetic (terminal style)

## Getting Started

```bash
npm run dev
```

Open http://localhost:3000

## Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout (metadata, SEO, analytics)
│   ├── page.tsx          # Main page
│   └── globals.css      # Global styles (Tailwind, design tokens, utilities)
├── components/
│   ├── ImageUploader.tsx         # Drag & drop image upload
│   ├── AsciiPreview.tsx        # ASCII display + fullscreen
│   ├── ConversionControls.tsx  # Resolution, charset & structure controls
│   ├── ActionButtons.tsx       # Copy, download, PNG export & fullscreen
│   └── CopyToast.tsx           # Copy feedback toast
├── hooks/
│   ├── useAsciiConverter.ts  # Conversion state & logic hook
│   └── useFullscreen.tsx     # Fullscreen overlay hook
└── utils/
    ├── imageToAscii.ts       # Image to ASCII conversion logic
    └── asciiToPng.ts         # ASCII to PNG canvas rendering
```

## Charsets

| Name      | Characters                                    |
|-----------|-----------------------------------------------|
| Classic   | ` .,:+=#S%?*@`                               |
| Blocks    | ` ░▒▓█`                                       |
| Detailed  | Full ASCII range                              |
| Minimal   | ` .:+=#`                                      |

## Commands

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run lint` - ESLint
- `npm run test` - Run tests (vitest)