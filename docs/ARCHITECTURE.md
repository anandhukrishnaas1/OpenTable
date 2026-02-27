# Architecture Overview

> Technical architecture documentation for OpenTable.

## System Architecture

```mermaid
graph TB
    subgraph Client["React Frontend (Vite + TypeScript)"]
        direction TB
        LP[Landing Page] --> Auth[Firebase Auth]
        Auth --> RS[Role Selection]
        RS --> DD[Donor Dashboard]
        RS --> VD[Volunteer Dashboard]
        RS --> AD[Admin Dashboard]
    end

    subgraph Services["External Services"]
        Gemini[Google Gemini AI]
        Cloud[Cloudinary CDN]
        FS[Firebase Firestore]
        FA[Firebase Auth]
    end

    DD -->|"Food Analysis"| Gemini
    DD -->|"Image Upload"| Cloud
    DD -->|"Save Donation"| FS
    VD -->|"Delivery Proof"| Cloud
    VD -->|"Update Status"| FS
    AD -->|"Read/Write"| FS
```

## Module Dependency Graph

```mermaid
graph LR
    App[App.tsx] --> Contexts
    App --> Pages
    App --> Components

    subgraph Contexts
        AuthCtx[AuthContext]
        DonCtx[DonationContext]
        AdminCtx[AdminContext]
    end

    subgraph Pages
        Landing[LandingPage]
        Login[LoginPage]
        Donor[DonorDashboard]
        Volunteer[VolunteerDashboard]
        Admin[AdminDashboard]
    end

    subgraph Components
        Layout
        Toast
        ErrorBoundary
        DoodleBG[DoodleBackground]
    end

    Contexts --> Services
    Pages --> Hooks
    Pages --> Contexts

    subgraph Services
        Firebase[firebase.ts]
        Cloudinary[cloudinary.ts]
        GeminiSvc[geminiService.ts]
    end

    subgraph Hooks
        useToast
        useLocalStorage
        useMediaQuery
    end

    Services --> Config[config/env.ts]
    Services --> Constants[constants/index.ts]
    Services --> Types[types.ts]
```

## Directory Structure

```
src/
├── __tests__/       # Test files and setup
├── components/      # Reusable UI components (Layout, Toast, ErrorBoundary)
├── config/          # Environment variable validation
├── constants/       # App-wide constants (routes, roles, API URLs)
├── contexts/        # React Context providers (Auth, Donation, Admin)
├── hooks/           # Custom React hooks (useToast, useLocalStorage, useMediaQuery)
├── pages/           # Route-level page components (lazy-loaded)
├── services/        # External service integrations (Firebase, Cloudinary, Gemini AI)
├── styles/          # Global CSS and design tokens
├── utils/           # Shared utility functions (date, image, cn)
├── App.tsx          # Root component with routing
├── index.tsx        # React DOM entry point
└── types.ts         # Shared TypeScript type definitions
```

## Data Flow

### Donation Lifecycle

```mermaid
sequenceDiagram
    participant D as Donor
    participant AI as Gemini AI
    participant CDN as Cloudinary
    participant DB as Firestore
    participant V as Volunteer
    participant A as Admin

    D->>AI: Upload food photo
    AI-->>D: Analysis (item, category, freshness)
    D->>CDN: Upload image
    CDN-->>D: Image URL
    D->>DB: Create donation (status: available)
    V->>DB: Claim donation (status: claimed)
    V->>DB: Pick up (status: picked_up)
    V->>CDN: Upload delivery proof
    V->>DB: Mark delivered (status: delivered)
    A->>DB: Review & clap
```

### Firestore Collections

| Collection | Purpose | Key Fields |
|-----------|---------|------------|
| `users` | User profiles & roles | `uid`, `email`, `role`, `name` |
| `donations` | Food donation listings | `item`, `status`, `imageUrl`, `deliveryProofUrl`, `clappedByAdmin` |
| `volunteersrequest` | Volunteer verification | `idImageUrl`, `selfieUrl`, `status`, `trustScore` |

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Lazy loading all pages** | Reduces initial bundle by ~60-70% |
| **Centralized constants** | Eliminates magic strings, enables refactoring |
| **Environment validation** | Fails fast on missing config in production |
| **Barrel exports** | Clean import paths, easier refactoring |
| **Real-time Firestore listeners** | Instant UI updates without polling |
| **Cloudinary CDN** | Client-side uploads without backend server |
