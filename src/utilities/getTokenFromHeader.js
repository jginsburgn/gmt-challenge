const tokenRegex = /^Bearer\s*([-A-Za-z0-9._]*)$/;

function getTokenFromHeader(req) {
  let header = req.get('Authorization');
  if (header) {
    const matches = header.match(tokenRegex);
    if (matches === null) {
      return undefined;
    }
    return matches[1];
  }
  return undefined;
}

module.exports = getTokenFromHeader;
