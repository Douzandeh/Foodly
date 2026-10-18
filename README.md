# 🍽️ Foodly

> A modern food delivery and takeout front-end built with **Next.js (App Router)** and **React**: browse the menu, filter recipes by difficulty and cooking time, and explore full dish details with ingredients and step-by-step instructions.

![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.3-61dafb?logo=react&logoColor=white)
![CSS Modules](https://img.shields.io/badge/Styling-CSS%20Modules-53c60b)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Routes](#routes)
- [Data Model](#data-model)
- [Rendering & Caching Strategy](#rendering--caching-strategy)
- [Deployment](#deployment)
- [Known Issues & Roadmap](#known-issues--roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Overview

Foodly is a multi-page food ordering interface. It consumes a REST API (a hosted instance on Vercel, or a local [`json-server`](https://github.com/typicode/json-server) instance backed by `db.json`) and renders a landing page, a browsable menu, a filterable category search, and rich dish detail pages.

The project demonstrates:

- Next.js **App Router** with Server Components for data fetching
- **Static generation + ISR** for detail pages
- **URL-driven state** (search params) for shareable, bookmarkable filters
- Component-scoped styling with **CSS Modules**
- Responsive layouts for desktop, tablet and mobile

## Features

- **Landing page**: hero banner, value propositions, company story, partner logos, ordering guide and policy section.
- **Menu**: card grid of all available dishes with cuisine, price and discount badge.
- **Categories**: filter dishes by **difficulty** (Easy / Medium / Hard) and **cooking time** (under or over 30 minutes). Filters live in the URL (`/categories?difficulty=Easy&time=less`), so results can be shared and survive a refresh.
- **Dish details**: image, cuisine, discounted price calculation, introduction, metadata (prep time, cook time, servings…), ingredient list and numbered recipe steps with alternating row colors.
- **404 handling**: unknown or invalid dish IDs resolve to Next.js `notFound()`.
- **Responsive design**: breakpoints at `900px` and `600px`.
- **Optimized images** via `next/image`.

## Tech Stack

| Area        | Technology                                    |
| ----------- | --------------------------------------------- |
| Framework   | [Next.js 16](https://nextjs.org) (App Router) |
| UI library  | [React 19](https://react.dev)                 |
| Styling     | CSS Modules + global reset                    |
| Mock API    | [json-server](https://github.com/typicode/json-server) `1.0.0-beta` |
| Linting     | ESLint 9 + `eslint-config-next` (core-web-vitals) |
| Fonts       | Geist & Geist Mono via `next/font/google`     |

## Project Structure

```text
foodly/
├── public/
│   └── images/                 # banner.png, search.png, and one <id>.jpeg per dish
├── src/
│   ├── app/
│   │   ├── layout.js           # Root layout (fonts, global CSS, <Layout />)
│   │   ├── globals.css         # Reset + base typography
│   │   ├── page.js             # "/"            → HomePage
│   │   ├── menu/
│   │   │   ├── page.js         # "/menu"        → MenuPage
│   │   │   └── [id]/page.js    # "/menu/:id"    → DetailsPage (SSG + ISR)
│   │   └── categories/         # "/categories"  → CategoriesPage (filters)
│   └── components/
│       ├── layout/             # Header, footer and page shell
│       ├── template/           # Page-level components (Home, Menu, Details, Categories)
│       ├── modules/            # Reusable blocks (Card, Banner, Attributes, Guide…)
│       └── icons/              # SVG icon components
├── db.json                     # Local mock database (served by json-server)
├── eslint.config.mjs
├── jsconfig.json               # "@/*" → "./src/*" path alias
├── next.config.mjs
└── package.json
```

**Architecture note:** `app/` contains only thin route files that fetch data on the server and delegate rendering to components in `components/template/`. Templates compose smaller, reusable `modules/`. This keeps routing, data access and presentation clearly separated.

## Getting Started

### Prerequisites

- **Node.js ≥ 22.12** (required by `json-server` 1.0 beta; Next.js itself needs ≥ 20.9)
- **npm** (or yarn / pnpm / bun)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Douzandeh/Foodly.git
cd Foodly

# 2. Install dependencies
npm install

# 3. Create your environment file (see the section below)
cp .env .env.local   # or create it manually

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Using the local mock API

By default the app can point to the hosted API. To work fully offline, run the bundled mock server instead:

```bash
# Terminal 1: serve db.json on http://localhost:4000
npm run serve-json

# Terminal 2: point the app at it, then start Next.js
# .env.local → BASE_URL=http://localhost:4000/
npm run dev
```

`db.json` exposes a single collection, so the endpoints are:

| Endpoint            | Description        |
| ------------------- | ------------------ |
| `GET /data`         | List all dishes    |
| `GET /data/:id`     | Get a single dish  |

## Environment Variables

| Variable     | Required | Example                              | Description                                                         |
| ------------ | :------: | ------------------------------------ | ------------------------------------------------------------------- |
| `BASE_URL`   |    ✅    | `https://api-foodly.vercel.app/`     | Base URL of the API. **Keep the trailing slash**, as the details route concatenates `data/<id>` directly onto it. |
| `REVALIDATE` |    ✅    | `3600`                               | ISR revalidation interval for dish detail pages, in seconds.        |

> ⚠️ `.gitignore` excludes `.env*`, so secrets and local overrides are never committed. Prefer `.env.local` for machine-specific values. If you add an `.env.example` for contributors, whitelist it with `!.env.example` in `.gitignore`.

## Available Scripts

| Command              | Description                                      |
| -------------------- | ------------------------------------------------ |
| `npm run dev`        | Start the Next.js development server             |
| `npm run build`      | Create an optimized production build             |
| `npm run start`      | Run the production build                         |
| `npm run lint`       | Lint the codebase with ESLint                    |
| `npm run serve-json` | Serve `db.json` as a REST API on port `4000`     |

## Routes

| Route                 | Rendering                | Description                                           |
| --------------------- | ------------------------ | ----------------------------------------------------- |
| `/`                   | Static                   | Landing page                                          |
| `/menu`               | Server-rendered          | All dishes                                            |
| `/menu/[id]`          | SSG + ISR (`revalidate`) | Dish details; returns 404 for unknown IDs             |
| `/categories`         | Server-rendered          | Filterable dish list (`?difficulty=…&time=…`)         |

**Supported query parameters on `/categories`**

| Param        | Values                     |
| ------------ | -------------------------- |
| `difficulty` | `Easy`, `Medium`, `Hard`   |
| `time`       | `less` (< 30 min), `more` (> 30 min) |

## Data Model

Each dish in `db.json` follows this shape:

```jsonc
{
  "id": 1,
  "name": "Beef Wellington",
  "price": 13,                 // base price in USD
  "discount": 10,              // percentage; 0 = no discount
  "introduction": "…",
  "details": [                 // array of single-key objects
    { "Cuisine": "British" },  // details[0] is always the cuisine
    { "Recipe Type": "Beef" },
    { "Difficulty": "Medium" },
    { "Preparation Time": "50 mins" },
    { "Cooking Time": "45 mins" },
    { "Serves": "8" }
  ],
  "ingredients": ["1.5 kg beef fillet, trimmed and tied", "…"],
  "recipe": ["Season the beef with black pepper…", "…"]
}
```

The final price is computed on the client as `price × (100 − discount) / 100`.

Dish images are resolved by convention from `public/images/<id>.jpeg`, so adding a dish requires adding a matching image file.

## Rendering & Caching Strategy

- **`generateStaticParams`** pre-renders the first **10** dish pages at build time.
- Remaining IDs are rendered on first request and then cached.
- Detail pages use `next: { revalidate: Number(REVALIDATE) }` (Incremental Static Regeneration), so content refreshes in the background at most once per `REVALIDATE` seconds.
- The categories page is a Client Component only where interactivity is required (`useRouter` / `useSearchParams`); the filter state itself is stored in the URL rather than in component state.

## Deployment

The easiest way to deploy is [Vercel](https://vercel.com/new):

1. Import the repository.
2. Add `BASE_URL` and `REVALIDATE` under **Project Settings → Environment Variables**.
3. Deploy. Every push to the main branch triggers a new build.

For self-hosting:

```bash
npm run build
npm run start
```

## Known Issues & Roadmap

Honest notes for contributors. These are good first issues:

**Data**
- [ ] Dish `#10` (*Southern fried chicken*) contains the *Cacio e pepe* cuisine, ingredients and recipe (copy/paste error in `db.json`).
- [ ] Dish `#13` (*Tacos*) and `#14` (*Som tam*) have ingredients and steps that belong to other recipes (prawn cocktail-style tacos, fish cakes).

**Code**
- [ ] Inconsistent URL building: `/menu` fetches `` `${BASE_URL}/data` `` (double slash) while `/menu/[id]` fetches `` `${BASE_URL}data/${id}` ``. Normalize with a small shared `getData()` helper.
- [ ] The discount badge on the details page reads `"{discount}$ OFF"` but `discount` is a **percentage**; it should read `"{discount}% OFF"`.
- [ ] Update default metadata (`title: "Create Next App"`) and add per-page `generateMetadata` for SEO.
- [ ] Remove the empty, unused `CarsList.module.css`.
- [ ] Add `loading.js` / `error.js` boundaries for the data-fetching routes.

**Features**
- [ ] "Add to Cart" is currently a static button, with no cart state or checkout flow yet.
- [ ] Text search and sorting on the menu.
- [ ] Unit/component tests (Jest + React Testing Library) and E2E tests (Playwright).
- [ ] Migrate to TypeScript.

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/): `git commit -m "feat: add menu search"`
4. Make sure `npm run lint` and `npm run build` pass
5. Push and open a Pull Request

## License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

## Author

**Hossein Douzandeh**
GitHub: [@Douzandeh](https://github.com/Douzandeh) · Repository: [Douzandeh/Foodly](https://github.com/Douzandeh/Foodly)
