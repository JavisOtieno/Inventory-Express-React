// server/routes/customerRoutes.js
const express = require('express')
const router = express.Router()
const { Customer } = require('../models')
const auth = require('../routes/auth')

// GET all
router.get('/', auth, async (req, res) => {
  try {
    const customers = await Customer.findAll({ order: [['id', 'DESC']] })
    res.json(customers)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// CREATE
router.post('/', auth, async (req, res) => {
  try {
    const { name, phone } = req.body
    if (!name || !phone) return res.status(400).json({ message: 'Name and phone required' })
    const customer = await Customer.create({ name, phone })
    res.status(201).json(customer)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// UPDATE
router.put('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id)
    if (!customer) return res.status(404).json({ message: 'Customer not found' })
    await customer.update(req.body)
    res.json(customer)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE
router.delete('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id)
    if (!customer) return res.status(404).json({ message: 'Customer not found' })
    await customer.destroy()
    res.json({ message: 'Customer deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router