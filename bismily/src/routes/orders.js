const express = require('express');
const router = express.Router();
const orderRepo = require('../repositories/OrderRepository');
const userRepo = require('../repositories/UserRepository');
const productRepo = require('../repositories/ProductRepository');

router.get('/', (req, res) => {
  const { userId } = req.query;
  const orders = userId ? orderRepo.findByUser(userId) : orderRepo.findAll();
  res.json(orders);
});

router.get('/:id', (req, res) => {
  const order = orderRepo.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

router.post('/', (req, res) => {
  const { userId, items } = req.body;

  if (!userId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'userId and items[] are required' });
  }

  const user = userRepo.findById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const enrichedItems = [];
  for (const item of items) {
    const product = productRepo.findById(item.productId);
    if (!product) {
      return res.status(404).json({ error: `Product ${item.productId} not found` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ error: `Not enough stock for ${product.title}` });
    }
    enrichedItems.push({
      productId: product.id,
      quantity: item.quantity,
      price: product.price,
    });
    product.stock -= item.quantity;
  }

  const order = orderRepo.create({ userId: Number(userId), items: enrichedItems });
  res.status(201).json(order);
});

router.put('/:id', (req, res) => {
  const updated = orderRepo.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Order not found' });
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const removed = orderRepo.delete(req.params.id);
  if (!removed) return res.status(404).json({ error: 'Order not found' });
  res.json({ message: 'Deleted', order: removed });
});

module.exports = router;