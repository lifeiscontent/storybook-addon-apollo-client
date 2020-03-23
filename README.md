# Storybook Addon Apollo Client

Use Apollo Client in your Storybook stories.

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
