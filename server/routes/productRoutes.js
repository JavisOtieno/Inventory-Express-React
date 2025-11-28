// server/routes/productRoutes.js
const express = require('express')
const router = express.Router()
const { Product } = require('../models') // assuming you have Product model
const auth = require('../routes/auth') // your JWT middleware
const { ProductSupplier, Supplier, Sequelize } = require('../models');

// GET all products
router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.findAll({ order: [['id', 'DESC']] })
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET suppliers who have stock of a specific product
router.get('/:id/suppliers', auth, async (req, res) => {
  try {
    const stock = await ProductSupplier.findAll({
      where: { 
        productId: req.params.id,
        quantity: { [Sequelize.Op.gt]: 0 } // Only show suppliers who actually have items
      },
      include: [{ model: Supplier, attributes: ['name'] }]
    });
    res.json(stock);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE product
router.post('/', auth, async (req, res) => {
  try {
    const { name, quantity } = req.body
    if (!name) return res.status(400).json({ message: 'Name is required' })

    const product = await Product.create({
      name,
      quantity: quantity || 0,
    })
    res.status(201).json(product)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// UPDATE product
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    await product.update(req.body)
    res.json(product)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    await product.destroy()
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router