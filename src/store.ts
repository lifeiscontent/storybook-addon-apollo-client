import { MockedResponse } from './types';

export let store: {
  queries: string[];
  mocks: MockedResponse[];
  activeIndex: number;
} = {
  queries: [],
  mocks: [],
  activeIndex: -1,
};

type Listener = (updatedStore: typeof store) => void;

let subscribers: Listener[] = [];

export const setStore = (
  nextStore: Partial<typeof store> | ((prevStore: typeof store) => typeof store)
) => {
  store =
    nextStore instanceof Function
      ? nextStore(store)
      : { ...store, ...nextStore };
  subscribers.forEach((x) => x(store));
};

export const subscribeStore = (subscriber: Listener) => {
  subscribers.push(subscriber);
  subscriber(store);
  return () => {
    subscribers = subscribers.filter((x) => x === subscriber);
  };
};
