// server/routes/purchaseRoutes.js
const express = require('express')
const router = express.Router()
const { Purchase, Supplier, Product } = require('../models')
const auth = require('../routes/auth')

// GET all
router.get('/', auth, async (req, res) => {
  try {
    const purchases = await Purchase.findAll({
      include: [
        { model: Supplier, attributes: ['name'] },
        { model: Product, attributes: ['name'] }
      ],
      order: [['id', 'DESC']]
    })
    res.json(purchases)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// CREATE
router.post('/', auth, async (req, res) => {
  try {
    const { supplierId, productId, quantity } = req.body
    if (!supplierId || !productId || !quantity) return res.status(400).json({ message: 'Supplier ID, Product ID, and quantity required' })
    const purchase = await Purchase.create({ supplierId, productId, quantity })
    
    const product = await Product.findByPk(productId)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    product.quantity += parseInt(quantity)
    await product.save()
    
    const detailedPurchase = await Purchase.findByPk(purchase.id, {
      include: [
        { model: Supplier, attributes: ['name'] },
        { model: Product, attributes: ['name'] }
      ]
    })
    res.status(201).json(detailedPurchase)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// UPDATE
router.put('/:id', auth, async (req, res) => {
  try {
    const purchase = await Purchase.findByPk(req.params.id)
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' })
    
    const oldProductId = purchase.productId
    const oldQuantity = purchase.quantity
    
    await purchase.update(req.body)
    
    const newProductId = purchase.productId
    const newQuantity = purchase.quantity
    
    if (oldProductId === newProductId) {
      const diff = newQuantity - oldQuantity
      const product = await Product.findByPk(newProductId)
      if (!product) return res.status(404).json({ message: 'Product not found' })
      product.quantity += diff
      await product.save()
    } else {
      const oldProduct = await Product.findByPk(oldProductId)
      if (!oldProduct) return res.status(404).json({ message: 'Old product not found' })
      oldProduct.quantity -= oldQuantity
      await oldProduct.save()
      
      const newProduct = await Product.findByPk(newProductId)
      if (!newProduct) return res.status(404).json({ message: 'New product not found' })
      newProduct.quantity += newQuantity
      await newProduct.save()
    }
    
    const detailedPurchase = await Purchase.findByPk(purchase.id, {
      include: [
        { model: Supplier, attributes: ['name'] },
        { model: Product, attributes: ['name'] }
      ]
    })
    res.json(detailedPurchase)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE
router.delete('/:id', auth, async (req, res) => {
  try {
    const purchase = await Purchase.findByPk(req.params.id)
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' })
    
    const product = await Product.findByPk(purchase.productId)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    product.quantity -= purchase.quantity
    await product.save()
    
    await purchase.destroy()
    res.json({ message: 'Purchase deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router