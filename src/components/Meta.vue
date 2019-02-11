<template>
  <div>
    <h4>Count: {{$todos.length}}</h4>
  </div>
</template>

<script>
export default {
  name: 'Meta',
  props: [ '$todos' ]
}
</script>