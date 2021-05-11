import Application, { Context, Middleware } from 'koa';
import authorizeBearerUser, { TokenClaims } from 'src/token/authorize-bearer';

export default function koaAuthorizationBearerMiddleware(
  appKey: string,
  fn?: (
    claims: TokenClaims,
    ctx: Context,
    next: Application.Next,
  ) => Promise<any>,
): Middleware {
  const middleWare: Middleware = async (ctx: Context, next) => {
    const { authorization } = ctx.headers;
    if (!authorization) {
      return next();
    }
    const claims = await authorizeBearerUser(appKey, authorization);

    if (fn) {
      return fn(claims, ctx, next);
    }

    ctx.state.claims = claims;

    return next();
  };
  return middleWare;
}
