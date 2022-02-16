const asyncHandler = require('express-async-handler');
const Goal = require('../models/goalModel');

// @desc Get goals
// @route GET /api/goals
// @acccess Private
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find();

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
  const goal = await Goal.create({ text: req.body.text });

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
  await goal.remove();

  res.status(200).json({ id: goalId });
});

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
};
