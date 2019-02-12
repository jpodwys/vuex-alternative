let STATE;
let observers;
const subscribers = {};

const compute = (obj, prop) => {
  Object.keys(observers).forEach(computedKey => {
    const observer = observers[computedKey];
    const observedArgs = observer.args;
    const cb = observer.cb;
    if (observedArgs.indexOf(prop) < 0) return;
    const args = [];
    observedArgs.forEach(arg => args.push(obj[arg]));
    STATE[computedKey] = cb.apply(null, args);
  });
}

const handler = {
  set (obj, prop, next) {
    obj[prop] = next;
    const els = subscribers[prop];
    if (!els) return true;
    Object.keys(els).forEach(id => {
      els[id].$props[`$${prop}`] = next;
    });
    compute(obj, prop);
    return true;
  }
}

export default class Store {
  constructor ({ state = {}, computed = {}, actions = {} }) {
    observers = computed;

    this.state = STATE = new Proxy({}, handler);
    Object.assign(this.state, state);

    this.actions = {};
    Object.keys(actions).forEach(action => {
      this.actions[action] = actions[action].bind(null, this.state);
    });
  }

  subscribe (name, el) {
    subscribers[name] = subscribers[name] || {};
    subscribers[name][el._uid] = el;
  }

  unsubscribe (name, el) {
    const subs = subscribers[name];
    if (subs) delete subs[el._uid];
  }
}
