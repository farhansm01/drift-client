# Drift — Task Breakdown

Reference AGENTS.md for full context on any task below. Tasks are sequenced 
by build order — do them roughly in this order, since later tasks depend on 
earlier ones (e.g. everything depends on T01-T05).

**How to track progress:** every task below has a `[ ]` checkbox in front of 
its ID. After you finish a task, change `[ ]` to `[x]` right in this file. 
That's your entire tracking system — one file, one glance to see where you 
are.

**How to command an AI to build a task:** give it this exact prompt shape —
"Read AGENTS.md and TASKS.md for project context. Build T01: [paste that 
task's description]. Follow the rules in AGENTS.md exactly."
Swap T01 for whichever task you're on. Always build in straight numerical 
order, T01 through T85 — no skipping ahead.

---

## Phase 0 — Project Setup

- [x] **T01** — Init Next.js 15 project (App Router, TypeScript), install Tailwind CSS
- [ ] **T02** — Set up folder structure: `src/app`, `src/components`, `src/lib/api`, 
  `src/lib/actions`, `src/lib/db.ts` (MongoDB connection, non-SRV 
  string if needed). No `src/models` — Mongo schemas live only on the Express 
  backend (Phase 1 below), never in the Next.js frontend. Also install the 
  shared UI dependencies used throughout the project: `framer-motion`, 
  `@gravity-ui/icons`, `react-toastify` (no `@heroui/react` — Drift's UI is 
  hand-rolled Tailwind components in a metallic/glassmorphism theme, not a 
  component library)
- [ ] **T03** — Connect MongoDB Atlas, verify connection works with a test query
- [ ] **T04** — Set up the **Express + TypeScript backend** as a separate 
  Vercel serverless function (resolved — mirrors ReSell Hub's deploy pattern, 
  not Render), verify it runs alongside the Next.js frontend on port 5000 
  locally. Install `express`, `cors`, `dotenv`, `mongodb`, `jose-cjs` (no 
  `jsonwebtoken` — unused leftover in ReSell Hub, skip it here), plus dev 
  deps `typescript`, `tsx` (or `ts-node`), `@types/express`, `@types/cors`, 
  `@types/node`. Add a `tsconfig.json` and a `vercel.json` (`builds`/`routes` 
  pointing at the compiled/entry file), with `module.exports = app` and 
  `app.listen()` gated behind `NODE_ENV !== 'production'`. This server is the 
  source of truth for all Car/Booking/Review CRUD. Note: Stripe checkout 
  session creation stays a Next.js API route (same-origin), and BetterAuth 
  itself is mounted inside Next.js — only the Car/Booking/Review data 
  endpoints live on this Express server.
- [ ] **T05** — Install and configure BetterAuth 1.6.11 (`--legacy-peer-deps`, 
  remove `^` caret in package.json). Configure with the native MongoDB 
  adapter (`mongodbAdapter`) + the **JWT plugin** (`jwt()`) so the separate 
  Express server can verify requests via Bearer token, mirroring the 
  developer's ReSell Hub `auth.ts`. Set `additionalFields.role` to default 
  `"user"` (not `"buyer"` — Drift only has `user`/`admin`), with a 
  `databaseHooks.user.create.before` hook restricting role to 
  `["user", "admin"]`. Also create `src/lib/auth-client.ts` with `signIn`, 
  `signUp`, `signOut`, `useSession`, and a `getAuthToken()` helper (fetches 
  JWT from `/api/auth/token`) for attaching to Express requests. On the 
  Express side, build the `verifyToken` middleware using `jose-cjs`'s 
  `createRemoteJWKSet` against the BetterAuth JWKS endpoint 
  (`${NEXT_PUBLIC_BETTER_AUTH_URL}/api/auth/jwks`) + `jwtVerify`, plus the 
  `Internal ${INTERNAL_API_SECRET}` bypass header for system calls — both 
  mirror ReSell Hub's `index.js` exactly. Add the auto-reconnect-on-cold-start 
  MongoDB middleware too, since this runs on Vercel serverless.

## Phase 1 — Data Models (Critical Logic #1 depends on these)
All four models below live **only on the Express backend** (e.g. 
`server/models/`) — there is no `src/models` folder on the Next.js frontend. 
The frontend never talks to MongoDB directly.

- [ ] **T06** — Create `User` model/schema (name, email, password, role) — Express backend
- [ ] **T07** — Create `Car` model/schema (title, category, pricePerDay, seats, 
  transmission, fuelType, images[], description, location, createdBy, createdAt) — Express backend
- [ ] **T08** — Create `Booking` model/schema (carId, userId, startDate, endDate, 
  totalDays, totalPrice, status, createdAt) — Express backend
- [ ] **T09** — Create `Review` model/schema (bookingId, carId, userId, rating, 
  comment, createdAt) — Express backend

## Phase 2 — Booking Overlap Logic (highest-risk, build in isolation first)

- [ ] **T10** — Write the overlap-check function (on the Express server): 
  given carId + new date range, query existing `pending`/`active` bookings 
  for that car, return true/false for conflict
- [ ] **T11** — Write the price-calculation function: totalDays × pricePerDay
- [ ] **T12** — Unit test the overlap function manually with sample data 
  (no-conflict case, exact-overlap case, partial-overlap case, adjacent-dates 
  edge case) before building any UI on top of it
- [ ] **T13** — Build the booking-creation API endpoint (Express) that uses 
  T10 + T11 together (reject if overlap, else create Booking with status 
  "pending")

## Phase 3 — Auth

- [ ] **T14** — Build Register page (email/password via BetterAuth)
- [ ] **T15** — Build Login page (email/password via BetterAuth)
- [ ] **T16** — Add Google OAuth login button (BetterAuth social provider)
- [ ] **T17** — Add Demo Login button (auto-fills test credentials, one for 
  user role, note if a separate one is needed for admin demo)
- [ ] **T18** — Build the dashboard shell: `src/app/dashboard/page.tsx` as a 
  thin index redirect (reads session via `useSession()`, sends unauthenticated 
  users to `/login`, sends everyone else to `/dashboard/${role}`), plus a 
  `useRoleGuard(role)` hook and per-role layouts — 
  `src/app/dashboard/admin/layout.tsx` and `src/app/dashboard/user/layout.tsx` 
  — each gating its route tree and rendering the matching sidebar (see T19). 
  Mirrors ReSell Hub's `DashboardIndexRedirect` + `AdminDashboardLayout` + 
  `useRoleGuard` pattern exactly.
- [ ] **T19** — Wire up Navbar auth state: Login/Register when logged out, 
  Dashboard/Logout when logged in (Dashboard link points to plain `/dashboard`, 
  which redirects per T18). Also build `AdminSidebar` and `UserSidebar` 
  components (nav links per AGENTS.md's Dashboard Architecture section) for 
  use inside the T18 layouts.

## Phase 4 — Car CRUD (Add Car / Manage Cars)

- [ ] **T20** — Build imgbb upload integration (frontend uploads image, gets 
  back a URL — no backend file handling)
- [ ] **T21** — Build Add Car form at `/dashboard/admin/add-car`: title, 
  description, price, category, seats, transmission, fuelType, location, 
  image upload via T20
- [ ] **T22** — Build Add Car API endpoint (Express, called via 
  `src/lib/actions/`) — creates Car doc
- [ ] **T23** — Build Manage Cars view at `/dashboard/admin/manage-cars` — 
  table/grid of admin's own cars
- [ ] **T24** — Add Edit action on Manage Cars (update existing Car doc)
- [ ] **T25** — Add Delete action on Manage Cars (remove Car doc)
- [ ] **T26** — Seed database with 16 sample cars (real-looking data, no 
  placeholder/lorem ipsum, prices in ৳) for testing/demo purposes

## Phase 5 — Listing Page (`/cars`)

- [ ] **T27** — Build Car Card component (image, title, short description, 
  price in ৳, meta info, "View Details" button) — consistent size/style, 
  reusable across listing page (mirrors ReSell Hub's `ProductCard`)
- [ ] **T28** — Build `/cars` page — fetch and display all cars in 4-per-row 
  grid (responsive down to mobile)
- [ ] **T29** — Add Skeleton loader while cars are loading (mirrors ReSell 
  Hub's `ProductCardSkeleton` — build a `CarCardSkeleton` equivalent)
- [ ] **T30** — Build Search bar (by title/keyword)
- [ ] **T31** — Build Filter controls — minimum 2 fields (category, price range, 
  transmission, fuel type)
- [ ] **T32** — Build Sort controls (price low-high, high-low, etc.)
- [ ] **T33** — Add Pagination or infinite scroll

## Phase 6 — Details Page + Booking Widget (`/cars/[id]`)

- [ ] **T34** — Build Details page layout — multiple images, description, 
  specifications section
- [ ] **T35** — Build Reviews section (list existing reviews for this car)
- [ ] **T36** — Build Related Cars section (e.g. same category)
- [ ] **T37** — Build date-range picker component — visually disables/greys out 
  already-booked dates for this specific car (fetch existing bookings for 
  this car to know which dates to disable)
- [ ] **T38** — Wire date picker to price calculation (T11) — show live total 
  price as dates are selected
- [ ] **T39** — Wire "Confirm Booking" button to booking-creation API (T13) — 
  show clear error if overlap rejected (toast via react-toastify)

## Phase 7 — Stripe Integration

- [ ] **T40** — Set up Stripe test-mode account/API keys
- [ ] **T41** — Build Stripe checkout flow triggered on "Confirm Booking" — 
  a same-origin Next.js API route (`src/app/api/checkout_sessions/route.ts`, 
  no Bearer token needed, mirrors ReSell Hub's `/api/checkout_sessions`) 
  creates the Stripe session (one-time payment, test card e.g. 
  4242 4242 4242 4242)
- [ ] **T42** — On successful payment, finalize Booking creation via the 
  Express booking-creation endpoint (T13) (status "pending")
- [ ] **T43** — Handle payment failure/cancel gracefully (don't create a Booking 
  if payment didn't succeed)

## Phase 8 — Dashboard: Manage Rentals (Admin)

- [ ] **T44** — Build Manage Rentals view at `/dashboard/admin/manage-rentals` — 
  table of bookings made on admin's own cars only (filter by Car.createdBy)
- [ ] **T45** — Implement status-based action buttons per row per the action 
  matrix (pending: edit/cancel/delete/mark-picked-up; active: mark-returned 
  only; completed/cancelled: delete only). Use the optimistic-update-with-
  revert-on-error pattern from ReSell Hub's `ManageOrdersPage` 
  (`handleStatusChange`)
- [ ] **T46** — Build Edit booking action (only enabled on "pending" — re-runs 
  overlap check via T10 before saving changes)
- [ ] **T47** — Build Cancel booking action (admin side — only on "pending", 
  flips status to "cancelled")
- [ ] **T48** — Build Delete booking action (available per matrix)
- [ ] **T49** — Build "Mark as Picked Up" action (pending → active)
- [ ] **T50** — Build "Mark as Returned" action (active → completed)

## Phase 9 — Dashboard: User Booking History

- [ ] **T51** — Build Booking History view at `/dashboard/user/booking-history` 
  — read-only list, grouped/filterable by status (Upcoming/Ongoing/Past/Cancelled)
- [ ] **T52** — Add Cancel button — visible only on "pending" bookings, flips 
  status to "cancelled"
- [ ] **T53** — Add "Leave a Review" button — visible only on "completed" 
  bookings, opens review form tied to that bookingId
- [ ] **T54** — Build review submission — creates Review doc, links to bookingId

## Phase 10 — Dashboard: Stats

- [ ] **T55** — Build admin Stats section at `/dashboard/admin/analytics` — 
  charts via Recharts (e.g. bookings count, revenue, most-rented car)
- [ ] **T56** — Build user Stats section at `/dashboard/user/stats` — their 
  own numbers (total trips, total spent) — pulls from T51's booking data
- [ ] **T57** — Confirm the T18 dashboard shell renders the correct sidebar/
  content for each role: `/dashboard/admin/*` only reachable by admins 
  (Add Car, Manage Cars, Manage Rentals, Analytics), `/dashboard/user/*` only 
  reachable by regular users (Booking History, Stats), and the `/dashboard` 
  index correctly redirects each role to its own route tree

## Phase 11 — Home Page

- [ ] **T58** — Build Navbar (full-width, sticky, responsive, correct route 
  count logged in/out per T19) — mirrors ReSell Hub's `AppNavbar`: desktop 
  nav links + profile dropdown with sign out, mobile hamburger menu
- [ ] **T59** — Build Hero section (60-70% viewport height, interactive 
  element/CTA, Framer Motion entrance animations + animated stat counters — 
  mirrors ReSell Hub's `HeroSection`)
- [ ] **T60** — Build Section 1: Featured Cars (pull top/sample cars)
- [ ] **T61** — Build Section 2: How It Works
- [ ] **T62** — Build Section 3: Categories (Sedan/SUV/Hatchback/Luxury/Van 
  browse shortcuts)
- [ ] **T63** — Build Section 4: Why Choose Us / Features
- [ ] **T64** — Build Section 5: Stats (e.g. "500+ cars", "1000+ happy renters" 
  — real-looking, not lorem ipsum)
- [ ] **T65** — Build Section 6: Testimonials
- [ ] **T66** — Build Section 7: FAQ
- [ ] **T67** — Build Section 8 (bonus): Final CTA banner
- [ ] **T68** — Build Footer (working links, contact info, social links — 
  mirrors ReSell Hub's `Footer`)

## Phase 12 — Remaining Pages

- [ ] **T69** — Build About page
- [ ] **T70** — Build Contact page (working form or contact info, no dead links)

## Phase 13 — Polish & QA

- [ ] **T71** — Full responsive pass — test every page on mobile, tablet, desktop
- [ ] **T72** — Verify color palette consistency (max 3 primary + 1 neutral) 
  across every page
- [ ] **T73** — Verify card consistency (size, border-radius, layout) across 
  listing, related cars, featured cars
- [ ] **T74** — Remove all placeholder/lorem ipsum content — replace with real 
  copy everywhere; confirm ৳ is used consistently (no stray `$`)
- [ ] **T75** — Test full booking flow end-to-end: browse → details → pick 
  dates → pay via Stripe → appears in dashboard → admin marks 
  picked-up/returned → user can review
- [ ] **T76** — Test protected route redirects (logged-out user hitting 
  `/dashboard`, `/dashboard/admin/*`, or `/dashboard/user/*` → sent to `/login`; 
  wrong-role user hitting the other role's routes → sent to `/unauthorized` 
  or their own dashboard, mirroring ReSell Hub's `useRoleGuard` behavior)
- [ ] **T77** — Test demo login buttons work correctly

## Phase 14 — Deployment

- [ ] **T78** — Deploy frontend (Vercel)
- [ ] **T79** — Deploy backend (Vercel — serverless function, mirrors 
  ReSell Hub's `vercel.json` + `module.exports = app` pattern, not Render)
- [ ] **T80** — Set all environment variables on deployed platforms (MongoDB URI, 
  BetterAuth secrets + JWT plugin config, Google OAuth keys, Stripe keys, 
  imgbb API key, `ALLOWED_ORIGIN` for backend CORS, `INTERNAL_API_SECRET`, 
  `NEXT_PUBLIC_BASE_URL` pointing at the deployed Express URL)
- [ ] **T81** — Final smoke test on live deployed URL (not localhost)
- [ ] **T82** — Remove/gitignore AGENTS.md and TASKS.md before final GitHub push

---

## Stretch Tasks (ONLY if all of the above is done with time remaining)

- [ ] **T83** — Refund messaging on cancellation (cosmetic only)
- [ ] **T84** — Admin dashboard expansion beyond own cars (if truly extra time)
- [ ] **T85** — Email/SMS notification on booking confirm/cancel


## Finished Tasks

T01, T02, T03, T04, T05, T06, T07, T08