// src/redteam/registry.ts

import chalk from 'chalk';
import dedent from 'dedent';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import logger from '../logger';
import { getNunjucksEngine } from '../util/templates';
import invariant from '../util/invariant';
import type { LoadApiProviderContext, TestSuiteConfig } from '../types';
import type { ApiProvider, ProviderOptions, ProviderOptionsMap } from '../types/providers';
import { providerMap } from './registry';  // your built-in, local providers

/**
 * Strictly local loader: no cloud providers.
 */
export async function loadApiProvider(
  providerId: string,
  context: LoadApiProviderContext = {}
): Promise<ApiProvider> {
  const { options = {}, basePath, env } = context;

  // If the provider path is a file://config, load and recurse
  if (
    providerId.startsWith('file://') &&
    (providerId.endsWith('.yaml') || providerId.endsWith('.yml') || providerId.endsWith('.json'))
  ) {
    const filePath = providerId.slice('file://'.length);
    const absolute = path.isAbsolute(filePath) ? filePath : path.join(basePath || process.cwd(), filePath);
    const content = yaml.load(fs.readFileSync(absolute, 'utf8')) as ProviderOptions | ProviderOptions[];
    invariant(content, `Provider config ${filePath} is undefined`);

    const configs = Array.isArray(content) ? content : [content];
    if (configs.length !== 1) {
      throw new Error(`Multiple providers in ${filePath} not supported here.`);
    }
    const cfg = configs[0];
    invariant(cfg.id, `Provider config in ${filePath} must include an id`);
    logger.info(`Loaded local provider ${cfg.id} from ${filePath}`);
    return loadApiProvider(cfg.id, { ...context, options: cfg });
  }

  // Otherwise, match against your built-in local provider factories
  const matched = providerMap.find((factory) => factory.test(providerId));
  if (!matched) {
    throw new Error(dedent`
      Could not identify local provider: ${chalk.bold(providerId)}

      Promptfoo is configured for an air‐gapped environment. Only local providers
      (file://… configs or built-in IDs) are supported.
    `);
  }

  const apiProvider = await matched.create(providerId, { id: providerId, config: options.config, basePath, env }, context);
  apiProvider.transform = options.transform;
  apiProvider.delay = options.delay;
  apiProvider.label  = options.label || apiProvider.label;
  return apiProvider;
}

/**
 * Load an array of providers, strictly local.
 */
export async function loadApiProviders(
  providerIds: TestSuiteConfig['providers'],
  context: LoadApiProviderContext = {}
): Promise<ApiProvider[]> {
  if (typeof providerIds === 'string') {
    return [await loadApiProvider(providerIds, context)];
  }
  if (typeof providerIds === 'function') {
    // custom in-process function provider
    return [{ id: 'custom-fn', callApi: providerIds }];
  }
  if (Array.isArray(providerIds)) {
    const results: ApiProvider[] = [];
    for (const id of providerIds) {
      if (typeof id === 'string') {
        const group = await loadApiProviders(id, context);
        results.push(...group);
      } else if (typeof id === 'function') {
        results.push({ id: id.name || 'custom-fn', callApi: id });
      } else if ('id' in id) {
        results.push(await loadApiProvider(id.id, { ...context, options: id }));
      } else {
        throw new Error(`Invalid provider entry: ${JSON.stringify(id)}`);
      }
    }
    return results;
  }
  throw new Error(`Invalid providers config: ${JSON.stringify(providerIds)}`);
}
