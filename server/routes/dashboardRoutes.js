// server/routes/dashboardRoutes.js
const express = require('express')
const router = express.Router()
// Import all your models here
const { Product, Customer, Purchase, Sale } = require('../models') 
const auth = require('../routes/auth')

// GET Dashboard Stats
router.get('/', auth, async (req, res) => {
  try {
    // Run all queries in parallel for better performance
    const [productCount, customerCount, purchaseCount, saleCount] = await Promise.all([
      Product.count(),
      Customer.count(),
      Purchase.count(),
      Sale.count() 
      // Note: If you want Total Revenue instead of count, use: Sale.sum('total_amount')
    ])

    res.json({
      totalProducts: productCount,
      totalCustomers: customerCount,
      totalPurchases: purchaseCount,
      totalSales: saleCount
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error fetching dashboard stats' })
  }
})

module.exports = router