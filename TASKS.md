# Drift — Task Breakdown (Two-Repo Version: drift-client + drift-server)

Reference AGENTS.md for full context — especially the Architecture section. 
Every task below is tagged with which repo it belongs to.

**How to track progress:** check off `[ ]` → `[x]` as you finish each task.

**How to command an AI to build a task:**
"Read AGENTS.md and TASKS.md for project context. Build T__: [paste that
task's description]. Follow the rules in AGENTS.md exactly — note which
repo (drift-client or drift-server) this task belongs to."

---

## Phase 0 — drift-client Setup

- [x] **T01** — Init Next.js project (App Router, TypeScript), install Tailwind CSS
- [x] **T02** — Set up folder structure: `src/app`, `src/components`, 
  `src/lib/api/`, `src/lib/actions/` (these call drift-server, never touch 
  MongoDB directly)
- [x] **T03** — (superseded — MongoDB connection moved to drift-server, see 
  Phase 1 below. drift-client no longer needs its own DB connection for 
  Car/Review data.)
- [x] **T04** — Install and configure BetterAuth 1.6.23 (`--legacy-peer-deps`), 
  set up `auth.ts` + `auth-client.ts` (BetterAuth's own DB collections can 
  still live in drift-client's MongoDB connection — this is separate from 
  Car/Review data)

## Phase 1 — drift-server Setup

- [ ] **T04b** — Init drift-server: Node.js + Express + TypeScript, install 
  `express`, `cors`, `dotenv`, `mongodb`, dev deps `typescript`, `tsx` (or 
  `ts-node`), `@types/express`, `@types/cors`, `@types/node`
- [ ] **T04c** — Connect MongoDB Atlas in drift-server (non-SRV string), 
  verify connection with a test query
- [ ] **T04d** — Set up CORS in drift-server to allow requests from 
  drift-client's URL (localhost:3000 for dev, deployed URL for production)

## Phase 2 — Data Schemas (drift-server)

- [x] **T05** — Create `User` model/schema (name, email, password — handled 
  by BetterAuth in drift-client, NOT needed in drift-server)
- [x] **T06** — Create `Car` type/schema in drift-server (title, 
  shortDescription, fullDescription, price, category, seats, transmission, 
  fuelType, location, image, contactInfo, createdBy, createdAt)
- [x] **T07** — Create `Review` type/schema in drift-server (carId, userId, 
  userName, rating, comment, createdAt)

## Phase 3 — drift-client Auth Pages

- [x] **T08** — Build Register page (email/password via BetterAuth)
- [x] **T09** — Build Login page (email/password via BetterAuth)
- [x] **T10** — ~~Demo Login button~~ — SKIPPED per instructor clarification
- [x] **T11** — Build auth proxy/guard (`src/proxy.ts`) — protects `/cars/add`
  and `/cars/manage`, redirects unauthenticated users to `/login`
- [x] **T12** — Wire up Navbar auth state: Login/Register when logged out, 
  4 links + Logout when logged in, 6 links total logged in (already done, 
  exceeds spec minimums)

## Phase 4 — Add Car / Manage Cars (drift-client pages + drift-server routes)

- [x] **T13** — Build imgbb upload integration (drift-client — frontend 
  uploads image, gets back a URL, no backend file handling anywhere)
- [x] **T14** — Build `/cars/add` form (drift-client) — ALL Car schema 
  fields, dropdowns for category/transmission/fuelType, per-field 
  validation errors, submit handler currently a stub
- [ ] **T15** — Build the Add Car flow, split across both repos:
  - drift-server: `POST /api/cars` route — reads `createdBy` (user id) from 
    the request body, attaches `createdAt` server-side, inserts into the 
    `cars` collection, returns the created car
  - drift-client: `src/lib/actions/cars.ts` — `createCar(data)` function 
    that `fetch()`s drift-server's `POST /api/cars` (include the logged-in 
    user's id in the request body, read via BetterAuth's `useSession()` or 
    `getSession()` client-side)
  - drift-client: wire T14's stub submit handler to call `createCar()`, 
    show success/error feedback, redirect to `/cars/manage` on success
- [ ] **T16** — Build `/cars/manage` page (drift-client) — table/grid of 
  cars the logged-in user has listed. Needs: 
  drift-server `GET /api/cars?createdBy=<userId>` route, and a matching 
  `src/lib/api/cars.ts` fetch function in drift-client
- [ ] **T17** — Add View action on Manage Cars (links to `/cars/[id]`)
- [ ] **T18** — Add Delete action on Manage Cars — drift-server 
  `DELETE /api/cars/:id` route (verify the car's `createdBy` matches the 
  requesting user id before deleting), drift-client action function + 
  wired-up delete button with a confirm step
- [ ] **T19** — Seed drift-server's database with 16 sample cars (real-
  looking data, no placeholder/lorem ipsum, prices in ৳, with plausible 
  `contactInfo` per listing) — write a one-off seed script in drift-server

## Phase 5 — Listing Page (`/cars`, drift-client)

- [ ] **T20** — Build Car Card component (image, title, short description, 
  price, meta info, "View Details" button) — consistent size/style
- [ ] **T21** — Build `/cars` page — needs drift-server `GET /api/cars` 
  route (all cars, no filter) + matching `src/lib/api/cars.ts` fetch 
  function; display in 4-per-row grid, responsive
- [ ] **T22** — Add Skeleton loader while cars are loading
- [ ] **T23** — Build Search bar (by title/keyword) — can filter client-side 
  or via a `?search=` query param to drift-server, your call
- [ ] **T24** — Build Filter controls — minimum 2 fields (category, price 
  range, transmission, or fuel type)
- [ ] **T25** — Build Sort controls (price low-high, high-low, etc.)
- [ ] **T26** — Add Pagination or infinite scroll

## Phase 6 — Details Page (`/cars/[id]`, drift-client)

- [ ] **T27** — Build Details page layout — needs drift-server 
  `GET /api/cars/:id` route + matching fetch function; multiple images, 
  title, price, meta info
- [ ] **T28** — Build Description/Overview section
- [ ] **T29** — Build Key Information/Specifications section (seats, 
  transmission, fuel type, location, contact info)
- [ ] **T30** — Build Reviews/Ratings section — needs drift-server 
  `GET /api/reviews?carId=<id>` route + fetch function; list seeded reviews
- [ ] **T31** — Build Related Items section (e.g. same category — can reuse 
  the T21 all-cars fetch and filter client-side)

## Phase 7 — Home Page (drift-client)

- [x] **T32** — Build Navbar (full-width, sticky, responsive)
- [ ] **T33** — Build Hero section (60-70% viewport height, interactive 
  element/CTA)
- [ ] **T34** — Build Section 1: Featured Cars
- [ ] **T35** — Build Section 2: How It Works
- [ ] **T36** — Build Section 3: Categories
- [ ] **T37** — Build Section 4: Why Choose Us / Features
- [ ] **T38** — Build Section 5: Stats (real-looking numbers, not lorem ipsum)
- [ ] **T39** — Build Section 6: Testimonials
- [ ] **T40** — Build Section 7: FAQ
- [x] **T41** — Build Footer (working links, contact info, social links)

## Phase 8 — Remaining Pages (drift-client)

- [ ] **T42** — Build About page (marketplace framing — list your car for 
  sale, browse others, contact sellers directly)
- [ ] **T43** — Build Contact page (working form or contact info, no dead links)

## Phase 9 — Polish & QA (both repos)

- [ ] **T44** — Full responsive pass on drift-client — every page on mobile, 
  tablet, desktop; verify color palette consistency (max 3 primary + 1 
  neutral); verify card consistency; remove all placeholder content
- [ ] **T45** — Test protected route redirects (`/cars/add`, `/cars/manage` 
  → `/login` when logged out); test full flow end-to-end: add car (client) 
  → saved (server) → shows in manage (client, fetched from server) → view → 
  delete (client → server) → gone from manage

## Phase 10 — Deployment (both repos)

- [ ] **T46** — Deploy drift-server (Vercel serverless function or Render), 
  set its environment variables (MongoDB URI, `ALLOWED_ORIGIN` for CORS). 
  Deploy drift-client (Vercel), set its environment variables (MongoDB URI 
  for BetterAuth, BetterAuth secrets, imgbb API key, drift-server's deployed 
  URL). Final smoke test on both live URLs, then remove/gitignore AGENTS.md 
  and TASKS.md from BOTH repos before final GitHub push

---

## Stretch Tasks (ONLY if all of the above is done with real time remaining)
- [ ] **T47** — Simple review-submission form (drift-client form + 
  drift-server `POST /api/reviews` route)
- [ ] **T48** — Google OAuth login button (spec lists this as optional)

## Finished Tasks
T01 - T32, T41, T47
(T03 superseded — see note in Phase 0. T10 intentionally skipped.)

## Notes / Decisions Log
- Pivoted from "car rental" framing to "used car marketplace/classifieds" 
  framing — no in-app transaction, buyer contacts seller directly.
- Rejected: role-based (admin/user) auth + dashboards. Spec does not require 
  it.
- Confirmed on Next.js 16 — file is `src/proxy.ts` (not `middleware.ts`), 
  exported function is `proxy` (not `middleware`).
- **Major architecture correction:** project is split across TWO repos 
  (drift-client + drift-server), matching the developer's proven pattern 
  from ReSell Hub/HireLoop/DocAppoint — NOT a single Next.js project with 
  local API routes, as an earlier version of this file incorrectly stated. 
  All Car/Review MongoDB logic lives in drift-server; drift-client only 
  fetches from it.
- Naming corrected throughout: "Car," never generic "Item" (`/cars/add`, 
  `/cars/manage`, not `/items/add`, `/items/manage`).
- BetterAuth version is 1.6.23 (not 1.6.11 — confirmed working at this 
  version for this project, the 1.6.11 pin was from an earlier, unrelated 
  project's bug report).
