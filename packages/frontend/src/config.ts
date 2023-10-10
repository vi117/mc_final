export const GOOGLE_APP_CLIENT_ID = import.meta.env
  .VITE_GOOGLE_APP_CLIENT_ID as string;

export const API_URL = import.meta.env.VITE_API_URL ?? window.location.origin;
