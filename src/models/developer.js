const jwt = require('jsonwebtoken');
const httpStatusCodes = require('http-status-codes');

const getTokenFromHeader = require('../utilities/getTokenFromHeader');

const secret = process.env.SECRET;

async function findDevelopersBySkills(skillsWanted) {
  const query = {
    skills: {
      $elemMatch: {
        $in: skillsWanted
      }
    }
  };
  return await global.atlan.retrieve('developer', query);
}

const developer = {
  schema: {
    email: {
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
    getMany: {
      willQuery: [
        async function(req, res) {
          const token = getTokenFromHeader(req);
          if (token) {
            try {
              const payload = jwt.verify(token, secret);
              const userId = payload.userId;
              const user = await global.atlan.retrieve('employer', userId);
              const skillsWanted = user.skills;
              const developers = await findDevelopersBySkills(skillsWanted);
              res.send(developers);
            }
            catch (error) {
              switch (true) {
                case error instanceof jwt.TokenExpiredError:
                  res.status(httpStatusCodes.GONE);
                  res.send('Token expired. Renew.');
                  break;
                default:
                  throw error;
              }
              return;
            }
          }
          else {
            res.status(httpStatusCodes.UNAUTHORIZED);
            res.send('Authorization header invalid.');
            return;
          }
        }
      ]
    }
  }
};

module.exports = { developer, findDevelopersBySkills };
