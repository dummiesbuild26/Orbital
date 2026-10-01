# Publishing ORBITAL on the App Store

The game and CI are prepared for App Review (see [what was checked](#what-was-checked-against-apples-guidelines)). What's left needs your Apple account and a few decisions only you can make.

> **Cost:** the Apple Developer Program costs **$99/year**. There's no free way to publish on the App Store.

## 1. One-time setup

1. **Enroll** in the [Apple Developer Program](https://developer.apple.com/programs/enroll/). Approval can take a day or two.
2. **Put your contact email in the privacy and support pages.** Replace `REPLACE_WITH_CONTACT_EMAIL` in `web/privacy.html` and `web/support.html`, then push. Apple rejects apps whose privacy policy or support page has no working contact. The upload workflow refuses to run until this is done.
3. **Register a bundle ID**, which must be unique to you, for example `com.yourname.orbital`. Go to [Certificates, IDs & Profiles → Identifiers](https://developer.apple.com/account/resources/identifiers/list) → **+** → App IDs → App, and enter the bundle ID. No extra capabilities are needed.
4. **Create the app** in [App Store Connect](https://appstoreconnect.apple.com/apps): **+** → New App → iOS, pick that bundle ID and any SKU (for example `orbital-1`).
   - The **name must be unique across the whole App Store.** "ORBITAL" on its own is probably taken; try something like **"Orbital: Neon Orbit Racer"**. The name on the home screen stays "ORBITAL".
5. **Create an App Store Connect API key:** App Store Connect → Users and Access → Integrations → App Store Connect API → Team Keys → **+**, with **Admin** access. Admin is needed so CI can create the signing certificate for you. Download the `.p8` file (you can only download it once) and note the **Key ID** and **Issuer ID**.
6. **Find your Team ID:** [developer.apple.com/account](https://developer.apple.com/account) → Membership details.
7. **In this GitHub repo**, go to Settings → Secrets and variables → Actions.
   - **Secrets:**

     | Name | Value |
     |---|---|
     | `APPLE_TEAM_ID` | your Team ID |
     | `ASC_KEY_ID` | the API key's Key ID |
     | `ASC_ISSUER_ID` | the Issuer ID |
     | `ASC_KEY_P8` | the full text of the `.p8` file, including the BEGIN/END lines |

   - **Variables tab:** `APP_BUNDLE_ID` = your bundle ID.

## 2. Upload a build

Go to **Actions → Upload to App Store Connect → Run workflow**, and enter the version (for example `1.0.0`).

The workflow then:
1. builds with the latest stable Xcode,
2. signs automatically using your API key (no certificates or profiles to manage),
3. uploads to App Store Connect.

After 10–30 minutes of processing, the build appears under **TestFlight**. Install it on your iPhone with the TestFlight app and play through it once before submitting.

## 3. Fill in the App Store listing

**URLs**
- Privacy Policy URL: `https://orbital-server.dummiesbuild26.workers.dev/privacy.html`
- Support URL: `https://orbital-server.dummiesbuild26.workers.dev/support.html`

**Category:** Games → Arcade. Secondary: Games → Action.

**Screenshots** are in `appstore/screenshots/`, already at Apple's required sizes:
- `iphone-6.9/`: 1320×2868, for the 6.9" iPhone slot
- `ipad-13/`: 2064×2752, for the 13" iPad slot

Regenerate them with `node tools/screenshots.mjs`.

**Subtitle** (30 characters max)
> One-tap neon orbit racer

**Promotional text**
> Race friends live, dodge the saws, chain gem combos, and unlock new orbits as the speed climbs.

**Description**
> Your comet circles a pulsing core. One tap flips your orbit: dodge the spinning saws, grab gems to build your combo, and survive as the speed climbs.
>
> • One-tap controls anyone can pick up, with a skill ceiling that keeps going
> • New orbits unlock as you level up: three, then four lanes of chaos
> • Glowing neon visuals, warp-speed starfield, explosive particles and a synth soundtrack that builds with every level
> • Live multiplayer: up to 8 pilots race the exact same course, and the last comet alive wins
> • Private rooms: share a 4-letter code and play with friends
> • Play vs bots any time, even offline
> • Global leaderboard
> • No ads, no accounts, no tracking

**Keywords** (100 characters max)
> arcade,one tap,neon,orbit,space,reflex,hyper casual,multiplayer,race,comet,dodge,high score,bots

**Copyright:** `2026 <your name>`

## 4. Questionnaires

**App Privacy** (App Store Connect → App Privacy). This matches `PrivacyInfo.xcprivacy` in the app.
- Do you collect data? **Yes**
  - **Identifiers → User ID**: used for App Functionality. **Not** linked to the user's identity. **Not** used for tracking.
  - **Usage Data → Gameplay Content**, which covers scores. Same answers: App Functionality, not linked, not tracking.
- Tracking: **No**. The app doesn't need the App Tracking Transparency prompt.

**Age rating:** answer **No / None** to everything. That includes user-generated content and messaging/chat: pilot names come from a fixed word list and there is no free text. That should give **4+**.

**Export compliance:** already answered in `Info.plist` (`ITSAppUsesNonExemptEncryption = NO`; the app only uses HTTPS).

**Content rights:** you own everything. There are no third-party assets: all graphics are drawn in code and all audio is synthesized.

## 5. Notes for the reviewer

Paste into **App Review Information → Notes**:

> No login is required.
>
> HOW TO PLAY: Tap anywhere to switch orbit and dodge the saws. From level 3 more orbits appear: tap the LEFT half of the screen to move in and the RIGHT half to move out (IN/OUT pads are shown).
>
> MULTIPLAYER: "Quick Match" pairs you with online players on the same course. If nobody else is online, tap "PLAY VS BOTS NOW" in the lobby to race clearly labelled bots (this also works offline). "Friends" creates a private room with a 4-letter code; the host can start a match alone.
>
> SAFETY: Players can't type names or messages. Pilot names are generated from a fixed word list (shuffle button), and the server rejects any other name. There is no chat or other user-generated content.
>
> PRIVACY: No accounts, ads or tracking. Ranks → "Delete my online data" removes the player's leaderboard entry. Privacy policy and support pages are linked on the title screen.

## What was checked against Apple's guidelines

| Guideline | Status |
|---|---|
| **1.2 User-generated content** | Removed the risk: no free text anywhere. Names are generated, and the server enforces the word list and hides any older free-text names. |
| **2.1 App completeness** | Quick Match can't get stuck waiting: there's a Play vs Bots fallback, and it switches to bots automatically when offline or the server can't be reached. Private rooms can be started alone. |
| **2.3 Accurate metadata** | Screenshots are real gameplay at the required sizes. |
| **4.2 Minimum functionality** | The full game ships inside the app and works offline. Native haptics and share sheet. Links open in Safari instead of navigating inside the app. |
| **5.1.1 Privacy** | Privacy policy and support pages with in-app links, in-app data deletion, privacy manifest, no tracking. |
| **Privacy manifest** | `ios/Orbital/PrivacyInfo.xcprivacy` declares the data types, with no tracking and no tracking domains. |
| **Current SDK** | The upload workflow uses the latest stable Xcode. The app uses the UIScene lifecycle, which iOS 26 expects. iPad supports all orientations and resizes correctly. |
| **App icon** | 1024×1024 with no alpha channel. |
| **Encryption** | Exempt (HTTPS only); declared in Info.plist. |
| **Debug features** | The web inspector is enabled only in debug builds. |

**Remaining risks**
- **4.2:** reviewers sometimes question games built with web technology. The game is fully bundled, works offline and uses native features, which is what Apple asks for. If they still push back, reply in Resolution Center describing the native features (haptics, share sheet, offline play, real-time multiplayer).
- **Trademarks:** check that the App Store name you pick isn't someone else's trademark.
- **Server uptime:** keep the Cloudflare Worker deployed during review. If it's down, the game falls back to bots and single-player, so review isn't blocked.
