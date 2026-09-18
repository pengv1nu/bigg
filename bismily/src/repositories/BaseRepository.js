const db = require('../database/db');

class BaseRepository {
  constructor(entityName, ModelClass) {
    this.entityName = entityName;
    this.ModelClass = ModelClass;
  }

  get collection() {
    return db[this.entityName];
  }

  create(data) {
    const id = db.nextId(this.entityName);
    const instance = new this.ModelClass({ id, ...data });
    this.collection.push(instance);
    return instance;
  }

  findAll() {
    return this.collection;
  }

  findById(id) {
    return this.collection.find((item) => item.id === Number(id)) || null;
  }

  update(id, data) {
    const item = this.findById(id);
    if (!item) return null;

    Object.keys(data).forEach((key) => {
      if (key !== 'id' && key !== 'createdAt') {
        item[key] = data[key];
      }
    });

    if (typeof item.calculateTotal === 'function') {
      item.total = item.calculateTotal();
    }

    return item;
  }

  delete(id) {
    const index = this.collection.findIndex((item) => item.id === Number(id));
    if (index === -1) return null;
    const [removed] = this.collection.splice(index, 1);
    return removed;
  }

  findOneBy(field, value) {
    return this.collection.find((item) => item[field] === value) || null;
  }
}

module.exports = BaseRepository;