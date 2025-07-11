// src/redteam/shared.ts

import chalk from 'chalk';
import * as fs from 'fs';
import yaml from 'js-yaml';
import * as os from 'os';
import * as path from 'path';
import { doEval } from '../commands/eval';
import logger, { setLogCallback, setLogLevel } from '../logger';
import type Eval from '../models/eval';
import { isRunningUnderNpx } from '../util';
import { loadDefaultConfig } from '../util/config/default';
import { doGenerateRedteam } from './commands/generate';
import type { RedteamRunOptions } from './types';

export async function doRedteamRun(
  options: RedteamRunOptions
): Promise<Eval | undefined> {
  if (options.verbose) {
    setLogLevel('debug');
  }
  if (options.logCallback) {
    setLogCallback(options.logCallback);
  }

  // Determine config paths
  let configPath = options.config ?? 'promptfooconfig.yaml';
  let redteamPath = options.output
    ? options.output
    : path.join(path.dirname(configPath), 'redteam.yaml');

  // If using a live config object, write it out to a temp file
  if (options.liveRedteamConfig) {
    const tmpFile = path.join(
      os.tmpdir(),
      `redteam-${Date.now()}`,
      'redteam.yaml'
    );
    fs.mkdirSync(path.dirname(tmpFile), { recursive: true });
    fs.writeFileSync(tmpFile, yaml.dump(options.liveRedteamConfig));
    configPath = tmpFile;
    redteamPath = tmpFile;
    logger.debug(`Using live config from ${tmpFile}`);
  }

  // --- REMOVED external health checks ---

  // Generate new test cases
  logger.info('Generating test cases...');
  const redteamConfig = await doGenerateRedteam({
    ...options,
    config: configPath,
    output: redteamPath,
    force: options.force,
    verbose: options.verbose,
    delay: options.delay,
    inRedteamRun: true,
    abortSignal: options.abortSignal,
    progressBar: options.progressBar,
  });

  // If no tests were generated, skip the scan
  if (!redteamConfig || !fs.existsSync(redteamPath)) {
    logger.info('No test cases generated. Skipping scan.');
    return;
  }

  // Run evaluation against the generated tests
  logger.info('Running scan...');
  const { defaultConfig } = await loadDefaultConfig();
  const evalResult = await doEval(
    {
      ...options,
      config: [redteamPath],
      output: options.output ? [options.output] : undefined,
      cache: true,
      write: true,
      filterProviders: options.filterProviders,
      filterTargets: options.filterTargets,
    },
    defaultConfig,
    redteamPath,
    {
      showProgressBar: options.progressBar,
      abortSignal: options.abortSignal,
      progressCallback: options.progressCallback,
    }
  );

  logger.info(chalk.green('\nRed team scan complete!'));

  // Point user to the local report only
  const command = isRunningUnderNpx() ? 'npx promptfoo' : 'promptfoo';
  logger.info(
    chalk.blue(`To view results, run ${chalk.bold(`${command} redteam report`)}`)
  );

  // Clear any log callbacks
  setLogCallback(null);
  return evalResult;
}

