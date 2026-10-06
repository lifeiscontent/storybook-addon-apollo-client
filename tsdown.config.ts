import { defineConfig, type UserConfig } from 'tsdown';
import packageJson from './package.json' with { type: 'json' };

// package.json lists the entries of each kind:
// "bundler": { "managerEntries": [...], "previewEntries": [...], "nodeEntries": [...] }
const {
  bundler: { managerEntries = [], previewEntries = [], nodeEntries = [] },
} = packageJson as { bundler: Record<string, string[] | undefined> };

const NODE_TARGET = 'node22.12'; // The lowest Node version that Storybook 11 supports

const commonConfig: UserConfig = {
  format: 'esm',
  // Use .js and .d.ts, because package.json has "type": "module".
  fixedExtension: false,
  deps: {
    neverBundle: [
      // Storybook supplies these packages, so they are not dependencies.
      'react',
      'react-dom',
      '@storybook/icons',
      // Users of the /vue and /angular entries install these packages. They
      // are not peer dependencies, because npm fails on the peer ranges of
      // optional peers that are not installed.
      /^vue$/,
      /^@vue\/apollo-composable$/,
      /^apollo-angular$/,
      /^@angular\/core$/,
    ],
    // Peer dependencies are external automatically.
    // Fail the build if a dependency gets bundled into the output.
    onlyBundle: [],
  },
};

const configs: UserConfig[] = [];

// Manager entries load in the manager UI. Storybook bundles them again, so
// they target esnext and need no types.
if (managerEntries.length) {
  configs.push({ ...commonConfig, entry: managerEntries, platform: 'browser', target: 'esnext', dts: false });
}

// Preview entries load in the preview iframe. Users import them in
// .storybook/preview.ts, so they have types.
if (previewEntries.length) {
  configs.push({ ...commonConfig, entry: previewEntries, platform: 'browser', target: 'esnext', dts: true });
}

// Node entries, for example presets, run in Node.
if (nodeEntries.length) {
  configs.push({ ...commonConfig, entry: nodeEntries, platform: 'node', target: NODE_TARGET, dts: false });
}

export default defineConfig(configs);
