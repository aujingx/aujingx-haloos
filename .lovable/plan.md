
# Refocus the demo around the robot, not the wearer

The current demo accidentally reads as a "smart glasses" product — a first-person POV with a gaze cursor over a static living-room photo. For a robot company (Loona, Clicbot), the protagonist of every scene must be a **visible robot in the room**, and the viewer must understand within 2 seconds what the robot is sensing, thinking, and doing.

## 1. Reframe: third-person "robot in the room", not first-person POV

Replace the full-bleed POV background with a consistent, lightly stylized **stage view of a room** seen from a neutral camera. The cast is always visible:

- **A human silhouette / character** (the user) — drawn, not photographed, so it reads as an illustration instead of "a guy on a sofa".
- **A small visible robot** (Loona-like rounded body, expressive eye) somewhere in the scene. The robot is the Agent; whenever the orb is "listening / thinking / acting", the robot itself shows it (eye pulse, head turn, small move).
- **A few interactable objects** (cup, window, door, lamp) as simple shapes with labels on hover.

This gives one shared mental model across all five scenes: *the robot is here, it perceives, it decides, it acts*.

Technical note: build a single `<RoomStage>` component with an inline SVG room (couch outline, table, window, door) and an `<AgentRobot>` SVG that accepts `state` and `position` props. All five scenes compose this same stage so the viewer's eye doesn't have to re-learn the layout. Move the existing `home-scene.jpg` to a subtle blurred backdrop or drop it entirely.

## 2. Make perception channels explicit and multimodal

The viewer needs to *see* how the robot senses the user. Show three input channels with small, always-on indicators near the robot:

- **Vision** (camera icon) — lights up when the robot is looking at someone/something. A thin line from the robot's eye to its current focus target.
- **Voice** (mic icon) — lights up when the user speaks; a small waveform appears above the user.
- **Gesture / posture** (hand icon) — lights up when the user raises a hand, shifts posture, etc.

In Scene 1 (Presence), the demo becomes interactive in a way that is *obviously* about perception: hovering different parts of the scene triggers different channels.

- Hover the **user character** → the robot turns its eye to the user, "Vision" lights up.
- Click a **"speak" button** floating near the user → "Voice" lights up, robot orients.
- Click a **"wave" button** → "Gesture" lights up.

A one-line caption at the bottom changes with each interaction (e.g., "Saw you.", "Heard you.", "Noticed your hand.") so the viewer instantly grasps "this robot perceives me in three ways".

## 3. Per-scene revisions

**Scene 1 · Presence** — Replace the gaze-cursor-over-photo with the room stage above. The robot sits/stands somewhere visible (not on the sofa). Demonstrate the three perception channels as described. Remove the "move the mouse, that's your gaze" hint — it implied first-person.

**Scene 2 · Trigger** — Keep the three trigger cases, but show the robot reacting on stage: turning to look, then either acting, asking, or staying still. Make the "did nothing" case visibly *quiet* — the robot doesn't move, but a soft indicator shows it considered and chose not to interrupt.

**Scene 3 · Emergence** — Notifications now visibly originate from the robot (small speech bubble), not from the top of the screen. The robot prioritizes by physically turning toward the user only for the message that matters; the filtered ones float in and dim out near the robot, never reaching the user.

**Scene 4 · Action** — Keep the "fetch the cup" arc, but animate the robot actually traversing the stage to the cup and back. The narration HUD stays but is shorter. Fix copy:
- `s4.stopped`: 中文 "停下了，要换个方式吗？" → "停下了，需要别的指示吗？"; 英文 "Stopped. Try another way?" → "Stopped. What would you like instead?"
- Align other zh/en pairs so meaning matches exactly (audit all `s*` keys).

**Scene 5 · Together (multi-agent)** — This is the scene most missing the robot. Reframe as:
- The **home robot** (Loona) is the one the user speaks to.
- It coordinates with the **car** and the **glasses/phone** as peer agents.
- Show all three as small device cards *with the home robot visibly central on stage*, sending lines out to the car and glasses cards. The "low battery" message comes back through the home robot — one voice, spoken on stage by the visible robot, not by a floating panel.

## 4. Copy fixes (Chinese tone + zh/en parity)

- `hero.body` 中文 "没有 App 之后，系统只剩一个 Agent 在你身边。下面五幕，是它的样子。" → "当 App 不再是入口，只剩一个 Agent 留在你身边。下面五种场景，是它的样子。"
  English match: "When apps stop being the entry point, only one agent stays with you. Five scenes show what that looks like."
- `fq.eyebrow` "五幕" → "五种场景" / "Five scenes" (already English, keep).
- Audit every `s1`–`s5` key so the Chinese and English say the *same* thing, not just similar things. Notable mismatches to fix in addition to `s4.stopped`:
  - `s1.firstHint` will be replaced entirely (no more gaze hint).
  - `s4.micNote` 中文 "（真实场景：直接说就好）" — keep, but make sure English matches tone.
  - `s5.lowbatNote` — re-align both versions to the new "home robot relays car's status" framing.

## 5. Default locale → English

In `src/lib/i18n.tsx`, change `useState<Locale>("zh")` → `useState<Locale>("en")`. Keep the localStorage override so returning users keep their choice. Update `<html lang>` if set anywhere (check `__root.tsx`).

## Technical section

Files to touch:

- **New** `src/components/halo/RoomStage.tsx` — shared SVG stage (room outline, sofa, table, window, door) + slot for objects/robot/user.
- **New** `src/components/halo/AgentRobot.tsx` — SVG robot with `state: idle|listening|thinking|acting|handoff` and `position: {x,y}`; eye pulse + small idle bob via Framer Motion.
- **New** `src/components/halo/PerceptionChannels.tsx` — three small indicators (vision/voice/gesture) that accept an `active` prop.
- **Rewrite** `src/components/halo/ScenePresence.tsx` — uses RoomStage + AgentRobot + PerceptionChannels; replaces mouse-as-gaze with explicit "look / speak / wave" interactions.
- **Update** `SceneTrigger.tsx`, `SceneEmergence.tsx`, `SceneAction.tsx`, `SceneMultiAgent.tsx` — compose RoomStage + AgentRobot. Scene 4 animates robot position along a path. Scene 5 places the home robot center-stage and draws connection lines to car/glasses cards.
- **Update** `src/lib/i18n.tsx` — default locale `en`; rewrite the listed keys; audit zh/en parity for all `s*` and `hero.*` keys.
- **Update** `src/components/halo/Hero.tsx` and `FiveQuestions.tsx` — replace "五幕" wording; tighten the hero body line.
- Drop or de-emphasize `src/assets/home-scene.jpg` (the photo is the source of the "static guy on sofa" feeling).

No backend/data changes. Pure frontend + copy.

## Out of scope (per earlier instruction)

- Trade-offs page — not adding back.
- New routes or auth — not adding.
