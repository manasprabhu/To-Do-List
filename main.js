// Selectors
const toDoInput       = document.querySelector('.todo-input');
const toDoBtn         = document.querySelector('.todo-btn');
const toDoList        = document.querySelector('.todo-list');
const standardTheme   = document.querySelector('.standard-theme');
const lightTheme      = document.querySelector('.light-theme');
const darkerTheme     = document.querySelector('.darker-theme');
const filterBtns      = document.querySelectorAll('.filter-btn');

// Event Listeners
toDoBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', deleteCheck);
filterBtns.forEach(btn => btn.addEventListener('click', filterTasks));
document.addEventListener("DOMContentLoaded", () => {
  changeTheme(localStorage.getItem('savedTheme') || 'standard');
  getTodos();
  updateTaskCounter();
});

// Theme selectors
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click',    () => changeTheme('light'));
darkerTheme.addEventListener('click',   () => changeTheme('darker'));

let savedTheme = localStorage.getItem('savedTheme') || 'standard';

// ————————————————————————————————
// Functions

function addToDo(event) {
  event.preventDefault();
  if (!toDoInput.value.trim()) {
    alert("You must write something!");
    return;
  }

  // Build to-do element
  const toDoDiv = document.createElement('div');
  toDoDiv.classList.add('todo', `${savedTheme}-todo`);

  const newToDo = document.createElement('li');
  newToDo.innerText = toDoInput.value;
  newToDo.classList.add('todo-item');
  toDoDiv.appendChild(newToDo);

  // Save & buttons
  saveLocal(toDoInput.value);
  toDoDiv.append(createButton('check-btn', 'fas fa-check'));
  toDoDiv.append(createButton('delete-btn', 'fas fa-trash'));

  toDoList.appendChild(toDoDiv);
  toDoInput.value = '';

  showToast("Task added!");
  updateTaskCounter();
}

function deleteCheck(e) {
  const item = e.target;
  if (item.closest('.delete-btn')) {
    const todo = item.closest('.todo');
    todo.classList.add('fall');
    removeLocalTodos(todo);
    todo.addEventListener('transitionend', () => {
      todo.remove();
      showToast("Task deleted!");
      updateTaskCounter();
    });
  }
  if (item.closest('.check-btn')) {
    const todo = item.closest('.todo');
    todo.classList.toggle('completed');
    showToast(todo.classList.contains('completed') ? "Task completed!" : "Marked incomplete");
    updateTaskCounter();
  }
}

function filterTasks(e) {
  document.querySelector('.filter-btn.active').classList.remove('active');
  e.target.classList.add('active');
  const filter = e.target.dataset.filter;
  document.querySelectorAll('.todo').forEach(todo => {
    switch (filter) {
      case 'all':       todo.style.display = 'flex'; break;
      case 'completed': todo.style.display = todo.classList.contains('completed') ? 'flex' : 'none'; break;
      case 'uncompleted':todo.style.display = !todo.classList.contains('completed') ? 'flex' : 'none'; break;
    }
  });
}

// — Local Storage —
function saveLocal(todo) {
  const todos = JSON.parse(localStorage.getItem('todos') || '[]');
  todos.push(todo);
  localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
  const todos = JSON.parse(localStorage.getItem('todos') || '[]');
  todos.forEach(text => {
    const toDoDiv = document.createElement('div');
    toDoDiv.classList.add('todo', `${savedTheme}-todo`);

    const newToDo = document.createElement('li');
    newToDo.innerText = text;
    newToDo.classList.add('todo-item');
    toDoDiv.appendChild(newToDo);

    toDoDiv.append(createButton('check-btn', 'fas fa-check'));
    toDoDiv.append(createButton('delete-btn', 'fas fa-trash'));

    toDoList.appendChild(toDoDiv);
  });
}

// Remove from localStorage
function removeLocalTodos(todoDiv) {
  const todos = JSON.parse(localStorage.getItem('todos') || '[]');
  const idx   = todos.indexOf(todoDiv.querySelector('.todo-item').innerText);
  if (idx >= 0) {
    todos.splice(idx, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
  }
}

// — UI Helpers —
function createButton(cls, iconClasses) {
  const btn = document.createElement('button');
  btn.classList.add(cls, `${savedTheme}-button`);
  btn.innerHTML = `<i class="${iconClasses}"></i>`;
  return btn;
}

// Toast notification
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// Task counter
function updateTaskCounter() {
  const all    = document.querySelectorAll('.todo').length;
  const done   = document.querySelectorAll('.todo.completed').length;
  document.getElementById('total-tasks').textContent     = `Total: ${all}`;
  document.getElementById('completed-tasks').textContent = `Completed: ${done}`;
}

// Theme changer
function changeTheme(color) {
  savedTheme = color;
  localStorage.setItem('savedTheme', color);
  document.body.className = color;
  document.querySelector('input').className = `${color}-input`;
  document.querySelectorAll('.todo').forEach(t => {
    t.className = t.classList.contains('completed')
      ? `todo ${color}-todo completed`
      : `todo ${color}-todo`;
  });
  document.querySelectorAll('button').forEach(btn => {
    if (btn.matches('.check-btn'))   btn.className = `check-btn ${color}-button`;
    if (btn.matches('.delete-btn'))  btn.className = `delete-btn ${color}-button`;
    if (btn.matches('.todo-btn'))    btn.className = `todo-btn ${color}-button`;
    if (btn.matches('.filter-btn'))  btn.classList.toggle('active', btn.classList.contains('active'));
  });
}