# Taxi Booking App

A full-stack ride-booking platform built with React, TypeScript, Tailwind CSS, and Node.js with Express.

## Features

- 🗺️ **Location-based Ride Search** - Integrated with Mapbox for real-time location services
- 💳 **Secure Payments** - Stripe integration for safe online transactions
- 👥 **Dual User Roles** - Driver and Passenger accounts with role-specific features
- 🔐 **Authentication** - JWT-based secure user authentication
- 📱 **Responsive Design** - Optimized for all devices using Tailwind CSS
- 📊 **Ride History** - Complete ride management and history tracking
- 🚗 **Real-time Updates** - Live ride status and driver tracking

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Mapbox GL JS for maps
- Axios for API calls
- React Router for navigation

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Stripe for payments
- Bcrypt for password hashing

## Quick Start

1. **Clone and Install Dependencies**
   ```bash
   npm run install:all
   ```

2. **Environment Setup**
   - Copy `.env.example` files in both `backend` and `frontend` directories
   - Add your API keys for Mapbox, Stripe, and MongoDB

3. **Start Development**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taxi-booking
JWT_SECRET=your-super-secret-jwt-key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_MAPBOX_TOKEN=pk.your_mapbox_token
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## Project Structure

```
taxi-booking-app/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth & validation middleware
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   └── utils/           # Helper utilities
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API services
│   │   └── types/           # TypeScript types
└── shared/                  # Shared types and utilities
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/rides` - Get user rides
- `POST /api/rides` - Create new ride
- `PUT /api/rides/:id` - Update ride status
- `POST /api/payments/create-intent` - Create Stripe payment intent

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.