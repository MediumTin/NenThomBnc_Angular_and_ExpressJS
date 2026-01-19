

const express = require('express');
const Router = express.Router();
const path = require('path');
const Menu_Candle_Processing = require('../../controllers/Website_Candle_Light/Menu_Candle_Processing_MongooseDB');
const Redis_API = require('../../controllers/API_with_Redis/API_Redis');
const PayPal_Interface = require('../../controllers/API_with_PayPal/PayPal_API')
const { createClient } = require('redis');

// Get Show detail
Router.get('/show_detail',async (req,res)=>{
    const { orderID } = req.query;
    console.log(`Order ID received in server for detail info: ${orderID}`);
    const detail_info = await PayPal_Interface.ShowOrderDetails(orderID); // Update new shopping bag to database
    res.json(detail_info);
})

// Tried POST method with PayPal payment gateway
Router.post('/capture-order',async (req,res)=>{
    const { orderID } = req.body;
    console.log(`Order ID received in server: ${orderID}`); 
    const status_update = await PayPal_Interface.CaptureOrder(orderID); // Update new shopping bag to database
    console.log(`status_update is ${status_update}`);
    console.log(`Buyer name is ${status_update.payer.name.given_name}`);
    const detail_info = await PayPal_Interface.ShowOrderDetails(orderID); // Update new shopping bag to database
    console.log(`Detail info is ${JSON.stringify(detail_info)}`);
    res.json(status_update);
})

Router.post('/create-order',async (req,res)=>{
    const status_update = await PayPal_Interface.CreateOrder(req,res); // Update new shopping bag to database
    // const data = await response.json();
    console.log(`Order ID is ${status_update.id}`);
    res.json({ id: status_update.id });
    // res.json({ message: `Update status is ${status_update}`});
})

// Export router to common usage
module.exports = Router;