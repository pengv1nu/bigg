const express = require('express');
const router = express.Router();
const userRepo = require('../repositories/UserRepository');

router.get('/', (req, res) => {
  res.json(userRepo.findAll());
});

router.get('/:id', (req, res) => {
  const user = userRepo.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

router.post('/', (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email and password are required' });
  }
  if (userRepo.findByEmail(email)) {
    return res.status(409).json({ error: 'Email already exists' });
  }
  const user = userRepo.create({ name, email, password, role });
  res.status(201).json(user);
});

router.put('/:id', (req, res) => {
  const updated = userRepo.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'User not found' });
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const removed = userRepo.delete(req.params.id);
  if (!removed) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'Deleted', user: removed });
});

module.exports = router;