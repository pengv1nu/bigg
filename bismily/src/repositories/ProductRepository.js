const BaseRepository = require('./BaseRepository');
const Product = require('../models/Product');

class ProductRepository extends BaseRepository {
  constructor() {
    super('products', Product);
  }

  findByCategory(category) {
    return this.collection.filter((p) => p.category === category);
  }
}

module.exports = new ProductRepository();