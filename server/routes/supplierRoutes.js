// server/routes/supplierRoutes.js
const express = require('express')
const router = express.Router()
const { Supplier } = require('../models')
const auth = require('../routes/auth')

// GET all
router.get('/', auth, async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({ order: [['id', 'DESC']] })
    res.json(suppliers)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// CREATE
router.post('/', auth, async (req, res) => {
  try {
    const { name, phone } = req.body
    if (!name || !phone) return res.status(400).json({ message: 'Name and phone required' })
    const supplier = await Supplier.create({ name, phone })
    res.status(201).json(supplier)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// UPDATE
router.put('/:id', auth, async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id)
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' })
    await supplier.update(req.body)
    res.json(supplier)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE
router.delete('/:id', auth, async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id)
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' })
    await supplier.destroy()
    res.json({ message: 'Supplier deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router