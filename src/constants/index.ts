/**
 * Application-wide constants for OpenTable.
 * Centralizes magic strings, configuration values, and enumerations.
 * @module constants
 */

/** Firebase Firestore collection names */
export const COLLECTIONS = {
  USERS: 'users',
  DONATIONS: 'donations',
  VOLUNTEER_REQUESTS: 'volunteersrequest',
} as const;

/** User role identifiers */
export const USER_ROLES = {
  USER: 'user',
  DONOR: 'donor',
  VOLUNTEER: 'volunteer',
  ADMIN: 'admin',
} as const;

/** Donation status values */
export const DONATION_STATUS = {
  AVAILABLE: 'available',
  CLAIMED: 'claimed',
  PICKED_UP: 'picked_up',
  DELIVERED: 'delivered',
} as const;

/** Volunteer application status values */
export const VOLUNTEER_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  FLAGGED: 'flagged',
} as const;

/** Food categories returned by AI analysis */
export const FOOD_CATEGORIES = [
  'Produce',
  'Bakery',
  'Dairy',
  'Canned',
  'Prepared Meal',
  'Snacks',
  'Beverages',
] as const;

/** Application route paths */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ROLE_SELECTION: '/role-selection',
  DONOR_DASHBOARD: '/menu',
  VOLUNTEER_DASHBOARD: '/volunteer',
  ADMIN_DASHBOARD: '/admin',
  ONBOARDING: '/onboarding',
  LEDGER: '/ledger',
} as const;

/** External service URLs */
export const API_URLS = {
  OPENROUTER: 'https://openrouter.ai/api/v1/chat/completions',
} as const;

/** AI Model configuration */
export const AI_CONFIG = {
  MODEL: 'google/gemini-2.5-flash',
  MAX_TOKENS: 500,
  APP_NAME: 'OpenTable',
} as const;

/** Toast notification durations (in ms) */
export const TOAST_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 8000,
} as const;
