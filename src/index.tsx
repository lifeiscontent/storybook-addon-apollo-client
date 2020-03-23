import React from 'react';
import { makeDecorator } from '@storybook/addons';
import { MockedProvider } from '@apollo/react-testing';

export const withApolloClient = makeDecorator({
  name: 'ApolloClient',
  parameterName: 'apolloClient',
  wrapper(getStory, context, settings) {
    return (
      <MockedProvider {...settings.options} {...settings.parameters}>
        {getStory(context)}
      </MockedProvider>
    );
  },
});
