const isDev = import.meta.env.DEV;

export const env = {
  appName: "쿠팡 클론",
  apiBaseUrl:
    import.meta.env.VITE_API_BASE_URL ?? (isDev ? "http://localhost:3000" : ""),
  isDev,
  isProd: import.meta.env.PROD,
};
