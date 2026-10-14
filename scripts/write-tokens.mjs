// Writes packages/ui/src/styles/theme.css from Paper's token export, so the generated file is
// never retyped by hand. Usage: save `get_tokens({ format: "tailwind" })` output to a file, then
//   node scripts/write-tokens.mjs <tokens-file> <contentHash.tokens> [<paper.config.json key>]
// The key names the file the tokens came from (default: `source`).
import { readFileSync, writeFileSync } from 'node:fs'
import { loadPaperConfig } from './paper-config.mjs'

const [file, hash, key] = process.argv.slice(2)
if (!file || !/^[0-9a-f]{8}$/.test(hash ?? '')) {
  console.error('usage: write-tokens.mjs <tokens-file> <8-hex tokens hash> [config key]')
  process.exit(1)
}
const theme = readFileSync(file, 'utf8').match(/@theme\s*\{[\s\S]*?\}/)?.[0]
if (!theme) {
  console.error(`no @theme { … } block in ${file}`)
  process.exit(1)
}
const { source, files } = loadPaperConfig()
if (key && !files[key]) {
  console.error(`paper.config.json has no file "${key}"`)
  process.exit(1)
}
const { name, id } = files[key ?? source]
const header = `/*
 * GENERATED FROM PAPER: do not edit by hand.
 * Source: Paper file "${name}" (${id}), tokens hash ${hash}.
 * Regenerate via Paper MCP get_tokens({ format: "tailwind" }) + scripts/write-tokens.mjs.
 */
`
const body = theme.replace(/#[0-9A-Fa-f]{3,8}\b/g, (hex) => hex.toLowerCase())
writeFileSync('packages/ui/src/styles/theme.css', `${header}${body}\n`)
console.log(`theme.css written (tokens hash ${hash})`)
