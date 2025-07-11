// src/updates.ts

import { TERMINAL_MAX_WIDTH, VERSION } from './constants';
import { getEnvBool } from './envars';
import logger from './logger';
import chalk from 'chalk';
import semverGt from 'semver/functions/gt';

/**
 * Stubbed getLatestVersion: always returns the current VERSION constant.
 */
export async function getLatestVersion(): Promise<string> {
  return VERSION;
}

/**
 * Stubbed checkForUpdates: never performs a network check and always returns false.
 */
export async function checkForUpdates(): Promise<boolean> {
  // Respect the disable flag, but even if disabled is false,
  // we still do no network calls and report no update.
  if (getEnvBool('PROMPTFOO_DISABLE_UPDATE')) {
    return false;
  }

  // Optionally you could log that update checks are disabled:
  logger.debug('Update checks are disabled in this build.');

  // Never indicate that an update is available
  return false;
}

