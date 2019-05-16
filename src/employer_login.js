const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');
const httpStatusCodes = require('http-status-codes');

const secret = process.env.SECRET;

const router = express.Router();
router.post('/employer/login', bodyParser.json(), async function(req, res) {

  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(httpStatusCodes.BAD_REQUEST);
    res.send('Missing email and/or password.');
    return;
  }

  const result = await global.atlan.retrieve('employer', { email });

  if (result.length === 0) {
    res.status(httpStatusCodes.NOT_FOUND);
    res.send('User does not exist.');
    return;
  }

  const user = result[0];

  const isPasswordValid = await bcrypt.compare(password, user.hash);

  if (isPasswordValid) {
    const token = jwt.sign(
      { userId: user._id, rights: ['regular-user'] },
      secret,
      {
        expiresIn: 3600
      }
    );
    res.status(httpStatusCodes.CREATED);
    res.send({ token });
    return;
  }
  else {
    res.status(httpStatusCodes.CONFLICT);
    res.send('Invalid password');
    return;
  }
});

module.exports = router;
