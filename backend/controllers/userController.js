const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHanldler = require('express-async-handler');
const User = require('../models/userModel');

// @desc Create user
// @route POST /api/users
// @acccess Public
const registerUser = asyncHanldler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide all values');
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error('User email already used');
  }

  //   hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res
      .status(201)
      .json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});
// @desc Login user
// @route POST /api/users/login
// @acccess Public

const loginUser = asyncHanldler(async (req, res) => {
  const { email, password } = req.body;

  // check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});
// @desc Get user data
// @route GET /api/users/me
// @acccess Public
const getMe = asyncHanldler(async (req, res) => {
  res.json({ message: 'User data ' });
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = { registerUser, loginUser, getMe };