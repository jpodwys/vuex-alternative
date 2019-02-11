<template>
  <ul>
    <li v-for="(todo, index) in $todos" :key="index">
      <Todo :todo="todo" :index="index" :removeTodo="$removeTodo"/>
    </li>
  </ul>
</template>

<script>
import Todo from '@/components/Todo.vue';

export default {
  name: 'Todos',
  components: { Todo },
  props: [ '$todos', '$removeTodo' ]
}
</script>

<style scoped>
ul {
  text-align: left;
  list-style: none;
  padding-left: 0;
}
</style>
