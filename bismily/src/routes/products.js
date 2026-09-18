const express = require('express');
const router = express.Router();
const productRepo = require('../repositories/ProductRepository');

router.get('/', (req, res) => {
  const { category } = req.query;
  const products = category
    ? productRepo.findByCategory(category)
    : productRepo.findAll();
  res.json(products);
});

router.get('/:id', (req, res) => {
  const product = productRepo.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

router.post('/', (req, res) => {
  const { title, price } = req.body;
  if (!title || price === undefined) {
    return res.status(400).json({ error: 'title and price are required' });
  }
  const product = productRepo.create(req.body);
  res.status(201).json(product);
});

router.put('/:id', (req, res) => {
  const updated = productRepo.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Product not found' });
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const removed = productRepo.delete(req.params.id);
  if (!removed) return res.status(404).json({ error: 'Product not found' });
  res.json({ message: 'Deleted', product: removed });
});

module.exports = router;