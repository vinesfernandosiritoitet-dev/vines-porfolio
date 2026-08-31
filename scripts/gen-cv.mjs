import { writeFileSync } from 'node:fs'

const lines = [
  ['VINES FERNANDO', 16, 780],
  ['Frontend Developer & UI/UX Designer', 12, 762],
  ['', 10, 748],
  ['Email    : vinesfernandosiritoitet@gmail.com', 10, 734],
  ['WhatsApp : 085187169158', 10, 720],
  ['Instagram: @saip.ul3446', 10, 706],
  ['', 10, 690],
  ['--- Skills ---', 12, 676],
  ['HTML, CSS, JavaScript, React, Laravel, Bootstrap, Figma', 10, 660],
  ['', 10, 644],
  ['--- Experience ---', 12, 630],
  ['Membangun website portfolio, aplikasi CRUD, dan desain UI/UX.', 10, 614],
  ['', 10, 598],
  ['--- Education ---', 12, 584],
  ['Belajar pemrograman web sejak 2023.', 10, 568],
]

const content = lines
  .map(([text, size, y]) => {
    const escaped = text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
    return `BT /F1 ${size} Tf 72 ${y} Td (${escaped}) Tj ET`
  })
  .join('\n')

const objects = [
  ['1 0 obj', '<< /Type /Catalog /Pages 2 0 R >>', 'endobj'],
  [
    '2 0 obj',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    'endobj',
  ],
  [
    '3 0 obj',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >>',
    'endobj',
  ],
  ['4 0 obj', `<< /Length ${Buffer.byteLength(content, 'utf8')} >>`, 'stream', content, 'endstream', 'endobj'],
  ['5 0 obj', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', 'endobj'],
]

const rows = ['%PDF-1.4']
const offsets = []
for (const obj of objects) {
  offsets.push(rows.reduce((n, r) => n + Buffer.byteLength(r + '\n', 'utf8'), 0))
  rows.push(...obj)
}

offsets.push(rows.reduce((n, r) => n + Buffer.byteLength(r + '\n', 'utf8'), 0))

rows.push('xref')
rows.push(`0 ${objects.length + 1}`)
rows.push('0000000000 65535 f ')
for (let i = 1; i <= objects.length; i += 1) {
  rows.push(`${String(offsets[i]).padStart(10, '0')} 00000 n `)
}
rows.push(`trailer << /Size ${objects.length + 1} /Root 1 0 R >>`)
rows.push('startxref')
rows.push(offsets[objects.length])
rows.push('%%EOF')

const raw = rows.join('\n')
writeFileSync(new URL('../public/cv.pdf', import.meta.url), raw)
console.log(`CV PDF generated: ${Buffer.byteLength(raw)} bytes`)
