import path from 'path';

// Conventional filenames
export const FEATURE_FILENAME_HINT = '.feature.';
export const CONFIG_FILENAME_HINT = '.config.';
export const ENV_FILENAME_HINT = '.env.';
export const CONTEXT_FILENAME_HINT = '.context.';
export const ENGINE_CONFIG_FILE_NAME = 'engine.config.js';

// Packages
export const CORE_PACKAGE = '@wixc3/engine-core';

// Used query params
export const CONFIG_QUERY_PARAM = 'config';
export const FEATURE_QUERY_PARAM = 'feature';

// File naming helpers
export const isCodeModule = (fileName: string) =>
    (fileName.endsWith('.ts') && !fileName.endsWith('.d.ts')) || fileName.endsWith('.tsx') || fileName.endsWith('.js');
export const isConfigFile = (fileName: string) => fileName.indexOf(CONFIG_FILENAME_HINT) >= 1 && isCodeModule(fileName);
export const isEnvFile = (fileName: string) => fileName.indexOf(ENV_FILENAME_HINT) >= 1 && isCodeModule(fileName);
export const isFeatureFile = (fileName: string) =>
    fileName.indexOf(FEATURE_FILENAME_HINT) >= 1 && isCodeModule(fileName);
export const isContextFile = (fileName: string) =>
    fileName.indexOf(CONTEXT_FILENAME_HINT) >= 1 && isCodeModule(fileName);

export function parseFeatureFileName(fileName: string): string {
    return fileName.split(FEATURE_FILENAME_HINT).shift()!;
}

export function parseConfigFileName(fileName: string) {
    const fullConfigName = fileName.split(CONFIG_FILENAME_HINT).shift()!;
    const envName = path.extname(fullConfigName);
    const configName = path.basename(fullConfigName, envName);
    return {
        fullConfigName,
        configName,
        envName: envName.slice(1),
    };
}

export function parseEnvFileName(fileName: string) {
    const [featureName, envName, childEnvName] = fileName.split(ENV_FILENAME_HINT).shift()!.split('.');

    if (!featureName || !envName) {
        throw new Error(`cannot parse env file: ${fileName}`);
    }

    return { featureName, envName, childEnvName };
}

export function parseContextFileName(fileName: string) {
    const [featureName, envName, childEnvName] = fileName.split(CONTEXT_FILENAME_HINT).shift()!.split('.');

    if (!featureName || !envName || !childEnvName) {
        throw new Error(`cannot parse context file: ${fileName}`);
    }
    return { featureName, envName, childEnvName };
}
