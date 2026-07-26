#!/usr/bin/env node
// =============================================================================
// Generate a VAPID keypair for the Field Guide's web push (workers/src/lib/push.ts).
//
//   node scripts/gen-vapid-keys.mjs
//
// Prints two base64url strings. Set them as Worker secrets:
//
//   cd workers
//   wrangler secret put VAPID_PUBLIC_KEY
//   wrangler secret put VAPID_PRIVATE_KEY
//
// Run this ONCE. Rotating the keypair invalidates every existing push
// subscription in the wild — browsers bind a subscription to the applicationServerKey
// it was created with, and pushes signed by a new key are rejected. If you do
// rotate, plan on every installed device silently going quiet until the app
// re-subscribes them (which it does at boot, but only once each device next
// opens the app).
//
// No dependencies: Node's webcrypto produces the same P-256 keys the Worker
// consumes, and the export format below matches what lib/push.ts imports.
// =============================================================================

import { webcrypto } from 'node:crypto'

const b64url = (buf) =>
  Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

const pair = await webcrypto.subtle.generateKey(
  { name: 'ECDSA', namedCurve: 'P-256' },
  true,
  ['sign', 'verify'],
)

// Public key as the uncompressed point (0x04 || X || Y) that the Push API's
// applicationServerKey expects and that lib/push.ts re-splits into JWK x/y.
const raw = await webcrypto.subtle.exportKey('raw', pair.publicKey)
// Private key as the JWK `d` scalar, which is what the Worker re-imports with.
const jwk = await webcrypto.subtle.exportKey('jwk', pair.privateKey)

console.log('')
console.log('VAPID_PUBLIC_KEY')
console.log(b64url(raw))
console.log('')
console.log('VAPID_PRIVATE_KEY')
console.log(jwk.d)
console.log('')
console.log('Set both with `wrangler secret put <NAME>` from workers/.')
console.log('Generate once: rotating silences every device already subscribed.')
