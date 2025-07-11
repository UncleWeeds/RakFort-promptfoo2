// src/telemetry.ts

import { z } from 'zod';
import { VERSION } from './constants';
import { getEnvBool } from './envars';
import logger from './logger';

/**
 * Schema for telemetry events (retained for type consistency).
 */
export const TelemetryEventSchema = z.object({
  event: z.enum([
    'assertion_used',
    'command_used',
    'eval_ran',
    'feature_used',
    'funnel',
    'webui_api',
    'webui_page_view',
  ]),
  packageVersion: z.string().optional().default(VERSION),
  properties: z.record(
    z.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
  ),
});
export type TelemetryEvent = z.infer<typeof TelemetryEventSchema>;
export type TelemetryEventTypes = TelemetryEvent['event'];
export type EventProperties = TelemetryEvent['properties'];

/**
 * Telemetry class stub: all methods are no-ops to disable outbound calls.
 */
export class Telemetry {
  /** Always report as disabled */
  get disabled(): boolean {
    return true;
  }

  /** Record an event (no-op) */
  record(_eventName: TelemetryEventTypes, _properties: EventProperties): void {
    return;
  }

  /** Record an event once (no-op) */
  recordOnce(
    _eventName: TelemetryEventTypes,
    _properties: EventProperties
  ): void {
    return;
  }

  /** Record and immediately send (no-op) */
  async recordAndSend(
    _eventName: TelemetryEventTypes,
    _properties: EventProperties
  ): Promise<void> {
    return;
  }

  /** Record once and send (no-op) */
  async recordAndSendOnce(
    _eventName: TelemetryEventTypes,
    _properties: EventProperties
  ): Promise<void> {
    return;
  }

  /** Send buffered events (no-op) */
  async send(): Promise<void> {
    return;
  }

  /**
   * Save user consent (no-op)
   */
  async saveConsent(
    _email: string,
    _metadata?: Record<string, string>
  ): Promise<void> {
    return;
  }
}

/** Default singleton instance */
const telemetry = new Telemetry();
export default telemetry;
