#!/usr/bin/env node
/**
 * Scans `public/` for `.webp` / `.avif` siblings of `.png`/`.jpg` sources and writes
 * `src/generated/imageFormatVariants.json` so OptimizedImage can serve modern formats
 * without 404s. Run via `npm run catalog:images` or `prebuild`.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const publicDir = path.join(root, 'public')
const outFile = path.join(root, 'src', 'generated', 'imageFormatVariants.json')

const relFiles = new Set()

function walk(absDir, relPrefix = '') {
  if (!fs.existsSync(absDir)) return
  for (const name of fs.readdirSync(absDir)) {
    if (name === '.DS_Store') continue
    const abs = path.join(absDir, name)
    const st = fs.statSync(abs)
    const rel = relPrefix ? `${relPrefix}/${name}` : name
    if (st.isDirectory()) walk(abs, rel)
    else relFiles.add(rel.split(path.sep).join('/'))
  }
}

walk(publicDir)

const variants = {}

for (const rel of relFiles) {
  const lower = rel.toLowerCase()
  if (!/\.(png|jpe?g)$/.test(lower)) continue
  const ext = path.extname(rel)
  const dir = path.posix.dirname(rel)
  const base = path.basename(rel, ext)
  const webpRel = dir === '.' ? `${base}.webp` : `${dir}/${base}.webp`
  const avifRel = dir === '.' ? `${base}.avif` : `${dir}/${base}.avif`
  const entry = {}
  if (relFiles.has(webpRel)) entry.webp = `/${webpRel}`
  if (relFiles.has(avifRel)) entry.avif = `/${avifRel}`
  if (Object.keys(entry).length > 0) {
    variants[`/${rel}`] = entry
  }
}

fs.mkdirSync(path.dirname(outFile), { recursive: true })
fs.writeFileSync(outFile, `${JSON.stringify(variants)}\n`, 'utf8')
console.log(
  '[catalog-image-variants]',
  Object.keys(variants).length,
  'mapped source(s) →',
  path.relative(root, outFile),
)
