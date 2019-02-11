<template>
  <div id="app">
    <h1>Todos</h1>
    <Meta/>
    <Form/>
    <Todos/>
  </div>
</template>

<script>
import Meta from '@/components/Meta.vue';
import Form from '@/components/Form.vue';
import Todos from '@/components/Todos.vue';

export default {
  name: 'App',
  components: { Meta, Form, Todos },
}
</script>

<style scoped>
#app {
  width: 200px;
  margin: auto;
}
h1 {
  text-align: center;
}
</style>
