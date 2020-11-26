# Storybook Addon Apollo Client

Use Apollo Client in your Storybook stories.

## Install

**yarn**
```
yarn add --dev storybook-addon-apollo-client
```

**npm**

```
npm install -D storybook-addon-apollo-client
```

## As a decorator in a story

```jsx
import { withApolloClient } from 'storybook-addon-apollo-client';
import MyComponentThatHasAQuery, {
  MyQuery,
} from '../component-that-has-a-query';

export default {
  title: 'My Story',
  decorators: [withApolloClient],
};

export const example = () => <MyComponentThatHasAQuery />;

example.story = {
  parameters: {
    apolloClient: {
      mocks: [
        { request: { query: MyQuery }, result: { data: { viewer: null } } },
      ],
    },
  },
};
```

## Usage in `preview.js`

```js
import { withApolloClient } from 'storybook-addon-apollo-client';
import { addDecorator } from '@storybook/react';
import { InMemoryCache } from 'apollo-cache-inmemory';

const cache = new InMemoryCache();

addDecorator(
  withApolloClient({
    cache,
    ...// take a look at all the options in https://www.apollographql.com/docs/react/development-testing/testing
    // everything that is used in `storybook-addon-apollo-client` is a 1 to 1 mapping of MockedProvider
  })
);
```

if you setup `withApolloClient` in preview, it will not need to be added to the `decorators` key in each story, consider doing this if you have a lot of stories that depend on Apollo.

Read more about the options available for MockedProvider at https://www.apollographql.com/docs/react/development-testing/testing

## Usage with Addon UI

An optional Addon allows you to visualize the mocked requests attached to each Story.

Register the addon in `./storybook/addons.js`
```
import "storybook-addon-apollo-client/register";
```

Add the addon to your configuration in `./storybook/main.js`
```
module.exports = {
  ...config,
  addons: [
    ...your addons
    "storybook-addon-apollo-client",
  ],
};
```

In Storybook, click "Show Addons" and navigate to the "Apollo Client" tab.
This is best viewed in vertical orientation using the "Change addons orientation" option.

**Request**
![Storybook Apollo Request UI](https://user-images.githubusercontent.com/428636/100296292-c9d97a80-2f59-11eb-980b-2950b3875c8e.png)

**Response**
![Storybook Apollo Response UI](https://user-images.githubusercontent.com/428636/93371320-29abfa80-f820-11ea-8966-a329bcdce34e.png)

## Example App

To see real world usage of how to use this addon, check out the example app:

https://github.com/lifeiscontent/realworld
