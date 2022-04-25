#!/usr/bin/env node

'use strict';

// This example mounts 2 raneto instances with different configurations in the same server

// Modules
const debug = require('debug')('raneto');
const path = require('path');

// Here is where we load Raneto.
// When you are in your own project repository,
// Raneto should be installed via NPM and loaded as:
// var raneto = require('raneto');
//
// For development purposes, we load it this way in this example:
const raneto = require('../app/index.js');

// Load our base configuration file.
// const config = require('./config.default.js');
const config = require('./config.custom.js');

const express = require('express');

// NOTE: __dirname = /opt/raneto/example

// Directory where Raneto data is stored or referenced from the Docker host, such as the 'content' directory
const data_dir = '/data'; 

// Create two subapps with different configurations for language support
const appEn = raneto(Object.assign({}, config, { base_url : '/en', locale : 'en', nowrap : true }));
//const appEs = raneto(Object.assign({}, config, { base_url : '/es', locale : 'es', nowrap : true }));

// Create subapps with different configurations
//const appRoot         = raneto(Object.assign({}, config, { base_url : '/', content_dir : path.join(data_dir, 'content'), nowrap : true }));
const appCoding               = raneto(Object.assign({}, config, { base_url : '/en/coding', content_dir : path.join(data_dir, 'content', 'coding'), nowrap : true }));
const appDevOps               = raneto(Object.assign({}, config, { base_url : '/en/devops', content_dir : path.join(data_dir, 'content', 'devops'), nowrap : true }));
const appSoftwareArchitecture = raneto(Object.assign({}, config, { base_url : '/en/software-architecture', content_dir : path.join(data_dir, 'content', 'software-architecture'), nowrap : true }));

// Create the main app
const mainApp = express();
//mainApp.use('/en', appEn);
//mainApp.use('/es', appEs);
mainApp.use('/en/coding', appCoding);
mainApp.use('/en/devops', appDevOps);
mainApp.use('/en/software-architecture', appSoftwareArchitecture);

//mainApp.use('/', appRoot); // lastly, default to Root.
mainApp.use('/en', appEn); // lastly, default to English. DO NOT USE A SLASH ONLY!

// Redirect root to English
mainApp.get('/', (req, res) => {
  // The optional first parameter to `res.redirect()` is a numeric
  // HTTP status.
  res.redirect(301, '/en');
});

// For testing only
// console.log('__dirname = ', __dirname); // = /opt/raneto/example

// Load the HTTP Server
const server = mainApp.listen(appEn.get('port'), appEn.get('host'), function () {
  debug('Express HTTP server listening on port ' + server.address().port);
});

// Now you can navigate to both:
// - http://localhost:3000/en
// - http://localhost:3000/es
// - http://localhost:3000/
// - http://localhost:3000/coding
// - http://localhost:3000/devops
// - http://localhost:3000/software-architecture
