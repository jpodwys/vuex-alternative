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

const subscribe = el => {
  if (!el.$props) return;
  const props = getStorePropKeys(el);
  const store = el.$store;
  props.forEach(prop => {
    const propName = prop.slice(1);
    if (store.state[propName] !== undefined) {
      store.subscribe(propName, el);
      return el.$props[prop] = store.state[propName];
    }
    if (store.actions[propName] !== undefined) {
      return el.$props[prop] = store.actions[propName];
    }
  });
};

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
  });
};
