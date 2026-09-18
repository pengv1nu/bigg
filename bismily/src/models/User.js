class User {
  constructor({ id = null, name, email, password, role = 'customer' }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.createdAt = new Date().toISOString();
  }

  toJSON() {
    const { password, ...rest } = this;
    return rest;
  }
}

module.exports = User;