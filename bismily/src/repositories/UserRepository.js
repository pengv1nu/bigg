const BaseRepository = require('./BaseRepository');
const User = require('../models/User');

class UserRepository extends BaseRepository {
  constructor() {
    super('users', User);
  }

  findByEmail(email) {
    return this.findOneBy('email', email);
  }
}

module.exports = new UserRepository();