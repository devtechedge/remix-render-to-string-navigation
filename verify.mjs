// Starts the app, clicks each internal link in a real browser, and reports what
// the document looks like after the click. Requires `npm install` first.
//
//   node verify.mjs
//
import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const PORT = 44100
const ORIGIN = `http://localhost:${PORT}`

let server = spawn(process.execPath, ['--import', 'remix/node-tsx', 'server.ts'], {
  stdio: ['ignore', 'pipe', 'inherit'],
  env: { ...process.env, PORT: String(PORT) },
})

async function waitForServer() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      let response = await fetch(ORIGIN)
      if (response.ok) return
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
  throw new Error('server did not start')
}

async function check(page, linkId) {
  await page.goto(ORIGIN, { waitUntil: 'load' })
  await page.waitForFunction(() => document.querySelector('#counter') !== null)

  let before = { url: page.url(), title: await page.title(), heading: await heading(page) }

  let errors = []
  let onError = (error) => errors.push(String(error))
  page.on('pageerror', onError)
  await page.click(`#${linkId}`)
  await new Promise((resolve) => setTimeout(resolve, 1500))
  page.off('pageerror', onError)

  let after = { url: page.url(), title: await page.title(), heading: await heading(page) }

  return { linkId, before, after, errors, navigated: before.heading !== after.heading }
}

async function heading(page) {
  return page.evaluate(() => document.querySelector('#heading')?.textContent ?? null)
}

try {
  await waitForServer()
  let browser = await chromium.launch()
  let page = await browser.newPage()
  let results = [await check(page, 'link-stream'), await check(page, 'link-string')]
  await browser.close()

  for (let result of results) {
    console.log(`\n--- clicked #${result.linkId} ---`)
    console.log(JSON.stringify(result, null, 2))
  }

  let broken = results.filter((result) => !result.navigated)
  console.log(
    `\n${broken.length === 0 ? 'PASS: every link navigated' : `FAIL: ${broken.map((result) => result.linkId).join(', ')} did not navigate`}`,
  )
  process.exitCode = broken.length === 0 ? 0 : 1
} finally {
  server.kill()
}
