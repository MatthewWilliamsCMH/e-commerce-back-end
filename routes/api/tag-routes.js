const router = require('express').Router();
const { Tag, Product } = require('../../models');

// The `/api/tags` endpoint

// get all tags
router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
      include: [{model: Product}]
    });
    if (!tagData) {
      return res.status(404).json({message: 'No tags found!'})
    }
    return res.status(200).json(tagData);
  }
  catch (err) {
    return res.status(500).json({message: 'Error retrieving tags.', error: err.message});
  }
});

// get one tag
router.get('/:id', async (req, res) => {
  // find a single tag by its `id` value
  // be sure to include its associated Products
  try {
    const tagData = await Tag.findOne({
      where: {id: req.params.id},
      include: [{model: Product}]
    });
    if (!tagData) {
        return res.status(404).json({message: 'Tag not found.'})
    }
    return res.status(200).json(tagData);
  }
  catch (err) {
    return res.status(500).json({message: 'Error retrieving tag.', error: err.message});
  }
});

// create a new tag
router.post('/', async (req, res) => {
  try {
    const tagData = await Tag.create({
      tag_name: req.body.tag_name
    });
    return res.status(200).json({message: 'Tag added.'});
  }
  catch(err) {
    return res.status(500).json({message: 'Error creating tag.', error: err.message});
  }
});

router.put('/:id', async (req, res) => {
  // update a tag by its `id` value
  try {
    const tagData = await Tag.update(
      {
        tag_name: req.body.tag_name
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
    if (!tagData) {
      return res.status(404).json({ message: 'Tag not found.'});
    }
    return res.status(200).json({message: 'Tag updated.'});
  }
  catch(err) {
    return res.status(500).json({message: 'Error updating tag.', error: err.message});
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!tagData) {
      return res.status(404).json({ message: 'Tag not found.'});
    }
    return res.status(200).json({message: 'Tag deleted.'});
  } 
  catch (err) {
    return res.status(500).json({message: 'Error deleting tag.', error: err.message});
  }
});

module.exports = router;