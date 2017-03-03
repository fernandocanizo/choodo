'use strict';

const extend = require('xtend');
const choo = require('choo');
const html = require('choo/html');
const app = choo();

// localStorage wrapper
const store = {
  getAll: (storeName, cb) => {
    try {
      cb(JSON.parse(window.localStorage[storeName]));
    } catch (e) {
      cb([]);
    }
  },

  add: (storeName, item, cb) => {
    store.getAll(storeName, (items) => {
      items.push(item);
      window.localStorage[storeName] = JSON.stringify(items);
      cb();
    });
  },

  replace: (storeName, index, item, cb) => {
    store.getAll(storeName, (items) => {
      items[index] = item;
      window.localStorage[storeName] = JSON.stringify(items);
      cb();
    });
  },
};

app.model({
  state: {
    todos: [],
  },
  reducers: {
    addTodo: (state, data) => {
      const todo = extend(data, {
        completed: false,
      });
      const newTodos = state.todos.slice();
      newTodos.push(data);
      return {
        todos: newTodos,
      };
    },

    updateTodo: (state, data) => {
      const newTodos = state.todos.slice();
      const oldTask = newTodos[data.index];
      const newTask = extend(oldTask, data.update);
      newTodos[data.index] = newTask;
      return { todos : newTodos };
    },
  },
});

const view = (state, prevState, send) => {
  const onTaskSubmition = (e) => {
    const userInput = e.target.children[0];
    send('addTodo', { title: userInput.value });
    userInput.value = '';
    e.preventDefault();
  };

  const onTaskChecked = (e, index) => {
    const update = { completed: e.target.checked }
    send('updateTodo', { index: index, update: update })
  };

  const hTodoLi = (todo, index) => {
    const checked = todo.completed ? 'checked' : '';
    const onChange = (e) => onTaskChecked(e, index);

    return html`
      <li>
        <input type="checkbox" ${ checked } onchange=${ onChange } />
        ${todo.title}
      </li>`;
  };

  return html`
    <div>
      <h1>ChooDo</h1>
      <form onsubmit=${ onTaskSubmition }>

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
