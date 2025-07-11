/**
 * Accounts helpers – internal fork
 * -------------------------------------------------
 * We stripped out the cloud e‑mail verification and
 * usage‑limit check, so the two helpers below now
 * return immediately.  All other functions stay the
 * same because they’re still handy for local config
 * (author name, etc.).
 */

import type { GlobalConfig } from '../configTypes';
import { getEnvString } from '../envars';
import { readGlobalConfig, writeGlobalConfigPartial } from './globalConfig';

/* ------------------------------------------------------------------ */
/*  Basic getters/setters – unchanged                                 */
/* ------------------------------------------------------------------ */

export function getUserEmail(): string | null {
  const globalConfig = readGlobalConfig();
  return globalConfig?.account?.email || null;
}

export function setUserEmail(email: string) {
  const config: Partial<GlobalConfig> = { account: { email } };
  writeGlobalConfigPartial(config);
}

export function getAuthor(): string | null {
  return getEnvString('PROMPTFOO_AUTHOR') || getUserEmail() || null;
}

/* ------------------------------------------------------------------ */
/*  Disabled cloud‑verification helpers                               */
/* ------------------------------------------------------------------ */

export async function promptForEmailUnverified(): Promise<void> {
  // ⛔  Email prompt removed in internal build
  return;
}

export async function checkEmailStatusOrExit(): Promise<void> {
  // ⛔  Remote usage‑limit check disabled in internal build
  return;
}
