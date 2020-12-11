import { PluginItem, TransformOptions } from '@babel/core';

export function config(entry: unknown[] = []): unknown[] {
  return [...entry, require.resolve('./addDecorator')];
}

export function managerEntries(entry: unknown[] = []): unknown[] {
  return [...entry, require.resolve('../register')];
}

export function babelDefault(config: TransformOptions): TransformOptions {
  return {
    ...config,
    plugins: [
      ...(config.plugins as PluginItem[]),
      require.resolve('babel-plugin-graphql-tag'),
    ],
  };
}
