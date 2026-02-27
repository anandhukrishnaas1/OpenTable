/**
 * Date and time utility functions.
 * @module utils/date
 */

/**
 * Formats a Date object or timestamp into a human-readable string.
 *
 * @param {Date | number} date - Date object or Unix timestamp (ms)
 * @param {Intl.DateTimeFormatOptions} [options] - Intl formatting options
 * @returns {string} Formatted date string
 *
 * @example
 * ```ts
 * formatDate(new Date())           // "Feb 27, 2026"
 * formatDate(1709040000000)        // "Feb 27, 2026"
 * ```
 */
export function formatDate(
    date: Date | number,
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }
): string {
    const d = typeof date === 'number' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', options);
}

/**
 * Formats a date into a relative time string (e.g., "2 hours ago").
 *
 * @param {Date | number} date - Date object or Unix timestamp (ms)
 * @returns {string} Relative time string
 *
 * @example
 * ```ts
 * formatRelativeTime(Date.now() - 3600000) // "1 hour ago"
 * ```
 */
export function formatRelativeTime(date: Date | number): string {
    const d = typeof date === 'number' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return formatDate(d);
}

/**
 * Returns a short time-ago string for display in feeds.
 *
 * @param {Date | number} date - Date object or Unix timestamp (ms)
 * @returns {string} Short relative time (e.g., "2h", "3d")
 */
export function getTimeAgo(date: Date | number): string {
    const d = typeof date === 'number' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'now';
    if (diffMinutes < 60) return `${diffMinutes}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 30) return `${diffDays}d`;

    return formatDate(d);
}
