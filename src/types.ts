export type ApolloClientAddonState = {
  options: string[];
  variables?: string;
  query?: string;
  extensions?: string;
  context?: string;
  result?: string;
  error?: string;
  activeIndex: number;
};
