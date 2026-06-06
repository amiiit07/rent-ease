# RentEase SaaS Architecture

## Stack
- Frontend: Next.js App Router + React + Tailwind
- API: Next.js Route Handlers (REST)
- DB: PostgreSQL via Prisma ORM
- Auth: JWT (jose) + bcrypt password hashing

## Multi-Tenant Model
- `Tenant` is top-level boundary.
- `Membership` assigns users to tenants with role (`ADMIN`, `VENDOR`, `CUSTOMER`).
- All business entities (`Product`, `Order`, `Rental`, `MaintenanceTicket`, `DamageClaim`) are tenant-scoped.

## Core Domain
- Catalog: `Product`, `Inventory`, `ServiceArea`
- Commerce: `Order`, `OrderItem`
- Rental Ops: `Rental`, `MaintenanceTicket`, `DamageClaim`

## API Surface
- Public
  - `GET /api/health`
  - `GET /api/catalog/products`
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- Authenticated
  - `POST /api/orders`
  - `GET /api/rentals`
  - `GET /api/support/tickets`
  - `POST /api/support/tickets`
- Admin/Vendor
  - `GET /api/admin/overview`
  - `GET /api/admin/products`
  - `POST /api/admin/products`

## Security
- Passwords are salted/hashed using bcrypt.
- Bearer JWT includes `sub`, `tenantId`, `role`.
- Role checks enforced at route level.
- Tenant isolation is enforced in all route queries.

## Operational Notes
- Use Prisma transactions for order placement and inventory reservation.
- Seed command provisions tenant, service areas, demo users, products, and inventory.
- Designed for SaaS deployment on Vercel + managed Postgres.
