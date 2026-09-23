# ShopSphere — Frontend Web Application

> **Phase 3 Complete** | Modern full-stack e-commerce platform (MERN Stack)

---

## Overview

The ShopSphere frontend is built using **React 18 / Vite / Tailwind CSS / React Router / Context API**. It is completely coupled with the Phase 1 & Phase 2 backend APIs using secure HTTP-only cookies for authentication and localStorage for shopping cart persistence.

---

## Tech Stack (Frontend)

| Layer | Technology |
|---|---|
| Core | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| HTTP Client | Axios (withCredentials: true) |
| Form Validation | React Hook Form |
| State Management | Context API (`AuthContext`, `CartContext`) |
| Iconography | Lucide React |

---

## Directory Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── CartDrawer.jsx       # Slide-over interactive cart with live totals
│   │   ├── Footer.jsx           # Responsive brand footer
│   │   ├── Navbar.jsx           # Sticky nav with live search and badge count
│   │   ├── ProductCard.jsx      # Reusable card with stock status & quick-add
│   │   ├── ProductSkeleton.jsx  # Loading skeletons for catalog & details
│   │   └── ProtectedRoute.jsx   # Role-based & authentication guard
│   ├── context/
│   │   ├── AuthContext.jsx      # HTTP-only cookie auth & /api/auth/me session check
│   │   └── CartContext.jsx      # Cart calculations, stock validation & localStorage sync
│   ├── layouts/
│   │   └── MainLayout.jsx       # Layout shell wrapping Navbar, Outlet, CartDrawer, Footer
│   ├── pages/
│   │   ├── Admin.jsx            # Admin control portal placeholder with RBAC notice
│   │   ├── Cart.jsx             # Dedicated shopping cart and order summary page
│   │   ├── Home.jsx             # Hero showcase, categories, and trending products
│   │   ├── Login.jsx            # Sign in form with React Hook Form
│   │   ├── Orders.jsx           # My Orders placeholder (Phase 4 integration)
│   │   ├── ProductDetails.jsx   # Product page with gallery, quantity, & stock guard
│   │   ├── Products.jsx         # Catalog with search, category filtering & sorting
│   │   └── Register.jsx         # Registration form with password validation
│   ├── services/
│   │   ├── api.js               # Central Axios client with interceptors
│   │   ├── authService.js       # Calls /api/auth endpoints
│   │   └── productService.js    # Calls /api/products & /api/categories endpoints
│   ├── utils/
│   │   └── formatters.js        # Currency formatter & cart total calculations
│   ├── App.jsx                  # Route definitions
│   ├── main.jsx                 # Entry point with BrowserRouter & Providers
│   └── index.css                # Tailwind directives
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## Available Pages & Routes

| Path | Access | Page / Component | Features |
|---|---|---|---|
| `/` | Public | `Home` | Hero banner, value propositions, category navigation, trending items |
| `/products` | Public | `Products` | Catalog with keyword search, category filter, price filter, sorting, pagination |
| `/products/:id` | Public | `ProductDetails` | Image gallery, stock limits, quantity increment, instant buy |
| `/cart` | Public | `Cart` | Full-page cart overview with tax, shipping, and order summary |
| `/login` | Public | `Login` | Form validation and HTTP-only cookie session login |
| `/register` | Public | `Register` | Registration with field checks and password match verification |
| `/profile` | Customer / Admin | `Profile` | Protected profile overview displaying role, email, and joined date |
| `/orders` | Customer / Admin | `Orders` | Order management placeholder (Phase 4 target) |
| `/admin` | Admin Only | `Admin` | Protected dashboard with live product/category metrics & RBAC guards |

---

## Development Setup

```bash
cd shopsphere/frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build for production
npm run build
```
The frontend connects to the backend API (`http://localhost:5000`) via the Vite development proxy configured in `vite.config.js`.
