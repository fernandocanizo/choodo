'use strict';

const choo = require('choo');
const html = require('choo/html');
const app = choo();


app.model({
  state: {
    todos: [
      { title: 'Buy milk' },
      { title: 'Call Samantha'},
    ],
  },
});

const hTodoLi = (todo) => html`<li>${todo.title}</li>`;

const view = (state, prevState, send) => {
  return html`
    <div>
      <h1>ChooDo</h1>
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
