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
    <div className="App p-4 ">
      <div className="text-skin-light text-4xl font-bold mb-8 ">
        Hello, Todo
      </div>
      <div className="text-skin-light-alt text-lg uppercase mb-4">
        Your Tasks
      </div>

      <div className="todos">
        {todos.length > 0 ? (
          todos.map((todo) => {
            return (
              <div
                className="todo relative bg-skin-button-day hover:opacity-80 p-4 rounded-2xl flex items-center duration-500 cursor-pointer mb-4 "
                key={todo._id}
                onClick={() => completeTodo(todo._id)}
              >
                <div
                  className={
                    "checkbox bg-skin-button-day-hover w-5 h-5 mr-4 rounded-full duration-500 " +
                    (todo.complete
                      ? "bg-skin-button-day-hover bg-gradient-to-r from-purple-500 to-pink-500"
                      : "bg-skin-button-day")
                  }
                ></div>
                <div
                  className={"text-xl " + (todo.complete ? "line-through" : "")}
                >
                  {todo.text}
                </div>
                <div
                  className="delete-todo absolute top-1/2 right-4 -translate-y-2/4 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
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
      <div
        className="addPopup fixed bottom-8 right-8 flex items-center justify-center w-16 h-16 rounded-full text-3xl font-black text-skin-light bg-gradient-to-r from-purple-500 to-pink-500 cursor-pointer"
        onClick={() => setPopActive(true)}
      >
        +
      </div>
      {popActive && (
        <div className="popup fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-skin-button-night-active p-8 rounded-2xl shadow-md">
          <div
            className="closePopup absolute top-4 right-4 w-5 h-5 text-xl text-skin-base cursor-pointer flex items-center justify-center bg-red-500 rounded-full p-3"
            onClick={() => setPopActive(false)}
          >
            x
          </div>
          <div className="content">
            <h3 className="text-skin-dark mb-4 uppercase">Add Task</h3>
            <input
              type="text"
              className="add-todo-input text-skin-info outline-none border-none appearance-none p-4 rounded-2xl w-full text-xl"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            />
            <div
              className="button px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 inline-block font-bold uppercase text-lg mt-4 text-center cursor-pointer"
              onClick={addTodo}
            >
              Create Task
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
