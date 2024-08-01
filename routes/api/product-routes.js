const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {  //I added async to all of these, but I'm not sure it's needed. If error, test without
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findAll({
      include: [{model: Category}, {model: Tag}]
    });
    res.status(200).json(productData);
  }
  catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findOne({
      include: [{model: Category}, {model: Tag}]
    })
  }
  catch (err) {
    if (!productData) {
      res.status(404).json({message: "No such product found."})
      return;
    }
  }
});

// create new product
router.post('/', async (req, res) => {
  const productData = await Product.create({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
  });

  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

//THIS IS CHATGPT'S SUGGESTED ALTERATION FOR EFFICIENCY; KEEP IT UNTIL I KNOW THE OTHER WORKS
// // create new product
// router.post('/', async (req, res) => {
//   try {
//     // Create the new product
//     const product = await Product.create({
//       product_name: req.body.product_name,
//       price: req.body.price,
//       stock: req.body.stock,
//     });

//     // Check if there are tags to associate
//     if (req.body.tagIds && req.body.tagIds.length) {
//       // Prepare the array of tag associations
//       const productTagIdArr = req.body.tagIds.map((tag_id) => {
//         return {
//           product_id: product.id,
//           tag_id,
//         };
//       });

//       // Bulk create entries in the ProductTag join table
//       await ProductTag.bulkCreate(productTagIdArr);
//     }

//     // Respond with the newly created product
//     res.status(200).json(product);
//   } catch (err) {
//     // Handle errors
//     console.error(err);
//     res.status(400).json({ error: 'An error occurred while creating the product.' });
//   }
// });

// update product
router.put('/:id', async (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

            // figure out which ones to remove
          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
                  // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id
      },
    });

    if (!productData) {
      res.status(404).json({ message: 'No product found to delete.' });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }

});

module.exports = router;