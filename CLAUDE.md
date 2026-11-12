# Claude Code Instructions — Code maritime

A Duolingo-style app to learn the French "permis bateau côtier" theory exam through short lessons.
First course: buoyage (IALA region A). Sister project of BirdGuessr: same stack, same conventions, same lesson mechanics.
Read `docs/GAME_DESIGN.md` before any gameplay work.

## Role & Philosophy
- Senior developer: quality, readability, tests. Stay pragmatic: this is a prototype, no backend until it is needed.
- UX/UI matter: audience includes ADHD, colour-blind and senior players. One main action per screen,
  nothing conveyed by colour alone (✓/✗ and text on every verdict), 44 px minimum touch targets,
  12 px minimum text, 4.5:1 contrast for text.

## Workflow
1. One branch and one pull request per task (`feat/…`, `fix/…`, `docs/…`); never push directly to `main`
   once the initial commit is in.
2. Link the PR to its GitHub issue (`Closes #12`).
3. PR description in French: what changed, how to test it (ideally from a phone), assumptions made.
4. TDD for domain logic (`web/app/engine/`, `web/app/courses/*/exercises.ts`): failing test first.
5. Never skip tests or linters before pushing: `cd web && npm run lint && npm run typecheck && npm test -- --run`.
6. Talk to the owner in French. Code, identifiers and commit messages in English.

## Git Commits
- No `Co-Authored-By: Claude` attribution.
- Conventional Commits: `type(scope): description` — types: feat, fix, ci, docs, refactor, test, chore.
- Scopes: `engine`, `course`, `web`, `deploy`, `docs`.

## Architecture

```
code-maritime/
├── web/                         # Nuxt 4 app (ssr: false, static, PWA manifest)
│   └── app/
│       ├── engine/              # GENERIC lesson engine: plain TS, no Vue, no boat vocabulary
│       │   ├── session.ts       #   play a lesson: choose → check → verdict → continue, hearts, retries
│       │   ├── builder.ts       #   build a lesson from a plan: tip, new-card intros, mix, review weighting, XP
│       │   ├── mastery.ts       #   spaced repetition (1 d, 3 d, 1 wk, 3 wk), same rule as BirdGuessr
│       │   ├── streak.ts, progress.ts, random.ts (injected, seedable)
│       ├── courses/             # types.ts (the Course contract), index.ts (all courses in path order), shared.ts
│       │   ├── balisage/        #   unit 1: marks, lessons, exercise generator
│       │   └── navires/         #   unit 2: vessels (lights by aspect, day shapes), lessons, exercise generator
│       ├── components/          # CardVisual (dispatch), BuoyMark, NightLight, ShipScene (SVG), RichText
│       ├── composables/         # useProgress (localStorage), useSound
│       ├── pages/               # index (path), lecon/[id] (lesson)
│       └── assets/themes/fixed.css  # the one UI palette — never hard-code a UI colour
├── deploy/docker-compose.prod.yml
└── docs/
```

- The engine must stay course-agnostic (cards, exercises, mastery): it is meant to become a shared core with
  BirdGuessr if the two products ever merge. Anything about boats lives in `courses/`.
- Signal colours of marks are content (in `BuoyMark.vue`), not UI theme.
- Progress lives in localStorage only (no account). Read it defensively (`parseProgress`).
- Randomness and time are injected (`seeded()`, `now`) so the engine is deterministic in tests.

## Adding a course
1. `courses/<id>/`: the cards and an `index.ts` exporting a `Course` (lessons with plans and tips, `card(id)` for intros,
   `generator(lesson)` → `(cardId, kind, rng, statement?) => CourseExercise | null`, null when the kind does not apply
   or fewer than two choices exist).
2. Test the generator: answer among unique choices, kinds only where they make sense, every lesson fills its count.
3. New picture types: add a `Visual` variant in `courses/types.ts` and draw it from `CardVisual.vue`.
4. Register the course in `courses/index.ts`. Card ids and lesson ids must be unique across courses (tested).

## Deployment
- CI (GitHub Actions) runs lint, typecheck, tests and build on every PR; on `main` it pushes
  `ghcr.io/lzwingelstein/code-maritime/web:<sha>` and `:latest`.
- Dokploy on the owner's VPS pulls it (`deploy/docker-compose.prod.yml`); the owner clicks Deploy after a merge.
