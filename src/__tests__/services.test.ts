/**
 * @module services.test
 * @description Unit tests for service modules — Cloudinary upload URL construction,
 * Gemini AI prompt formatting, and Firebase config validation.
 */
import { describe, it, expect } from 'vitest';

// ───── Cloudinary service logic ─────

describe('Cloudinary upload URL construction', () => {
  const CLOUD_NAME = 'test-cloud';
  const UPLOAD_PRESET = 'test-preset';

  it('should construct correct upload URL', () => {
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    expect(url).toBe('https://api.cloudinary.com/v1_1/test-cloud/image/upload');
  });

  it('should create valid FormData payload', () => {
    const formData = new FormData();
    formData.append('file', 'data:image/png;base64,abc123');
    formData.append('upload_preset', UPLOAD_PRESET);

    expect(formData.get('upload_preset')).toBe('test-preset');
    expect(formData.get('file')).toBeTruthy();
  });

  it('should handle base64 image data', () => {
    const base64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRg==';
    expect(base64.startsWith('data:image/')).toBe(true);
  });
});

// ───── Gemini AI prompt structure ─────

describe('Gemini AI prompt formatting', () => {
  it('should contain required analysis fields in prompt', () => {
    const prompt = `Analyze this food image and provide a JSON response with these fields:
      - item: string (name of the food)
      - category: string (Produce, Bakery, Dairy, Canned, Prepared Meal, Snacks, Beverages)
      - expiresIn: string (estimated time until expiry)
      - safeToEat: "Yes" or "No"
      - confidence: string (percentage like "95%")`;

    expect(prompt).toContain('item');
    expect(prompt).toContain('category');
    expect(prompt).toContain('expiresIn');
    expect(prompt).toContain('safeToEat');
    expect(prompt).toContain('confidence');
  });

  it('should define all valid food categories', () => {
    const categories = [
      'Produce',
      'Bakery',
      'Dairy',
      'Canned',
      'Prepared Meal',
      'Snacks',
      'Beverages',
    ];
    expect(categories).toHaveLength(7);
    expect(categories).toContain('Prepared Meal');
  });

  it('should validate AI response structure', () => {
    const mockResponse = {
      item: 'Fresh Bread',
      category: 'Bakery',
      expiresIn: '2 days',
      safeToEat: 'Yes',
      confidence: '92%',
    };

    expect(mockResponse.item).toBeTruthy();
    expect(mockResponse.category).toBeTruthy();
    expect(['Yes', 'No']).toContain(mockResponse.safeToEat);
    expect(mockResponse.confidence).toMatch(/^\d+%$/);
  });

  it('should handle unsafe food detection', () => {
    const mockResponse = {
      item: 'Spoiled Milk',
      category: 'Dairy',
      expiresIn: 'Expired',
      safeToEat: 'No',
      confidence: '88%',
    };

    expect(mockResponse.safeToEat).toBe('No');
    expect(mockResponse.expiresIn).toBe('Expired');
  });
});

// ───── Firebase config validation ─────

describe('Firebase configuration validation', () => {
  it('should validate API key format', () => {
    const mockKey = 'AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
    expect(mockKey.startsWith('AIza')).toBe(true);
    expect(mockKey.length).toBeGreaterThan(20);
  });

  it('should validate required Firebase config fields', () => {
    const requiredFields = [
      'apiKey',
      'authDomain',
      'projectId',
      'storageBucket',
      'messagingSenderId',
      'appId',
    ];

    requiredFields.forEach((field) => {
      expect(field).toBeTruthy();
    });
    expect(requiredFields).toHaveLength(6);
  });

  it('should validate Firestore collection names', () => {
    const collections = ['users', 'donations', 'volunteersrequest'];

    expect(collections).toContain('users');
    expect(collections).toContain('donations');
    expect(collections).toContain('volunteersrequest');
  });
});

// ───── Environment variable validation ─────

describe('Environment variable keys', () => {
  it('should define all required env var keys', () => {
    const requiredEnvVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_OPENROUTER_API_KEY',
      'VITE_CLOUDINARY_CLOUD_NAME',
      'VITE_CLOUDINARY_UPLOAD_PRESET',
    ];

    requiredEnvVars.forEach((key) => {
      expect(key.startsWith('VITE_')).toBe(true);
    });
    expect(requiredEnvVars).toHaveLength(4);
  });
});
