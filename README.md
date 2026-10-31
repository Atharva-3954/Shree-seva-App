# Shree Seva - Single-Shop E-Commerce Platform

A production-grade, single-shop e-commerce platform built for high reliability and clean architectural separation. The project consists of a bare **React Native CLI** mobile frontend supporting dual interfaces (Customer App & Owner Dashboard) and a high-performance **Node.js / Express / TypeScript** REST API powered by **Neon PostgreSQL** and **Drizzle ORM**.

---

## 🏗 System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Mobile Applications                  │
│               (React Native CLI - Bare)                │
│                                                        │
│   ┌────────────────────────┐  ┌────────────────────┐   │
│   │  Customer Application  │  │  Owner Dashboard   │   │
│   │  (Browse, Cart, Order) │  │ (Verify, Products, │   │
│   │                        │  │  Inventory, Orders)│   │
│   └───────────┬────────────┘  └─────────┬──────────┘   │
└───────────────┼─────────────────────────┼──────────────┘
                │   REST API (HTTPS/JSON) │
                │   Axios + JWT Bearer    │
                ▼                         ▼
┌────────────────────────────────────────────────────────┐
│                   Backend REST API                     │
│               (Node.js + Express + TS)                 │
│                                                        │
│  • JWT Authentication & bcrypt Password Hashing        │
│  • Role-Based Access Control (Customer vs Owner)       │
│  • Zod Request Validation                              │
│  • Cloudinary Image Management                         │
│  • Product Verification Lifecycle Engine               │
│  • Drizzle ORM Database Layer                          │
└───────────────────────────┬────────────────────────────┘
                            │ SQL over HTTPS / Serverless
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Neon PostgreSQL                      │
│                  Serverless Database                   │
│                                                        │
│  15 Relational Tables: Users, Addresses, Categories,   │
│  Products, Variants, Verification History, Inventory,   │
│  Cart, Cart Items, Orders, Order Items, Payments,      │
│  Coupons, Notifications, Reviews                       │
└────────────────────────────────────────────────────────┘
```

> **Security Mandate**: The mobile application NEVER connects directly to Neon PostgreSQL. All database access is exclusively mediated through the authenticated, role-guarded Express.js backend.

---

## 🎨 Design System & Color Tokens

| Token Name | Hex Code | Primary Purpose |
| :--- | :--- | :--- |
| **Yellow** | `#FFD600` | Primary brand accent, Pending badges, Highlights |
| **Red** | `#E50914` | Danger actions, Cancellations, Rejections, Errors |
| **White** | `#FFFFFF` | Primary background, Light surfaces, Inverted text |
| **Black** | `#202020` | Dark surfaces, Primary body text |
| **Grey** | `#777777` | Secondary text, Borders, Subdued elements |
| **Green** | `#168A43` | Success states, Confirmed orders, Published status |

Mobile design tokens are exported from `mobile/src/theme/`:
- `colors.ts` (palette & status mappings)
- `typography.ts` (type scale, weights, line heights)
- `spacing.ts` (spacing scale & border radii)
- `index.ts` (unified `theme` object)

---

## 🔄 Product Verification Lifecycle

Products follow a strict three-state governance lifecycle before customer exposure:

```
┌───────────┐      Submit       ┌─────────────┐     Approve     ┌───────────────┐
│   Draft   │ ────────────────> │   Pending   │ ──────────────> │   Published   │
└───────────┘                   └──────┬──────┘                 └───────────────┘
      ▲                                │
      │          Reject + Reason       │
      └────────────────────────────────┘
```

- **Draft**: Product is created or edited by the shop manager.
- **Pending**: Submitted for formal catalog review.
- **Published**: Successfully verified. **Only published products are returned to customer endpoints.**
- **Rejected**: Failed verification with a mandatory `rejectionReason`. Must be updated and resubmitted.
- **Audit Trail**: Every state transition is recorded in `product_verification_history` with verifier ID, timestamp, and explanation.

---

## 📁 Repository Structure

```
Shree-seva app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── cloudinary.ts          # Cloudinary v2 SDK configuration
│   │   │   ├── database.ts            # Neon PostgreSQL connection & testConnection()
│   │   │   └── env.ts                 # Zod-validated environment config
│   │   ├── db/
│   │   │   └── schema/
│   │   │       ├── enums.ts           # PostgreSQL pgEnums (roles, statuses, types)
│   │   │       ├── users.ts           # Users table & relations
│   │   │       ├── addresses.ts       # Customer delivery addresses
│   │   │       ├── categories.ts      # Product categories
│   │   │       ├── products.ts        # Products table with lifecycle status
│   │   │       ├── productVariants.ts # SKU, variant pricing, options
│   │   │       ├── productVerificationHistory.ts # Full audit trail of status transitions
│   │   │       ├── inventory.ts       # Stock counts & low-stock thresholds
│   │   │       ├── cart.ts            # User carts & cart items
│   │   │       ├── orders.ts          # Customer orders & item snapshots
│   │   │       ├── payments.ts        # Payment records (COD, UPI, Card, Netbanking)
│   │   │       ├── coupons.ts         # Discounts & promo code engine
│   │   │       ├── notifications.ts   # System & order notifications
│   │   │       ├── reviews.ts         # Verified purchaser product reviews
│   │   │       └── index.ts           # Consolidated schema re-exports
│   │   ├── middleware/
│   │   │   ├── auth.ts                # JWT authentication & authorizeOwner guard
│   │   │   ├── errorHandler.ts        # AppError & centralized error handler
│   │   │   └── validate.ts            # Zod validation middleware factory
│   │   ├── routes/
│   │   │   ├── auth.routes.ts         # Register, Login, Owner Setup, Profile
│   │   │   ├── user.routes.ts         # Customer profile & address management
│   │   │   ├── category.routes.ts     # Public catalog categories
│   │   │   ├── product.routes.ts      # Public catalog (only published products)
│   │   │   ├── cart.routes.ts         # Cart CRUD operations
│   │   │   ├── order.routes.ts        # Order placement & tracking
│   │   │   ├── payment.routes.ts      # Payment verification
│   │   │   ├── coupon.routes.ts       # Promo code validation
│   │   │   ├── notification.routes.ts # User notification inbox
│   │   │   ├── review.routes.ts       # Product rating & reviews
│   │   │   ├── owner.routes.ts        # Protected owner dashboard & product verification
│   │   │   └── index.ts               # Master route aggregator
│   │   ├── scripts/
│   │   │   └── testDb.ts              # Standalone Neon connection tester
│   │   ├── types/
│   │   │   └── express.d.ts           # Express Request user property extension
│   │   ├── utils/
│   │   │   └── helpers.ts             # Order number generation, slugifier, pagination
│   │   ├── validation/
│   │   │   ├── auth.validation.ts     # Zod schemas for register, login, owner setup
│   │   │   ├── order.validation.ts    # Zod schemas for orders & status updates
│   │   │   └── product.validation.ts  # Zod schemas for creation, update, verification
│   │   └── index.ts                   # Express application entrypoint
│   ├── drizzle/                       # Generated SQL migration files (0000_*.sql)
│   ├── .env.example                   # Template environment variables
│   ├── drizzle.config.ts              # Drizzle-kit configuration
│   ├── package.json                   # Backend dependencies & npm scripts
│   └── tsconfig.json                  # TypeScript compiler options
│
├── mobile/
│   ├── android/                       # Native Android Project (Gradle)
│   │   ├── app/
│   │   │   ├── src/main/
│   │   │   │   ├── java/com/shreeseva/
│   │   │   │   │   ├── MainActivity.kt
│   │   │   │   │   └── MainApplication.kt
│   │   │   │   ├── res/values/
│   │   │   │   │   ├── strings.xml
│   │   │   │   │   └── styles.xml
│   │   │   │   └── AndroidManifest.xml
│   │   │   ├── build.gradle
│   │   │   └── proguard-rules.pro
│   │   ├── gradle/wrapper/
│   │   │   └── gradle-wrapper.properties
│   │   ├── build.gradle
│   │   ├── gradle.properties
│   │   └── settings.gradle
│   ├── ios/                           # Native iOS Project (Xcode / CocoaPods)
│   │   ├── ShreeSeva/
│   │   │   ├── AppDelegate.h
│   │   │   ├── AppDelegate.mm
│   │   │   ├── Info.plist
│   │   │   └── main.m
│   │   └── Podfile
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.ts              # Axios instance with JWT interceptor & 401 handling
│   │   │   ├── auth.api.ts            # Auth endpoints
│   │   │   ├── products.api.ts        # Catalog endpoints
│   │   │   ├── cart.api.ts            # Cart endpoints
│   │   │   ├── orders.api.ts          # Order endpoints
│   │   │   └── index.ts
│   │   ├── config/
│   │   │   └── index.ts               # Platform-aware API base URLs (Android 10.0.2.2 vs iOS localhost)
│   │   ├── hooks/
│   │   │   ├── useApi.ts              # Reusable API query/mutation hook
│   │   │   └── index.ts
│   │   ├── navigation/
│   │   │   ├── RootNavigator.tsx      # Top-level auth/customer/owner routing
│   │   │   ├── AuthNavigator.tsx      # Login, Register, Forgot Password stack
│   │   │   ├── CustomerNavigator.tsx  # Customer Tabs + Details stack
│   │   │   └── OwnerNavigator.tsx     # Owner Dashboard & Management stack
│   │   ├── store/
│   │   │   ├── authStore.ts           # Zustand store for user session & token persistence
│   │   │   ├── cartStore.ts           # Zustand store for client cart calculations
│   │   │   └── index.ts
│   │   ├── theme/
│   │   │   ├── colors.ts              # Official 6-color system + extended tokens
│   │   │   ├── typography.ts          # Font sizes & weights
│   │   │   ├── spacing.ts             # Spacing & border radii
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   ├── auth.types.ts
│   │   │   ├── cart.types.ts
│   │   │   ├── common.types.ts
│   │   │   ├── navigation.types.ts    # React Navigation type definitions
│   │   │   ├── order.types.ts
│   │   │   ├── product.types.ts
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── format.ts              # Currency (₹ INR), date, text helpers
│   │   │   ├── storage.ts             # Typed AsyncStorage wrapper
│   │   │   └── index.ts
│   │   ├── validation/
│   │   │   ├── auth.validation.ts     # Client-side input validation
│   │   │   └── index.ts
│   │   ├── components/                # Reusable UI component stubs
│   │   ├── screens/                   # UI screen stubs (to be built)
│   │   └── assets/                    # Static assets
│   ├── .env.example
│   ├── .gitignore
│   ├── .prettierrc.js
│   ├── app.json
│   ├── App.tsx                        # Root React component
│   ├── babel.config.js                # Module resolver & Reanimated plugin
│   ├── index.js                       # AppRegistry entry point
│   ├── metro.config.js                # Metro bundler config
│   ├── package.json                   # Zero Expo packages - pure React Native CLI
│   └── tsconfig.json                  # Strict TypeScript configuration
└── README.md
```

---

## ⚙️ Environment Variables

### Backend Configuration (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and populate:

```env
# Server
PORT=3000
NODE_ENV=development

# Neon PostgreSQL Database URL (from console.neon.tech)
DATABASE_URL=postgresql://<user>:<password>@<ep-identifier>.<region>.aws.neon.tech/<dbname>?sslmode=require

# JWT Secrets
JWT_SECRET=your_super_secret_jwt_key_at_least_32_chars
JWT_EXPIRES_IN=7d

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Owner Setup Protection (Required for initial owner account registration)
OWNER_SETUP_KEY=your_secure_random_owner_registration_key
```

### Mobile Configuration (`mobile/.env`)

Copy `mobile/.env.example` to `mobile/.env`:

```env
# For Android Emulator: 10.0.2.2 points to host machine localhost
# For Physical Device: use your machine's LAN IP (e.g., http://192.168.1.100:3000/api)
# For iOS Simulator: localhost is supported
API_BASE_URL=http://10.0.2.2:3000/api
```

---

## 🚀 Installation & Setup

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Test database connection (requires valid DATABASE_URL in .env)
npm run db:test

# Generate SQL migrations from schema
npm run db:generate

# Push migrations directly to Neon database
npm run db:push

# Build TypeScript to production bundle
npm run build

# Start development server with live reload
npm run dev

# Start production server
npm run start
```

### 2. Mobile Setup (React Native CLI - Bare)

```bash
cd mobile

# Install dependencies (do NOT use expo)
npm install
```

#### Android Run Instructions:
1. Ensure Android Studio, Android SDK (API 34), and `JAVA_HOME` (JDK 17) are configured.
2. Start an Android Virtual Device (AVD) from Android Studio.
3. Start the Metro bundler:
   ```bash
   npm run start
   ```
4. In a separate terminal, launch the Android app:
   ```bash
   npm run android
   ```
5. If running on a physical Android device:
   ```bash
   adb reverse tcp:8081 tcp:8081
   adb reverse tcp:3000 tcp:3000
   ```

#### iOS Run Instructions:
1. Ensure macOS with Xcode 15+ and CocoaPods are installed.
2. Install CocoaPods dependencies:
   ```bash
   cd ios && pod install && cd ..
   ```
3. Start the Metro bundler:
   ```bash
   npm run start
   ```
4. In a separate terminal, run:
   ```bash
   npm run ios
   ```
   Or open `mobile/ios/ShreeSeva.xcworkspace` directly in Xcode and select your simulator/device.

---

## 🧪 Verification Status

| Component | Status | Details |
| :--- | :---: | :--- |
| **React Native CLI Setup** | ✅ Verified | Bare workflow, package.json configured with zero Expo dependencies. |
| **Android Build Configuration** | ✅ Verified | Gradle root (`build.gradle`), `settings.gradle`, `app/build.gradle`, `AndroidManifest.xml`, `MainActivity.kt`, and `MainApplication.kt` created. |
| **iOS Build Configuration** | ✅ Verified | CocoaPods `Podfile`, `Info.plist`, `AppDelegate.h/.mm`, and `main.m` created. |
| **Backend Startup** | ✅ Verified | Express boots cleanly with Helmet, CORS, Morgan, and JSON parsing. `/health` responds. |
| **TypeScript Compilation** | ✅ Verified | `tsc --noEmit` exits with 0 errors across all backend schema, routes, and middleware. |
| **Drizzle Schema & Migrations** | ✅ Verified | 15 tables & 7 enums generated via `drizzle-kit generate` into `drizzle/0000_steady_proteus.sql`. |
| **Neon Connection Layer** | ✅ Verified | Tested via `@neondatabase/serverless`. Zod validation blocks startup without credentials; `testConnection()` validates connectivity with `SELECT 1`. |

