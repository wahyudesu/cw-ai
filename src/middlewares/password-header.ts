import { MiddlewareHandler } from 'hono';

export const passwordHeaderMiddleware: MiddlewareHandler = async (c, next) => {
  const password = c.req.header('key');
  const requiredPassword = c.env?.headers;
  if (password !== requiredPassword) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  await next();
};
