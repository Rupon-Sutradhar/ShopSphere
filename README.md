# ShopSphere

ShopSphere is a full-stack, production-ready MERN e-commerce platform built over 5 phases. It features role-based access control, product management, shopping cart functionality, secure checkout, Stripe payments, and a fully Dockerized deployment architecture.

## 🚀 Features
- **User Authentication:** JWT-based HTTP-only cookies, robust login/register, role-based access (Customer/Admin).
- **Product Management:** Admin CRUD operations, rich product catalog with pagination, search, category filtering, and sorting.
- **Shopping Cart:** Persistent cart state, stock validation, tax, and shipping calculations.
- **Checkout & Payments:** Stripe PaymentIntent integration with secure webhook verification.
- **Admin Dashboard:** Order management, product/category inventory control, sales overview.
- **Production Security:** Helmet headers, Express rate-limiting, CORS whitelisting, fail-fast DB connections.
- **DevOps Ready:** Dockerized frontend and backend, `docker-compose` setup for easy orchestration, and GitHub Actions CI/CD pipelines.

## 🏗 Architecture
- **Frontend:** React 19, Vite, Tailwind CSS, React Router v7, Context API, Lucide React icons.
- **Backend:** Node.js, Express, MongoDB (Mongoose), Stripe API.
- **Security:** bcryptjs, jsonwebtoken, helmet, express-rate-limit.
- **Deployment:** Docker, Nginx (for serving React build in prod).

## 📂 Folder Structure
```
shopsphere/
├── backend/            # Express API, MongoDB models, Controllers, Services
├── frontend/           # React SPA, Tailwind styles, Contexts, Pages
├── docker-compose.yml  # Multi-container orchestration
└── .github/workflows/  # CI/CD pipelines
```

## 🔐 Environment Variables
Create `.env` files in both `backend` and `frontend` directories based on `.env.example`.

### Backend `.env`
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/shopsphere
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 🛠 Local Setup

### Without Docker
1. **Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### With Docker Compose
```bash
docker-compose up --build
```
This spins up the Backend on `:5000`, Frontend on `:8080`, and a local MongoDB instance on `:27017`.

## 💳 Payment Architecture
1. User confirms shipping on frontend checkout.
2. Order is saved to DB (`isPaid: false`).
3. Frontend initiates payment flow via `/api/payment/create-payment-intent`.
4. Backend securely creates a Stripe Intent and returns `clientSecret`.
5. User enters card details via Stripe Elements (`<PaymentForm />`).
6. On success, Stripe sends a webhook to `/api/payment/webhook`.
7. Backend verifies webhook signature, finds the order, and updates `isPaid = true`.

## 📦 Docker & CI/CD
- **Dockerfiles:** Multi-stage build for frontend using Nginx, optimized alpine Node image for backend.
- **GitHub Actions:** `.github/workflows/ci.yml` runs on push/PR to `main`. It installs dependencies, lints frontend, and builds the Vite app to ensure deployment readiness.
- **Deployment:** Ready for deployment to platforms like Render, Railway, AWS ECS, or DigitalOcean using the provided Docker images.

## 🛡 Security
- No secrets exposed to frontend.
- API requests validated.
- Webhook endpoints use raw body signature verification.
- HTTP-only cookies prevent XSS theft of JWTs.
- `express-rate-limit` mitigates brute-force attacks.
- `helmet` secures HTTP headers.

## 🧪 Testing
Manual End-to-End testing passed for:
- Registration, Login, Logout
- Browsing, Filtering, Adding to Cart
- Checkout, Order Creation, Stripe Payment
- Webhook Order Status Updates
- Admin Dashboard CRUD Operations
