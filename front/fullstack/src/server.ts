import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
// Cloud Run's front end adds these headers to every request; without trusting
// them Angular skips SSR and falls back to client-side rendering.
const angularApp = new AngularNodeAppEngine({
  trustProxyHeaders: ['x-forwarded-for', 'x-forwarded-proto'],
});

/**
 * Forward /api requests to the backend, so the browser only ever talks to this
 * server and needs no backend URL or CORS setup.
 */
const backendOrigin = new URL(
  process.env['API_URL_SERVER'] ?? 'http://localhost:8080/api/customers',
).origin;

app.use('/api', express.raw({ type: '*/*' }), async (req, res, next) => {
  try {
    const hasBody = !['GET', 'HEAD'].includes(req.method) && Buffer.isBuffer(req.body);
    const response = await fetch(backendOrigin + req.originalUrl, {
      method: req.method,
      headers: req.headers['content-type'] ? { 'content-type': req.headers['content-type'] } : {},
      body: hasBody ? req.body : undefined,
    });
    res.status(response.status);
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.type(contentType);
    }
    res.send(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    next(error);
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
