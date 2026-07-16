# Drift

A used car marketplace built for Dhaka — list your car for sale, browse listings from other sellers, and connect directly. No middleman, no in-app payments, no waiting on approvals.

**Tagline:** Drive further, worry less.

## Overview

Drift lets any logged-in user list a car for sale and manage their own listings. Buyers browse the catalog, search, filter, and sort, then contact sellers directly using the contact info on each listing — the same way classifieds like Craigslist or AutoTrader work.

This repo is the **frontend** (Next.js). The backend lives in a separate repo: [drift-server](#) *(add your actual server repo link here)*.

## Features

- Email/password authentication (BetterAuth)
- Browse cars — search, filter (category, transmission), sort, pagination
- Car details page — gallery, specs, seller contact info, reviews, related cars
- List a car for sale (protected route, image upload via imgbb)
- Manage your own listings — view and delete
- Leave and read reviews on any car
- Fully responsive, dark metallic UI theme

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **Auth:** BetterAuth (email/password)
- **Backend:** Node.js + Express (separate repo)
- **Database:** MongoDB Atlas
- **Image hosting:** imgbb

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster
- An imgbb API key
- The [drift-server](#) backend running/deployed

### Installation

```bash
git clone <this-repo-url>
cd drift
npm install --legacy-peer-deps
```

### Environment Variables

Create a `.env.local` file in the root:

```dotenv
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=drift

BETTER_AUTH_SECRET=your_secret_here
BETTER_AUTH_URL=http://localhost:3000

NEXT_PUBLIC_BASE_URL=https://your-drift-server-url.vercel.app
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

### Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, Register — no navbar/footer
│   ├── (main)/          # Public + protected pages — wrapped in Navbar/Footer
│   │   ├── cars/        # Explore, [id] details, add, manage
│   │   ├── about/
│   │   └── contact/
│   └── layout.tsx       # Root layout — fonts, metadata only
├── components/          # Navbar, Footer, CarCard, ImageUpload, etc.
├── lib/
│   ├── api/              # GET requests to drift-server
│   ├── actions/           # POST/DELETE requests to drift-server
│   ├── auth.ts
│   └── auth-client.ts
└── types/                # Shared TypeScript types (Car, Review)
```

## Deployment

Deployed on Vercel. Set the environment variables above in your Vercel project settings, matching the deployed drift-server URL for `NEXT_PUBLIC_BASE_URL`.

## License

Built as an academic project.
