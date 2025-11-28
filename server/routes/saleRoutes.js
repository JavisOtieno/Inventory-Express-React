const express = require('express')
const router = express.Router()
const { Sale, Customer, Product, Supplier, ProductSupplier, sequelize } = require('../models')
const auth = require('../routes/auth')

// GET all
router.get('/', auth, async (req, res) => {
  try {
    const sales = await Sale.findAll({
      include: [
        { model: Customer, attributes: ['name'] },
        { model: Product, attributes: ['name'] },
        { model: Supplier, attributes: ['name'] } // Include Supplier info
      ],
      order: [['createdAt', 'DESC']]
    })
    res.json(sales)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// CREATE
router.post('/', auth, async (req, res) => {
  const t = await sequelize.transaction()

  try {
    const { customerId, productId, supplierId, quantity } = req.body

    // 1. Check Specific Stock (Product + Supplier)
    const ps = await ProductSupplier.findOne({
      where: { productId, supplierId },
      transaction: t
    })

    if (!ps || ps.quantity < parseInt(quantity)) {
      await t.rollback()
      return res.status(400).json({ 
        message: `Insufficient stock from this supplier. Available: ${ps ? ps.quantity : 0}` 
      })
    }

    // 2. Create Sale
    const sale = await Sale.create(
        { customerId, productId, supplierId, quantity },
        { transaction: t }
    )

    // 3. Deduct from ProductSupplier
    ps.quantity -= parseInt(quantity)
    await ps.save({ transaction: t })

    // 4. Deduct from Global Product
    const product = await Product.findByPk(productId, { transaction: t })
    product.quantity -= parseInt(quantity)
    await product.save({ transaction: t })

    await t.commit()

    const detailedSale = await Sale.findByPk(sale.id, {
      include: [
          { model: Customer }, 
          { model: Product },
          { model: Supplier }
      ]
    })
    res.status(201).json(detailedSale)

  } catch (err) {
    await t.rollback()
    res.status(400).json({ message: err.message })
  }
})

// UPDATE
router.put('/:id', auth, async (req, res) => {
  const t = await sequelize.transaction()

  try {
    const sale = await Sale.findByPk(req.params.id, { transaction: t })
    if (!sale) {
        await t.rollback()
        return res.status(404).json({ message: 'Sale not found' })
    }

    const { customerId, productId, supplierId, quantity } = req.body

    // LOGIC: "Return" the old items to the shelf, then "Buy" the new items.
    
    // 1. Return Old Stock
    const oldPS = await ProductSupplier.findOne({
      where: { productId: sale.productId, supplierId: sale.supplierId },
      transaction: t
    })
    if (oldPS) {
      oldPS.quantity += sale.quantity
      await oldPS.save({ transaction: t })
    }

    const oldProduct = await Product.findByPk(sale.productId, { transaction: t })
    oldProduct.quantity += sale.quantity
    await oldProduct.save({ transaction: t })

    // 2. Take New Stock
    const newPS = await ProductSupplier.findOne({
      where: { productId, supplierId },
      transaction: t
    })

    if (!newPS || newPS.quantity < parseInt(quantity)) {
        await t.rollback()
        return res.status(400).json({ 
            message: `Insufficient stock for update. Available: ${newPS ? newPS.quantity : 0}` 
        })
    }

    newPS.quantity -= parseInt(quantity)
    await newPS.save({ transaction: t })

    const newProduct = await Product.findByPk(productId, { transaction: t })
    newProduct.quantity -= parseInt(quantity)
    await newProduct.save({ transaction: t })

    // 3. Update Sale Record
    await sale.update({ customerId, productId, supplierId, quantity }, { transaction: t })

    await t.commit()

    const updated = await Sale.findByPk(req.params.id, {
        include: [{ model: Customer }, { model: Product }, { model: Supplier }]
    })
    res.json(updated)

  } catch (err) {
    await t.rollback()
    res.status(400).json({ message: err.message })
  }
})

// DELETE
router.delete('/:id', auth, async (req, res) => {
  const t = await sequelize.transaction()

  try {
    const sale = await Sale.findByPk(req.params.id, { transaction: t })
    if (!sale) {
        await t.rollback()
        return res.status(404).json({ message: 'Sale not found' })
    }

    // 1. Return Stock to ProductSupplier
    const ps = await ProductSupplier.findOne({
      where: { productId: sale.productId, supplierId: sale.supplierId },
      transaction: t
    })
    
    // If ps exists, add back. If it doesn't exist (maybe supplier deleted?), we skip or re-create.
    // Assuming supplier exists:
    if (ps) {
      ps.quantity += sale.quantity
      await ps.save({ transaction: t })
    }

    // 2. Return Stock to Global Product
    const product = await Product.findByPk(sale.productId, { transaction: t })
    product.quantity += sale.quantity
    await product.save({ transaction: t })

    // 3. Delete Sale
    await sale.destroy({ transaction: t })

    await t.commit()
    res.json({ message: 'Sale deleted' })

  } catch (err) {
    await t.rollback()
    res.status(500).json({ message: err.message })
  }
})

module.exports = router