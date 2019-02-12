import Vue from 'vue';
import Vstore from "../v-store";

Vue.use(Vstore);

const state = {
  todos: []
};

const computed = {
  newestTodo: {
    args: [ 'todos' ],
    cb: (todos) => todos ? todos[0] : ''
  },
  oldestTodo: {
    args: [ 'todos' ],
    cb: (todos) => todos ? todos[todos.length - 1] : ''
  }
};

const actions = {
  addTodo (state, todo) {
    state.todos.unshift(todo);
    state.todos = [].concat(state.todos);
  },
  removeTodo (state, index) {
    state.todos.splice(index, 1);
    state.todos = [].concat(state.todos);
  }
};

export default new Vstore.Store({
  state,
  computed,
  actions
});
