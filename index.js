require('dotenv').config();

const notifyEmployersOfMatches = require('./src/utilities/notifyEmployersOfMatches');

const express = require('express');
const Atlan = require('atlan');
const { MongoClient } = require('mongodb');

// Model import
const { developer } = require('./src/models/developer');
const { employer } = require('./src/models/employer');

const app = express();

const employerLogin = require('./src/employer_login');

(async () => {
  const connection = await MongoClient.connect(process.env.MONGO_URL, { useNewUrlParser: true });
  global.db = connection.db('gmt');
  global.atlan = new Atlan(
    global.db,
    {
      developer,
      employer
    }
  );
  const api = global.atlan.api();
  app.use('/api', employerLogin);
  app.use('/api', api);
  app.listen(process.env.PORT);

  // Setup interval tasks
  setInterval(
    function() {
      notifyEmployersOfMatches();
    },
    3.6E+6
  );
})();

