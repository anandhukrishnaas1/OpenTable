/**
 * Unit tests for date and image utility functions.
 * @module __tests__/utils
 */

import { describe, it, expect } from 'vitest';
import { formatDate, formatRelativeTime, getTimeAgo } from '../utils/date';
import { cn } from '../utils/cn';

/* ============================================================
   formatDate
   ============================================================ */

describe('formatDate', () => {
    it('formats a Date object into a short date string', () => {
        const date = new Date('2026-02-27T10:00:00Z');
        const result = formatDate(date);
        expect(result).toContain('Feb');
        expect(result).toContain('27');
        expect(result).toContain('2026');
    });

    it('formats a numeric timestamp into a short date string', () => {
        const ts = new Date('2026-01-15T00:00:00Z').getTime();
        const result = formatDate(ts);
        expect(result).toContain('Jan');
        expect(result).toContain('15');
        expect(result).toContain('2026');
    });

    it('accepts custom Intl formatting options', () => {
        const date = new Date('2026-06-01T00:00:00Z');
        const result = formatDate(date, { weekday: 'long' });
        expect(result).toBe('Monday');
    });
});

/* ============================================================
   formatRelativeTime
   ============================================================ */

describe('formatRelativeTime', () => {
    it('returns "Just now" for very recent timestamps', () => {
        const result = formatRelativeTime(Date.now() - 5000);
        expect(result).toBe('Just now');
    });

    it('returns minutes ago for timestamps within the last hour', () => {
        const result = formatRelativeTime(Date.now() - 5 * 60 * 1000);
        expect(result).toContain('minute');
        expect(result).toContain('ago');
    });

    it('returns hours ago for timestamps within the last day', () => {
        const result = formatRelativeTime(Date.now() - 3 * 60 * 60 * 1000);
        expect(result).toContain('hour');
        expect(result).toContain('ago');
    });

    it('returns days ago for timestamps within the last week', () => {
        const result = formatRelativeTime(Date.now() - 2 * 24 * 60 * 60 * 1000);
        expect(result).toContain('day');
        expect(result).toContain('ago');
    });
});

/* ============================================================
   getTimeAgo
   ============================================================ */

describe('getTimeAgo', () => {
    it('returns "now" for very recent timestamps', () => {
        expect(getTimeAgo(Date.now() - 10000)).toBe('now');
    });

    it('returns minutes shorthand (e.g., "5m")', () => {
        const result = getTimeAgo(Date.now() - 5 * 60 * 1000);
        expect(result).toBe('5m');
    });

    it('returns hours shorthand (e.g., "3h")', () => {
        const result = getTimeAgo(Date.now() - 3 * 60 * 60 * 1000);
        expect(result).toBe('3h');
    });

    it('returns days shorthand (e.g., "2d")', () => {
        const result = getTimeAgo(Date.now() - 2 * 24 * 60 * 60 * 1000);
        expect(result).toBe('2d');
    });
});

/* ============================================================
   cn (class name utility)
   ============================================================ */

describe('cn', () => {
    it('combines multiple class names', () => {
        expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('filters out falsy values', () => {
        expect(cn('base', false, undefined, null, 'active')).toBe('base active');
    });

    it('returns empty string when all values are falsy', () => {
        expect(cn(false, undefined, null)).toBe('');
    });

    it('handles a single class name', () => {
        expect(cn('only')).toBe('only');
    });

    it('supports conditional class names via boolean expressions', () => {
        const isActive = true;
        const isDisabled = false;
        expect(cn('btn', isActive && 'btn-active', isDisabled && 'btn-disabled')).toBe('btn btn-active');
    });
});
