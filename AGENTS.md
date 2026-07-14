# Project: Drift — Car Rental Platform (Full Stack, TypeScript)

## Overview
Drift is a full-stack car rental platform with REAL booking/reservation logic — 
not just a static catalog. Users browse cars, view availability, book specific 
date ranges, and manage their bookings. Hosts/admins list and manage their own 
cars and the rentals made on them. This is a student assignment project with a 
hard deadline — prioritize a fully working core over half-finished extras.

Tagline: "Drive further, worry less."

## Tech Stack
- Frontend: Next.js 15 (App Router), React, **TypeScript (mandatory — this 
  project uses TS, unlike the developer's usual JS-only projects)**
- Styling: Tailwind CSS, hand-rolled components (no headless/primitive UI 
  library — see Design Language below)
- UI Libraries: Framer Motion (entrance animations, animated counters), 
  Gravity UI icons (`@gravity-ui/icons`), react-toastify (toast 
  notifications) — carried over from the developer's ReSell Hub frontend 
  stack. **HeroUI is NOT used on Drift** — all components (Drawer, Avatar, 
  Chip, Card, Button, etc.) are built by hand in Tailwind so the 
  metallic/glassmorphism theme (see below) can be applied consistently; a 
  generic component library would fight that look.

## Design Language — Metallic / Glassmorphism
Drift's visual identity is a metallic, glassmorphic theme — distinct from 
ReSell Hub's look:
- Frosted-glass surfaces: translucent panels (`backdrop-blur`, low-opacity 
  white/gray backgrounds, thin 1px light-reflective borders) over a dark or 
  gradient backdrop
- Metallic accents: chrome/silver/gunmetal gradients on buttons, borders, 
  and highlights (subtle linear/radial gradients, not flat color fills) — 
  brushed-steel feel rather than glossy plastic
- Depth via soft shadows + inner highlights on glass cards, not harsh drop 
  shadows
- Still respects the "max 3 primary + 1 neutral color" rule — the metallic 
  tones (silver/gray/chrome) count as the neutral, paired with 1-2 accent 
  colors (e.g. an electric blue or steel teal) for CTAs/links
- Applies site-wide: navbar, cards, dashboard panels, modals, buttons — 
  consistent glass + metal treatment everywhere, not just the hero section
- Charts: Recharts (for Stats/Analytics sections)
- Backend: **Node.js + Express.js + TypeScript**, running as a separate 
  **Vercel serverless function** (mirrors ReSell Hub's backend exactly — 
  `module.exports = app` with `app.listen()` gated behind 
  `if (process.env.NODE_ENV !== 'production')`, plus a `vercel.json` with 
  a `builds`/`routes` config pointing at the compiled entry file). Locally 
  it still behaves like a normal server on port 5000 via `nodemon`/`tsx`.
- Database: MongoDB (native `mongodb` driver, non-SRV Atlas connection string 
  — developer's ISP blocks SRV DNS lookups)
- Auth: **BetterAuth v1.6.11** (pin exactly, install with `--legacy-peer-deps`, 
  remove `^` caret in package.json — v1.6.13+ has a breaking kysely 
  compatibility bug) + Google OAuth via BetterAuth's built-in social provider
- Payments: **Stripe** (test mode) — required, not optional
- Image hosting: **imgbb** — car images are uploaded to imgbb, which returns 
  a hosted image URL; only that URL string is stored in MongoDB (no binary 
  image data or file uploads stored in the database or backend server)

## Auth Architecture (resolved — mirrors ReSell Hub exactly)
Drift uses the same hybrid auth setup as the developer's ReSell Hub project:

- **BetterAuth runs inside Next.js**, mounted at `src/app/api/auth/[...all]/route.ts` 
  via `toNextJsHandler(auth)`. This is same-origin, so cookies/sessions work 
  natively for anything Next.js itself needs to do.
- `src/lib/auth.ts` configures BetterAuth with the native MongoDB adapter 
  (`mongodbAdapter`), the **JWT plugin** (`jwt()`), Google OAuth, and an 
  `additionalFields.role` field defaulting to `"user"` (not `"buyer"` — 
  Drift only has two roles). A `databaseHooks.user.create.before` hook 
  restricts the role field to `["user", "admin"]` on signup, same pattern as 
  ReSell Hub's `allowedRoles` check.
- `src/lib/auth-client.ts` exposes `signIn`, `signUp`, `signOut`, 
  `useSession`, and a `getAuthToken()` helper that fetches a JWT from 
  `/api/auth/token` for attaching to Express requests.
- **The separate Express server** (Vercel serverless, port 5000 locally) is 
  the source of truth for all Car/Booking/Review CRUD. Every request from 
  `src/lib/api/*` (GET) and `src/lib/actions/*` (mutations) attaches 
  `Authorization: Bearer ${token}` from `getAuthToken()`, and Express 
  verifies it. Public GETs (car listing, car details, categories) skip the 
  token.
- **Token verification on Express (exact pattern, mirrors ReSell Hub's 
  `index.js`):** use `jose-cjs`'s `createRemoteJWKSet(new URL(process.env.NEXT_PUBLIC_BETTER_AUTH_URL + '/api/auth/jwks'))` 
  once at module load, then `jwtVerify(token, JWKS)` inside a `verifyToken` 
  middleware. Look the resulting `payload.sub` up in the `user` collection 
  and attach it as `req.user`. **Do not add the `jsonwebtoken` package** — 
  it's present in ReSell Hub's `package.json` but unused there; `jose-cjs` 
  is the actual verification path.
- **Internal bypass header:** mirror ReSell Hub's pattern where 
  `Authorization: Internal ${process.env.INTERNAL_API_SECRET}` short-circuits 
  `verifyToken` and sets `req.user = { role: 'internal' }`, for any 
  server-to-server/system calls that don't go through a real user session.
- **Auto-reconnect middleware:** since the backend runs as a Vercel serverless 
  function, add the same reconnect-on-cold-start middleware ReSell Hub uses — 
  checks `client.topology?.isConnected()` before each request and 
  reconnects if needed, since serverless instances can go cold between 
  invocations.
- Role guard middlewares mirror ReSell Hub's `verifyAdmin`/`verifySeller`/ 
  `verifyBuyer` pattern, collapsed to two: `verifyAdmin` and `verifyUser` 
  (`req.user?.role !== 'admin'` / `'user'` → 403).
- CORS mirrors ReSell Hub exactly: `origin: process.env.ALLOWED_ORIGIN`, 
  `methods: ['GET','POST','PUT','PATCH','DELETE']`, 
  `allowedHeaders: ['Content-Type','Authorization']`. Body parsers capped 
  at `10mb` (`express.json`, `express.urlencoded`).
- **Stripe checkout session creation is a Next.js API route** 
  (`src/app/api/checkout_sessions/route.ts`), same-origin, no Bearer token 
  needed — identical to ReSell Hub's `/api/checkout_sessions/route.js`.
- Booking creation itself (after successful Stripe payment) goes through the 
  Express server like all other mutations, so the overlap-check function 
  (Critical Logic #1) lives server-side in Express and is reused by both the 
  customer booking flow and the admin rental-edit flow.

## Core Concept
- "Item" = a car listing, added/managed by a host (logged-in user with role "admin")
- Bookings are REAL: date-range selection, overlap/conflict checking, and 
  price calculation are required and must work correctly
- A car cannot be double-booked for overlapping, active date ranges
- This is NOT a simple catalog — treat booking logic as the core, highest-risk 
  feature and build it first

## Routes
| Page | Route | Access |
|---|---|---|
| Home | `/` | Public |
| Explore/Listing | `/cars` | Public |
| Car Details + Booking widget | `/cars/[id]` | Public (booking action requires login) |
| Login / Register | `/login`, `/register` | Public |
| Dashboard index (role redirect) | `/dashboard` | Protected — redirects to role route below |
| Admin Dashboard | `/dashboard/admin`, `/dashboard/admin/add-car`, `/dashboard/admin/manage-cars`, `/dashboard/admin/manage-rentals`, `/dashboard/admin/analytics` | Protected — admin only |
| User Dashboard | `/dashboard/user`, `/dashboard/user/booking-history`, `/dashboard/user/stats` | Protected — user only |
| About / Contact | `/about`, `/contact` | Public |

**Resolved decision:** Drift uses **per-role dashboard route trees** — 
`/dashboard/admin/*` and `/dashboard/user/*` — each with its own layout, 
sidebar, and role guard, mirroring ReSell Hub's `AdminDashboardLayout` / 
`BuyerDashboardLayout` / `SellerDashboardLayout` pattern exactly (just two 
sidebars instead of three, since Drift only has `user`/`admin` roles). 
Plain `/dashboard` is a thin index page that reads the session and redirects 
to `/dashboard/${role}`, mirroring ReSell Hub's `DashboardIndexRedirect`.

## Data Schema
These schemas are defined and used **only on the Express backend** (e.g. 
`server/models/` or equivalent inside the Express project) — there is no 
`src/models` folder in the Next.js frontend. The frontend never touches 
MongoDB directly; it only calls the Express API via `src/lib/api/` (GET) and 
`src/lib/actions/` (mutations), so it has no need for schema definitions of 
its own (TS types/interfaces for API response shapes can live in 
`src/lib/types.ts` if needed, but that's separate from the DB schema).

```
User {
  name, email, password (hashed via BetterAuth), 
  role: "user" | "admin"
}

Car {
  title, category, pricePerDay, seats, transmission, fuelType,
  images[] (array of imgbb-hosted URL strings, NOT binary/file data),
  description, location, createdBy (User ref), createdAt
}

Booking {
  carId, userId, startDate, endDate, totalDays, totalPrice,
  status: "pending" | "active" | "completed" | "cancelled",
  createdAt
}

Review {
  bookingId, carId, userId, rating, comment, createdAt
  // tied to bookingId specifically so only users who actually completed 
  // a rental can review — prevents fake reviews
}
```

No separate Payment or Wishlist collections — these are ReSell Hub-specific 
and out of scope for Drift. Stripe payment status is tied directly to the 
booking-creation flow (Critical Logic below), not a standalone collection.

## Critical Logic #1: Booking Overlap Check
Before confirming ANY booking (whether made by a customer or edited by an admin):
1. Query all Bookings for the target `carId` where status is `"pending"` OR `"active"` 
   (these are the only statuses that actually block a car — `completed` and 
   `cancelled` bookings free up the car again)
2. Check if `[newStartDate, newEndDate]` overlaps any existing 
   `[startDate, endDate]` in that filtered set
3. Overlap formula: `(newStart <= existingEnd) AND (newEnd >= existingStart)`
4. If overlap found → reject with "Not available for selected dates"
5. If no overlap → create/update Booking, calculate 
   `totalPrice = totalDays * pricePerDay`

Build this as ONE reusable function, on the Express server — both the 
customer-facing booking flow AND the admin's rental-editing flow must call 
the same overlap-check logic. Do not duplicate this logic in two places.

## Critical Logic #2: Booking Status Lifecycle
Statuses move forward manually — there is no GPS/IoT automation, a human 
clicks a button at each real-world handoff point.

| Status | Meaning | Who changes it, and how |
|---|---|---|
| `pending` | Booked, rental period hasn't started | Set automatically on booking creation |
| `active` | Customer has physically picked up the car | Admin clicks "Mark as Picked Up" (pending → active) |
| `completed` | Rental period is over, car returned | Admin clicks "Mark as Returned" (active → completed) |
| `cancelled` | Booking called off before pickup | Either the customer (only while `pending`) or the admin (only while `pending`) clicks "Cancel" |

### Action matrix (who can do what, per status)
| Status | Customer can | Admin can |
|---|---|---|
| `pending` | Cancel | Edit, Cancel, Delete, Mark as Picked Up |
| `active` | — | Mark as Returned |
| `completed` | Leave a Review | Delete |
| `cancelled` | — | Delete |

Manage Rentals (admin) and Booking History (customer) both read from the same 
existing bookings, plus the status-transition buttons above.

Follow the optimistic-update-with-revert-on-error pattern established in 
ReSell Hub's `ManageOrdersPage` (`handleStatusChange`) for every status 
transition button here.

## Dashboard Architecture (resolved)
Two separate role-gated dashboard route trees, mirroring ReSell Hub:

- `src/app/dashboard/page.tsx` — thin index redirect: reads session via 
  `useSession()`, redirects to `/login` if logged out, otherwise to 
  `/dashboard/${role}` (mirrors `DashboardIndexRedirect`)
- `src/app/dashboard/admin/layout.tsx` — wraps all admin routes, uses a 
  `useRoleGuard("admin")` hook (mirrors ReSell Hub's `sessions.ts`), renders 
  `AdminSidebar` (desktop) + a hand-rolled slide-in mobile sidebar (Framer 
  Motion transition + glass/metallic panel, no HeroUI `Drawer`), blocks render 
  until role is confirmed (spinner while loading, matches 
  `AdminDashboardLayout`)
- `src/app/dashboard/user/layout.tsx` — same pattern with `useRoleGuard("user")` 
  and `UserSidebar`
- `src/components/dashboard/AdminSidebar.tsx` — nav links: Overview, Add Car, 
  Manage Cars, Manage Rentals, Analytics, Sign Out
- `src/components/dashboard/UserSidebar.tsx` — nav links: Overview, Booking 
  History, Stats, Sign Out

| Section | Admin/Host sees | Regular user sees |
|---|---|---|
| Add Car | ✅ `/dashboard/admin/add-car` | ❌ No |
| Manage Cars (full CRUD) | ✅ `/dashboard/admin/manage-cars` | ❌ No |
| Manage Rentals | ✅ `/dashboard/admin/manage-rentals` — bookings on THEIR cars only | ❌ No |
| Stats (charts via Recharts) | ✅ `/dashboard/admin/analytics` — car/revenue stats | ✅ `/dashboard/user/stats` — trips taken, total spent |
| Booking History | ❌ Not here (their bookings live in Manage Rentals) | ✅ `/dashboard/user/booking-history` — READ-ONLY, grouped/filterable by status |
| Cancel a booking | N/A (handled inside Manage Rentals) | ✅ Only on `pending` bookings |
| Leave a Review | N/A | ✅ Only on `completed` bookings |

## Navbar Behavior
Mirrors ReSell Hub's `AppNavbar` pattern (`useSession`/`signOut` from 
`auth-client.ts`, desktop links + profile dropdown, mobile hamburger menu):
- **Logged out:** Login, Register buttons (top right)
- **Logged in:** Dashboard, Logout buttons (top right); Dashboard link 
  points to plain `/dashboard` (which redirects to the correct role route)

## Global UI & Design Rules
- Theme: metallic/glassmorphism throughout (see Design Language section above) 
  — no HeroUI or other component library, all components hand-rolled in Tailwind
- No placeholder/dummy/lorem ipsum content anywhere — everything must look real
- Max 3 primary colors + 1 optional neutral color (metallic silver/gray/chrome 
  tones count as the neutral)
- All cards: same size, border-radius, layout — strict visual consistency
- Fully responsive: mobile, tablet, desktop — always, no exceptions
- 4 cards per row on desktop for the car listing grid
- Skeleton loaders while data is loading (mirrors ReSell Hub's 
  `ProductCardSkeleton` pattern — build a `CarCardSkeleton` equivalent)
- Filters on `/cars`: minimum 2 fields (category, price, transmission, fuel type)
- Protected routes (`/dashboard/*`, booking actions) redirect unauthenticated 
  users to `/login`
- No fetch calls inside page components — GET requests via `src/lib/api/`, 
  mutations (POST/PATCH/DELETE) via `src/lib/actions/`, both attaching 
  `getAuthToken()` Bearer headers for private Express endpoints (mirrors 
  ReSell Hub's `products.ts`/`orders.ts`/etc. exactly)
- Demo login button required on `/login` (auto-fills test credentials)
- Date picker on `/cars/[id]` must visually disable/grey out already-booked 
  dates for that specific car
- Image upload flow (Add Car / Manage Cars edit form): file is uploaded 
  directly to imgbb's API from the frontend, imgbb returns a hosted image 
  URL, and ONLY that URL is sent to the Express backend/saved to MongoDB — 
  do not build any local file storage or image-upload handling server-side
- Toast notifications (react-toastify) for all success/error states on 
  mutations, mirrors ReSell Hub throughout

## Home Page Requirements
- Navbar: full-width, sticky/fixed, responsive, min 3 routes logged out / 
  min 5 routes logged in
- Hero: 60-70% viewport height, interactive element (slider/animation/CTA) — 
  Framer Motion entrance animations + animated stat counters, mirrors 
  ReSell Hub's `HeroSection`
- Minimum 7 meaningful sections (e.g. Featured Cars, How It Works, Categories, 
  Why Choose Us, Stats, Testimonials, FAQ, CTA) — structurally mirrors 
  ReSell Hub's `FeaturedProducts`, `PopularCategories`, `MarketplaceStats`, 
  `TrustedSellers`/testimonials sections, reskinned for cars
- Footer: fully functional, working links only, contact info + social links 
  (mirrors ReSell Hub's `Footer`)

## Sample Car Catalog (for seeding realistic data — 16 cars minimum)
Categories to cover: Sedan, SUV, Hatchback, Luxury, Van. Include variety in 
price (৳1,800–9,000/day range), transmission (Automatic/Manual), and fuel 
type (Petrol/Diesel/Electric/Hybrid) so filters have something real to filter.
Use ৳ consistently everywhere prices are displayed — do not mix in `$`.

## Build Order (sequenced by risk — hardest logic first)
1. Schema + booking overlap-check logic (Critical Logic #1) — build and test 
   this in isolation before anything depends on it
2. BetterAuth setup (email/password + Google OAuth, pinned 1.6.11, JWT 
   plugin + auth-client bridge)
3. Car CRUD (Add Car, Manage Cars)
4. Listing page (`/cars` — search, filter, sort, pagination)
5. Details page + booking widget (date picker, price calc, overlap check, confirm)
6. Stripe integration (test mode, one-time payment on booking confirm)
7. Dashboard: Manage Rentals (status lifecycle + action matrix)
8. Dashboard: user Booking History (read-only) + Stats (both roles)
9. Home page (7 sections)
10. About / Contact pages

## Explicitly IN Scope (required, build these)
- Real date-range booking with overlap prevention
- Price auto-calculation based on date range
- Full booking status lifecycle (pending → active → completed, or cancelled)
- User's own booking history (view/cancel on pending only)
- Admin's car listing management (full CRUD)
- Admin's rental management (edit/cancel/delete per status matrix)
- Stripe payment (test mode) on booking confirmation
- Google OAuth login alongside email/password

## Explicitly OUT of Scope / Stretch Goals (LOWEST PRIORITY)
Only build these if steps 1-10 above are fully complete, tested, and working, 
with real time remaining before the deadline:
- Refund messaging/logic on cancellation (cosmetic only — no real refund 
  needed since Stripe is test mode)
- Admin dashboard beyond "manage own cars" (i.e. NOT a platform-wide 
  view of all users/all cars/all bookings — stay scoped to the logged-in 
  admin's own cars only)
- Email/SMS notifications on booking confirm/cancel
- Any calendar UI beyond a simple date-range picker with disabled dates
- Wishlist / saved cars (not part of Drift's spec, unlike ReSell Hub)

## Developer Context (for the AI agent's awareness)
- Developer is a CS student (AIUB, 8th semester) building this under a 
  ~2-day deadline alongside midterm exams — prioritize working, demoable 
  features over exhaustive polish
- Developer does NOT know TypeScript deeply yet — this project is a deliberate 
  stretch since the assignment mandates it; explain TS-specific syntax/concepts 
  briefly when introducing them, don't assume prior TS fluency
- **Resolved:** Drift reuses the developer's ReSell Hub architecture and 
  patterns wholesale — Express + JWT-bridged BetterAuth, native MongoDB 
  driver with non-SRV Atlas connection string (ISP blocks SRV DNS lookups), 
  hand-rolled Tailwind components in the metallic/glassmorphism theme (no 
  HeroUI on this project), Framer Motion, Gravity UI icons, react-toastify, 
  per-role dashboard route 
  trees with sidebars/layouts/`useRoleGuard`, optimistic-update-with-revert 
  patterns, desktop-table + mobile-card dual layouts for all data lists, 
  and a Vercel-serverless Express backend (not Render). The only deliberate 
  difference from ReSell Hub is the language: Drift is TypeScript throughout 
  (frontend AND backend), ReSell Hub was JS-only.
- Always ask before assuming — if a requirement in this file is ambiguous, 
  ask a clarifying question rather than guessing and building the wrong thing

## IMPORTANT — Before Final Submission
Remove or .gitignore this file (and any other AI-agent config files) before 
pushing the final repo for grading — these are build-time tools, not part 
of the deliverable, and can look unprofessional to evaluators/recruiters if 
left visible in the repo.
