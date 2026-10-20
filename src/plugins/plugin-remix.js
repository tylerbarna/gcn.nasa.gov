// This should eventually be a npm package, but for now it lives here.
// It's job is to notify the remix dev server of the version of the running
// app to trigger HMR / HDR.
import { logDevReady } from '@remix-run/node'
import * as fs from 'node:fs'
import * as path from 'node:path'

const buildPath = 'build/server/index.cjs'
const absoluteBuildPath = path.resolve(process.cwd(), buildPath)

let lastTimeout

export default {
  sandbox: {
    async watcher({ filename }) {
      // Only react to changes in the server build output. The Remix compiler
      // writes many files during a build (static assets, CSS, etc.) and
      // watching all of them causes a cascade of logDevReady calls that result
      // in a series of rapid-fire reloads and failed network requests in the
      // browser. By keying on the server build file specifically we fire exactly
      // once per successful build.
      if (filename !== absoluteBuildPath) return

      if (lastTimeout) {
        clearTimeout(lastTimeout)
      }

      lastTimeout = setTimeout(async () => {
        let contents
        try {
          contents = fs.readFileSync(absoluteBuildPath, 'utf8')
        } catch {
          // Build file may not exist yet or may still be writing; skip this cycle.
          return
        }

        // The server bundle embeds the manifest hash multiple times (imports,
        // references, etc.). We only want to call logDevReady once per build
        // with a single hash, so take just the first match.
        const match = /manifest-([A-F0-9]+)\.js/.exec(contents)
        if (match) {
          logDevReady({ assets: { version: match[1] } })
        }
      }, 300)
    },
  },
  set: {
    env() {
      // Pass matching env variables through to the application in dev mode.
      const passthruKeys = /^NODE_ENV$|^REMIX_DEV_/
      return {
        testing: Object.fromEntries(
          Object.entries(process.env).filter(([key]) => passthruKeys.test(key))
        ),
      }
    },
  },
}
