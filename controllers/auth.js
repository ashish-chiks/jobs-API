const userModel = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { UnauthenticatedError, BadRequestError } = require("../errors");

const register = async (req, res) => {
  const user = await userModel.create({ ...req.body });
  const token = user.generateToken();
  res
    .status(StatusCodes.CREATED)
    .json({ user: { username: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new BadRequestError("please provide email and password");

  const user = await userModel.findOne({ email });
  if (!user) throw new UnauthenticatedError("no user with this email found");

  //password check

  const token = user.generateToken();
  res.status(StatusCodes.OK).json({ user: { username: user.name }, token });
};

module.exports = { register, login };
