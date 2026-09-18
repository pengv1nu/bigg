class Order {
  constructor({ id = null, userId, items = [], status = 'pending' }) {
    this.id = id;
    this.userId = userId;
    this.items = items;
    this.status = status;
    this.total = this.calculateTotal();
    this.createdAt = new Date().toISOString();
  }

  calculateTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}

module.exports = Order;