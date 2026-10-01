# 🪐 ORBITAL

**One tap. Two orbits. Zero mercy.**

A neon one-tap arcade game. Your comet circles a pulsing core: tap anywhere to jump between the inner and outer orbit. Dodge the spinning saws, grab gems to build your combo multiplier, and survive as the speed climbs.

- Glowing neon visuals, warp-speed starfield, particle explosions, screen shake and slow-mo deaths
- A new color theme every level (Neon → Toxic → Solar → Ultraviolet → …)
- A generative synth soundtrack that picks up as you level up (all audio is synthesized, with no asset files)
- Combo multipliers up to x6, near-miss bonuses ("CLUTCH! +2"), roast messages on death
- **Challenge a Friend** creates a 1080×1080 score card and opens the share sheet
- Haptics on iOS, saved best score, pause on background
- **Online multiplayer:** in Quick Match, up to 8 players race the *identical* course live and the last comet alive wins. You see every rival as a glowing ghost on the orbit
- **Private rooms:** a 4-letter code and an invite link. The link opens the web version, so friends can join without the app
- **Global leaderboard:** shows your world rank after every run

## Play

### 🌐 Play now in your browser: **https://orbital-server.dummiesbuild26.workers.dev/**

Works on phones and desktops. Multiplayer, private rooms and the leaderboard all work there, and invite links open it too.

| Platform | How |
|---|---|
| **iPhone / iPad (IPA)** | Download `Orbital.ipa` from [Releases](../../releases/latest) and sideload it with [Sideloadly](https://sideloadly.io), [AltStore](https://altstore.io) or TrollStore |
| **Web** | **https://orbital-server.dummiesbuild26.workers.dev/** |
| **Add to Home Screen** | Open the web version in Safari → Share → *Add to Home Screen* for a full-screen app |

Controls: with 2 orbits, **tap** anywhere (or **space**) to switch orbit. From level 3 there are 3–4 orbits: tap the **left** half of the screen to move **in** toward the core and the **right** half to move **out**; IN / OUT pads at the bottom show which side is which. On a keyboard, use ← / → (or ↓ / ↑). **P** / **Esc** pauses.

## App Store

Everything is prepared for App Review. **[APP_STORE.md](APP_STORE.md)** has the step-by-step submission guide, ready-to-paste listing text, privacy and age-rating answers, and the review notes. Screenshots at Apple's sizes are in `appstore/screenshots/`. The **Upload to App Store Connect** workflow signs and uploads builds once your Apple Developer secrets are set.

## Multiplayer server

The server (rooms, matchmaking and the leaderboard) and the web version run on Cloudflare's free plan at the URL above. Every push to `main` redeploys it automatically.

### How it works

- Every match has a **shared random seed**. The course is generated purely from that seed, so every player gets the exact same course with no position streaming.
- Clients send only `switch orbit at angle θ`, `score` and `crashed` events. Rivals are replayed at the exact course angle where each event happened, so ghosts stay accurate despite lag.
- The `Room` Durable Object runs one lobby/match (WebSocket hibernation API). The `Hub` Durable Object handles matchmaking and stores the leaderboard in SQLite.
- Scores are reported by the clients, so a determined cheater could fake one. That's fine for a casual game.

Run the server locally: `cd server && npm install && npx wrangler dev`, then open http://localhost:8787.

## Project layout

```
web/                 the whole game: one self-contained index.html (no dependencies)
ios/project.yml      XcodeGen spec for the native iOS wrapper
ios/Orbital/         Swift WKWebView shell (haptics + native share sheet bridge)
server/              Cloudflare Worker: multiplayer rooms, matchmaking, leaderboard
tools/render-icon.mjs  regenerates the app icon (node + playwright)
tools/screenshots.mjs  regenerates App Store screenshots
appstore/screenshots/  App Store screenshots (iPhone 6.9", iPad 13")
.github/workflows/   release.yml: deploys the server, builds the IPA, publishes a Release
                     appstore.yml: signs and uploads to App Store Connect (manual)
```

## How the IPA gets built

Each push to `main` (or a `v*` tag, or a manual run from the Actions tab) runs `release.yml`. The workflow:

1. deploys the server and web version and writes the server URL into `web/config.js`
2. generates `Orbital.xcodeproj` with XcodeGen
3. builds an **unsigned** Release `.app` that bundles `web/`
4. zips it into `Orbital.ipa`
5. publishes a GitHub Release (`v1.1.<run>`, or your tag) with the IPA attached

This IPA is unsigned on purpose: sideloading tools re-sign it with your Apple ID when they install it. App Store and TestFlight builds go through the separate **Upload to App Store Connect** workflow (see [APP_STORE.md](APP_STORE.md)).

Build locally on a Mac:

```sh
brew install xcodegen
cd ios && xcodegen generate && open Orbital.xcodeproj
```
