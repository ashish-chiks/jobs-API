const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer "))
    throw new UnauthenticatedError("authentication failed");

  const token = header.split(" ")[1];
  try {
    const { userId, name } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = { userId, name };
    next();
  } catch (error) {
    throw new UnauthenticatedError("authentication failed");
  }
};

module.exports = auth;
