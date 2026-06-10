import Task from "../models/Task.js";

export const getTasks =
  async (req, res) => {

    const tasks =
      await Task.find();

    res.json(tasks);
  };

export const createTask =
  async (req, res) => {

    const task =
      await Task.create(
        req.body
      );

    res.status(201).json(
      task
    );
  };

export const completeTask =
  async (req, res) => {

    const task =
      await Task.findByIdAndUpdate(
        req.params.id,
        { completed: true },
        { new: true }
      );

    res.json(task);
  };