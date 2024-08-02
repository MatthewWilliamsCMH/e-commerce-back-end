const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findAll({
      include: [{model: Product}]
    });
    if (!categoryData) {
      return res.status(404).json({message: "No categories found!"})
    }
   res.status(200).json(categoryData); //need return here?
  }
  catch (err) {
    return res.status(500).json({message: "Error retrieving categories.", error: err.message});
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findOne({
      include: [{model: Product}]
    });
    if (!categoryData) {
      return res.status(404).json({message: "Category not found."})
    }
    res.status(200).json(categoryData); //need return here?
  }
  catch (err) {
    res.status(500).json({message: "Error retrieving category.", error: err.message});
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const categoryData = await Category.create({
      category_name: req.body.category_name,
    });
    res.status(200).json({message: "Category added."}); //return here?
  }
  catch(err) {
    return res.status(500).json({message: "Error creating category.", error: err.message});
  };
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const categoryData = await Category.update(
      {
        category_name: req.body.category_name
      },
      {
        where: {
          id: req.params.id,
        }
      }
    )
    if (!categoryData) {
      return res.status(404).json({message: "Category not found."})
    }
    res.status(200).json({message: "Category updated."}); //return here?
  }
  catch(err) {
    return res.status(500).json({message: "Error updating category.", error: err.message});
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!categoryData) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    res.status(200).json({message: "Category deleted."}); //return here?
  } catch (err) {
      return res.status(500).json({message: "Error deleting category.", error: err.message});
  }
});

module.exports = router;