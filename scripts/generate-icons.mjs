import { mkdir, access } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const candidates = [
  resolve(root, 'scripts/icon.svg'),
  resolve(root, 'assets/icon.png'),
  resolve(root, 'assets/icon.jpg'),
  resolve(root, 'books/1/cover.jpg'),
]
const outDir = resolve(root, 'public/icons')

let source
for (const c of candidates) {
  try {
    await access(c)
    source = c
    break
  } catch {}
}

if (!source) {
  console.error('[icons] No source found. Tried:')
  for (const c of candidates) console.error(`  - ${c}`)
  process.exit(1)
}

console.log(`[icons] using ${source}`)

await mkdir(outDir, { recursive: true })

const bg = { r: 192, g: 57, b: 43, alpha: 1 }

const targets = [
  { name: 'icon-192.png', size: 192, pad: 0 },
  { name: 'icon-512.png', size: 512, pad: 0 },
  { name: 'icon-maskable-512.png', size: 512, pad: 0.2 },
]

for (const { name, size, pad } of targets) {
  const inner = Math.round(size * (1 - pad * 2))
  const resized = await sharp(source)
    .resize(inner, inner, { fit: 'contain', background: bg })
    .toBuffer()

  await sharp({
    create: { width: size, height: size, channels: 4, background: bg },
  })
    .composite([{ input: resized, gravity: 'center' }])
    .png()
    .toFile(resolve(outDir, name))

  console.log(`[icons] wrote ${name} (${size}×${size})`)
}
