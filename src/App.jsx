import { useState, useEffect } from "react";
import "./App.css";
import iconCheck from "./assets/icon-check.svg";

function App() {
  const [todos, setTodos] = useState([
    {
      id: new Date().getTime(),
      text: "Complete online JavaScript course",
      isChecked: true,
    },
    {
      id: new Date().getTime() - 1,
      text: "Jog around the park 3x",
      isChecked: false,
    },
    {
      id: new Date().getTime() - 2,
      text: "10 minutes meditation",
      isChecked: false,
    },
    {
      id: new Date().getTime() - 3,
      text: "Read for 1 hour",
      isChecked: false,
    },
    {
      id: new Date().getTime() - 4,
      text: "Pick up groceries",
      isChecked: false,
    },
    {
      id: new Date().getTime() - 5,
      text: "Complete Todo App on Frontend Mentor",
      isChecked: false,
    },
  ]);

  const [todoText, setTodoText] = useState("");
  const [filter, setFilter] = useState("all");
  const [hover, setHover] = useState(-1);
  const [theme, setTheme] = useState("dark");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Handles
  const handleWindowResize = () => setWindowWidth(window.innerWidth);

  const handleMouseOver = (i) => setHover(i);
  const handleMouseOut = () => setHover(0);
  const switchTheme = () => {
    setTheme((prev) => (prev == "dark" ? "light" : "dark"));
  };
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (todoText.trim() == "") return;
    const newTodo = {
      id: new Date().getTime(),
      text: todoText,
      isChecked: false,
    };

    setTodos((prev) => [...prev, newTodo]);
    setTodoText("");
  };
  const handleToggle = (id) => {
    setTodos((prev) =>
      prev.map((i) => (i.id == id ? { ...i, isChecked: !i.isChecked } : i))
    );
  };
  const handleDeleteTodos = () => {
    setTodos((prev) => prev.filter((todo) => !todo.isChecked));
  };
  const handleDeleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };
  const handleFilter = (filterType) => setFilter(filterType);
  const filteredTodos =
    filter == "checked"
      ? todos.filter((i) => i.isChecked)
      : filter == "unchecked"
      ? todos.filter((i) => !i.isChecked)
      : todos;

  const handleDragStart = (event, todoId) => {
    event.dataTransfer.setData("text/plain", todoId);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const todoId = event.dataTransfer.getData("text/plain");
    if (!event.target.classList.contains("no-drag")) {
      const updatedTodos = [...todos];
      const draggedTodoIndex = updatedTodos.findIndex(
        (todo) => todo.id === +todoId
      );
      const targetTodoIndex = updatedTodos.findIndex(
        (todo) => todo.id === +event.target.id
      );
      [updatedTodos[draggedTodoIndex], updatedTodos[targetTodoIndex]] = [
        updatedTodos[targetTodoIndex],
        updatedTodos[draggedTodoIndex],
      ];
      setTodos(updatedTodos);
    }
  };

  // Conditional Rendering for Dark/Light Theme

  document.body.style.backgroundColor =
    theme == "dark" ? "hsl(235, 21%, 11%)" : "hsl(0, 0%, 98%)";
  if (theme == "dark" && windowWidth <= "600") {
    document.body.classList.add("bg-mobile-dark");
    document.body.classList.remove("bg-desktop-dark");
    document.body.classList.remove("bg-desktop-light");
    document.body.classList.remove("bg-mobile-light");
  } else if (theme == "dark" && windowWidth > "600") {
    document.body.classList.add("bg-desktop-dark");
    document.body.classList.remove("bg-desktop-light");
    document.body.classList.remove("bg-mobile-light");
    document.body.classList.remove("bg-mobile-dark");
  } else if (theme == "light" && windowWidth <= "600") {
    document.body.classList.add("bg-mobile-light");
    document.body.classList.remove("bg-desktop-dark");
    document.body.classList.remove("bg-mobile-dark");
    document.body.classList.remove("bg-desktop-light");
  } else if (theme == "light" && windowWidth > "600") {
    document.body.classList.add("bg-desktop-light");
    document.body.classList.remove("bg-desktop-dark");
    document.body.classList.remove("bg-mobile-light");
    document.body.classList.remove("bg-mobile-dark");
  }

  // UseEffect and Event Listener to track viewport width

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  // Render
  return (
    <div data-theme={theme} className="main" date-theme="light">
      <header className="title">
        <h1>Todo</h1>
        <button
          className={theme == "dark" ? "icon-sun" : "icon-moon"}
          onClick={switchTheme}
        >
          Toggle Display Mode
        </button>
      </header>
      <main>
        <form>
          <button type="submit" onClick={handleAddTodo}>
            Add
          </button>
          <input
            type="text"
            value={todoText}
            placeholder="Create a new todo..."
            onChange={(e) => setTodoText(e.target.value)}
          />
        </form>
        {/* Main Todo List goes here */}
        <ul>
          {filteredTodos.map((i) => (
            <div className="todo-container" key={i.id}>
              <li
                onMouseOver={() => handleMouseOver(i.id)}
                onMouseOut={handleMouseOut}
                className="todo-items"
                style={{
                  textDecoration: i.isChecked ? "line-through" : "none",
                  color: i.isChecked
                    ? "var(--clr-disabled)"
                    : "var(--clr-main)",
                }}
                draggable="true"
                onDragStart={(event) => handleDragStart(event, i.id)}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                id={i.id}
              >
                <label
                  style={{
                    backgroundImage: i.isChecked
                      ? "var(--clr-bg-gradient)"
                      : "none",
                  }}
                >
                  <img
                    style={{ display: i.isChecked ? "block" : "none" }}
                    src={iconCheck}
                    alt=""
                  />
                  <input
                    className="checkbox no-drag"
                    type="checkbox"
                    checked={i.isChecked}
                    onChange={() => handleToggle(i.id)}
                  />
                </label>
                <p onClick={() => handleToggle(i.id)} className="no-drag">
                  {i.text}
                </p>
                <button
                  style={{
                    display:
                      hover == i.id ? "block" : windowWidth > 600 && "none",
                  }}
                  onClick={() => handleDeleteTodo(i.id)}
                >
                  Delete
                </button>
              </li>
              <hr />
            </div>
          ))}
        </ul>
        <div className="todo-footer">
          <p>{todos.filter((i) => !i.isChecked).length} items left</p>
          <div className="selectors selectors-style">
            <button
              style={{
                color: filter == "all" && "var(--clr-primary-bright-blue)",
              }}
              onClick={() => handleFilter("all")}
            >
              All
            </button>
            <button
              style={{
                color:
                  filter == "unchecked" && "var(--clr-primary-bright-blue)",
              }}
              onClick={() => handleFilter("unchecked")}
            >
              Active
            </button>
            <button
              style={{
                color: filter == "checked" && "var(--clr-primary-bright-blue)",
              }}
              onClick={() => handleFilter("checked")}
            >
              Completed
            </button>
          </div>
          <button onClick={handleDeleteTodos}>Clear Selected</button>
        </div>
        <div className="selectors-mobile">
          <button
            className="selectors-style"
            style={{
              color: filter == "all" && "var(--clr-primary-bright-blue)",
            }}
            onClick={() => handleFilter("all")}
          >
            All
          </button>
          <button
            className="selectors-style"
            style={{
              color: filter == "unchecked" && "var(--clr-primary-bright-blue)",
            }}
            onClick={() => handleFilter("unchecked")}
          >
            Active
          </button>
          <button
            className="selectors-style"
            style={{
              color: filter == "checked" && "var(--clr-primary-bright-blue)",
            }}
            onClick={() => handleFilter("checked")}
          >
            Completed
          </button>
        </div>
        <strong>Drag and drop to reorder list</strong>
      </main>
    </div>
  );
}

export default App;
