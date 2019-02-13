let STATE;
let COMPUTED;
let WATCHERS;
const SUBSCRIBERS = {};

const compute = (obj, prop, next, prev) => {
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

const watch = (obj, prop, next, prev) => {
  const watchedKeys = Object.keys(WATCHERS);
  const index = watchedKeys.indexOf(prop);
  if (index < 0) return;
  WATCHERS[watchedKeys[index]](next, prev);
}

const handler = {
  set (obj, prop, next) {
    const prev = obj[prop];
    obj[prop] = next;
    compute(obj, prop, next, prev);
    watch(obj, prop, next, prev);
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
