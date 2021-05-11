import Application, { Context, Middleware } from 'koa';
import authorizeBearerUser, { TokenClaims } from 'src/token/authorize-bearer';

export default async function koaAuthorizationBearerMiddleware(
  appKey: string,
  fn?: (claims: TokenClaims, next: Application.Next) => Promise<any>,
): Promise<any> {
  const middleWare: Middleware = async (ctx: Context, next) => {
    const { authorization } = ctx.headers;
    if (!authorization) {
      return next();
    }
    const claims = await authorizeBearerUser(appKey, authorization);

    if (fn) {
      return fn(claims, next);
    }

    ctx.state.claims = claims;

    return next();
  };
  return middleWare;
}
