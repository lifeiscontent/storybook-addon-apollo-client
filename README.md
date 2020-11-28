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

Add the addon to your configuration in `.storybook/main.js`
```
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
    Provider: MockedProvider,
    // any props you want to pass to MockedProvider on every story
  },
};
```

## Using with a story with a query

```jsx
import { withApolloClient } from 'storybook-addon-apollo-client';
import MyComponentThatHasAQuery, {
  MyQuery,
} from '../component-that-has-a-query';

export default {
  title: 'My Story',
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

Read more about the options available for MockedProvider at https://www.apollographql.com/docs/react/development-testing/testing

### Usage
In Storybook, click "Show Addons" and navigate to the "Apollo Client" tab.

**Addon UI Preview**
![Addon UI Preview](https://raw.githubusercontent.com/lifeiscontent/storybook-addon-apollo-client/preview.png)

## Example App

To see real world usage of how to use this addon, check out the example app:

https://github.com/lifeiscontent/realworld
