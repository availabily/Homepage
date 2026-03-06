import { createCanvas } from 'canvas';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, '..', 'public', 'og-image.png');

const WIDTH = 1200;
const HEIGHT = 630;
const PADDING = 60;
const THEOREM_COUNT = '2,433';

const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');

// Background
ctx.fillStyle = '#050505';
ctx.fillRect(0, 0, WIDTH, HEIGHT);

// Subtle dot-pattern texture
ctx.fillStyle = 'rgba(255,255,255,0.03)';
const DOT_SPACING = 30;
for (let x = DOT_SPACING; x < WIDTH; x += DOT_SPACING) {
  for (let y = DOT_SPACING; y < HEIGHT; y += DOT_SPACING) {
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Top-left: "COBOUND" wordmark
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 36px monospace';
ctx.textBaseline = 'top';
ctx.fillText('COBOUND', PADDING, PADDING);

// Center: Main math heading
const centerY = HEIGHT / 2;
ctx.fillStyle = '#34d399';
ctx.font = 'bold 80px monospace';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('H\u00B9(K;\u2124) = 0', WIDTH / 2, centerY - 30);

// Below heading: tagline
ctx.fillStyle = '#ffffff';
ctx.font = '28px sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('Agent coordination is mathematically decidable.', WIDTH / 2, centerY + 60);

// Bottom-left: theorem count
ctx.fillStyle = '#6b7280';
ctx.font = '20px monospace';
ctx.textAlign = 'left';
ctx.textBaseline = 'bottom';
ctx.fillText(`${THEOREM_COUNT} Lean\u00A04 theorems\u00A0\u00B7\u00A0Zero sorry statements`, PADDING, HEIGHT - PADDING);

// Bottom-right: domain
ctx.textAlign = 'right';
ctx.fillText('cobound.dev', WIDTH - PADDING, HEIGHT - PADDING);

// Write file
mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, canvas.toBuffer('image/png'));
console.log(`OG image written to ${OUTPUT_PATH} (${WIDTH}x${HEIGHT})`);
