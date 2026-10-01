# 🪐 ORBITAL

**One tap. Two orbits. Zero mercy.**

A neon one-tap arcade game. Your comet circles a pulsing core: tap anywhere to jump between the inner and outer orbit. Dodge the spinning saws, grab gems to build your combo multiplier, and survive as the speed climbs.

- Glowing neon visuals, warp-speed starfield, particle explosions, screen shake and slow-mo deaths
- A new color theme every level (Neon → Toxic → Solar → Ultraviolet → …)
- A generative synth soundtrack that picks up as you level up (all audio is synthesized, with no asset files)
- Combo multipliers up to x6, near-miss bonuses ("CLUTCH! +2"), roast messages on death
- **Challenge a Friend** creates a 1080×1080 score card and opens the share sheet
- Haptics on iOS, saved best score, pause on background

## Play

| Platform | How |
|---|---|
| **iPhone / iPad (IPA)** | Download `Orbital.ipa` from [Releases](../../releases/latest) and sideload it with [Sideloadly](https://sideloadly.io), [AltStore](https://altstore.io) or TrollStore |
| **Web** | The GitHub Pages deploy (Settings → Pages → Source: *GitHub Actions*), or open `web/index.html` locally |
| **Add to Home Screen** | Open the web version in Safari → Share → *Add to Home Screen* for a full-screen app |

Controls: **tap** / **space** to switch orbit, **P** / **Esc** to pause.

## Project layout

```
web/                 the whole game: one self-contained index.html (no dependencies)
ios/project.yml      XcodeGen spec for the native iOS wrapper
ios/Orbital/         Swift WKWebView shell (haptics + native share sheet bridge)
tools/render-icon.mjs  regenerates the app icon (node + playwright)
.github/workflows/   ios.yml builds the IPA and publishes a Release; pages.yml deploys the web game
```

## How the IPA gets built

Each push to `main` (or a `v*` tag, or a manual run from the Actions tab) runs `ios.yml` on a macOS runner. The workflow:

1. generates `Orbital.xcodeproj` with XcodeGen
2. builds an **unsigned** Release `.app` that bundles `web/`
3. zips it into `Orbital.ipa`
4. publishes a GitHub Release (`v1.0.<run>`, or your tag) with the IPA attached

The IPA is unsigned on purpose, because signing needs an Apple account. Sideloading tools re-sign it with your Apple ID when they install it. To publish to the App Store or TestFlight, you would add signing certificates as repository secrets and switch the build step to `xcodebuild archive` + `-exportArchive`.

Build locally on a Mac:

```sh
brew install xcodegen
cd ios && xcodegen generate && open Orbital.xcodeproj
```
