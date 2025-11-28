const express = require('express')
const router = express.Router()
const { Purchase, Supplier, Product, ProductSupplier, sequelize } = require('../models')
const auth = require('../routes/auth')

// GET all
router.get('/', auth, async (req, res) => {
  try {
    const purchases = await Purchase.findAll({
      include: [
        { model: Supplier, attributes: ['name'] },
        { model: Product, attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']]
    })
    res.json(purchases)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// CREATE
router.post('/', auth, async (req, res) => {
  const t = await sequelize.transaction()

  try {
    const { supplierId, productId, quantity } = req.body
    
    // 1. Create the Purchase Record
    const purchase = await Purchase.create(
        { supplierId, productId, quantity }, 
        { transaction: t }
    )

    // 2. Upsert ProductSupplier (Inventory Batch)
    const productSupplier = await ProductSupplier.findOne({
      where: { productId, supplierId },
      transaction: t
    })

    if (productSupplier) {
      productSupplier.quantity += parseInt(quantity)
      await productSupplier.save({ transaction: t })
    } else {
      await ProductSupplier.create({
        productId,
        supplierId,
        quantity
      }, { transaction: t })
    }

    // 3. Update Global Product Count
    const product = await Product.findByPk(productId, { transaction: t })
    product.quantity += parseInt(quantity)
    await product.save({ transaction: t })

    await t.commit()

    // Fetch for response
    const detailedPurchase = await Purchase.findByPk(purchase.id, {
      include: [{ model: Supplier }, { model: Product }]
    })
    res.status(201).json(detailedPurchase)

  } catch (err) {
    await t.rollback()
    res.status(400).json({ message: err.message })
  }
})

// UPDATE
router.put('/:id', auth, async (req, res) => {
  const t = await sequelize.transaction()

  try {
    const purchase = await Purchase.findByPk(req.params.id, { transaction: t })
    if (!purchase) {
        await t.rollback()
        return res.status(404).json({ message: 'Purchase not found' })
    }

    const { supplierId, productId, quantity } = req.body

    // LOGIC: Revert the old purchase completely, then apply the new one.
    // This handles changing suppliers, products, or quantities safely.

    // 1. Revert Old Data
    const oldPS = await ProductSupplier.findOne({
      where: { productId: purchase.productId, supplierId: purchase.supplierId },
      transaction: t
    })
    if (oldPS) {
      oldPS.quantity -= purchase.quantity
      await oldPS.save({ transaction: t })
    }
    
    const oldProduct = await Product.findByPk(purchase.productId, { transaction: t })
    oldProduct.quantity -= purchase.quantity
    await oldProduct.save({ transaction: t })

    // 2. Apply New Data
    let newPS = await ProductSupplier.findOne({
      where: { productId, supplierId },
      transaction: t
    })

    if (newPS) {
      newPS.quantity += parseInt(quantity)
      await newPS.save({ transaction: t })
    } else {
      await ProductSupplier.create({ productId, supplierId, quantity }, { transaction: t })
    }

    const newProduct = await Product.findByPk(productId, { transaction: t })
    newProduct.quantity += parseInt(quantity)
    await newProduct.save({ transaction: t })

    // 3. Update the Purchase Record
    await purchase.update({ supplierId, productId, quantity }, { transaction: t })

    await t.commit()
    
    // Return updated record
    const updated = await Purchase.findByPk(req.params.id, {
        include: [{ model: Supplier }, { model: Product }]
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
    const purchase = await Purchase.findByPk(req.params.id, { transaction: t })
    if (!purchase) {
        await t.rollback()
        return res.status(404).json({ message: 'Purchase not found' })
    }

    // 1. Deduct from ProductSupplier
    const ps = await ProductSupplier.findOne({
      where: { productId: purchase.productId, supplierId: purchase.supplierId },
      transaction: t
    })
    
    // Check if removing this purchase would make stock negative (optional safeguard)
    if (ps && ps.quantity < purchase.quantity) {
       await t.rollback()
       return res.status(400).json({ message: 'Cannot delete: Stock has already been sold.' })
    }

    if (ps) {
      ps.quantity -= purchase.quantity
      await ps.save({ transaction: t })
    }

    // 2. Deduct from Global Product
    const product = await Product.findByPk(purchase.productId, { transaction: t })
    product.quantity -= purchase.quantity
    await product.save({ transaction: t })

    // 3. Delete Record
    await purchase.destroy({ transaction: t })

    await t.commit()
    res.json({ message: 'Purchase deleted' })

  } catch (err) {
    await t.rollback()
    res.status(500).json({ message: err.message })
  }
})

module.exports = router