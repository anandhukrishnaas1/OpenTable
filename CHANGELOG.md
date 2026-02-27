# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-27

### Added

- **AI Food Scanner** — Gemini 2.0 Flash multimodal AI analyzes food photos for category, freshness, and safety
- **Donor Dashboard** — Upload food photos, auto-fill details via AI, list donations with live tracking
- **Volunteer Dashboard** — Browse available pickups, one-click claim, delivery proof upload with camera
- **Admin Dashboard** — Approve/reject volunteer verification requests, view delivery proofs, clap recognition
- **Identity Verification** — Volunteers submit ID photo + selfie for admin review before accepting deliveries
- **Transparency Ledger** — Public activity log showing all donation and delivery activity
- **Role-Based Access** — Donor, Volunteer, and Admin roles with appropriate permissions
- **Real-Time Sync** — Firebase Firestore `onSnapshot` for instant updates across all users
- **Google OAuth** — One-click sign-in with Google alongside email/password authentication
- **Progressive Web App** — PWA support via `vite-plugin-pwa` for installable experience
- **Image CDN** — Cloudinary integration for optimized image storage and delivery
- **Code Splitting** — React.lazy + Suspense for ~60-70% reduction in initial bundle size
- **Performance** — Preconnect hints, browser caching via Vercel headers, tree-shaking via Vite
- **GPS Integration** — Auto-detect donor location for faster listing
- **Google Maps** — Directions integration for volunteer pickups

### Security

- Firebase Auth with role-based Firestore security rules
- Environment variable protection for all API keys
- Cloudinary unsigned upload presets (no secret exposed client-side)
