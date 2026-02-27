# API Reference

> External service integrations used by OpenTable.

## Table of Contents

- [Firebase Authentication](#firebase-authentication)
- [Firebase Firestore](#firebase-firestore)
- [Google Gemini AI (via OpenRouter)](#google-gemini-ai-via-openrouter)
- [Cloudinary Image CDN](#cloudinary-image-cdn)

---

## Firebase Authentication

OpenTable uses Firebase Auth for user authentication with two providers:

### Google OAuth Sign-In

```typescript
import { signInWithGoogle } from '@services/firebase';

const user = await signInWithGoogle();
// Returns: Firebase User object
// Side effect: Creates user document in Firestore if new user
```

### Email/Password Registration

```typescript
import { registerWithEmail } from '@services/firebase';

const user = await registerWithEmail(email, password, displayName, phone);
// Returns: Firebase User object
// Side effect: Creates user document in Firestore
```

### Email/Password Login

```typescript
import { loginWithEmail } from '@services/firebase';

const user = await loginWithEmail(email, password);
// Returns: Firebase User object
```

### Sign Out

```typescript
import { logout } from '@services/firebase';

await logout();
```

---

## Firebase Firestore

### Collections

| Collection | Document ID | Description |
|-----------|-------------|-------------|
| `users` | Firebase Auth UID | User profiles with roles |
| `donations` | Auto-generated | Food donation listings |
| `volunteersrequest` | Auto-generated | Volunteer verification requests |

### Save Donation

```typescript
import { saveDonationToCloud } from '@services/firebase';

await saveDonationToCloud({
  id: 'unique-id',
  item: 'Fresh Bread',
  category: 'Bakery',
  status: 'available',
  imageUrl: 'https://res.cloudinary.com/...',
  quantity: '10 loaves',
  contact: '+1234567890',
  address: '123 Main St',
  donorId: 'user-uid',
  donorName: 'John Doe',
});
```

---

## Google Gemini AI (via OpenRouter)

### Analyze Food Image

Sends a food photo to Google Gemini 2.0 Flash for multi-modal analysis.

```typescript
import { analyzeFoodImage } from '@services/geminiService';

const result = await analyzeFoodImage(base64ImageString);
```

#### Response Shape (`ScanResult`)

```typescript
interface ScanResult {
  item: string;        // "Red Grapes"
  category: string;    // "Produce" | "Bakery" | "Dairy" | etc.
  expiresIn: string;   // "2 days" | "4 hours"
  safeToEat: 'Yes' | 'No';
  confidence: string;  // "95%"
}
```

#### Configuration

| Parameter | Value | Source |
|-----------|-------|--------|
| Model | `google/gemini-2.5-flash` | `constants/AI_CONFIG.MODEL` |
| Max Tokens | `500` | `constants/AI_CONFIG.MAX_TOKENS` |
| API URL | `https://openrouter.ai/api/v1/chat/completions` | `constants/API_URLS.OPENROUTER` |

---

## Cloudinary Image CDN

### Upload Image

Uploads a base64-encoded image using an unsigned upload preset.

```typescript
import { uploadToCloudinary } from '@services/cloudinary';

const secureUrl = await uploadToCloudinary(base64DataUrl);
// Returns: "https://res.cloudinary.com/your-cloud/image/upload/v1234/..."
```

#### Configuration

| Parameter | Environment Variable | Description |
|-----------|---------------------|-------------|
| Cloud Name | `VITE_CLOUDINARY_CLOUD_NAME` | Your Cloudinary account name |
| Upload Preset | `VITE_CLOUDINARY_UPLOAD_PRESET` | Unsigned upload preset name |

---

## Environment Variables

All API keys are managed through environment variables and validated at startup via `config/env.ts`.

| Variable | Service | Required |
|----------|---------|----------|
| `VITE_FIREBASE_API_KEY` | Firebase | ✅ |
| `VITE_OPENROUTER_API_KEY` | OpenRouter (Gemini AI) | ✅ |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary | ✅ |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Cloudinary | ✅ |
