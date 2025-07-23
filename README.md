# Taxi Booking App

A simple full-stack ride-booking platform built with React, TypeScript, Tailwind CSS, Node.js, and Express. It demonstrates a clean architecture with reusable components, Stripe payments, Mapbox maps, and role-based authentication.

## Features

* Register / login as driver or passenger (JWT)
* Drivers can create rides with origin, destination, price, seats
* Passengers can search rides, view on Mapbox map, and book rides
* Stripe PaymentIntent creation (client secret returned)
* Dashboard with ride history (as driver & passenger)
* Responsive UI using Tailwind CSS

> NOTE  This project uses **in-memory arrays** instead of a database for the sake of brevity. When the backend restarts, data is lost. Replace `db.ts` with real persistence (MongoDB, PostgreSQL, etc.) for production use.

## Prerequisites

* Node.js ≥ 18
* Yarn or npm
* Mapbox account – create an access token
* Stripe account – obtain a secret key

## Getting Started

Clone the repo (or copy the code) and then:

```bash
# Install backend deps
cd backend && npm install
# Install frontend deps
cd ../frontend && npm install
```

### Environment variables

Create a `.env` file in `backend/` based on `.env.example`:

```ini
PORT=5000
JWT_SECRET=supersecretjwtkey
STRIPE_SECRET_KEY=sk_test_your_key_here
```

For the frontend, create a `.env` **in `frontend/`** containing your Mapbox token:

```ini
VITE_MAPBOX_TOKEN=pk_your_mapbox_access_token
```

### Run in development

Open two terminals or use a process manager:

```bash
# Terminal 1 – backend
cd backend
npm run dev

# Terminal 2 – frontend
cd frontend
npm run dev
```

Visit http://localhost:3000 in your browser. The React dev-server proxies requests directly to the backend running at http://localhost:5000.

---

Enjoy building on top of this starter! Feel free to replace the temporary in-memory database with a real one, add validations, and extend Stripe integration to take actual payments.