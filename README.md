# Storybook Addon Apollo Client

Use Apollo Client in your Storybook stories.

## Versions

- If you're using Apollo Client 2.x and Storybook 5.x use version 1.x
- If you're using Apollo Client 2.x or 3.x and Storybook 6.x use version 4.x

## Install

**yarn**

```
yarn add --dev storybook-addon-apollo-client
```

**npm**

```
npm install -D storybook-addon-apollo-client
```

Add the addon to your configuration in `.storybook/main.js`

```js
module.exports = {
  ...config,
  addons: [
    ...your addons
    "storybook-addon-apollo-client",
  ],
};
```

add the following to your `.storybook/preview.js`

```js
import { MockedProvider } from '@apollo/client/testing'; // Use for Apollo Version 3+
// import { MockedProvider } from "@apollo/react-testing"; // Use for Apollo Version < 3

export const parameters = {
  apolloClient: {
    MockedProvider,
    // any props you want to pass to MockedProvider on every story
  },
};
```

## Upgrading from a previous version

In previous versions, we had a decorator called `withApolloClient` this is no longer nesscessary. If you're upgrading from this API here are the following changes that you'll need to make:

1. remove all code referencing the deprecated withApolloClient decorator.
2. follow install instructions

## Writing your stories with queries

```jsx
import DashboardPage, { DashboardPageQuery } from '.';

export default {
  title: 'My Story',
};

export const Example = () => <DashboardPage />;

Example.parameters = {
  apolloClient: {
    // do not put MockedProvider here, you can, but its preferred to do it in preview.js
    mocks: [
      {
        request: {
          query: DashboardPageQuery,
        },
        result: {
          data: {
            viewer: null,
          },
        },
      },
    ],
  },
};
```

Read more about the options available for MockedProvider at https://www.apollographql.com/docs/react/development-testing/testing

### Usage

In Storybook, click "Show Addons" and navigate to the "Apollo Client" tab.

![Addon UI Preview](preview.png)

## Example App

To see real world usage of how to use this addon, check out the example app:

https://github.com/lifeiscontent/realworld

## Loading State

You can use the `delay` parameter to simulate loading state.

```
import DashboardPage, { DashboardPageQuery } from '.';

export default {
  title: 'My Story',
};

export const Example = () => <DashboardPage />;

Example.parameters = {
  apolloClient: {
    mocks: [
      {
        // Use `delay` parameter to increase loading time
        delay: 1e21,
        request: {
          query: DashboardPageQuery,
        },
        result: {
          data: {},
        },
      },
    ],
  },
};
```

## Error State

You can use the `error` parameter to create error state.

```
import DashboardPage, { DashboardPageQuery } from '.';

export default {
  title: 'My Story',
};

export const Example = () => <DashboardPage />;

Example.parameters = {
  apolloClient: {
    mocks: [
      {
        request: {
          query: DashboardPageQuery,
        },
        error: new Error('This is a mock network error'),
      },
    ],
  },
};
```


### Vue Support

In order to use this plugin with [@storybook/vue3](https://www.npmjs.com/package/@storybook/vue3):

Add the addon to your configuration in `.storybook/main.js`

```js
module.exports = {
  ...config,
  addons: [
    ...your addons
    "storybook-addon-apollo-client/preset-vue",
  ],
};
```

create a component in `.storebook/MockedProvider.vue`
```vue
<script setup lang="ts">
import { ApolloClient, DefaultOptions } from '@apollo/client/core';
import { InMemoryCache as Cache } from '@apollo/client/cache';
import { MockLink, MockedResponse } from '@apollo/client/testing/core';
import type { ApolloLink } from '@apollo/client/link/core';
import type { Resolvers } from '@apollo/client/core';
import type { ApolloCache } from '@apollo/client/cache';
import {DefaultApolloClient} from "@vue/apollo-composable";
import {provide} from "vue";

export interface MockedProviderOptions<TSerializedCache = {}> {
    mocks?: ReadonlyArray<MockedResponse>;
    addTypename?: boolean;
    defaultOptions?: DefaultOptions;
    cache?: ApolloCache<TSerializedCache>;
    resolvers?: Resolvers;
    childProps?: object;
    children?: any;
    link?: ApolloLink;
}

const {
    mocks,
    addTypename,
    defaultOptions,
    cache,
    resolvers,
    link
} = defineProps<MockedProviderOptions>();

const client = new ApolloClient({
    cache: cache || new Cache({ addTypename }),
    defaultOptions,
    link: link || new MockLink(
        mocks || [],
        addTypename,
    ),
    resolvers,
});

provide(DefaultApolloClient as Symbol, client);
</script>

<template>
    <slot></slot>
</template>
```

> **_NOTE:_**  If someone with time could publish the component as a separate package installation and usage could be simplified

add the following to your `.storybook/preview.js`

```js
import MockedProvider from './MockedProvider'; // Use for Apollo Version 3+

export const parameters = {
  apolloClient: {
    MockedProvider,
    // any props you want to pass to MockedProvider on every story
  },
};
```

any other instruction will work as expected.
