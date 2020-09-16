import React from 'react';

import { QueryDetails } from './query-details';
import { QueryMetadata, Tabs } from './types';

type Props = { queries: Array<QueryMetadata> };

/* TODO: Should this be derived from config, or addon settings/params? */
const initialTab = Tabs.Response;

export const QueriesList: React.FC<Props> = ({ queries }) => {
  return (
    <div>
      <h2>Queries</h2>

      {queries.map((query, index) => (
        <QueryDetails
          key={`${query.name}-${index}`}
          initialTab={initialTab}
          {...query}
        />
      ))}
    </div>
  );
};
