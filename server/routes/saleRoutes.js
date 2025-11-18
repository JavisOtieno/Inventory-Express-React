// server/routes/saleRoutes.js
const express = require('express')
const router = express.Router()
const { Sale, Customer, Product } = require('../models')
const auth = require('../routes/auth')

// GET all
router.get('/', auth, async (req, res) => {
  try {
    const sales = await Sale.findAll({
      include: [
        { model: Customer, attributes: ['name'] },
        { model: Product, attributes: ['name'] }
      ],
      order: [['id', 'DESC']]
    })
    res.json(sales)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// CREATE
router.post('/', auth, async (req, res) => {
  try {
    const { customerId, productId, quantity } = req.body
    if (!customerId || !productId || !quantity) return res.status(400).json({ message: 'Customer ID, Product ID, and quantity required' })
    const sale = await Sale.create({ customerId, productId, quantity })
    
    const product = await Product.findByPk(productId)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    product.quantity += parseInt(quantity)
    await product.save()
    
    const detailedSale = await Sale.findByPk(sale.id, {
      include: [
        { model: Customer, attributes: ['name'] },
        { model: Product, attributes: ['name'] }
      ]
    })
    res.status(201).json(detailedSale)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// UPDATE
router.put('/:id', auth, async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id)
    if (!sale) return res.status(404).json({ message: 'Sale not found' })
    
    const oldProductId = sale.productId
    const oldQuantity = sale.quantity
    
    await sale.update(req.body)
    
    const newProductId = sale.productId
    const newQuantity = sale.quantity
    
    if (oldProductId === newProductId) {
      const diff = newQuantity - oldQuantity
      const product = await Product.findByPk(newProductId)
      if (!product) return res.status(404).json({ message: 'Product not found' })
      product.quantity -= diff
      await product.save()
    } else {
      const oldProduct = await Product.findByPk(oldProductId)
      if (!oldProduct) return res.status(404).json({ message: 'Old product not found' })
      oldProduct.quantity += oldQuantity
      await oldProduct.save()
      
      const newProduct = await Product.findByPk(newProductId)
      if (!newProduct) return res.status(404).json({ message: 'New product not found' })
      newProduct.quantity -= newQuantity
      await newProduct.save()
    }
    
    const detailedSale = await Sale.findByPk(sale.id, {
      include: [
        { model: Customer, attributes: ['name'] },
        { model: Product, attributes: ['name'] }
      ]
    })
    res.json(detailedSale)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE
router.delete('/:id', auth, async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id)
    if (!sale) return res.status(404).json({ message: 'Sale not found' })
    
    const product = await Product.findByPk(sale.productId)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    product.quantity += sale.quantity
    await product.save()
    
    await sale.destroy()
    res.json({ message: 'Sale deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router