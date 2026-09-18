const BaseRepository = require('./BaseRepository');
const Order = require('../models/Order');

class OrderRepository extends BaseRepository {
  constructor() {
    super('orders', Order);
  }

  findByUser(userId) {
    return this.collection.filter((o) => o.userId === Number(userId));
  }
}

module.exports = new OrderRepository();