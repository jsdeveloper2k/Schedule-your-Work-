const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require('cors');
app.use(express.json());
app.use(cors())

mongoose
  .connect("mongodb://localhost:27017/todoMern")
  .then(() => {
    console.log("db is connected");
  })
  .catch((e) => console.log(error, e));

//creating the schema
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
});
//creating Todo Model for TodoSchema
const todoModel = mongoose.model("Todo", todoSchema);

//Create a new Todo item
app.post("/todo", async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTodo = new todoModel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (e) {
    console.log(e), res.status(500).json({ message: e.message });
  }
});

//Getting  all the items
app.get("/todo", async (req, res) => {
  try {
    const todos = await todoModel.find();
    res.json(todos);
  } catch (e) {
    console.log(e), res.status(500).json({ message: e.message });
  }
});

// Update a todoItem
app.put("/todo/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.id;

    const updatedTodo = await todoModel.findByIdAndUpdate(
      id,
      { title, description },
      { new: true } // This option will return the updated document
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "TODO NOT FOUND" });
    }
    res.status(200).json(updatedTodo);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

// delete a todo Item
app.delete("/todo/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

const port = 8000;
app.listen(port, () => {
  console.log("The server is started" + port);
});
