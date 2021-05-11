import tryToCatch from 'try-to-catch';
import { jwt } from 'highoutput-auth';
import AccessTokenExpiredError from '../library/errors/access-token-expired-error';
import ForbiddenError from '../library/errors/invalid-request-error';

export type TokenClaims = {
  id: string;
  externalId?: string;
  iat: number;
  exp: number;
  sub: string;
};

export default async function authorizeBearerUser(
  appKey: string,
  authorization: string,
): Promise<TokenClaims> {
  const [type, token] = authorization.split(' ');
  if (type.toLowerCase() !== 'bearer') {
    throw new ForbiddenError(
      `\`${type}\` authorization type is not supported.`,
    );
  }

  const [error, claims] = await tryToCatch(() => jwt.verify(token, appKey));
  if (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AccessTokenExpiredError();
    }

    throw new ForbiddenError('Access token is invalid.');
  }

  return claims;
}
