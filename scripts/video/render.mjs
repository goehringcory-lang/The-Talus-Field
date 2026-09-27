// Renders a scene file in scripts/video/ to an MP4 and poster under img/.
//
//   node scripts/video/render.mjs firefall [poster-second]
//
// The scene exposes window.render(t); this drives headless Chromium over the
// DevTools protocol, screenshots every frame at 30 fps, and encodes with
// ffmpeg (both must be on PATH). Frames go to a temp dir and are removed.
// A re-render changes the bytes, so give the output a new filename: /img/* is
// served immutable for 30 days.
import { spawn, execFileSync } from "node:child_process";
import { writeFileSync, readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "../..");
const name = process.argv[2] || "firefall";
const posterAt = parseFloat(process.argv[3] || "3.5");
const FPS = 30, DUR = 30, PORT = 9333;

const work = mkdtempSync(join(tmpdir(), "tf-video-"));
const scene = join(work, "scene.html");
writeFileSync(scene, readFileSync(join(here, `${name}.html`), "utf8").replaceAll("REPO", pathToFileURL(repo).href));

const chrome = spawn(process.env.CHROME || "chromium", ["--headless=new", `--remote-debugging-port=${PORT}`,
  "--allow-file-access-from-files", "--hide-scrollbars", "--force-color-profile=srgb",
  `--user-data-dir=${join(work, "profile")}`, "about:blank"], { stdio: "ignore" });
let wsUrl;
for (let i = 0; i < 50 && !wsUrl; i++) {
  try { wsUrl = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((x) => x.type === "page")?.webSocketDebuggerUrl; } catch {}
  if (!wsUrl) await new Promise((r) => setTimeout(r, 200));
}
const sock = new WebSocket(wsUrl);
await new Promise((r) => sock.addEventListener("open", r));
let seq = 0; const pending = new Map();
sock.addEventListener("message", (e) => { const m = JSON.parse(e.data); pending.get(m.id)?.(m); pending.delete(m.id); });
const send = (method, params = {}) => new Promise((res) => { const id = ++seq; pending.set(id, res); sock.send(JSON.stringify({ id, method, params })); });

await send("Emulation.setDeviceMetricsOverride", { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
await send("Page.enable");
await send("Page.navigate", { url: pathToFileURL(scene).href });
await new Promise((r) => setTimeout(r, 1500));
await send("Runtime.evaluate", { expression: "Promise.all([document.fonts.ready, ...[...document.images].map((i) => i.decode())])", awaitPromise: true });

for (let f = 0; f < FPS * DUR; f++) {
  await send("Runtime.evaluate", { expression: `render(${f / FPS}); new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))`, awaitPromise: true });
  const shot = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(join(work, `f${String(f).padStart(4, "0")}.png`), Buffer.from(shot.result.data, "base64"));
}
sock.close(); chrome.kill();

const out = join(repo, "img", `${name}-in-30-seconds`);
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", String(FPS), "-i", join(work, "f%04d.png"),
  "-c:v", "libx264", "-preset", "slow", "-crf", "22", "-pix_fmt", "yuv420p", "-profile:v", "high", "-movflags", "+faststart", "-an", `${out}.mp4`]);
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", join(work, `f${String(Math.round(posterAt * FPS)).padStart(4, "0")}.png`),
  "-vf", "scale=1280:-1", "-q:v", "4", `${out}-poster.jpg`]);
rmSync(work, { recursive: true, force: true });
console.log(`wrote ${out}.mp4 and ${out}-poster.jpg`);
