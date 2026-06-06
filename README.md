# Rent Mojo

Rent Mojo is a responsive rental marketplace for furniture and appliances. It is designed for students and working professionals who want flexible monthly rentals instead of high upfront purchases.

## Features

- Browse furniture and appliance catalog items
- Compare monthly rent, security deposit, and tenure options
- Add items to a cart and schedule delivery
- Track active rentals and pickup timelines
- Submit maintenance support requests
- Review an admin dashboard with inventory, claims, and service areas

## Tech Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS v4
- PostgreSQL + Prisma ORM
- JWT auth (jose) + bcrypt password hashing

## SaaS Capabilities

- Multi-tenant architecture using tenant + membership boundaries
- Role-based access (`ADMIN`, `VENDOR`, `CUSTOMER`)
- Tenant-aware catalog, ordering, rentals, and support workflows
- Admin analytics endpoints for MRR, utilization, claims, and ticket load

## Run Locally

```bash
npm install
npm run prisma:generate
npm run db:push
npm run db:seed
npm run dev
```

Open the app at `http://localhost:3000`.

Create your environment file first:

```bash
cp .env.example .env
```

Set `DATABASE_URL` and `JWT_SECRET` in `.env`.

## Build

```bash
npm run build
```

## API Quick Reference

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/catalog/products`
- `POST /api/orders`
- `GET /api/rentals`
- `GET /api/support/tickets`
- `POST /api/support/tickets`
- `GET /api/admin/overview`
- `GET /api/admin/products`
- `POST /api/admin/products`

## Notes

- The frontend currently uses local state for demo UX, while backend APIs are production-oriented.
- The layout is responsive and optimized for desktop and mobile viewing.
- See `docs/PRD.md` and `docs/ARCHITECTURE.md` for product and technical documentation.