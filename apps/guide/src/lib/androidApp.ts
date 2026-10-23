// =============================================================================
// The Android app: the PWA as the Play Store build runs it.
//
// The Play Store build (the FieldGuideAndroid project) is a Trusted Web
// Activity: Chrome showing this PWA full screen inside a small native shell.
// It is a paid download, and owning it on Google Play is the purchase. The
// shell asks Play to vouch for the copy (Play Integrity) at first launch and
// about monthly after, then opens /unlock?token=…&install=…, which the
// Worker's /api/play/unlock turns into a session (routes/Unlock.tsx). A
// signed-out reader in the app can start the same check with one tap
// (UNLOCK_INTENT_URL).
//
// Play's payments policy also means the app never offers the web checkout:
// inside the shell every buy action points at the app's own Play Store page.
// Outside the shell nothing here changes anything.
// =============================================================================

// Must match the Android project's applicationId and PLAY_PACKAGE_NAME in
// workers/wrangler.toml.
const ANDROID_PACKAGE = 'com.thetalusfieldjournal.guide'
// The shell's launch URLs carry this query parameter (LauncherActivity.java),
// as a second signal beside the referrer.
const LAUNCH_PARAM = 'source'
const LAUNCH_VALUE = 'android-app'
const SESSION_KEY = 'tfg.androidApp'

export const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`

// Hands control to the shell's UnlockActivity, which runs the Play check and
// reopens the guide at /unlock. Chrome only follows it from a tap.
export const UNLOCK_INTENT_URL = `intent://unlock#Intent;scheme=talusguide;package=${ANDROID_PACKAGE};end`

// Called once at boot, before render. Chrome sets the referrer to
// android-app://<package>/ when the shell launches the page; the flag goes in
// sessionStorage, which is per tab, because the shell shares Chrome's storage
// for this origin and a localStorage flag would leak into the reader's
// ordinary Chrome tabs, where the web checkout must keep working.
export function markAndroidLaunch(): void {
  try {
    const fromShell =
      document.referrer.startsWith(`android-app://${ANDROID_PACKAGE}`) ||
      new URLSearchParams(window.location.search).get(LAUNCH_PARAM) === LAUNCH_VALUE
    if (fromShell) sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    /* storage-blocked: treated as the web app */
  }
}

export function isAndroidApp(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

// An app install's account (the Worker's lib/play.ts): playapp:<install id>.
// It means nothing to a reader, so it is labelled instead of shown.
export function isPlayAppAccount(sub: string | undefined): boolean {
  return !!sub && sub.startsWith('playapp:')
}

export function accountLabel(sub: string | undefined): string {
  return isPlayAppAccount(sub) ? 'This phone, through Google Play' : (sub ?? '')
}
