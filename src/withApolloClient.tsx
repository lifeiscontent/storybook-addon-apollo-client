import { useChannel } from "@storybook/preview-api";
import { EVENTS, PARAM_KEY } from "./constants";
import { print } from "graphql";
import { MockedProvider } from "@apollo/client/testing";
import { DecoratorFunction } from "@storybook/types";

export const withApolloClient: DecoratorFunction = (StoryFn, context) => {
  const props = context.parameters[PARAM_KEY] ?? {};
  const Story = StoryFn as React.FC;

  const emit = useChannel({
    [EVENTS.REQUEST]: () => {
      emit(EVENTS.RESULT, {
        mocks: props.mocks ?? [],
        queries: props.mocks?.map((mock) => print(mock.request.query)) ?? [],
      });
    },
    [EVENTS.CLEAR]: () => {
      emit(EVENTS.RESULT, {
        mocks: [],
        queries: [],
      });
    },
  });

  if (!props.mocks?.length) {
    return <Story />;
  }

  return (
    <MockedProvider {...props}>
      <Story />
    </MockedProvider>
  );
};
