import 'zone.js/dist/zone-node';
import {enableProdMode} from '@angular/core';
// Express Engine
import {ngExpressEngine} from '@nguniversal/express-engine';
// Import module map for lazy loading
import {provideModuleMap} from '@nguniversal/module-map-ngfactory-loader';

import * as express from 'express';
import * as proxy from 'http-proxy-middleware'
import {join} from 'path';

// https://www.pika.dev/packages/ngx-owl-carousel-o
// -----------------------------------------------------------------------------------
import { readFileSync } from 'fs'; // import readFileSync            (1)
const domino = require('domino');  // import the library `domino`    (2)
// -----------------------------------------------------------------------------------

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist/browser');

// https://github.com/chimurai/http-proxy-middleware
// Add middleware for http proxying
const apiProxy = proxy({ target: 'http://ann-shop-server.com', changeOrigin: true });
const imageProxy = proxy({ target: 'http://system.hethongann.com', changeOrigin: true });
const noImageapiProxy = proxy({ target: 'http://system.hethongann.com', changeOrigin: true });

app.use('/api/v1', apiProxy);
app.use('/uploads/images', imageProxy);
app.use('/App_Themes/Ann/image', noImageapiProxy);

// https://www.pika.dev/packages/ngx-owl-carousel-o
// -----------------------------------------------------------------------------------
const template = readFileSync(join(DIST_FOLDER, 'index.html')).toString(); // use `index.html` as template (3)
const win = domino.createWindow(template); // create object Window                     (4)
global['Event'] = win.Event;               // assign the `win.Event` to prop `Event`   (5)
// -----------------------------------------------------------------------------------


// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('./dist/server/main');

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
        provideModuleMap(LAZY_MODULE_MAP)
    ]
}));

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });
// Serve static files from /browser
app.get('*.*', express.static(DIST_FOLDER, {
    maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
    res.render('index', { req });
});

// Start up the Node server
app.listen(PORT, () => {
    console.log(`Node Express server listening on http://localhost:${PORT}`);
});
