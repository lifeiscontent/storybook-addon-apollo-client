import { useParameter } from "@storybook/manager-api";
import { PARAM_KEY } from "./constants";

export function Title() {
  const { mocks = [] } = useParameter(PARAM_KEY, {
    mocks: [],
  });

  return mocks.length ? `Apollo Client (${mocks.length})` : "Apollo Client";
}
