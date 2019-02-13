let STATE;
let COMPUTED;
let WATCHERS;
const SUBSCRIBERS = {};

const compute = (obj, prop, next) => {
  Object.keys(COMPUTED).forEach(computedKey => {
    const observer = COMPUTED[computedKey];
    const observedArgs = observer.args;
    const cb = observer.cb;
    if (observedArgs.indexOf(prop) < 0) return;
    const args = [];
    observedArgs.forEach(arg => args.push(obj[arg]));
    STATE[computedKey] = cb.apply(null, args);
  });
}

const watch = (obj, prop, next) => {
  const watchedKeys = Object.keys(WATCHERS);
  const index = watchedKeys.indexOf(prop);
  if (index < 0) return;
  WATCHERS[watchedKeys[index]](next);
}

const handler = {
  set (obj, prop, next) {
    obj[prop] = next;
    compute(obj, prop, next);
    watch(obj, prop, next);
    const els = SUBSCRIBERS[prop];
    if (!els) return true;
    Object.keys(els).forEach(id => {
      els[id].$props[`$${prop}`] = next;
    });
    return true;
  }
}

export default class Store {
  constructor ({ state = {}, computed = {}, watchers = {}, actions = {} }) {
    COMPUTED = computed;
    WATCHERS = watchers;

    this.state = STATE = new Proxy({}, handler);
    Object.assign(this.state, state);

    this.actions = {};
    Object.keys(actions).forEach(action => {
      this.actions[action] = actions[action].bind(null, this.state);
    });
  }

  subscribe (name, el) {
    SUBSCRIBERS[name] = SUBSCRIBERS[name] || {};
    SUBSCRIBERS[name][el._uid] = el;
  }

  unsubscribe (name, el) {
    const subs = SUBSCRIBERS[name];
    if (subs) delete subs[el._uid];
  }
}
