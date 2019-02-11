<template>
  <form @submit.prevent="onSubmit">
    <input placeholder="Todo" v-model="input" autofocus/>
    <input type="submit" value="Create" :disabled="!input"/>
  </form>
</template>

<script>
export default {
  name: 'Form',
  props: [ '$addTodo' ],
  data () {
    return {
      input: ''
    }
  },
  methods: {
    onSubmit () {
      this.$addTodo(this.input);
      this.input = '';
    }
  }
}
</script>
