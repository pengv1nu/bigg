class Product {
  constructor({ id = null, title, description = '', price, stock = 0, category = 'general' }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = Number(price);
    this.stock = Number(stock);
    this.category = category;
    this.createdAt = new Date().toISOString();
  }
}

module.exports = Product;