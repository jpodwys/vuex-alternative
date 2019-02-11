import Vue from 'vue';

Vue.config.warnHandler = (msg, vm, trace) => {
  if (~msg.indexOf('Avoid mutating a prop directly')) return;
  console.error(msg, trace);
}

/**
 * 1. Check if it's a state variable
 * 2. If it is, setup a listeners array for it
 * 3. Store a reference to the vue instance in the listeners array
 * 4. On vue instance destroy, remove the appropriate listener
 * 5. If it's an action, assign a reference to it on the vue instance
 */
const handle = el => {
  if (!el.$props) return;
  const props = Object.keys(el.$props).filter(prop => prop[0] === '$');
  const store = el.$store;
  props.forEach(prop => {
    const propName = prop.slice(1);
    if (store.state[propName] !== undefined) {
      store.listeners[propName] = store.listeners[propName] || [];
      store.listeners[propName].push({ el });
      el.$props[prop] = store.state[propName];
    }
    if (store.actions[propName] !== undefined) {
      el.$props[prop] = store.actions[propName];
    }
  });
}

export default {
  install: function (Vue/*, options*/) {
    Vue.mixin({
      // inheritAttrs: false,
      beforeCreate () {
        const options = this.$options
        if (options.store) {
          this.$store = options.store;
        } else if (options.parent && options.parent.$store) {
          this.$store = options.parent.$store
        }
      },
      created () {
        handle(this);
      },
      beforeUpdate () {
        handle(this);
      },
      beforeDestroy () {
        /**
         * Create list of store props
         * Iterate over each finding the ones that are state variables
         * For each of them, remove the listener for this vue instance
         * If there are no more listeners, delete listeners[propName]
         */
      }
      // activated/deactivated
    });
  }
}