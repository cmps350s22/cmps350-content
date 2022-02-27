import * as todoRepository from './todo-repository.js';

//Select DOM
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-add");
const todoList = document.querySelector(".todo-list");

//Event Listeners
document.addEventListener("DOMContentLoaded", e => {
  const todos = todoRepository.getTodos();
  todos.forEach( (todo) => {
    renderToDo(todo)
  });
});

todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteTodo);

// Execute a function when the user releases a key on the keyboard
todoInput.addEventListener("keyup", event => {
   // Number 13 is the "Enter" key on the keyboard
   if (event.keyCode === 13) {
     // Cancel the default action, if needed
     event.preventDefault();
     // Trigger the button element with a click
     todoButton.click();
   }
});

//Functions
function addTodo() {
  const todo = todoInput.value.trim();
  if (!todo) {
    todoInput.setCustomValidity('Todo text is required');
    todoInput.reportValidity();
    return;
  }

  renderToDo(todo);
  todoInput.value = "";

  //Save to localStorage
  todoRepository.addTodo(todo);
}

function deleteTodo(e) {
  const item = e.target;

  if (item.classList[0] === "trash-btn") {
    const todo = item.parentElement;

    //Remove from localStorage
    todoRepository.deleteTodo(todo.children[0].innerText);
    // Remove element  from UI
    todo.remove();
  }
  if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
    console.log(todo);
  }
}

function renderToDo(todo) {
  //Create todo div
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  //Create list item
  const newTodo = document.createElement("li");
  newTodo.innerText = todo;
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);

  //Create Completed Button
  const completedButton = document.createElement("button");
  completedButton.innerHTML = `<i class="fas fa-check"></i>`;
  completedButton.classList.add("complete-btn");
  todoDiv.appendChild(completedButton);

  //Create trash button
  const trashButton = document.createElement("button");
  trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
  trashButton.classList.add("trash-btn");
  todoDiv.appendChild(trashButton);
  //attach final Todo
  todoList.appendChild(todoDiv);
}