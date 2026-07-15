# Project: Drift — Used Car Marketplace (Full Stack, TypeScript)

## Overview
Drift is a full-stack used car **marketplace/listing** platform. Users browse
cars for sale, view details, and — once logged in — can list their own car
for sale and manage (view/delete) the listings they've added. This is a
student assignment with a hard deadline. Build exactly what the spec below
asks for — nothing more. No booking system, no in-app payments, no
admin/user role split, no dashboard.

There is no in-app purchase flow. A buyer sees the price and contact info on
a listing and reaches out to the seller directly to arrange the sale —
same pattern as Craigslist or AutoTrader. Drift's job ends at "connect buyer
and seller," not at "process the transaction."

Tagline: "Drive further, worry less."

## Architecture — TWO SEPARATE REPOS (important — read before building anything)
This is NOT a single Next.js project doing everything. There are two 
repositories, matching the developer's proven pattern from prior projects 
(ReSell Hub, HireLoop, DocAppoint):

- **`drift-client`** — Next.js 16 (App Router, TypeScript, Tailwind). 
  Handles ALL frontend pages, auth (BetterAuth), and UI. Does NOT talk to 
  MongoDB directly. `src/lib/actions/` and `src/lib/api/` contain functions 
  that `fetch()` the deployed Express server's URL — never a local Next.js 
  API route for Car/Review data.
- **`drift-server`** — Node.js + Express + TypeScript, separate repo, 
  separate deployment. Owns ALL MongoDB read/write logic for Car and Review 
  data (the actual `db.collection("cars").insertOne(...)` etc. calls live 
  here, not in the Next.js project). Exposes REST endpoints like 
  `POST /api/cars`, `GET /api/cars`, `DELETE /api/cars/:id`, etc.

**Where things live, concretely:**
- Car/Review MongoDB schemas/types → `drift-server` (not `drift-client`)
- Car/Review CRUD route handlers → `drift-server`'s Express routes
- `drift-client`'s `src/lib/actions/cars.ts` (etc.) → just `fetch()` calls 
  to `drift-server`'s deployed URL, nothing else
- BetterAuth itself → lives in `drift-client` only (this stays a Next.js 
  concern, not Express) — but `drift-server` needs a way to verify a request 
  is from a logged-in user (see Auth note below)

**Auth note for drift-server:** since BetterAuth sessions live in 
`drift-client`, `drift-server` needs some way to know who's making a 
request (e.g. for `createdBy` on Add Car, or for checking a Delete request 
belongs to the right user). Simplest approach for this deadline: 
`drift-client` fetches the current session/user id via BetterAuth 
client-side, then sends that user id in the request body/headers to 
`drift-server`. `drift-server` trusts it for now (no token verification) — 
this is a deliberate scope-reduction for time, not a "correct" production 
pattern, but acceptable for a graded student assignment with this deadline.

## Tech Stack
**drift-client:**
- Next.js 16 (App Router), React, TypeScript (mandatory)
- Styling: Tailwind CSS
- Charts: Recharts (only if a stats-style section is used — not required)
- Auth: BetterAuth v1.6.23, `--legacy-peer-deps`. No role/admin split. 
  Google OAuth is OPTIONAL per spec.
- Image hosting: imgbb — frontend uploads image, gets back a URL, only that 
  URL string is stored (no binary file handling anywhere)

**drift-server:**
- Node.js + Express + TypeScript
- Database: MongoDB (non-SRV connection string)
- Deployed separately from drift-client (own repo, own deployment)

## Core Concept — ONE role, no admin/user split
There is no "admin" or "host" role. Any logged-in user can:
- List a car for sale (`/cars/add`)
- View and delete the listings they personally added (`/cars/manage`)
That's the entire authenticated feature set. No bookings, no reservations, 
no in-app payments, no dashboard, no rental-status lifecycle.

## Routes (drift-client pages)
| Page | Route | Access |
|---|---|---|
| Home | `/` | Public |
| Explore/Listing | `/cars` | Public |
| Car Details | `/cars/[id]` | Public |
| Login | `/login` | Public |
| Register | `/register` | Public |
| Add Car | `/cars/add` | Protected — redirect to `/login` if not logged in |
| Manage Cars | `/cars/manage` | Protected — redirect to `/login` if not logged in |
| About | `/about` | Public |
| Contact | `/contact` | Public |

Naming rule: use "Car" in all user-facing labels, buttons, and routes — 
never generic "Item" (e.g. "Add Car" not "Add Item", `/cars/add` not 
`/items/add`).

## Data Schema (lives in drift-server)

```
User {
  name, email, password (hashed via BetterAuth, lives in drift-client's DB 
  collections managed by BetterAuth itself)
  // no "role" field — every user has identical permissions
}

Car {
  title, shortDescription, fullDescription, 
  price (asking price, in BDT ৳ — NOT per-day, this is a sale listing), 
  category, seats, transmission, fuelType, location,
  image (single imgbb URL string),
  contactInfo (seller's phone or email — how a buyer reaches them),
  createdBy (User id string), createdAt
}

Review {
  carId, userId, userName, rating, comment, createdAt
}
```

## Global UI & Design Rules
- No placeholder/dummy/lorem ipsum content anywhere
- Max 3 primary colors + 1 optional neutral color
- All cards: same size, border-radius, layout — strict visual consistency
- Fully responsive: mobile, tablet, desktop
- 4 cards per row on desktop for the car listing grid
- Skeleton loader while data is loading
- Filters on `/cars`: minimum 2 fields (category, price, transmission, fuel type)
- Protected routes (`/cars/add`, `/cars/manage`) redirect unauthenticated 
  users to `/login`
- No fetch calls inside page components — GET via `src/lib/api/`, mutations 
  (POST/DELETE) via `src/lib/actions/` — both of these call drift-server's 
  deployed URL, never a local Next.js API route for Car/Review data
- All buttons and links must be clickable — no dead links anywhere

## Home Page Requirements
- Navbar: full-width, sticky/fixed, responsive, min 3 routes logged out / 
  min 5 routes logged in (already built — 4 logged out, 6 logged in)
- Hero: 60-70% viewport height, interactive element (slider/animation/CTA), 
  clear visual flow into the next section
- Minimum 7 meaningful sections (e.g. Featured Cars, How It Works, Categories, 
  Why Choose Us, Stats, Testimonials, FAQ, CTA)
- Footer: fully functional, working links only, contact info + social links 
  (already built)

## Add Car Page (`/cars/add`) — full field list
Must include every field the Car schema requires (not just the spec's 
minimal example list), or `/cars` filters will break on missing data:
title, shortDescription, fullDescription, price, category (dropdown), 
seats, transmission (dropdown), fuelType (dropdown), location, contactInfo, 
optional image (imgbb upload). Single Submit button.

## Manage Cars Page (`/cars/manage`) — exact scope per spec
- Table/grid listing all cars the logged-in user has listed
- Actions per row: **View, Delete** only — no Edit button
- Clean, readable, responsive layout

## Details Page (`/cars/[id]`) — exact sections per spec
- Publicly accessible, no login required
- Multiple images or media (use 2-3 stock images per seeded car)
- Description / Overview section
- Key information / Specifications section (seats, transmission, fuel type, 
  location, and contact info for the seller)
- Reviews / Ratings section (list seeded reviews for this car)
- Related items section (e.g. same category)

## Sample Car Catalog (for seeding — 16 cars minimum, seeded into drift-server's DB)
Categories to cover: Sedan, SUV, Hatchback, Luxury, Van. Include variety in 
price (৳1,800–9,000 asking price range), transmission (Automatic/Manual), 
and fuel type (Petrol/Diesel/Electric/Hybrid). Include a realistic 
`contactInfo` value per seeded listing (fake but plausible phone/email).

## Build Order
1. drift-client: project setup (Next.js + TS + Tailwind)
2. drift-server: project setup (Express + TS + MongoDB connection)
3. drift-client: BetterAuth setup (email/password)
4. drift-server: Car/Review schemas + CRUD routes
5. drift-client: Add Car page + action function calling drift-server
6. drift-client: Manage Cars page (view/delete) + action functions
7. drift-client: Listing page (`/cars` — search, filter, sort, pagination)
8. drift-client: Details page (images, description, specs, contact info, 
   reviews, related cars)
9. drift-client: Home page (7 sections)
10. drift-client: About / Contact pages
11. Polish & responsive QA
12. Deploy both repos (Vercel for client, Vercel/Render for server)

## Explicitly OUT of Scope — do NOT build these
- Booking/reservation system (date picker, overlap-checking, price-per-day 
  calculation tied to a rental period)
- In-app purchase/checkout flow, Stripe or any payment integration
- Admin vs. user role split — there is only one type of logged-in user
- A "dashboard" of any kind — just the two plain pages, `/cars/add` and 
  `/cars/manage`
- Rental/booking status lifecycle (pending/active/completed/cancelled)
- Edit action on Manage Cars (View + Delete only)
- Real JWT token verification between drift-client and drift-server (see 
  Auth note above — trusting the passed user id is an acceptable 
  scope-reduction for this deadline)
- Google OAuth as a requirement (optional only, skip unless time allows)
- Stats/analytics dashboards

## Developer Context (for the AI agent's awareness)
- Developer is a CS student (AIUB, 8th semester) building this under a tight 
  deadline alongside midterm exams — prioritize working, spec-accurate 
  features over any extra polish or scope
- Developer often works across multiple separate AI chat sessions/accounts 
  due to usage limits — ALWAYS read this file and TASKS.md fully before 
  building anything, and flag any inconsistency between what's asked and 
  what's already been decided here, rather than silently building something 
  different
- If a requirement in this file is ambiguous, ask a clarifying question 
  rather than guessing and building unrequested scope
- Naming must stay consistent: "Car," never generic "Item," across UI text, 
  routes, and variable/function names

## IMPORTANT — Before Final Submission
Remove or .gitignore this file (and TASKS.md) from BOTH repos before 
pushing for grading — these are build-time planning tools, not part of the 
deliverable.
