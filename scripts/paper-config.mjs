// Reads paper.config.json: which Paper files belong to this app and which one syncs read.
// `source` names the file `paper-to-code` reads and `code-to-paper` pushes to. A file whose `id` is
// null doesn't exist yet: `code-to-paper` creates it under its name, then records the id here.
// Usage: node scripts/paper-config.mjs  (prints the resolved config: names with {appName} filled in)
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const ID = /^[0-9A-Z]{26}$/

export const loadPaperConfig = (path = new URL('../paper.config.json', import.meta.url)) => {
  const { appName, source, files } = JSON.parse(readFileSync(path, 'utf8'))
  if (!appName) throw new Error('paper.config.json: appName is required')
  if (!files?.[source]) throw new Error(`paper.config.json: source "${source}" is not in files`)
  const resolved = Object.fromEntries(
    Object.entries(files).map(([key, { name, id }]) => {
      if (id !== null && !ID.test(id)) throw new Error(`paper.config.json: ${key}.id is not a Paper file id`)
      return [key, { name: name.replaceAll('{appName}', appName), id }]
    }),
  )
  if (!resolved[source].id) throw new Error(`paper.config.json: source "${source}" has no id yet`)
  return { appName, source, files: resolved }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(loadPaperConfig(), null, 2))
}
