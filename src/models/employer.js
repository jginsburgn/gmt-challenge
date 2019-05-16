const bcrypt = require('bcrypt');
const httpStatusCodes = require('http-status-codes');

const sendMail = require('../email/sendMail');

const hashRounds = parseInt(process.env.BCRYPT_ROUNDS);

const employer = {
  schema: {
    email: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
    },
    skills: {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  },
  hooks: {
    getMany: {
      willQuery: [
        function(_, res) {
          res.status(httpStatusCodes.NOT_FOUND);
          res.send();
        }
      ]
    },
    getOne: {
      willQuery: [
        function(_, res) {
          res.status(httpStatusCodes.NOT_FOUND);
          res.send();
        }
      ]
    },
    patch: {
      willValidate: [
        function(_, res) {
          res.status(httpStatusCodes.NOT_FOUND);
          res.send();
        }
      ]
    },
    delete: {
      willDelete: [
        function(_, res) {
          res.status(httpStatusCodes.NOT_FOUND);
          res.send();
        }
      ]
    },
    post: {
      didValidateWillWrite: [
        async function(req, res, next) {
          const employers = await global.atlan.retrieve('employer', { email: req.body.email });
          if (employers.length !== 0){
            res.status(httpStatusCodes.CONFLICT);
            res.send('Employer already exists!');
            return;
          }

          req.body.hash = await bcrypt.hash(req.body.password, hashRounds);
          delete req.body.password;
          next();
        }
      ],
      didWrite: [
        function(req, res, next) {
          const user = req.body;
          const content = [];
          content.push(`Hello ${user.email}:`);
          content.push('You will soon start receiving job offers from our employers :)');
          content.push('Best,');
          content.push('GMT');
          sendMail(user.email, 'Welcome!', content.join('\n'));
          next();
        }
      ]
    }
  }
};

module.exports = { employer };
