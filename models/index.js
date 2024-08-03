// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category; this is a one-to-many relationship
Product.belongsTo( Category, {
  foreignKey: 'category_id'
})
// Categories have many Products; the second statement establishing the one-to-many
Category.hasMany( Product, {
  foreignKey: 'category_id',
})

// Products belongToMany Tags (through ProductTag)
Product.belongsToMany( Tag, { 
  through: ProductTag,
  foreignKey: 'product_id'
})
// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany( Product, {
  through: ProductTag
})

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag
};
