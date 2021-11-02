import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { StringUtils, TokenClaims } from '@azure/msal-common';
import { IdTokenClaims } from '../models/IdTokenClaims.type';
import { Configuration } from '@azure/msal-node';
import { AuthSettings } from '../models/AuthSettings.type';

export class TokenValidatorService {
  constructor(private tenantId: string, private msalConfig: Configuration) {}

  async validateToken(authToken: string) {
    const verifiedToken = await this.verifyTokenSignature(authToken);
    this.validateIdTokenClaims(verifiedToken as IdTokenClaims);
  }

  private validateIdTokenClaims(idTokenClaims: IdTokenClaims) {
    const now = Math.round(new Date().getTime() / 1000);

    if (!idTokenClaims.iss.includes(this.tenantId)) {
      throw 'Invalid issuer.';
    }

    if (idTokenClaims.aud !== this.msalConfig.auth.clientId) {
      throw 'Invalid audience.';
    }

    if (idTokenClaims.iat <= now && idTokenClaims.exp >= now === false) {
      throw 'Token is expired.';
    }
  }

  private async verifyTokenSignature(authToken: string): Promise<TokenClaims> {
    if (StringUtils.isEmpty(authToken)) {
      throw 'No token found';
    }

    let decodedToken;

    try {
      decodedToken = jwt.decode(authToken, { complete: true });
    } catch (error) {
      throw 'Token cannot be decoded';
    }

    let keys;

    try {
      keys = await this.getSigningKeys(
        decodedToken.header,
        decodedToken.payload.tid
      );
    } catch (error) {
      throw 'Signing keys cannot be obtained.';
    }

    try {
      return jwt.verify(authToken, keys) as TokenClaims;
    } catch (error) {
      throw 'Token cannot be verified.';
    }
  }

  private async getSigningKeys(header, tid: string): Promise<string> {
    const jwksUri = `https://login.microsoftonline.com/${tid}/discovery/v2.0/keys`;
    const client = jwksClient({
      jwksUri: jwksUri,
    });

    return (await client.getSigningKeyAsync(header.kid)).getPublicKey();
  }
}
