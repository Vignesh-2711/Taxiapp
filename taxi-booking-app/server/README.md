# Taxi Booking App – Backend

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file:
   ```env
   PORT=5000
   JWT_SECRET=your_jwt_secret_here
   STRIPE_SECRET_KEY=your_stripe_secret_key_here
   ```
3. Run the server in development:
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/auth/register` – Register user
- `POST /api/auth/login` – Login user
- `GET /api/rides` – List rides
- `POST /api/rides` – Create ride (passenger)
- `POST /api/rides/:id/book` – Book ride (driver)
- `GET /api/rides/history` – Ride history (user)
- `POST /api/payment/intent` – Create Stripe payment intent

## Tech
- Node.js, Express, TypeScript, TypeORM, SQLite, Stripe