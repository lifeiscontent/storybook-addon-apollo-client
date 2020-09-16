import React from 'react';
import { DocumentWrapper } from '@storybook/components';
import { useParameter } from '@storybook/api';

import config from '../config';
import { ErrorBoundary } from './error-boundary';
import { ErrorFallback, Empty } from './fallbacks';
import { formatMockedQuery } from './utils';
import { Parameters } from './types';
import { QueriesList } from './query-list';

const { parameterName } = config;

const ApolloClientQueriesList = () => {
  const storyParams = useParameter<Parameters | undefined>(parameterName);

  /* No Apollo Client parameters found on this story */
  if (!storyParams) {
    return null;
  }

  /* No mock requests provided, or mocks are intentionally empty */
  // Empty array of mock data can be used to test loading states
  // https://www.apollographql.com/docs/react/development-testing/testing/#testing-loading-states
  const { mocks } = storyParams;
  if (!mocks?.length) {
    return <Empty />;
  }

  /* Transform Apollo MockedProvider mocks for display */
  return <QueriesList queries={mocks.map(formatMockedQuery)} />;
};

export const ApolloClientPanel = () => (
  <DocumentWrapper>
    <div style={{ padding: '1rem' }}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ApolloClientQueriesList />
      </ErrorBoundary>
    </div>
  </DocumentWrapper>
);
