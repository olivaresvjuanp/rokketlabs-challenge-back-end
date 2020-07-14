import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
//import https from 'https';
import mongoose from 'mongoose';

import { apiRouter } from './routes';
import config from './config.json';

const app = express();

app.use(bodyParser.json()); // For parsing application/json.
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded.
app.use('/api/animals', apiRouter.animals); // API routes.

app.get('/', (req, res) => {
  res.send('Hello World!');
});

mongoose.connect(config.mongo.uri, { // We have to connect the DB before starting the server.
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then((): void => {
    try {
      http.createServer(app).listen(config.server.port);
    } catch (error) {
      throw error; // Throws error when HTTP server can't start.
    }

    console.log(`Server listening on ${config.server.port}`);
  })
  .catch(error => {
    throw error; // Throws error when mongoose can't connect.
  });
