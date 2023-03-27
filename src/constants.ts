export const ADDON_ID = 'apollo-client' as const;
export const PANEL_ID = `${ADDON_ID}/panel` as const;
export const PARAM_KEY = 'apolloClient' as const;
export const EVENTS = {
  REQUEST: `${ADDON_ID}/REQUEST`,
  RESULT: `${ADDON_ID}/RESULT`,
} as const;
