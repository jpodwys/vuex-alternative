<template>
  <div>
    <h4>Count: {{$todos.length}}</h4>
    <h4>Newest: {{$newestTodo}}</h4>
    <h4>Oldest: {{$oldestTodo}}</h4>
  </div>
</template>

<script>
export default {
  name: 'Meta',
  props: [ '$todos', '$newestTodo', '$oldestTodo' ]
}
</script>