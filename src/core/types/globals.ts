export {};

declare global {
  interface Window {
    __RUNTIME_CONFIG__: {
      NODE_ENV: string;
      API_BASE_PATH: string;
      SOCKET_BASE_PATH: string;
      GOOGLEMAP_ACCESS_TOKEN: string;
    };
  }
}
