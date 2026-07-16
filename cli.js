import fs from 'fs';
import sharp from 'sharp';

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, '');
    args[key] = argv[i + 1];
  }
  return args;
}

function generateSVG(initials, bgColor, circleColor, textColor, size = 200, inset = 0.1) {
  const radius = (size / 2) * (1 - inset);
  const fontSize = size * 0.33;
  const textY = size / 2 + (fontSize * 0.35);

  return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${bgColor}"/>
  <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="${circleColor}"/>
  <text x="${size / 2}" y="${textY}" font-family="Arial" font-weight="bold" font-size="${fontSize}" fill="${textColor}" text-anchor="middle">${initials}</text>
</svg>`;
}

async function main() {
  const args = parseArgs(process.argv);
  const initials = args.initials || 'AB';
  const bgColor = args.bg || '#C8102E';
  const circleColor = args.circle || 'white';
  const textColor = args.text || '#C8102E';
  const size = parseInt(args.size) || 400;
  const outputDir = args.output || '.';
  const fileName = args.name || `avatar-${initials}`;

  const svg = generateSVG(initials, bgColor, circleColor, textColor, size);

  // Write SVG
  const svgPath = `${outputDir}/${fileName}.svg`;
  fs.writeFileSync(svgPath, svg);
  console.log(`✓ SVG: ${svgPath}`);

  // Write PNG via sharp
  const pngPath = `${outputDir}/${fileName}.png`;
  await sharp(Buffer.from(svg))
    .png()
    .toFile(pngPath);
  console.log(`✓ PNG: ${pngPath}`);
}

main().catch(console.error);
