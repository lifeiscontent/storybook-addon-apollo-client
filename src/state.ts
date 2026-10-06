import { print } from 'graphql';
import type { ApolloClientAddonState, MockedResponseLike } from './types';

function getMockName(mock: MockedResponseLike) {
  if (mock.request.operationName) {
    return mock.request.operationName;
  }

  const operationDefinition = mock.request.query.definitions.find(
    (definition) => definition.kind === 'OperationDefinition',
  );

  return operationDefinition?.name?.value ?? 'Unnamed';
}

/** Adds a number to names that occur more than once, so each option is unique. */
function getMockLabels(mocks: ReadonlyArray<MockedResponseLike>) {
  const names = mocks.map(getMockName);
  const seen = new Map<string, number>();

  return names.map((name) => {
    if (names.indexOf(name) === names.lastIndexOf(name)) {
      return name;
    }

    const count = (seen.get(name) ?? 0) + 1;
    seen.set(name, count);
    return `${name} (${count})`;
  });
}

function serializeError(error: Error): object {
  // Apollo Client errors keep their data in own properties, for example
  // `errors` on CombinedGraphQLErrors and `statusCode` on ServerError.
  return Object.assign(
    { name: error.name, message: error.message },
    error,
    error.cause === undefined ? {} : { cause: error.cause },
  );
}

function replacer(_key: string, value: unknown) {
  if (typeof value === 'function') {
    return value.name ? `[Function ${value.name}]` : '[Function]';
  }

  if (value instanceof Error) {
    return serializeError(value);
  }

  // JSON has no Infinity or NaN. Apollo Client uses Infinity for maxUsageCount.
  if (typeof value === 'number' && !Number.isFinite(value)) {
    return String(value);
  }

  return value;
}

/**
 * Turns a value from a mock into text for the panel.
 * Returns `undefined` when the panel must show its placeholder.
 */
export function formatValue(value: unknown): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  try {
    return JSON.stringify(value, replacer, 2);
  } catch {
    // For example, a value that refers to itself.
    return String(value);
  }
}

function formatMockOptions({ delay, maxUsageCount }: MockedResponseLike) {
  if (delay === undefined && maxUsageCount === undefined) {
    return undefined;
  }

  return formatValue({ delay, maxUsageCount });
}

/** Makes the panel state for the mock at `activeIndex`. */
export function getApolloClientAddonState(
  mocks: ReadonlyArray<MockedResponseLike>,
  activeIndex: number,
): ApolloClientAddonState {
  const options = getMockLabels(mocks);
  const mock = mocks[activeIndex];

  if (!mock) {
    return { options, activeIndex: -1 };
  }

  return {
    options,
    activeIndex,
    query: print(mock.request.query),
    variables: formatValue(mock.request.variables ?? mock.variableMatcher),
    extensions: formatValue(mock.request.extensions),
    context: formatValue(mock.request.context),
    result: formatValue(mock.result),
    error: formatValue(mock.error),
    mockOptions: formatMockOptions(mock),
  };
}
