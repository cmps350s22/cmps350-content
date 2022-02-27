export function getTodos() {
    let todos;
    if (!localStorage.todos) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.todos);
    }
    return todos;
}

export function addTodo(todo) {
    const todos = getTodos();
    todos.push(todo);
    localStorage.todos = JSON.stringify(todos);
}

export function deleteTodo(todo) {
    const todos = getTodos();
    console.log(todos);
    todos.splice(todos.indexOf(todo), 1);
    localStorage.todos = JSON.stringify(todos);
}