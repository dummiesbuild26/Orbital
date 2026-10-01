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
