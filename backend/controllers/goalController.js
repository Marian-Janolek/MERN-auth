const asyncHandler = require('express-async-handler');
const Goal = require('../models/goalModel');
const User = require('../models/userModel');

// @desc Get goals
// @route GET /api/goals
// @acccess Private
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id });

  res.status(200).json(goals);
});

// @desc Create goal
// @route POST /api/goals
// @acccess Private
const createGoal = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error('Please add a text field');
  }
  const goal = await Goal.create({ text: req.body.text, user: req.user.id });

  res.status(200).json(goal);
});

// @desc Update goal
// @route PATCH /api/goals/:id
// @acccess Private
const updateGoal = asyncHandler(async (req, res) => {
  const { id: goalId } = req.params;
  const goal = await Goal.findById(goalId);

  if (!goal) {
    res.status(400);
    throw new Error(`Goal with id : ${goalId} not found`);
  }

  const user = await User.findById(req.user.id);

  // check for user
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }
  // Make sure the logged in user matches the goals user
  if (goal.user.toString() !== user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedGoal = await Goal.findByIdAndUpdate(goalId, req.body, {
    new: true,
  });

  res.status(200).json(updatedGoal);
});
// @desc Delete goals
// @route DELETE /api/goals/:id
// @acccess Private
const deleteGoal = asyncHandler(async (req, res) => {
  const { id: goalId } = req.params;

  const goal = await Goal.findById(goalId);

  if (!goal) {
    res.status(400);
    throw new Error(`Goal with id : ${goalId} not found`);
  }

  const user = await User.findById(req.user.id);

  // check for user
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }
  // Make sure the logged in user matches the goals user
  if (goal.user.toString() !== user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }
  await goal.remove();

  res.status(200).json({ id: goalId });
});

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
};
