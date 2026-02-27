/**
 * Utility for conditionally joining CSS class names.
 * @module utils/cn
 */

/**
 * Combines multiple class name values, filtering out falsy values.
 *
 * @param {...(string | boolean | undefined | null)[]} classes - Class names to combine
 * @returns {string} Combined class name string
 *
 * @example
 * ```tsx
 * <div className={cn('base-class', isActive && 'active', error && 'error')}>
 * ```
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ');
}
