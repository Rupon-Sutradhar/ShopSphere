# ShopSphere — Backend API

> **Phase 1 Complete** | Modern full-stack e-commerce platform (MERN Stack)

---

## Overview

ShopSphere is a production-oriented e-commerce platform built with the MERN stack. This repository contains the **backend API** (Node.js + Express + MongoDB).

The project is being built incrementally across **5 phases**:

| Phase | Focus | Status |
|---|---|---|
| 1 | Project Foundation + Backend Core | ✅ **Complete** |
| 2 | Auth + Products + Categories + Admin Backend | ✅ **Complete** |
| 3 | React Frontend + UI + Product Browsing + Cart | ✅ **Complete** |
| 4 | Frontend/Backend Integration + Orders + Checkout | ⏳ Pending |
| 5 | Stripe + Webhooks + Production Security + Docker + CI/CD | ⏳ Pending |

---

## Tech Stack (Phase 1)

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js v18+ |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Config | dotenv |
| CORS | cors |
| Cookies | cookie-parser |
| Logging | morgan |
| Dev server | nodemon |

---

## Project Structure

```
shopsphere/
└── backend/
    ├── src/
    │   ├── config/
    │   │   ├── db.js          # MongoDB connection
    │   │   └── config.js      # Centralised env config
    │   ├── controllers/
    │   │   └── healthController.js
    │   ├── middleware/
    │   │   ├── errorHandler.js  # Centralised error handling
    │   │   └── notFound.js      # 404 handler
    │   ├── models/            # (empty — populated in Phase 2+)
    │   ├── routes/
    │   │   └── healthRoutes.js
    │   ├── services/          # (empty — populated in Phase 2+)
    │   ├── utils/
    │   │   └── AppError.js    # Custom operational error class
    │   ├── app.js             # Express app setup
    │   └── server.js          # Entry point + graceful shutdown
    ├── .env                   # Local env vars (gitignored)
    ├── .env.example           # Template — commit this
    ├── .gitignore
    ├── package.json
    └── README.md
```

---

## Prerequisites

- **Node.js** v18 or higher
- **MongoDB** running locally on port `27017`, or a MongoDB Atlas URI

---

## Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd shopsphere/backend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env and set your MONGODB_URI and other values
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/shopsphere
CLIENT_ORIGIN=http://localhost:5173
```

> **Never commit `.env` to version control.**

---

## Running the Server

```bash
# Development (auto-restart with nodemon)
npm run dev

# Production
npm start
```

---

## API Endpoints

### Phase 1

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/health` | API & DB health check | Public |
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/logout` | Logout user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| GET | `/api/products` | Get all products | Public |
| GET | `/api/products/:id`| Get single product | Public |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id`| Update product | Admin |
| DELETE | `/api/products/:id`| Delete product | Admin |
| GET | `/api/categories` | Get all categories | Public |
| GET | `/api/categories/:id`| Get single category | Public |
| POST | `/api/categories` | Create category | Admin |
| PUT | `/api/categories/:id`| Update category | Admin |
| DELETE | `/api/categories/:id`| Delete category | Admin |

### Example Response — `GET /api/health`

```json
{
  "success": true,
  "message": "ShopSphere API is running",
  "environment": "development",
  "timestamp": "2026-09-23T10:00:00.000Z",
  "uptime": "42s",
  "database": {
    "status": "connected"
  }
}
```

---

## Current Architecture Decisions

### Separation of Concerns
- **Routes** — URL mapping only, no logic
- **Controllers** — request/response handling
- **Services** — business logic (Phase 2+)
- **Models** — Mongoose schemas (Phase 2+)
- **Middleware** — reusable request processing
- **Config** — all env vars read in one place

### Error Handling
- Custom `AppError` class for operational errors
- Centralised `errorHandler` middleware catches everything
- Mongoose errors (CastError, duplicate key, ValidationError) handled explicitly
- Stack traces only exposed in `NODE_ENV=development`

### CORS
- Whitelist-based: only origins listed in `CLIENT_ORIGIN` are allowed
- `credentials: true` enabled for future cookie-based JWT sessions
- Pre-flight (`OPTIONS`) handled for all routes

### Graceful Shutdown
- SIGTERM / SIGINT handlers stop accepting new connections before exiting
- 10-second forced exit prevents hung shutdowns in production

---

## Future Phases

### Phase 2
- JWT authentication (register, login, logout)
- Refresh token via httpOnly cookies
- Role-based access control (admin / customer)
- User, Product, Category models
- Product CRUD with image upload (Cloudinary)
- Admin-only product/category management routes

### Phase 3
- React + Vite + Tailwind CSS frontend
- Product listing, search, filtering
- Product detail page
- Shopping cart (Context API)

### Phase 4
- Cart → Order checkout flow
- Order model and management
- Order history for users

### Phase 5
- Stripe payment integration
- Stripe webhooks for order confirmation
- Docker + Docker Compose
- GitHub Actions CI/CD pipeline
- Cloud deployment (Railway / Render / AWS)
