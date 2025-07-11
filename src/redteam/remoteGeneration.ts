// src/redteam/remoteGeneration.ts

/**
 * Always disable remote redteam payload generation.
 */
export function getRemoteGenerationUrl(): string {
  throw new Error(
    'Remote red-team payload generation is disabled in this build.'
  );
}

/**
 * Indicate that remote generation is permanently turned off.
 */
export function neverGenerateRemote(): boolean {
  return true;
}

/**
 * Health check endpoint is not available when remote is disabled.
 */
export function getRemoteHealthUrl(): string | null {
  return null;
}

/**
 * Never generate remotely—only use local code.
 */
export function shouldGenerateRemote(): boolean {
  return false;
}

/**
 * Disable any “unaligned” remote endpoints as well.
 */
export function getRemoteGenerationUrlForUnaligned(): string {
  throw new Error(
    'Remote red-team unaligned payload generation is disabled in this build.'
  );
}
