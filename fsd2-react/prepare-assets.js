import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const repoRoot = path.join(__dirname)
const dst = path.join(__dirname, 'public')
if (!fs.existsSync(dst)) fs.mkdirSync(dst)

const images = [
  'loundery logo.png',
  'LOUNDERY 1.jpg',
  'LOUNDERY 2.jpg',
  'LOUNDERY 3.webp',
  'LOUNDERY 2.webp',
  'loundery4.jpeg',
  'hero.png'
]

images.forEach(name => {
  const src = path.join(repoRoot, name)
  const dest = path.join(dst, name)
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest)
    console.log('Copied', name)
  } else {
    console.warn('Missing:', src)
  }
})

// Also copy script.js and style.css if present
const extras = ['script.js', 'style.css']
extras.forEach(name => {
  const src = path.join(repoRoot, name)
  const dest = path.join(dst, name)
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest)
    console.log('Copied', name)
  } else {
    console.warn('Missing:', src)
  }
})

console.log('Asset prepare complete. Review public/ for files.')
