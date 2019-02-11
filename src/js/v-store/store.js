const listeners = {};

const initialState = {
  todos: []
}

const handler = {
  set (obj, prop, next) {
    obj[prop] = next;
    const cbs = listeners[prop];
    if (!cbs) return true;
    cbs.reverse().forEach(cb => {
      cb.el.$props[`$${prop}`] = next;
    });
    return true;
  }
}

const state = new Proxy(
  initialState,
  handler
);

const actions = {
  addTodo (todo) {
    state.todos.unshift(todo);
    state.todos = [].concat(state.todos);
  },
  removeTodo (index) {
    state.todos.splice(index, 1);
    state.todos = [].concat(state.todos);
  }
};

export default {
  state,
  actions,
  listeners
}
