# Taxi Booking App

A full-stack ride-booking platform using React, TypeScript, Tailwind CSS, Node.js, Express, TypeORM, SQLite, Mapbox, and Stripe.

## Features
- Responsive frontend with location-based ride search (Mapbox)
- Secure online payments (Stripe)
- RESTful APIs for authentication, ride creation, driver/passenger roles, and ride history
- Clean architecture and reusable components

## Getting Started

### Backend
```bash
cd backend
cp .env.example .env # or edit .env with your secrets
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Configuration
- Set your Stripe and JWT secrets in `backend/.env`.
- Mapbox integration requires a public token (to be added in the frontend code).

---

This project is a minimal, modern full-stack taxi booking starter. Expand as needed!
