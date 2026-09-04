// Unit tests for the pure modules: the sync salvage (a wipe already happened
// there once), the editorial trip bridge, the JWT session parse, and the
// on-device solar calculation. Node environment on purpose: nothing under test
// needs a DOM, and the few browser globals a module touches (localStorage,
// atob, TextDecoder) are either in Node already or stubbed by the test.
//
// Kept apart from vite.config.ts so the build config, which is guarded for
// byte-determinism by scripts/check-build-determinism.mjs, carries nothing
// test-only.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
