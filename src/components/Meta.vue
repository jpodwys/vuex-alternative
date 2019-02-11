<template>
  <div>
    <h4>Count: {{$todos.length}}</h4>
  </div>
</template>

<script>
export default {
  name: 'Metadata',
  props: [ '$todos' ]
}
</script>