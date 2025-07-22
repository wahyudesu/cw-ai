import { Scalar } from '@scalar/hono-api-reference';
import type { AppOpenAPI } from './types';
import packageJSON from '../../package.json' with { type: 'json' };

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: packageJSON.version,
      contact: {
        name: 'Hono Team',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      title: 'Hono Cloudflare Worker CRUD API',
      description:
        'A simple CRUD API built with Hono framework and Zod OpenAPI for Cloudflare Workers\nComplete with validation, error handling, and automatic documentation.',
    },
    servers: [
      {
        url: 'http://localhost:8787',
        description: 'Development server',
      },
    ],
  });

  app.get(
    '/docs',
    Scalar({
      url: '/doc',
      theme: 'kepler',
      layout: 'modern',
      defaultHttpClient: {
        targetKey: 'js',
        clientKey: 'fetch',
      },
    })
  );
}
