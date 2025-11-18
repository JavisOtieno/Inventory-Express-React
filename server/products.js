module.exports = (prisma) => {
  const router = require('express').Router();

  router.get('/', async (req, res) => {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(products);
  });

  router.post('/', async (req, res) => {
    const { name, description, price } = req.body;
    const product = await prisma.product.create({ data: { name, description, price } });
    res.status(201).json(product);
  });

  router.delete('/:id', async (req, res) => {
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  });

  return router;
};
