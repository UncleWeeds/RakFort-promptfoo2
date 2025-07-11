// src/envars.ts

/**
 * Stubbed environment variable accessors for an air-gapped build.
 * All boolean flags return `true` (i.e., features are disabled),
 * string flags return an empty string, and ints return 0.
 */

/**
 * Always returns `true` to disable any feature gated by a boolean env var.
 */
export function getEnvBool(_key: string, _default?: boolean): boolean {
  return true;
}

/**
 * Returns an empty string for any string-valued env var.
 */
export function getEnvString(_key: string, _default?: string): string {
  return '';
}

/**
 * Returns zero for any integer-valued env var.
 */
export function getEnvInt(_key: string, _default?: number): number {
  return 0;
}
