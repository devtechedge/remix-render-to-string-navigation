import { createAssetServer } from 'remix/assets'

const rootDir = process.cwd()

export const assets = createAssetServer({
  basePath: '/assets',
  rootDir,
  allowFiles: ['app/routes.ts', 'app/**/public/**'],
  allowPackages: ['remix'],
  denyFiles: ['app/**/*.test.*'],
  sourceMaps: 'external',
  watch: true,
})

const entry = 'app/actions/public/entry.ts'

export const scriptEntry = await assets.getScriptEntry(entry)
