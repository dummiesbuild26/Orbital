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

| Platform | How |
|---|---|
| **iPhone / iPad (IPA)** | Download `Orbital.ipa` from [Releases](../../releases/latest) and sideload it with [Sideloadly](https://sideloadly.io), [AltStore](https://altstore.io) or TrollStore |
| **Web** | The Cloudflare Worker URL (shown in the release notes and on the Actions run summary), or open `web/index.html` locally for single-player |
| **Add to Home Screen** | Open the web version in Safari → Share → *Add to Home Screen* for a full-screen app |

Controls: **tap** / **space** to switch orbit, **P** / **Esc** to pause.

## Free multiplayer server (one-time setup, about 5 minutes)

The server runs on **Cloudflare Workers + Durable Objects**. Both are included in Cloudflare's **free plan**, with no credit card required. The same Worker also hosts the web version of the game.

1. Create a free account at [dash.cloudflare.com](https://dash.cloudflare.com/sign-up). Open **Workers & Pages** once so Cloudflare gives you a `*.workers.dev` subdomain.
2. **My Profile → API Tokens → Create Token** → use the **"Edit Cloudflare Workers"** template → create it and copy the token.
3. Copy your **Account ID**. It's on the right side of the Workers & Pages overview page.
4. In this GitHub repo, go to **Settings → Secrets and variables → Actions → New repository secret** and add:
   - `CLOUDFLARE_API_TOKEN`: the token
   - `CLOUDFLARE_ACCOUNT_ID`: the account ID
5. Re-run the **Deploy server & build iOS IPA** workflow, or push any commit.

The workflow deploys the server, injects its URL into the app, and builds the IPA. The release notes then include the link to play online. Until the secrets exist, the server step is skipped and the game works single-player only.

Free-plan limits (100k requests/day; WebSocket messages count 20:1) cover thousands of matches a day. The protocol only sends orbit-switch events, not positions, and idle rooms hibernate at no cost.

### How multiplayer works

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
.github/workflows/   release.yml deploys the server, builds the IPA, publishes a Release
```

## How the IPA gets built

Each push to `main` (or a `v*` tag, or a manual run from the Actions tab) runs `release.yml`. The workflow:

1. deploys the server (if the Cloudflare secrets are set) and writes its URL into `web/config.js`
2. generates `Orbital.xcodeproj` with XcodeGen
3. builds an **unsigned** Release `.app` that bundles `web/`
4. zips it into `Orbital.ipa`
5. publishes a GitHub Release (`v1.1.<run>`, or your tag) with the IPA attached

The IPA is unsigned on purpose, because signing needs an Apple account. Sideloading tools re-sign it with your Apple ID when they install it. To publish to the App Store or TestFlight, you would add signing certificates as repository secrets and switch the build step to `xcodebuild archive` + `-exportArchive`.

Build locally on a Mac:

```sh
brew install xcodegen
cd ios && xcodegen generate && open Orbital.xcodeproj
```
