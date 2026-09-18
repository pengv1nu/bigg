const db = {
  products: [],
  orders: [],
  users: [],

  _counters: {
    products: 0,
    orders: 0,
    users: 0,
  },

  nextId(entity) {
    this._counters[entity] += 1;
    return this._counters[entity];
  },
};

module.exports = db;