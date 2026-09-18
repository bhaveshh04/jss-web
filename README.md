# JSS Innovative Solutions — Website + Employee Portal

A single Next.js application that serves both:

1. **The public marketing website** — Home, About, Services, Portfolio,
   Contact, Careers.
2. **The Employee Portal** (`/portal`, behind `/login`) — a real, database-backed
   attendance and task-management system with two roles: **Owner** and
   **Employee**.

Everything runs from one codebase and deploys as one app.

---

## Tech stack

| Layer      | Choice |
|------------|--------|
| Framework  | Next.js 16 (App Router) + React 19 |
| Styling    | Tailwind CSS v4 |
| Database   | PostgreSQL, via **Prisma ORM** |
| Auth       | Signed JWT session cookie (httpOnly), password hashing with **bcrypt** |
| Charts     | Recharts |
| Email      | Nodemailer (any SMTP provider) — optional, best-effort |

No plaintext passwords are ever stored or returned by any API — everything
goes through `bcryptjs`, and `passwordHash` is stripped before a user object
is ever sent to the browser (`lib/auth.ts` → `toSafeUser`).

---

## 1. Prerequisites

- Node.js 20+
- A PostgreSQL database. Any of these work well and have a generous free tier:
  - [Neon](https://neon.tech)
  - [Supabase](https://supabase.com) (Database → Connection string)
  - [Railway](https://railway.app)
  - A self-hosted Postgres instance

---

## 2. Local setup

```bash
npm install
cp .env.example .env
```

Edit `.env`:

```bash
DATABASE_URL="postgresql://user:password@host:5432/jss_erp?schema=public"
JWT_SECRET="<a long random string — e.g. `openssl rand -base64 48`>"

OWNER_NAME="Your Name"
OWNER_EMAIL="owner@yourcompany.in"
OWNER_PASSWORD="a-strong-first-password"

OFFICE_LAT="18.5793"      # used only as the seed default — editable later
OFFICE_LNG="73.8143"      # from the Owner's Settings → Office location page
OFFICE_RADIUS_METERS="200"

# Optional — contact-form email notifications. Leave blank to skip emails
# (the form still saves to the database either way).
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM="JSS Innovative Solutions <no-reply@yourcompany.in>"
CONTACT_NOTIFY_TO="sales@yourcompany.in"

NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

Push the schema to your database and seed the first Owner account:

```bash
npx prisma db push      # creates all tables from prisma/schema.prisma
npm run db:seed         # creates the Owner account, default office settings,
                         # and the default website content (hero, services, etc.)
```

> `npm install` also runs `prisma generate` automatically (via the
> `postinstall` script) to generate the typed Prisma Client — this requires
> normal internet access to download Prisma's query engine, so run it on a
> machine/CI with unrestricted network access, not behind a strict firewall.

Run the dev server:

```bash
npm run dev
```

- Public site: `http://localhost:3000`
- Login: `http://localhost:3000/login` — sign in with the `OWNER_EMAIL` /
  `OWNER_PASSWORD` you set above.

For production-grade schema changes going forward, prefer migrations over
`db push`:

```bash
npx prisma migrate dev --name init
```

---

## 3. Project structure

```
app/
  (marketing)/          Public site — shares Navbar/Footer via its layout
    page.tsx            Home
    about/  services/  portfolio/  contact/  careers/
  login/                 Standalone login screen
  portal/                Employee Portal — protected by middleware.ts
    page.tsx             Dashboard (role-aware)
    employees/           Owner: manage employees
    employees/[id]/      Owner: one employee's attendance/tasks/leave history
    tasks/                Task list (owner: assign+manage; employee: update status)
    leaves/               Leave requests (owner: approve/reject; employee: request)
    attendance/           Clock in/out (employee) or browse+export (owner)
    settings/             Change own password
    settings/office/      Owner: office GPS + geofence radius
  api/                    All backend logic — every route re-checks auth+role
components/
  marketing/             Navbar, Footer, ContactForm, CareersApplyForm
  portal/                Sidebar shell, dashboard, all portal screens
  ui/                    Shared marketing UI primitives
lib/
  prisma.ts              Prisma Client singleton
  jwt.ts                 Edge-safe session signing/verification (used by middleware)
  auth.ts                Password hashing + session reading (Node-only, server-only)
  geo.ts                 Haversine distance for the geofence check
  site-content.ts        All public-site copy in one place
  activity.ts / mailer.ts / date.ts / types.ts
middleware.ts            Blocks unauthenticated access to /portal/* at the edge
prisma/
  schema.prisma          Full data model
  seed.ts                Creates the first Owner account, default office settings,
                        and the default website content rows
```

---

## 4. How auth & the geofence actually work

- **Sessions**: on login, the server signs a JWT (HS256, `jose`) containing
  `{ sub, role, name, email }` and sets it as an httpOnly, `SameSite=Lax`
  cookie. `middleware.ts` verifies that JWT on every request to `/portal/*`
  and redirects to `/login` if it's missing or invalid — this runs on the
  server/edge, so it can't be bypassed by hiding a button in the UI.
- **Role checks**: every API route calls `getCurrentUser()` (which re-reads
  the user from the database, not just the JWT, so a deactivated account is
  locked out immediately) and explicitly checks `role === "OWNER"` where
  needed. The middleware also blocks a few owner-only page paths outright.
- **Geofenced clock-in**: the employee's browser calls the Geolocation API to
  get `{ lat, lng }`, which is sent to `POST /api/attendance/clock-in`. The
  server computes the great-circle distance to `OfficeSettings` (stored in
  the database, editable from **Settings → Office location**) and rejects
  the request if it's outside `radiusMeters`. The radius and coordinates are
  never hardcoded in application code.

---

## 5. Deploying to production

### Database
Provision a Postgres database on Neon/Supabase/Railway and copy its
connection string.

### Vercel
1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add the same environment variables from `.env` in **Project → Settings →
   Environment Variables** (use your production `DATABASE_URL`, a fresh
   `JWT_SECRET`, real SMTP credentials, and your real `NEXT_PUBLIC_SITE_URL`).
4. Deploy. Vercel runs `npm install` (which runs `prisma generate`) and
   `npm run build` automatically.
5. Run the schema push/seed **once**, pointed at the production database,
   from your local machine:
   ```bash
   DATABASE_URL="<production-url>" npx prisma db push
   DATABASE_URL="<production-url>" OWNER_EMAIL=... OWNER_PASSWORD=... npm run db:seed
   ```

### Any other Node host
The app is a standard Next.js app — `npm run build` then `npm run start`
works anywhere that runs Node 20+, as long as `DATABASE_URL` and `JWT_SECRET`
are set in the environment.

---

## 6. First-login checklist for the Owner

1. Sign in at `/login` with the seeded `OWNER_EMAIL` / `OWNER_PASSWORD`.
2. Go to **Settings → Change password** and set a real password.
3. Go to **Settings → Office location** and set the real office GPS
   coordinates (use "Use my current location" while standing at the office)
   and the geofence radius.
4. Go to **Employees → Add employee** to create accounts — a temporary
   password is generated and shown once; hand it to the employee and ask
   them to change it from their own Settings page after first login.
5. Go to **Website content** to edit every piece of public-site copy —
   hero headline, stats, services, values, why-choose-us, industries,
   portfolio case studies, and careers listings — without touching code.
   Changes go live immediately (the public pages read fresh from the
   database on every request, no rebuild or redeploy needed).

---

## 6a. Editing the public website from the portal

The **Website content** section (Owner only) at `/portal/website` covers
every editable piece of marketing copy in one place:

- Company & contact details (name, tagline, phone, email, address, socials)
- Homepage hero (headline, subheadline, CTA button text, the stats banner)
- About page (who-we-are copy, vision, mission, leadership bio)
- Products & Solutions (the nav dropdown items and Services-page cards)
- Core services grid, Core values, Why choose us, Industries served
- Portfolio / case studies
- Careers / open positions (also feeds the position dropdown on the
  application form)
- The detailed module breakdown on the Services page

Under the hood, all of this lives in one `SiteContent` table — one row per
section, storing structured JSON validated against a zod schema (see
`lib/site-sections.ts`). That file is also the single place to add a new
editable section in the future: add a schema, a default, and an entry in
`SECTION_KEYS`, and both the admin UI and public pages pick it up. Every
public marketing page fetches its content directly from the database on
each request — there's no cache to bust and no rebuild step after an edit.


---

## 7. Notes & honest caveats

- **SEO**: every marketing page has per-page metadata; `/sitemap.xml` and
  `/robots.txt` are generated automatically and exclude `/portal`, `/login`
  and `/api`.
- **Email**: the contact form and job-application form always save to the
  database regardless of SMTP configuration. Email notification is
  best-effort on top — if `SMTP_*` env vars are missing, the app simply
  skips sending and logs nothing broken.
- **CSV export**: `Settings → Attendance → Export CSV` (Owner) streams a CSV
  with per-day clock-in/out times and computed hours for any date range —
  ready to hand to payroll.
- This project was built and reviewed without a live Postgres connection
  available in the build environment, so while every route, schema
  relationship and query was written and reviewed carefully by hand, you
  should still run through the first-login checklist above end-to-end after
  your first deploy to confirm everything behaves as expected in your
  environment.
