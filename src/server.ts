import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();


app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);


app.use('/**', (req, res, next) => {
  console.log('Rendering request:', req.url);  
  angularApp
    .handle(req)
    .then((response) => {
      if (response) {
        writeResponseToNodeResponse(response, res);
      } else {
        next();
      }
    })
    .catch((err) => {
      console.error('SSR Error:', err); 
      next(err);
    });
});


if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}


export const reqHandler = createNodeRequestHandler(app);
