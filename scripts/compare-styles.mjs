// Round-trip check for a Paper file: compares the classes mapped from its exports (paper-to-code
// rules, written to a JSON file) with the current *.styles.ts, key by key, as class sets (order
// doesn't matter). Exits 1 on any difference. Usage:
//   node scripts/compare-styles.mjs <mapped.json>
// mapped.json: { "components/Button.styles.ts": { "base": "…", "variant.primary": "…" }, … }
// (paths relative to packages/ui/src; nested keys joined with dots).
import { readFileSync } from 'node:fs'

const [mappedFile] = process.argv.slice(2)
if (!mappedFile) {
  console.error('usage: compare-styles.mjs <mapped.json>')
  process.exit(1)
}
const mapped = JSON.parse(readFileSync(mappedFile, 'utf8'))
const root = new URL('../packages/ui/src/', import.meta.url)

const flatten = (styles, prefix = '') =>
  Object.entries(styles).flatMap(([key, value]) =>
    typeof value === 'string' ? [[prefix + key, value]] : flatten(value, `${prefix}${key}.`),
  )
const classes = (value) => new Set(value.split(/\s+/).filter(Boolean))

let diffs = 0
const report = (line) => {
  diffs++
  console.log(line)
}
for (const [file, keys] of Object.entries(mapped)) {
  const styles = Object.values(await import(new URL(file, root).href))[0]
  const code = new Map(flatten(styles))
  for (const [key, value] of code) {
    if (!(key in keys)) {
      report(`${file} ${key}: not mapped`)
      continue
    }
    const want = classes(value)
    const got = classes(keys[key])
    const extra = [...got].filter((c) => !want.has(c))
    const missing = [...want].filter((c) => !got.has(c))
    if (extra.length || missing.length)
      report(`${file} ${key}: +[${extra.join(' ')}] -[${missing.join(' ')}]`)
  }
  for (const key of Object.keys(keys)) if (!code.has(key)) report(`${file} ${key}: not in code`)
}
console.log(diffs ? `${diffs} difference(s)` : 'zero diff: every key maps to the same class set')
process.exit(diffs ? 1 : 0)
