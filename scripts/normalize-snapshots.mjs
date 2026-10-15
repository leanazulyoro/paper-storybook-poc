// Paper's get_jsx output carries node ids (`id="1K-0"`): they aren't design and would make every
// snapshot look changed. Strips them from the Paper export snapshots in place; idempotent. Only
// node ids (`<letters/digits>-<digits>`): SVG defs ids (`_8Z-0__9lt4kb0`) are design and stay.
// Usage: node scripts/normalize-snapshots.mjs [dir]  (default: paper-snapshots)
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const files = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? files(path) : path.endsWith('.txt') ? [path] : []
  })

const [dir = 'paper-snapshots'] = process.argv.slice(2)
let changed = 0
for (const file of files(dir)) {
  const before = readFileSync(file, 'utf8')
  const after = before.replace(/ id="[0-9A-Z]+-\d+"/g, '')
  if (after !== before) {
    writeFileSync(file, after)
    changed++
    console.log(`stripped ids: ${file}`)
  }
}
console.log(`${changed} snapshot(s) normalized`)
