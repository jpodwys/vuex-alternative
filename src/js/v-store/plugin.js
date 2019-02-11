import Vue from 'vue';

Vue.config.warnHandler = (msg, vm, trace) => {
  if (~msg.indexOf('Avoid mutating a prop directly')) return;
  console.error(msg, trace);
}

const getStorePropKeys = el => Object.keys(el.$props).filter(prop => prop[0] === '$');

const setup = el => {
  const options = el.$options
  if (options.store) {
    el.$store = options.store;
  } else if (options.parent && options.parent.$store) {
    el.$store = options.parent.$store
  }
};

/**
 * 1. Check if it's a state variable
 * 2. If it is, setup a listeners array for it
 * 3. Store a reference to the vue instance in the listeners array
 * 4. On vue instance destroy, remove the appropriate listener
 * 5. If it's an action, assign a reference to it on the vue instance
 */
const subscribe = el => {
  if (!el.$props) return;
  const props = getStorePropKeys(el);
  const store = el.$store;
  props.forEach(prop => {
    const propName = prop.slice(1);
    if (store.state[propName] !== undefined) {
      store.subscribe(propName, el);
      el.$props[prop] = store.state[propName];
    }
    if (store.actions[propName] !== undefined) {
      el.$props[prop] = store.actions[propName];
    }
  });
};

/**
 * Create list of store props
 * Iterate over each finding the ones that are state variables
 * For each of them, remove the listener for this vue instance
 * If there are no more listeners, delete listeners[propName]
 */
const unsubscribe = el => {
  if (!el.$props) return;
  const props = getStorePropKeys(el);
  const store = el.$store;
  props.forEach(prop => {
    const propName = prop.slice(1);
    store.unsubscribe(propName, el);
  });
};

export default (Vue/*, options*/) => {
  Vue.mixin({
    beforeCreate () {
      setup(this);
    },
    created () {
      subscribe(this);
    },
    beforeUpdate () {
      subscribe(this);
    },
    beforeDestroy () {
      unsubscribe(this);
    }
    // activated/deactivated
  });
};
