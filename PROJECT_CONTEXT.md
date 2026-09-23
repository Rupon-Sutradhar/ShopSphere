# ShopSphere — PROJECT_CONTEXT.md

> **Persistent handoff document between development phases.**
> Update this file at the end of every phase before stopping work.

---

## Project Overview

**ShopSphere** is a production-oriented full-stack e-commerce platform (MERN stack) built incrementally across 5 phases. It will ultimately include authentication, role-based access control, product management, a shopping cart, order management, Stripe payments, Docker containerisation, and CI/CD deployment.

---

## Current Phase

**✅ Phase 1 — Project Foundation + Backend Core** — COMPLETE

---

## Architecture

### Design Principles
- **Separation of concerns**: Routes → Controllers → Services → Models
- **No business logic in routes or controllers** (services layer for Phase 2+)
- **Fail-fast**: Server exits if DB is unreachable at startup
- **Graceful shutdown**: SIGTERM/SIGINT stop the HTTP server before process exit
- **Environment-driven config**: All secrets/config via `.env`, never hardcoded
- **Centralised error handling**: One middleware catches everything; AppError for operational errors
- **CORS whitelist**: Origin-based, supports credentials (for future httpOnly cookies)

### Request Lifecycle
```
HTTP Request
  → CORS middleware
  → Body parser / Cookie parser
  → Morgan logger
  → Route handler
  → Controller
  → (Service in Phase 2+)
  → (Model/DB in Phase 2+)
  → JSON response
  
Any error thrown:
  → errorHandler middleware
  → Structured JSON error response
```

---

## Folder Structure

```
shopsphere/
└── backend/
    ├── src/
    │   ├── config/
    │   │   ├── db.js              # Mongoose connection (exits on failure)
    │   │   └── config.js          # All env vars read once, exported as object
    │   ├── controllers/
    │   │   └── healthController.js # GET /api/health
    │   ├── middleware/
    │   │   ├── errorHandler.js    # 4-param Express error handler (LAST middleware)
    │   │   └── notFound.js        # 404 for unknown routes (before error handler)
    │   ├── models/                # Empty — Phase 2+ adds User, Product, Category
    │   ├── routes/
    │   │   └── healthRoutes.js    # Mounts healthController at /api/health
    │   ├── services/              # Empty — Phase 2+ adds business logic here
    │   ├── utils/
    │   │   └── AppError.js        # Custom error class: new AppError(msg, statusCode)
    │   ├── app.js                 # Express setup: CORS, parsers, routes, middleware
    │   └── server.js              # Entry point: dotenv → DB → listen → shutdown
    ├── .env                       # Local secrets (gitignored)
    ├── .env.example               # Template committed to repo
    ├── .gitignore
    ├── package.json
    └── README.md
```

---

## Technologies Used (Phase 1)

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^5.x | HTTP framework |
| `mongoose` | ^8.x | MongoDB ODM |
| `dotenv` | ^16.x | Environment variables |
| `cors` | ^2.x | Cross-origin resource sharing |
| `cookie-parser` | ^1.x | Cookie parsing (for Phase 2 JWT) |
| `morgan` | ^1.x | HTTP request logging |
| `nodemon` | ^3.x | Dev auto-restart (devDependency) |

---

## Implemented Features (Phase 1)

- [x] Node.js + Express project initialised
- [x] MongoDB connection module with fail-fast behaviour
- [x] Centralised config module (`src/config/config.js`)
- [x] Express app with CORS, JSON parsing, cookie-parser, morgan
- [x] `GET /api/health` endpoint (reports API + DB status)
- [x] `AppError` custom error class
- [x] Centralised error-handling middleware (handles Mongoose errors, operational errors, 500s)
- [x] 404 handler for unknown routes
- [x] Graceful shutdown (SIGTERM / SIGINT)
- [x] `npm run dev` (nodemon) and `npm start` scripts
- [x] `.env.example` with all future placeholder variables pre-documented
- [x] `.gitignore` protecting `.env`, `node_modules`, logs
- [x] `README.md` with full setup, API docs, architecture notes
- [x] `PROJECT_CONTEXT.md` (this file)

---

## API Endpoints

### Phase 1

| Method | Path | Controller | Auth | Status |
|--------|------|-----------|------|--------|
| GET | `/api/health` | `healthController.getHealth` | Public | ✅ Live |

### Planned (Phase 2+)

| Method | Path | Notes |
|--------|------|-------|
| POST | `/api/auth/register` | Phase 2 |
| POST | `/api/auth/login` | Phase 2 |
| POST | `/api/auth/logout` | Phase 2 |
| GET | `/api/auth/me` | Phase 2 |
| GET/POST | `/api/products` | Phase 2 |
| GET/PUT/DELETE | `/api/products/:id` | Phase 2 |
| GET/POST | `/api/categories` | Phase 2 |
| GET/PUT/DELETE | `/api/cart` | Phase 3/4 |
| GET/POST | `/api/orders` | Phase 4 |
| POST | `/api/payments/stripe` | Phase 5 |
| POST | `/api/payments/webhook` | Phase 5 |

---

## Database Models

### Phase 1
No models created — no entities require persistence yet.

### Planned Models

#### User (Phase 2)
```
_id, name, email (unique), password (hashed), role (enum: customer|admin),
avatar?, createdAt, updatedAt
```

#### Category (Phase 2)
```
_id, name (unique), slug, description?, image?, createdAt, updatedAt
```

#### Product (Phase 2)
```
_id, name, slug, description, price, stock, images[], category (ref),
isFeatured, createdAt, updatedAt
```

#### Cart / CartItem (Phase 3)
```
Option A: Cart document per user (user ref, items[])
Option B: Cart items embedded in User document
Decision to be made in Phase 3 based on query patterns.
```

#### Order (Phase 4)
```
_id, user (ref), items[], shippingAddress, paymentMethod,
paymentStatus, orderStatus, totalAmount, stripePaymentIntentId?,
createdAt, updatedAt
```

---

## Environment Variables

### Active (Phase 1)

| Variable | Example | Description |
|----------|---------|-------------|
| `PORT` | `5000` | HTTP server port |
| `NODE_ENV` | `development` | Environment mode |
| `MONGODB_URI` | `mongodb://localhost:27017/shopsphere` | MongoDB connection string |
| `CLIENT_ORIGIN` | `http://localhost:5173` | CORS allowed origin(s), comma-separated |

### Reserved for Future Phases

| Variable | Phase | Description |
|----------|-------|-------------|
| `JWT_SECRET` | 2 | JWT signing secret (min 32 chars) |
| `JWT_EXPIRES_IN` | 2 | JWT expiry (e.g. `7d`) |
| `CLOUDINARY_CLOUD_NAME` | 2 | Cloudinary account |
| `CLOUDINARY_API_KEY` | 2 | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | 2 | Cloudinary API secret |
| `STRIPE_SECRET_KEY` | 5 | Stripe secret key (server-side) |
| `STRIPE_WEBHOOK_SECRET` | 5 | Stripe webhook signature secret |

---

## Important Architectural Decisions

### 1. CJS (CommonJS) modules
Using `require/module.exports` throughout. Rationale: avoids `.mjs` extension complexity and top-level `await` issues in Node 18. Can migrate to ESM if needed.

### 2. `server.js` vs `app.js` separation
`server.js` owns port binding and process-level concerns.  
`app.js` is a pure Express app — importable in tests without starting a server.

### 3. CORS whitelist strategy
`CLIENT_ORIGIN` is a comma-separated string so multiple origins (e.g. `https://shopsphere.com,https://www.shopsphere.com`) can be added without code changes.

### 4. Cookie-parser installed in Phase 1
Installed now so Phase 2 can add httpOnly JWT refresh cookies without touching app.js structure.

### 5. Mongoose `serverSelectionTimeoutMS: 5000`
Fails fast during development. In production, consider a higher value or retry logic.

### 6. AppError.isOperational flag
`statusCode < 500` errors are considered operational (user errors); `5xx` errors are unexpected server failures. This flag can be used in Phase 5 to decide whether to page on-call.

---

## Security Decisions

| Decision | Rationale |
|----------|-----------|
| `.env` in `.gitignore` | Prevents secrets from being committed |
| CORS whitelist | Only explicitly listed origins can call the API |
| `credentials: true` in CORS | Required for httpOnly cookie auth (Phase 2) |
| No secrets in source code | All secrets via environment variables |
| Stack trace hidden in production | Prevents information leakage |
| `limit: '10mb'` on body parser | Prevents basic payload DoS attacks |

---

## Pending Work

### Phase 2
- [ ] JWT authentication (register, login, logout, `/auth/me`)
- [ ] httpOnly cookie-based refresh tokens
- [ ] Role-based access control middleware (admin / customer)
- [ ] `User` model
- [ ] `Category` model + admin CRUD
- [ ] `Product` model + admin CRUD
- [ ] Cloudinary image upload via Multer
- [ ] Input validation middleware (express-validator or Zod)

### Phase 3
- [ ] React + Vite + Tailwind CSS setup
- [ ] React Router v6 routing
- [ ] Context API (auth + cart state)
- [ ] Product listing, search, filter
- [ ] Product detail page
- [ ] Shopping cart UI

### Phase 4
- [ ] Cart → Checkout → Order flow
- [ ] Order model + order routes
- [ ] Order history

### Phase 5
- [ ] Stripe PaymentIntent integration
- [ ] Stripe webhooks (order confirmation, refunds)
- [ ] Rate limiting (express-rate-limit)
- [ ] Helmet.js security headers
- [ ] Docker + Docker Compose
- [ ] GitHub Actions CI/CD
- [ ] Cloud deployment (MongoDB Atlas + Cloudinary + hosting)

---

## Naming & Convention Decisions

> **Do not change these without a strong technical reason — they must remain consistent across all phases.**

| Convention | Decision |
|------------|---------|
| API prefix | `/api/` |
| Route naming | Plural nouns: `/api/products`, `/api/orders` |
| HTTP methods | REST conventions (GET/POST/PUT/PATCH/DELETE) |
| Response format | `{ success: bool, message: string, data?: any }` |
| Error format | `{ success: false, message: string, stack?: string }` |
| Environment | `process.env` always via `src/config/config.js` |
| Module system | CommonJS (`require/module.exports`) |
| Async pattern | `async/await` throughout |
| File naming | camelCase for modules, PascalCase for classes/models |
| DB naming | camelCase fields, PascalCase model names |

---

## How to Run (Phase 1)

```bash
cd shopsphere/backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev
```

**Test:**
```
GET http://localhost:5000/api/health
```

---

## Git Status

- Git repository: initialized at `shopsphere/` root (to be done)
- `.gitignore`: configured — `.env`, `node_modules/`, logs excluded
- Not yet pushed to GitHub (push only when explicitly requested)
