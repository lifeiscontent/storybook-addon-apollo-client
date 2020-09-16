import React from 'react';
import { Icons } from '@storybook/components';

export const Empty: React.FC = () => <p>No mocked queries found.</p>;

export const ErrorFallback = () => (
  <div style={{ display: 'flex' }}>
    <Icons icon="facesad" style={{ width: '2rem', marginRight: '1rem' }} />
    <p>
      Something went wrong. Check the console and your query configuration for
      more details.
    </p>
  </div>
);
