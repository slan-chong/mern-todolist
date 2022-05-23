const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Todo = require("./models/Todo");

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/mern-todo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch(console.error);

app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post("/todo/new", (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });
  todo.save();
  res.json(todo);
});

app.delete("/todo/delete/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) return res.status(404).send("Todo not found...");
  const deletedTodo = await Todo.findByIdAndDelete(req.params.id);

  res.json(deletedTodo);
});

app.get("/todo/complete/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.complete = !todo.complete;
  todo.save();
  res.json(todo);
});
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Express server started on port ${port}`));
