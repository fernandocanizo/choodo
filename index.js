'use strict';

const choo = require('choo');
const html = require('choo/html');
const app = choo();


app.model({
  state: {
    todos: [],
  },
  reducers: {
    addTodo: (state, data) => {
      const newTodos = state.todos.slice();
      newTodos.push(data);
      return {
        todos: newTodos,
      };
  },
  },
});

const hTodoLi = (todo) => html`<li>${todo.title}</li>`;

const view = (state, prevState, send) => {
  const onTaskSubmition = (e) => {
    const userInput = e.target.children[0];
    send('addTodo', { title: userInput.value });
    userInput.value = '';
    e.preventDefault();
  };

  return html`
    <div>
      <h1>ChooDo</h1>
      <form onsubmit=${onTaskSubmition}>

        <input type="text" placeholder="Write your next task here..." id="title" autofocus>
      </form>

      <ul>
        ${state.todos.map(hTodoLi)}
      </ul>
    </div>
`;
}

app.router([
  ['/', view],
]);

const tree = app.start();
document.body.appendChild(tree);
