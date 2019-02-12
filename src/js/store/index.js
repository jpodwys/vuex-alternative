import Vue from 'vue';
import Vstore from "../v-store";

Vue.use(Vstore);

const state = {
  todos: []
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
  actions
});
