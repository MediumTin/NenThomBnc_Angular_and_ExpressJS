// Declare library and dependent module
const express = require('express');
const Router = express.Router();
const path = require('path');
const Menu_Candle_Processing = require('../../controllers/Website_Candle_Light/Menu_Candle_Processing_MongooseDB');
var isAdminRightChecked;
const User_Information_Handling = require('../../controllers/Website_Candle_Light/User_Information_Handling');
const User_Information_From_MySQL = require('../../controllers/API_with_MySQL/MySQL_API_products_table');
const Redis_API = require('../../controllers/API_with_Redis/API_Redis');
const Global_Interface = require('../../controllers/Website_Candle_Light/Global_interface');
const { createClient } = require('redis');
const samplearray2 = ['Location 1', 'Location 2'];
var old_array;

const client = createClient({
   username: process.env.REDIS_USERNAME,
   password: process.env.REDIS_PASSWORD,
   socket: {
       host: process.env.REDIS_HOST,
       port: process.env.REDIS_PORT
   }
});  // Create a Redis client

// Process with router
Router.get('/customer',async (req,res)=>{
   var username, email, group, brand;
   console.log("Admin management - customer route called");
   const Customer_list = await User_Information_From_MySQL.Get_Customer_List_in_MySQL_DB_for_Admin();
   console.log(`Customer_list is ${Customer_list}`);
   console.log(`Customer_list length is ${Customer_list.length}`);
   console.log('First item of Customer_list is : ', Customer_list[0]);
   console.log('Type of first item of Customer_list is : ', typeof(Customer_list[0])); // object

   var response_array = [];
   for(let i=0; i<Customer_list.length; i++){
      let customer = Customer_list[i];
      response_array.push({
         "Customer_Id" : `${customer.customer_id}`,
         "email" : `${customer.email}`,
         "name" : `${customer.name}`,
         "address" : `${customer.address}`
      });
   }
   res.status(200).send(response_array);
   
})

// Process with router
Router.get('/coupon',async (req,res)=>{
   console.log("Admin management - coupon route called");
   const Coupon_list = await User_Information_From_MySQL.Get_Coupon_List_for_Admin();
   console.log(`Coupon_list is ${Coupon_list}`);
   console.log(`Coupon_list length is ${Coupon_list.length}`);
   console.log('First item of Coupon_list is : ', Coupon_list[0]);
   console.log('Type of first item of Coupon_list is : ', typeof(Coupon_list[0])); // object
   var response_array = [];
   for(let i=0; i<Coupon_list.length; i++){
      let coupon = Coupon_list[i];
      response_array.push({
         "Coupon_id" : `${coupon.coupon_id}`,
         "Code" : `${coupon.code}`,
         "Discount_type" : `${coupon.discount_type}`,
         "Discount_value" : `${coupon.discount_value}`,
         "MinOrderValue" : `${coupon.min_order_value}`,
         "MaxDiscountValue" : `${coupon.max_discount_value}`,
         "ValidFrom" : `${coupon.valid_from}`,
         "ValidTo" : `${coupon.valid_to}`,
         "UsageLimit" : `${coupon.usage_limit}`,
         "LimitForPerson" : `${coupon.per_user_limit}`,
         "StatusActivation" : `${coupon.status}`
      });
   }
   res.status(200).send(response_array);
   
})

// Process with router
Router.post('/coupon',(req,res)=>{
   console.log("Admin management - coupon post route called");
   console.log('Request body is : ', req.body);
   Changed_Coupon_list = req.body;
   for(let i=0; i<Changed_Coupon_list.length; i++){
      let coupon = Changed_Coupon_list[i];
      User_Information_From_MySQL.Update_Coupon_Status_for_Admin(coupon.Coupon_id, coupon.StatusActivation);
   }
   res.status(200).send({message: 'Coupon status updated successfully'});
})

// Process with router
Router.get('/inventory',async (req,res)=>{
   const Inventory_list = await User_Information_From_MySQL.Get_Inventory_List_for_Admin();
   console.log(`Inventory_list is ${Inventory_list}`);
   console.log(`Inventory_list length is ${Inventory_list.length}`);
   console.log('First item of Inventory_list is : ', Inventory_list[0]);
   console.log('Type of first item of Inventory_list is : ', typeof(Inventory_list[0])); // object
   var response_array = [];
   for(let i=0; i<Inventory_list.length; i++){
      let inventory = Inventory_list[i];
      response_array.push({
         "InventoryId" : `${inventory.inventory_id}`,
         "ProductName" : `${inventory.product_sku}`,
         "Quantity" : `${inventory.quantity}`,
         "WarehouseName" : `${inventory.name}`,
         "Location" : `${inventory.location}`
      });
   }
   res.status(200).send(response_array);

})

// Process with router
Router.get('/warehouse',async (req,res)=>{
   const Warehouse_list = await User_Information_From_MySQL.Get_Warehouse_List_for_Admin();
   console.log(`Warehouse_list is ${Warehouse_list}`);
   console.log(`Warehouse_list length is ${Warehouse_list.length}`);
   console.log('First item of Warehouse_list is : ', Warehouse_list[0]);
   console.log('Type of first item of Warehouse_list is : ', typeof(Warehouse_list[0])); // object
   var response_array = [];
   for(let i=0; i<Warehouse_list.length; i++){
      let warehouse = Warehouse_list[i];
      response_array.push({
         "Warehouse_ID" : `${warehouse.warehouse_id }`,
         "WarehouseName" : `${warehouse.name}`,
         "Location" : `${warehouse.location}`,
         "Capacity" : `${warehouse.capacity}`,
         "ManagerName" : `${warehouse.manager_name}`
      });
   }
   console.log('Response array is : ', response_array);
   res.status(200).send(response_array);
   
})

// Process with router
Router.get('/orderstatus',async (req,res)=>{

   const Order_Detail_list = await User_Information_From_MySQL.Get_Order_Detail_List_for_Admin();
   console.log(`Order_Detail_list is ${Order_Detail_list}`);
   console.log(`Order_Detail_list length is ${Order_Detail_list.length}`);
   console.log('First item of Order_Detail_list is : ', Order_Detail_list[0]);
   console.log('Type of first item of Order_Detail_list is : ', typeof(Order_Detail_list[0])); // object
   var response_array = [];
   for(let i=0; i<Order_Detail_list.length; i++){
      var order_detail = Order_Detail_list[i];
      var detail = await User_Information_From_MySQL.Get_Order_Detail_for_Admin(order_detail.order_id);
      var detail_items = [];
      for(let j=0; j<detail.length; j++){
         let d = detail[j];
         detail_items.push({
            "OrderDetailId" : `${d.order_detail_id}`,
            "ProductName" : `${d.product_sku}`,
            "Quantity" : `${d.quantity}`,
            "UnitPrice" : `${d.unit_price}`,
            "SubTotalAmount" : `${d.subtotal}`,
            "PaymentId" : `${d.payment_id}`,
            "PaymentMethod" : `${d.method}`,
            "PaymentStatus" : `${d.status}`,
            "PaymentGatewayId" : `${d.payment_gateway_id}`
         });
      }
      response_array.push({
         "OrderId" : `${order_detail.order_id}`,
         "CustomerId" : `${order_detail.customer_id}`,
         "CustomerUsername" : `${order_detail.name}`,
         "TotalAmount" : `${order_detail.total_amount}`,
         "OrderStatus" : `${order_detail.status}`,
         "OrderDate" : `${order_detail.order_date}`,
         "details" : detail_items
      });
   }
   console.log('Response array is : ', response_array);
   res.status(200).send(response_array);
})

// Process with router
Router.post('/orderstatus',(req,res)=>{
   console.log("Admin management - orderstatus post route called");
   console.log('Request body is : ', req.body);
   Changed_Order_list = req.body;
   for(let i=0; i<Changed_Order_list.length; i++){
      let order = Changed_Order_list[i];
      User_Information_From_MySQL.Update_Order_Status_for_Admin(order.OrderId, order.OrderStatus);
   }  
   res.status(200).send({message: 'Order status updated successfully'});
})


// Export router to common usage
module.exports = Router;