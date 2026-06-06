# RentEase PRD

## Problem
Students and working professionals relocate frequently and avoid buying furniture and appliances because of high upfront costs, maintenance burden, and relocation complexity.

## Product Goal
Build a monthly subscription rental SaaS for furniture and appliances that supports flexible tenure plans, delivery/pickup scheduling, and operations visibility for vendors/admins.

## Personas
- Renter (customer): needs quick setup and low monthly commitment.
- Vendor operations: manages inventory, schedules, and service requests.
- Platform admin: controls users, disputes, and expansion.

## In Scope
- Responsive web app
- Product catalog
- Monthly rentals with tenure options
- Delivery scheduling
- Active rental management
- Maintenance ticketing
- Admin/vendor operations dashboard

## Out of Scope
- Native mobile apps
- Cross-border rentals
- AI dynamic pricing
- Second-hand marketplace

## Functional Requirements
- User auth: register/login
- Catalog browsing by category and city
- Product details: monthly rent, deposit, tenure options
- Order creation with delivery address/date
- Rental lifecycle tracking
- Maintenance ticket submission and monitoring
- Admin endpoints for product management and KPI overview

## Non-Functional Requirements
- Page load target: under 3s on key pages
- Secure auth token handling and password hashing
- Inventory consistency through transaction-based reservation
- Multi-tenant schema for city/vendor expansion

## KPIs
- Active rentals
- MRR
- Product utilization rate
- Ticket resolution SLA
- Open claims
