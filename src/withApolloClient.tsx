/* eslint-disable react-hooks/rules-of-hooks */
import type { Renderer, StoryContext } from '@storybook/types';
import { EVENTS, PARAM_KEY } from './constants';
import { useEffect, useChannel } from '@storybook/preview-api';
import { print } from 'graphql';

export function withApolloClient<T extends Renderer>(
  Story: React.FC<unknown>,
  context: StoryContext<T>
): T['storyResult'] {
  const {
    MockedProvider,
    mocks: providedMocks,
    globalMocks,
    ...props
  } = context.parameters[PARAM_KEY];

  const emit = useChannel({}, []);
  useEffect(() => {
    const mocks = [...(globalMocks ?? []), ...(providedMocks ?? [])];
    emit(EVENTS.RESULT, {
      activeIndex: mocks.length ? 0 : -1,
      mocks,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queries: mocks.map((mock: any) => print(mock.request.query)),
    });
  }, [emit, globalMocks, providedMocks]);

  if (!MockedProvider) {
    console.warn(
      'storybook-addon-apollo-client: MockedProvider is missing from parameters in preview'
    );

    return <Story />;
  }

  return (
    <MockedProvider
      {...props}
      mocks={[...(globalMocks ?? []), ...(providedMocks ?? [])]}
    >
      <Story />
    </MockedProvider>
  );
}
