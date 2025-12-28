// Declare library and dependent module
// const express = require('express');
// const Router = express.Router();
// const path = require('path');
// const Menu_Candle_Processing = require('../../controllers/Website_Candle_Light/Menu_Candle_Processing_MongooseDB');
// var isAdminRightChecked;
// const Redis_API = require('../../controllers/API_with_Redis/API_Redis');
// const { createClient } = require('redis');

const express = require('express');
const Router = express.Router();
const path = require('path');
const productModel = require('../controllers/API_with_MySQL/MySQL_API_products_table');
const { createClient } = require('redis');


Router.get('/get_product',async (req,res)=>{
   const products = await productModel.getAllProducts();
   console.log('Products fetched successfully:', products);
   res.json(products);
})

Router.get('/insert_product',async (req,res)=>{
    const data = {
        name: "Nến thơm Lavender",
        price: 120000,
        description: "Nến hương lavender thư giãn"
    };
    const products = await productModel.insertProduct(data);
    console.log('Products fetched successfully:', products);
    res.json(products);
})

Router.get('/update_product',async (req,res)=>{
    const id = 3; // ID of the product to update
    const data = {
        name: "Nến thơm Lavender Cập nhật",
        price: 120000,
        description: "Nến hương lavender thư giãn Cập nhật"
    };
    const products = await productModel.updateProduct(id,data);
    console.log('Products fetched successfully:', products);
    res.json(products);
})

Router.get('/delete_product',async (req, res) => {
  try {
    const { id } = req.query; // Lấy id từ query parameter
    if (!id) {
      return res.status(400).json({ error: 'Missing id parameter' });
    }

    const result = await productModel.deleteProduct(id);
    console.log(`Product with id=${id} deleted successfully:`, result);

    res.json({ message: `Product with id=${id} deleted!`, result });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Internal Server Error', detail: err.message });
  }
});
// Export router to common usage
module.exports = Router;