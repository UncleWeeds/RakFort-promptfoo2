// src/fetch.ts

/**
 * This module provides stubbed fetch helpers that
 * immediately error out to disable all network activity.
 */

/**
 * Sanitize a URL (stubbed, no-op).
 */
export function sanitizeUrl(url: string): string {
  return url;
}

/**
 * HTTP proxy is disabled in this build.
 */
export function getProxyUrl(): string | undefined {
  return undefined;
}

/**
 * Attempts to perform a fetch via proxy, but is disabled.
 */
export async function fetchWithProxy(
  _url: RequestInfo,
  _options: RequestInit = {}
): Promise<Response> {
  throw new Error('Network calls are disabled in this build (fetchWithProxy)');
}

/**
 * Attempts to perform a fetch with timeout, but is disabled.
 */
export function fetchWithTimeout(
  _url: RequestInfo,
  _options: RequestInit = {},
  _timeout: number
): Promise<Response> {
  return Promise.reject(
    new Error('Network calls are disabled in this build (fetchWithTimeout)')
  );
}

/**
 * Detecting rate limits is moot since no calls occur.
 */
export function isRateLimited(_response: Response): boolean {
  return false;
}

/**
 * No rate-limit handling needed when no requests are sent.
 */
export async function handleRateLimit(_response: Response): Promise<void> {
  return;
}

/**
 * Retries are disabled—always error out.
 */
export async function fetchWithRetries(
  _url: RequestInfo,
  _options: RequestInit = {},
  _timeout: number,
  _retries: number = 0
): Promise<Response> {
  throw new Error('Network calls are disabled in this build (fetchWithRetries)');
}
