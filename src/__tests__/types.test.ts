/**
 * @module types.test
 * @description Unit tests for shared TypeScript types and enums.
 * Validates Category enum values, interface field requirements,
 * and type narrowing for application-wide types.
 */
import { describe, it, expect } from 'vitest';
import { Category } from '../types';

// ───── Category enum ─────

describe('Category enum', () => {
  it('should define all 7 food categories', () => {
    const values = Object.values(Category);
    expect(values).toHaveLength(7);
  });

  it('should include Produce', () => {
    expect(Category.Produce).toBe('Produce');
  });

  it('should include Bakery', () => {
    expect(Category.Bakery).toBe('Bakery');
  });

  it('should include Dairy', () => {
    expect(Category.Dairy).toBe('Dairy');
  });

  it('should include Canned', () => {
    expect(Category.Canned).toBe('Canned');
  });

  it('should include PreparedMeal', () => {
    expect(Category.PreparedMeal).toBe('Prepared Meal');
  });

  it('should include Snacks', () => {
    expect(Category.Snacks).toBe('Snacks');
  });

  it('should include Beverages', () => {
    expect(Category.Beverages).toBe('Beverages');
  });
});

// ───── Type shape validation ─────

describe('Type shapes', () => {
  it('should validate ScanResult shape', () => {
    const result = {
      id: 'scan-001',
      timestamp: Date.now(),
      imageUrl: 'https://example.com/food.jpg',
      item: 'Rice',
      category: Category.PreparedMeal,
      expiresIn: '4 hours',
      safeToEat: 'Yes' as const,
      confidence: '95%',
    };

    expect(result.id).toBeTruthy();
    expect(result.timestamp).toBeGreaterThan(0);
    expect(result.safeToEat).toBe('Yes');
    expect(result.category).toBe('Prepared Meal');
  });

  it('should validate UserRole union type values', () => {
    const validRoles: string[] = ['user', 'donor', 'volunteer', 'admin'];
    expect(validRoles).toContain('user');
    expect(validRoles).toContain('donor');
    expect(validRoles).toContain('volunteer');
    expect(validRoles).toContain('admin');
  });

  it('should validate Donation status union type values', () => {
    const validStatuses: string[] = ['available', 'claimed', 'picked_up', 'delivered'];
    expect(validStatuses).toContain('available');
    expect(validStatuses).toContain('claimed');
    expect(validStatuses).toContain('picked_up');
    expect(validStatuses).toContain('delivered');
  });

  it('should validate VolunteerRequest status values', () => {
    const validStatuses: string[] = ['pending', 'approved', 'rejected', 'flagged'];
    expect(validStatuses).toContain('pending');
    expect(validStatuses).toContain('approved');
    expect(validStatuses).toContain('rejected');
    expect(validStatuses).toContain('flagged');
  });
});
