# ORBITAL auto-updates: progress log

Screenshots are 390×844 phone captures (2× scale) of the build in that commit series.

## 01. Course versioning for multiplayer
Clients now send a course version with Quick Match and room joins, and the server only puts players with the same version together. An older app build therefore never races a newer one on a different course from the same seed. To try it: nothing changes visibly; an outdated client trying to join a newer room gets "Update ORBITAL to join this room".
Screenshot: `01-course-versioning.png` (bot match countdown, which also shows the new swipe explanation)

## 02. Hopper spikes
From level 2, some spikes start on one orbit and jump to a neighbouring one as you approach. A dashed pink target and a chevron show where they will land. The hop always finishes before you pass the previous column, so there's never less reaction time than for a normal spike. To try it: play to level 2+ and look for spikes with a dashed circle next to them.
Screenshot: `02-hopper-spikes.png`

## 03. Shield power-up
From level 3, some gem trails end in a shield pickup. While you have it the comet wears a bubble (and a shield icon shows in the top-left); the next spike you hit shatters instead of ending the run, followed by a short blinking grace period.
Screenshots: `03-shield-pickup.png`, `03-shield-saved.png`

## 04. Daily challenge
A new DAILY CHALLENGE button on the title screen starts a course seeded from today's date, so everyone gets the same course that day and retries replay it. It tracks today's best and a day streak (shown on the button), and the share card mentions the daily.
Screenshot: `04-daily-challenge.png`

## 05. Pilot screen: stats, achievements, comet skins
The BEST · ★ PILOT pill on the title screen opens lifetime stats, 14 achievements and 8 comet skins unlocked by achievements (Gold, Ghost, Ember, Toxic, Void, Champion, Rainbow). Unlocks are announced with a toast and a dot on the pill. Everything is stored on the device.
Screenshot: `05-pilot-screen.png`

## 06. Swipe controls for 3+ orbits
With 3 or more orbits, swipe up to move out and swipe down to move in; taps no longer move you. The IN/OUT pads are replaced by a small animated swipe hint. With 2 orbits, any tap still switches. In solo, the first two times the third orbit appears, the game pauses on a NEW ORBIT tutorial and resumes on a swipe or tap with a short grace period. Multiplayer and bot matches never pause: the countdown explains swipes and a banner appears instead.
Screenshots: `06-swipe-tutorial.png`, `06-swipe-hint.png`

## 07. FEVER mode and the gem magnet
Reaching the maximum x6 combo (25 gems in a row) now starts **FEVER** for 8 seconds: every gem scores double (up to +12), the trail turns into a wide rainbow, the background pulses on the beat and the music adds a lead line. Every 15 more gems in the same combo triggers it again, and missing a gem ends it. A new **magnet** pickup can appear at the end of gem trails from level 2: for 7 seconds, gems on every orbit fly into your comet, which is the easiest way to reach FEVER. A new achievement, Fever Pitch, unlocks the Aurora comet. (The course changed, so the course version is now 3.)
Screenshot: `07-fever-magnet.png` (FEVER running, magnet timer on the left)

## 08. Missions
There are now always three missions, such as "Score 80 in one run", "Make 4 near misses", "Reach FEVER", "Grab a magnet", "Dodge 120 spikes" or "Play 2 daily challenges". Each pays 20–90 ✦ stardust when done; a banner pops up mid-run the moment you complete one. The results screen shows your missions with progress bars (on short phones only the ones you just finished), and the Pilot screen lists them with how many you've done in total. Finished missions are swapped for a new kind at the start of the next run, and each kind gets harder (and pays more) every time you complete it.
Screenshots: `08-missions-results.png`, `08-missions-pilot.png`
