<template>
  <li>
    <span>{{todo}}</span>
    <button @click="removeTodo(index)">X</button>
  </li>
</template>

<script>
export default {
  name: 'Todo',
  props: [ 'todo', 'index', 'removeTodo' ]
}
</script>

<style scoped>
span {
  display: inline-block;
  width: 150px;
}
</style>