const sharp = require('sharp');
const path = require('path');
(async () => {
  try {
    const backgroundPath = path.join(process.cwd(), 'public', 'certificate_final.png');
    const overlaySvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="2398" height="1792" xmlns="http://www.w3.org/2000/svg">
  <style>
    .teacher { font: 86px Inter, system-ui, sans-serif; font-weight: 700; fill: #111827; }
    .course { font: 52px Inter, system-ui, sans-serif; fill: #1e293b; }
    .meta { font: 36px Inter, system-ui, sans-serif; fill: #0f172a; }
  </style>
  <text x="1199" y="740" text-anchor="middle" class="teacher">Test Teacher</text>
  <text x="1199" y="850" text-anchor="middle" class="course">Program / Curriculum: Test Course</text>
  <text x="150" y="1474" class="meta">Date: Test Date</text>
  <text x="2248" y="1474" text-anchor="end" class="meta">Certificate ID: TEST-123</text>
</svg>`;
    const buffer = await sharp(backgroundPath).composite([{ input: Buffer.from(overlaySvg), top: 0, left: 0 }]).png().toBuffer();
    console.log('success', buffer.length);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();