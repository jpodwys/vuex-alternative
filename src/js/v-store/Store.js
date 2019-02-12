const subscribers = {};

const handler = {
  set (obj, prop, next) {
    obj[prop] = next;
    const els = subscribers[prop];
    if (!els) return true;
    Object.keys(els).reverse().forEach(id => {
      els[id].$props[`$${prop}`] = next;
    });
    return true;
  }
}

export default class Store {
  constructor ({ state = {}, actions = {} }) {
    this.state = new Proxy(state, handler);
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
    if (!subs) return;
    delete subs[el._uid];
  }
}
