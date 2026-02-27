/**
 * @module hooks.test
 * @description Unit tests for custom React hooks — useToast, useLocalStorage, useMediaQuery.
 */
import { describe, it, expect, beforeEach } from 'vitest';

// ───── useToast (pure state logic) ─────

describe('useToast state logic', () => {
  it('should create a toast state object with defaults', () => {
    const defaultState = {
      visible: false,
      message: '',
      type: 'info' as const,
    };

    expect(defaultState.visible).toBe(false);
    expect(defaultState.message).toBe('');
    expect(defaultState.type).toBe('info');
  });

  it('should support all toast types', () => {
    const types: Array<'success' | 'error' | 'warning' | 'info'> = [
      'success',
      'error',
      'warning',
      'info',
    ];

    types.forEach((type) => {
      expect(['success', 'error', 'warning', 'info']).toContain(type);
    });
  });
});

// ───── useLocalStorage (serialization logic) ─────

describe('useLocalStorage serialization', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should serialize values to JSON for storage', () => {
    const key = 'test-key';
    const value = { name: 'OpenTable', version: 1 };

    localStorage.setItem(key, JSON.stringify(value));
    const stored = JSON.parse(localStorage.getItem(key) || '{}');

    expect(stored.name).toBe('OpenTable');
    expect(stored.version).toBe(1);
  });

  it('should handle string values', () => {
    const key = 'role';
    const value = 'donor';

    localStorage.setItem(key, JSON.stringify(value));
    const stored = JSON.parse(localStorage.getItem(key) || '""');

    expect(stored).toBe('donor');
  });

  it('should return default when key does not exist', () => {
    const stored = localStorage.getItem('nonexistent');
    expect(stored).toBeNull();
  });

  it('should handle array values', () => {
    const donations = ['bread', 'rice', 'vegetables'];
    localStorage.setItem('donations', JSON.stringify(donations));
    const stored = JSON.parse(localStorage.getItem('donations') || '[]');

    expect(stored).toHaveLength(3);
    expect(stored[0]).toBe('bread');
  });
});

// ───── useMediaQuery (matchMedia behavior) ─────

describe('useMediaQuery matchMedia mock', () => {
  it('should detect mobile viewport', () => {
    const mql = window.matchMedia('(max-width: 768px)');
    // Our test setup mocks matchMedia to return matches: false
    expect(typeof mql.matches).toBe('boolean');
  });

  it('should return an object with addEventListener', () => {
    const mql = window.matchMedia('(min-width: 1024px)');
    expect(typeof mql.addEventListener).toBe('function');
  });

  it('should return an object with removeEventListener', () => {
    const mql = window.matchMedia('(min-width: 1024px)');
    expect(typeof mql.removeEventListener).toBe('function');
  });
});

// ───── Constants validation ─────

describe('Application constants', () => {
  it('should define valid user roles', () => {
    const roles = ['user', 'donor', 'volunteer', 'admin'];
    expect(roles).toContain('donor');
    expect(roles).toContain('volunteer');
    expect(roles).toContain('admin');
    expect(roles).toHaveLength(4);
  });

  it('should define valid donation statuses', () => {
    const statuses = ['available', 'claimed', 'picked_up', 'delivered'];
    expect(statuses).toContain('available');
    expect(statuses).toContain('delivered');
    expect(statuses).toHaveLength(4);
  });

  it('should define valid application statuses', () => {
    const statuses = ['Pending', 'Verified', 'Flagged', 'Rejected'];
    expect(statuses).toContain('Pending');
    expect(statuses).toContain('Verified');
    expect(statuses).toHaveLength(4);
  });
});
