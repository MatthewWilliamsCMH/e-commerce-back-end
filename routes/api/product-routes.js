const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findAll({
      include: [{model: Category}, {model: Tag}]
    });
    if (!productData) { //it's very unlikely this would happen; it would mean there are no products in the db.
      return res.status(404).json({message: 'No products found!'})
    }
    return res.status(200).json(productData);
  }
  catch (err) {
    return res.status(500).json({message: 'Error retrieving products.', error: err.message});
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findOne({
      where: {id: req.params.id},
      include: [{model: Category}, {model: Tag}]
    });
    if (!productData) {
      return res.status(404).json({message: 'Product not found.'})
    }
    return res.status(200).json(productData);}
    catch (err) {
      return res.status(500).json({message: 'Error retrieving product.', error: err.message});
    }
  });

// create new product
router.post('/', async (req, res) => {
  try {
    const productData = await Product.create({
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
    });

    // if there are product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => ({
          product_id: productData.id,
          tag_id
      }));
      await ProductTag.bulkCreate(productTagIdArr);
    }
    // if no product tags, just respond
    return res.status(200).json({message: 'Product added.'});
  }
  catch(err) {
    return res.status(500).json({message: 'Error adding product.', error: err.message});
  }
});

router.put('/:id', async (req, res) => {
  // update a product by its `id` value
  try {
    const productData = await Product.update({
        product_name: req.body.product_name,
        price: req.body.price,
        stock: req.body.stock
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
    if (!productData) { // chatGPT puts [productData] into an array above and checks here to see if it has an index of 0 (in other words, it's not empty)
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.status(200).json({message: 'Product updated.'}) //return here?
  }
  catch(err) {
    return res.status(500).json({message: 'Error updating product', error: err.message})
  }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!productData) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.status(200).json({message: 'Product deleted.'});
  } 
  catch (err) {
    return res.status(500).json({message: 'Error deleting product.', error: err.message});
  }
});

module.exports = router;