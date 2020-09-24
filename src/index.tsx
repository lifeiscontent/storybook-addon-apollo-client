import React from 'react';
import { makeDecorator } from '@storybook/addons';
import { MockedProvider } from '@apollo/client/testing';

import config from './config';
import './register';

const { decoratorName, parameterName } = config;

export const withApolloClient = makeDecorator({
  name: decoratorName,
  parameterName,
  wrapper(getStory, context, settings) {
    return (
      <MockedProvider {...settings.options} {...settings.parameters}>
        {getStory(context)}
      </MockedProvider>
    );
  },
});
