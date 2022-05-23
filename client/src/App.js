import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3001";

function App() {
  const [todos, setTodos] = useState([]);
  const [popActive, setPopActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  useEffect(() => {
    const GetTodo = async () => {
      await axios
        .get(API_BASE + "/todos")
        .then((res) => {
          setTodos(res.data);
        })
        .catch((err) => console.error(err));
    };
    GetTodo();
  }, []);
  const completeTodo = async (id) => {
    try {
      const { data } = await axios.get(API_BASE + "/todo/complete/" + id);
      setTodos((todos) =>
        todos.map((todo) => {
          if (todo._id === data._id) {
            todo.complete = data.complete;
          }
          return todo;
        })
      );
    } catch (e) {
      console.log(e);
    }
  };
  const deleteTodo = async (id) => {
    const { data } = await axios.delete(API_BASE + "/todo/delete/" + id);
    try {
      setTodos((todos) =>
        todos.filter((todo) => {
          return todo._id !== data._id;
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const addTodo = async () => {
    if (newTodo) {
      try {
        const { data } = await axios.post(
          API_BASE + "/todo/new/",
          {
            text: newTodo,
          },
          {
            headers: { "Content-Type": "application/json;charset=UTF-8" },
          }
        );
        setTodos([...todos, data]);
        setPopActive(false);
        setNewTodo("");
      } catch (e) {
        console.log(e);
      }
    } else {
      setNewTodo("Please type something");
    }
  };

  return (
    <div className="App">
      <h1>Hello, Todo</h1>
      <h4>Your Tasks</h4>

      <div className="todos">
        {todos.length > 0 ? (
          todos.map((todo) => {
            return (
              <div
                className={"todo " + (todo.complete ? "is-complete" : "")}
                key={todo._id}
                onClick={() => completeTodo(todo._id)}
              >
                <div className="checkbox"></div>
                <div className="text">{todo.text}</div>
                <div
                  className="delete-todo"
                  onClick={() => deleteTodo(todo._id)}
                >
                  x
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-3xl font-bold underline">No tasks now</p>
        )}
      </div>
      <div className="addPopup" onClick={() => setPopActive(true)}>
        +
      </div>
      {popActive && (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopActive(false)}>
            x
          </div>
          <div className="content">
            <h3>Add Task</h3>
            <input
              type="text"
              className="add-todo-input"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            />
            <div className="button" onClick={addTodo}>
              Create Task
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
