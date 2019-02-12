let STATE;
const subscribers = {};
const observers = {};

const compute = (obj, prop) => {
  Object.keys(observers).forEach(computedKey => {
    const observer = observers[computedKey];
    const observedArgs = observer.args;
    const computer = observer.compute;
    if (observedArgs.indexOf(prop) < 0) return;
    const args = [];
    observedArgs.forEach(arg => args.push(obj[arg]));
    STATE[computedKey] = computer.apply(null, args);
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
  constructor ({ state = {}, actions = {} }) {
    /**
     * Separate computed into a different object
     * Add entries to the observers object
     * Generate a Proxy object
     * Add remaining state keys to the Proxy object
     */

    const regular = {};
    Object.keys(state).forEach(prop => {
      if (typeof state[prop] === 'object' && !Array.isArray(state[prop])) {
        const args = state[prop].args;
        const compute = state[prop].compute;
        if (args && Array.isArray(args) && compute && typeof compute === 'function') {
          return observers[prop] = state[prop];
        }
      } else {
        regular[prop] = state[prop];
      }
    });

    this.state = STATE = new Proxy({}, handler);
    Object.assign(this.state, regular);

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
