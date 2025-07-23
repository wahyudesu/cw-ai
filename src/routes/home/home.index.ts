import type { Context } from 'hono';

import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';

// src/routes/home/home.index.ts
import { createRouter } from '@/lib/create-app';

const router = createRouter();

// Helper function to escape HTML
function escapeHtml(str: string) {
  return str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
      })[tag] || tag
  );
}

// Data
const features = [
  { icon: '⚡', text: 'Blazing fast Hono.js server' },
  { icon: '🚀', text: 'Deploy everywhere - both server and serverless' },
  { icon: '🔐', text: 'Built-in authentication system' },
  { icon: '🗝️', text: 'API key management' },
  { icon: '🛒', text: 'Complete products API' },
  { icon: '📝', text: 'OpenAPI documentation with Scalar' },
  { icon: '🔁', text: 'Edge-ready with Cloudflare Workers' },
  { icon: '💻', text: 'Support multiple model with AI SDK' },
];

const deploymentOptions = [
  {
    title: 'Railway | Render (Node js Server)',
    link: 'https://hono-api-starterkit-production.up.railway.app',
    steps: [
      'No changes Needed: `git clone repo url`',
      'Run `pnpm install`',
      'Add Variables: `create .env from .env.example`',
      'Test Locally: seed and then run pnpm dev',
      'Push to github and Deploy to Railway',
    ],
    note: 'Railway can also give you a postgress Database URL instead of Neon.',
  },
  {
    title: 'Vercel Ege Runtime (serverless)',
    link: 'https://hono-api-starterkit-vercel-edge.vercel.app',
    steps: [
      'You have two ways to do this`',
      '1. You can get clone the already configured kit',
      '2. You can follow the steps in readme file to get started',
    ],
    note: 'You can test locally by running pnpm run vercel:dev',
  },
  {
    title: 'Cloudflare',
    link: 'https://hono-starter-kit.gmukejohnbaptist.workers.dev/',
    steps: [
      'A lot of Changes , You need to have the starter kit',
      'Install Wrangler: `npm install -g wrangler`',
      'Authenticate: `wrangler login`',
      'Configure wrangler.toml',
      'Set environment variables',
      'Deploy with `wrangler publish`',
    ],
    note: 'Works great with Cloudflare Workers and Pages.',
  },
];

// HTML Route
router.get('/', (c: Context) => {
  // Generate feature HTML
  const featuresHtml = features
    .map(
      (feature) => `
    <li class="flex items-center bg-white p-4 rounded-lg shadow-sm">
      <span class="feature-icon">${escapeHtml(feature.icon)}</span>
      <span>${escapeHtml(feature.text)}</span>
    </li>
  `
    )
    .join('');

  // Generate deployment options HTML
  const deploymentHtml = deploymentOptions
    .map(
      (option) => `
    <div class="bg-white p-6 rounded-lg shadow-sm">
      <a href=${option.link} class="text-xl font-medium mb-3 text-indigo-600 block">${escapeHtml(option.title)}</a>
      <ol class="list-decimal pl-5 space-y-1 mb-3">
        ${option.steps.map((step) => `<li class="text-sm">${escapeHtml(step)}</li>`).join('')}
      </ol>
      <p class="text-sm text-gray-500">${escapeHtml(option.note)}</p>
    </div>
  `
    )
    .join('');

  const aboutHonoHtml = `
    <section class="mb-12 bg-white p-6 rounded-lg shadow-sm">
      <h2 class="text-2xl font-semibold mb-4 text-gray-800">🌟 About This Project</h2>
      <div class="space-y-4">
        <p class="text-gray-700">
          A lightweight, fast, and flexible web framework designed for modern web applications and APIs.
        </p>
        <h3 class="text-xl font-medium text-indigo-600">Why choose Typescript over Python?</h3>
        <ul class="list-disc pl-5 space-y-2">
          <li><strong>Universal Deployment:</strong> Write once, run anywhere—Node.js, serverless, edge, and more</li>
          <li><strong>Type Safety:</strong> Catch errors early and improve code reliability with static typing</li>
          <li><strong>Performance:</strong> Fast runtime and optimized for backend and AI/ML workloads</li>
          <li><strong>Modern Ecosystem:</strong> Rich libraries, tooling, and seamless integration with JavaScript</li>
          <li><strong>Scalability:</strong> Easy to maintain and scale large codebases for production</li>
          <li><strong>Edge Ready:</strong> Designed for edge platforms like Cloudflare Workers</li>
          <li><strong>AI SDK:</strong> Standardizes integration of AI models across providers</li>
        </ul>
        <div class="mt-4 p-4 bg-indigo-50 rounded-lg">
          <p class="text-indigo-700">
            <strong>Key Motivation:</strong> Hono was created to bridge the gap between traditional server frameworks
            and modern edge computing, providing developers with a unified way to build applications that can run
            anywhere without code changes. 
          </p>
        </div>
      </div>
    </section>
  `;

  const htmlContent = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title> Simple AI Backend Typescript Starter Kit </title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          .feature-icon { width: 24px; height: 24px; margin-right: 8px; }
        </style>
      </head>
      <body class="bg-gray-50">
        <div class="max-w-4xl mx-auto px-4 py-12">
          <header class="mb-12 text-center">
            <h1 class="text-4xl font-bold text-indigo-700 mb-4">Simple AI Backend Typescript Starter Kit</h1>
            <p class="text-xl text-gray-600">
            Simple starter repo for your Machine Learning/AI projects
            A robust, production-ready API starter built with Hono, Prisma, and OpenAPI
            </p>
          </header>

          <!-- Features Section -->
          <section class="mb-12">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800">✨ Features</h2>
            <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${featuresHtml}
            </ul>
          </section>

          <!-- Deployment Section -->
          <section class="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800 md:col-span-3">☁️ Deployment</h2>
            ${deploymentHtml}
          </section>

          <!-- New About Hono Section -->
          ${aboutHonoHtml}

          <footer class="text-center text-gray-500 text-sm">
            <p>Visit <a href="/scalar" class="text-indigo-600 hover:underline">/API Docs</a> for API documentation</p>
            <p class="mt-2">This starter kit represents ~40-60 hours of development time</p>
          </footer>
        </div>
      </body>
    </html>`;

  return c.html(htmlContent);
});
// Separate the OpenAPI handler to ensure proper typing
function openApiHandler(c: Context) {
  const accept = c.req.header('Accept');

  if (accept?.includes('text/html')) {
    // Return a proper redirect response
    return c.redirect('/', HttpStatusCodes.MOVED_TEMPORARILY);
  }

  // Explicitly return the JSON response
  return c.json({
    message: 'Welcome to the Product API Starter Kit',
    html: 'Visit this route in a browser for a beautiful HTML interface',
  });
}

// Keep the OpenAPI route for API clients
router.openapi(
  createRoute({
    tags: ['Home'],
    method: 'get',
    path: '/',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        z.object({
          message: z.string(),
          html: z.string().optional().describe('Visit this route in a browser for HTML response'),
        }),
        'API Home'
      ),
      [HttpStatusCodes.MOVED_TEMPORARILY]: {
        description: 'Redirects to HTML version when Accept header includes text/html',
        headers: z.object({
          Location: z.string().url(),
        }),
      },
    },
  }),
  openApiHandler
);

export default router;
