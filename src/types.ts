/**
 * Shared TypeScript type definitions for OpenTable.
 * @module types
 */

/** Food category enumeration */
export enum Category {
  Produce = 'Produce',
  Bakery = 'Bakery',
  Dairy = 'Dairy',
  Canned = 'Canned',
  PreparedMeal = 'Prepared Meal',
  Snacks = 'Snacks',
  Beverages = 'Beverages',
}

/** Result from the AI food scan analysis */
export interface ScanResult {
  /** Unique scan identifier */
  id: string;
  /** Unix timestamp of the scan */
  timestamp: number;
  /** URL of the uploaded food image */
  imageUrl: string;
  /** AI-identified food item name */
  item: string;
  /** AI-detected food category */
  category: Category;
  /** Estimated time until expiry (e.g., "2 days", "4 hours") */
  expiresIn: string;
  /** AI assessment of food safety */
  safeToEat: 'Yes' | 'No';
  /** AI confidence percentage (e.g., "95%") */
  confidence: string;
}

/** Error returned when AI parsing fails */
export interface ParseError {
  /** Human-readable error message */
  error: string;
}

/** User role type */
export type UserRole = 'user' | 'donor' | 'volunteer' | 'admin';

/** User profile stored in Firestore */
export interface UserProfile {
  /** Firebase Auth UID */
  uid: string;
  /** Display name */
  name: string;
  /** Email address */
  email: string;
  /** Phone number (optional) */
  phone: string;
  /** Assigned role */
  role: UserRole;
  /** Account creation timestamp */
  createdAt: Date;
}

/** Donation listing stored in Firestore */
export interface Donation {
  /** Unique donation ID */
  id: string;
  /** Food item name */
  item: string;
  /** Food category */
  category: string;
  /** Current donation status */
  status: 'available' | 'claimed' | 'picked_up' | 'delivered';
  /** URL of the food image */
  imageUrl: string;
  /** Quantity description */
  quantity: string;
  /** Donor's contact info */
  contact: string;
  /** Pickup address */
  address: string;
  /** Donor's user ID */
  donorId: string;
  /** Donor's display name */
  donorName: string;
  /** Volunteer's user ID (when claimed) */
  volunteerId?: string;
  /** Volunteer's display name (when claimed) */
  volunteerName?: string;
  /** URL of delivery proof photo */
  deliveryProofUrl?: string;
  /** Whether admin has clapped for this delivery */
  clappedByAdmin?: boolean;
  /** AI-estimated expiry time */
  expiresIn?: string;
  /** AI safety assessment */
  safeToEat?: string;
  /** AI confidence score */
  confidence?: string;
  /** Timestamp when donation was created */
  uploadedAt: Date;
}

/** Volunteer verification request */
export interface VolunteerRequest {
  /** Request document ID */
  id: string;
  /** Applicant's user ID */
  userId: string;
  /** Applicant's display name */
  name: string;
  /** Applicant's email */
  email: string;
  /** Applicant's phone */
  phone: string;
  /** URL of uploaded ID document photo */
  idImageUrl: string;
  /** URL of uploaded selfie photo */
  selfieUrl: string;
  /** Application status */
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  /** Admin-assigned trust score (0-100) */
  trustScore?: number;
  /** Admin review notes */
  notes?: string;
  /** Submission timestamp */
  submittedAt: Date;
}
