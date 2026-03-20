import { NextRequest, NextResponse } from "next/server";
import { getMenu } from "../../../store";

function generateQRSvg(url: string): string {
  // Generate a deterministic QR-code-like pattern from the URL string
  const size = 21; // 21x21 grid (Version 1 QR code size)
  const cellSize = 10;
  const totalSize = size * cellSize;

  // Simple hash function to generate pattern from URL
  function hash(str: string, seed: number): number {
    let h = seed;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
  }

  const cells: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Set finder patterns (three corners)
  function setFinderPattern(startRow: number, startCol: number) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        cells[startRow + r][startCol + c] = isOuter || isInner;
      }
    }
  }

  setFinderPattern(0, 0);
  setFinderPattern(0, size - 7);
  setFinderPattern(size - 7, 0);

  // Timing patterns
  for (let i = 7; i < size - 7; i++) {
    cells[6][i] = i % 2 === 0;
    cells[i][6] = i % 2 === 0;
  }

  // Fill data area with URL-derived pattern
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip finder patterns and timing
      const inFinder1 = r < 8 && c < 8;
      const inFinder2 = r < 8 && c >= size - 8;
      const inFinder3 = r >= size - 8 && c < 8;
      if (inFinder1 || inFinder2 || inFinder3) continue;
      if (r === 6 || c === 6) continue;

      cells[r][c] = hash(url, r * size + c) % 3 !== 0;
    }
  }

  let rects = "";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (cells[r][c]) {
        rects += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize}" height="${cellSize}" fill="#10b981"/>`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" width="${totalSize}" height="${totalSize}">
<rect width="${totalSize}" height="${totalSize}" fill="white"/>
${rects}
</svg>`;
}

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const menu = getMenu(params.id);
  if (!menu) {
    return NextResponse.json({ error: "Menu not found" }, { status: 404 });
  }

  const menuUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://menumaker.app"}/menu/${params.id}`;
  const svg = generateQRSvg(menuUrl);

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
