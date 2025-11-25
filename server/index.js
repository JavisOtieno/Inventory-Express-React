const express = require('express');
const sequelize = require('./models').sequelize;  // Import from models/index.js (auto-generated)
const { User } = require('./models');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth.js');
const productRoutes = require('./routes/productRoutes.js');

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', require('./routes/supplierRoutes'))
app.use('/api/customers', require('./routes/customerRoutes'))
app.use('/api/purchases', require('./routes/purchaseRoutes'))
app.use('/api/sales', require('./routes/saleRoutes'))
app.use('/api/dashboard',  require('./routes/saleRoutes'))

// Sync database (for dev; in production, use migrations)
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Error syncing database:', err));

// Sample GET route to fetch users
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sample POST route to add a user
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = await User.create({ name, email });
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});