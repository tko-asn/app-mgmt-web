/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_URL: string;
    readonly REACT_APP_API_ENDPOINT: string;
    readonly REACT_APP_AUTH0_DOMAIN: string;
    readonly REACT_APP_AUTH0_CALLBACK_URL: string;
    readonly REACT_APP_AUTH0_CLIENT_ID: string;
  }
}
