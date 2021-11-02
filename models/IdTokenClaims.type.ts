import { TokenClaims } from '@azure/msal-common';

export type IdTokenClaims = TokenClaims & {
  aud?: string;
};
