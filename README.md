# ASCII Converter

Web application that converts images to ASCII art.

## Stack

- Next.js 16.2.2 + React 19 + TypeScript
- Tailwind CSS v4
- lucide-react for icons
- Canvas API for image processing

## Features

- Drag & drop or click to upload images
- Real-time ASCII conversion with 4 charsets
- Resolution control (20-200 chars width)
- Copy to clipboard / Download as .txt
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
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Main page (conversion logic)
│   └── globals.css  # Global styles (Tailwind)
├── components/
│   ├── ImageUploader.tsx      # Drag & drop image upload
│   ├── AsciiPreview.tsx      # ASCII display
│   ├── ConversionControls.tsx # Resolution & charset controls
│   ├── ActionButtons.tsx     # Copy & download buttons
│   └── CopyToast.tsx         # Copy feedback toast
└── utils/
    └── imageToAscii.ts       # Image to ASCII conversion logic
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