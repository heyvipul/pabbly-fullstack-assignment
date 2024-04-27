const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const verifyToken = require("../middleware/authmiddleware");

// Create a new task
router.post("/create", async (req, res) => {
    try {
        const { title, description, dueDate, priority,createdBy } = req.body;
        // const createdBy = req.user.id; // get user id from token
        const task = new Task({
            title,
            description,
            dueDate,
            priority,
            createdBy
        });

        await task.save();
        res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
        console.error("Error in creating task:", error);
        res.status(500).json({ error: "Error in creating task" });
    }
});

// Get all tasks
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        console.error("Error in fetching tasks:", error);
        res.status(500).json({ error: "Error in fetching tasks" });
    }
});

// Get task by ID
router.get("/:id", async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id});
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json(task);
    } catch (error) {
        console.error("Error in fetching task details:", error);
        res.status(500).json({ error: "Error in fetching task details" });
    }
});

// Update task
router.put("/:id", async (req, res) => {
    try {
        const { title, description, dueDate, priority } = req.body;
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id},
            { title, description, dueDate, priority },
            { new: true }
        );
        if (!updatedTask) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        console.error("Error in updating task:", error);
        res.status(500).json({ error: "Error in updating task" });
    }
});

// Delete task
router.delete("/:id", async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({ _id: req.params.id});
        if (!deletedTask) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error in deleting task:", error);
        res.status(500).json({ error: "Error in deleting task" });
    }
});

module.exports = router;
