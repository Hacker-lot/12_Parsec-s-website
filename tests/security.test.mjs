import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'))

test('Vercel applies baseline security headers to every route', async () => {
  const config = await readJson(new URL('../vercel.json', import.meta.url))
  const globalHeaders = config.headers.find(({ source }) => source === '/(.*)')?.headers || []
  const headers = Object.fromEntries(globalHeaders.map(({ key, value }) => [key, value]))

  assert.match(headers['Content-Security-Policy'], /object-src 'none'/)
  assert.match(headers['Content-Security-Policy'], /frame-ancestors 'none'/)
  assert.equal(headers['X-Content-Type-Options'], 'nosniff')
  assert.equal(headers['X-Frame-Options'], 'DENY')
  assert.match(headers['Strict-Transport-Security'], /includeSubDomains/)
})

test('new-tab links cannot control the opener', async () => {
  const source = await readFile(
    new URL('../src/components/originkit/ui/scan-grid-button.tsx', import.meta.url),
    'utf8',
  )
  assert.match(source, /rel: newTab \? "noopener noreferrer"/)
})

test('credential-shaped files are ignored', async () => {
  const ignore = await readFile(new URL('../.gitignore', import.meta.url), 'utf8')
  for (const entry of ['.env.*', '.npmrc', '*.pem', '*.key']) assert.ok(ignore.includes(entry))
})
