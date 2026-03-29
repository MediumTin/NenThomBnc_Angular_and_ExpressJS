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
   // Startdard way:
   // 1. Set new value in Database
   // 2. Delete from Cache
   // 3. Read cache failure (miss cached)
   // 4. Read data from Datbase due to missing Cache
   // 5. Write new data to Cache
const client = createClient({
   username: process.env.REDIS_USERNAME,
   password: process.env.REDIS_PASSWORD,
   socket: {
       host: process.env.REDIS_HOST,
       port: process.env.REDIS_PORT
   }
});  // Create a Redis client
client.connect().then(() => {
  console.log('Connected to Redis');   
   // Khởi động server hoặc các thao tác khác
}).catch((err) => {
   console.error('Redis connection error:', err);
});
// Process with router
Router.get('/customer',async (req,res)=>{
   var response_array = [];
   var response_array_Final = [];
   var username, email, group, brand;
   console.log("Admin management - customer route called");
   var Customer_list = [];
   var Request_From_Client = "Get_Customer_List_For_Admin";
   const Result_Read_From_Cache = await Redis_API.Get_Data_From_Redis(client,Request_From_Client); // Check request is exist in Cache or not
   console.log(`Value of reading data from Cache: ${Result_Read_From_Cache}`); 
   if(Result_Read_From_Cache == null){
      console.log("Miss cached");
      const Customer_list = await User_Information_From_MySQL.Get_Customer_List_in_MySQL_DB_for_Admin(); // missing in cache , Request read from Database
      for(let i=0; i<Customer_list.length; i++){
         let customer = Customer_list[i];
         response_array.push({
            "Customer_Id" : `${customer.customer_id}`,
            "email" : `${customer.email}`,
            "name" : `${customer.first_name} ${customer.last_name}`,
            "address" : `${customer.address}`
         });
      }
      const Result_Write_To_Cache = await Redis_API.Set_Data_To_Redis(client,Request_From_Client,JSON.stringify(response_array)); // set new data from database to Redis cache
      console.log(`Value of writing data to Cache: ${Result_Write_To_Cache}`);
      console.log(`Type of response message ${typeof(response_array)}`);
      response_array_Final = response_array;
   }
   else {
      console.log("Available in cache, Read in Cache");
      response_array_Final = JSON.parse(Result_Read_From_Cache);
   }  
   res.status(200).send(response_array_Final);
   
})

// Process with router
Router.get('/coupon',async (req,res)=>{
   console.log("Admin management - coupon route called");
   var response_array = [];
   var response_array_Final = [];
   var Request_From_Client = "Get_Coupon_List_For_Admin";
   const Result_Read_From_Cache = await Redis_API.Get_Data_From_Redis(client,Request_From_Client); // Check request is exist in Cache or not
   console.log(`Value of reading data from Cache: ${Result_Read_From_Cache}`); 
   if(Result_Read_From_Cache == null){
      console.log("Miss cached");
      const Coupon_list = await User_Information_From_MySQL.Get_Coupon_List_for_Admin(); // missing in cache , Request read from Database
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
      const Result_Write_To_Cache = await Redis_API.Set_Data_To_Redis(client,Request_From_Client,JSON.stringify(response_array)); // set new data from database to Redis cache
      console.log(`Value of writing data to Cache: ${Result_Write_To_Cache}`);
      console.log(`Type of response message ${typeof(response_array)}`);
      response_array_Final = response_array;
   }
   else {
      console.log("Available in cache, Read in Cache");
      response_array_Final = JSON.parse(Result_Read_From_Cache);
   }  
   res.status(200).send(response_array_Final);
   
})

// Process with router
Router.post('/coupon',(req,res)=>{
   var Request_From_Client = "Get_Coupon_List_For_Admin";
   console.log("Admin management - coupon post route called");
   console.log('Request body is : ', req.body);
   Changed_Coupon_list = req.body;
   for(let i=0; i<Changed_Coupon_list.length; i++){
      let coupon = Changed_Coupon_list[i];
      User_Information_From_MySQL.Update_Coupon_Status_for_Admin(coupon.Coupon_id, coupon.StatusActivation);
   }
   const Result_Delete_Cache = Redis_API.Delete_seperated_data_inRedis(client, Request_From_Client); // Delete cache after updating coupon status in database
   console.log(`Value of deleting data in Cache: ${Result_Delete_Cache}`);
   res.status(200).send({message: 'Coupon status updated successfully'});
})

// Process with router
Router.get('/inventory',async (req,res)=>{
   var response_array = [];
   var response_array_Final = [];
   var Request_From_Client = "Get_Inventory_List_For_Admin";
   const Result_Read_From_Cache = await Redis_API.Get_Data_From_Redis(client,Request_From_Client); // Check request is exist in Cache or not
   console.log(`Value of reading data from Cache: ${Result_Read_From_Cache}`); 
   if(Result_Read_From_Cache == null){
      console.log("Miss cached");
      const Inventory_list = await User_Information_From_MySQL.Get_Inventory_List_for_Admin(); // missing in cache , Request read from Database
      for(let i=0; i<Inventory_list.length; i++){
         let inventory = Inventory_list[i];
         response_array.push({
            "InventoryId" : `${inventory.inventory_id}`,
            "ProductName" : `${inventory.product_name}`,
            "Quantity" : `${inventory.quantity_storage}`,
            "WarehouseName" : `${inventory.name}`,
            "Location" : `${inventory.location}`
         });
      }
      const Result_Write_To_Cache = await Redis_API.Set_Data_To_Redis(client,Request_From_Client,JSON.stringify(response_array)); // set new data from database to Redis cache
      console.log(`Value of writing data to Cache: ${Result_Write_To_Cache}`);
      console.log(`Type of response message ${typeof(response_array)}`);
      response_array_Final = response_array;
   }
   else {
      console.log("Available in cache, Read in Cache");
      response_array_Final = JSON.parse(Result_Read_From_Cache);
   } 

   console.log('Response array is : ', response_array_Final);
   res.status(200).send(response_array_Final);

})

// Process with router
Router.get('/warehouse',async (req,res)=>{
   var response_array = [];
   var response_array_Final = [];
   var Request_From_Client = "Get_Warehouse_List_For_Admin";
   const Result_Read_From_Cache = await Redis_API.Get_Data_From_Redis(client,Request_From_Client); // Check request is exist in Cache or not
   console.log(`Value of reading data from Cache: ${Result_Read_From_Cache}`); 
   if(Result_Read_From_Cache == null){
      console.log("Miss cached");
      const Warehouse_list = await User_Information_From_MySQL.Get_Warehouse_List_for_Admin(); // missing in cache , Request read from Database
      console.log(`Warehouse_list in Database is ${Warehouse_list}`);
      console.log(`Warehouse_list in Database length is ${Warehouse_list.length}`);
      console.log('First item of Warehouse_list in Database is : ', Warehouse_list[0]);
      console.log('Type of first item of Warehouse_list in Database is : ', typeof(Warehouse_list[0])); // object
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
      const Result_Write_To_Cache = await Redis_API.Set_Data_To_Redis(client,Request_From_Client,JSON.stringify(response_array)); // set new data from database to Redis cache
      console.log(`Value of writing data to Cache: ${Result_Write_To_Cache}`);
      console.log(`Type of response message ${typeof(response_array)}`);
      response_array_Final = response_array;
   }
   else {
      console.log("Available in cache, Read in Cache");
      response_array_Final = JSON.parse(Result_Read_From_Cache);
      console.log(`Type of response message ${typeof(response_array_Final)}`);
   } 
   console.log('Response array is : ', response_array_Final);
   res.status(200).send(response_array_Final);
})

// Process with router
Router.get('/orderstatus',async (req,res)=>{
   var response_array = [];
   var response_array_Final = [];
   var Order_Detail_list = [];
   var Request_From_Client = "Get_Order_Detail_list_For_Admin";
   const Result_Read_From_Cache = await Redis_API.Get_Data_From_Redis(client,Request_From_Client); // Check request is exist in Cache or not
   console.log(`Value of reading data from Cache: ${Result_Read_From_Cache}`); 
   if(Result_Read_From_Cache == null){
      console.log("Miss cached");
      const Order_Detail_list = await User_Information_From_MySQL.Get_Order_Detail_List_for_Admin();
      // console.log(`Order_Detail_list is ${Order_Detail_list}`);
      // console.log(`Order_Detail_list length is ${Order_Detail_list.length}`);
      // console.log('First item of Order_Detail_list is : ', Order_Detail_list[0]);
      // console.log('Type of first item of Order_Detail_list is : ', typeof(Order_Detail_list[0])); // object

      for(let i=0; i<Order_Detail_list.length; i++){
         var order_detail = Order_Detail_list[i];
         var detail = await User_Information_From_MySQL.Get_Order_Detail_for_Admin(order_detail.order_id);
         var detail_items = [];
         for(let j=0; j<detail.length; j++){
            let d = detail[j];
            detail_items.push({
               "OrderDetailId" : `${d.order_detail_id}`,
               "ProductName" : `${d.product_name}`,
               "Quantity" : `${d.quantity}`,
               "UnitPrice" : `${d.price_unit}`,
               "SubTotalAmount" : `${d.price_unit * d.quantity}`,
               "PaymentId" : `${d.payment_id}`,
               "PaymentMethod" : `${d.method}`,
               "PaymentStatus" : `${d.status_payment}`,
               "PaymentGatewayId" : `${d.payment_gateway_id}`
            });
         }
         response_array.push({
            "OrderId" : `${order_detail.order_id}`,
            "CustomerId" : `${order_detail.customer_id}`,
            "CustomerUsername" : `${order_detail.name}`,
            "TotalAmount" : `${order_detail.total_amount}`,
            "OrderStatus" : `${order_detail.status_order}`,
            "OrderDate" : `${order_detail.order_date}`,
            "details" : detail_items
         });
      }
      const Result_Write_To_Cache = await Redis_API.Set_Data_To_Redis(client,Request_From_Client,JSON.stringify(response_array)); // set new data from database to Redis cache
      console.log(`Value of writing data to Cache: ${Result_Write_To_Cache}`);
      console.log(`Type of response message ${typeof(response_array)}`);
      response_array_Final = response_array;
   }
   else {
      console.log("Available in cache, Read in Cache");
      // console.log(`Order_Detail_list in Redis is ${Result_Read_From_Cache}`);
      // console.log(`Order_Detail_list in Redis length is ${Result_Read_From_Cache.length}`);
      // console.log('First item of Order_Detail_list in Redis is : ', Result_Read_From_Cache[0]);
      // console.log('Type of first item of Order_Detail_list in Redis is : ', typeof(Result_Read_From_Cache[0])); // object
      response_array_Final = JSON.parse(Result_Read_From_Cache);
      // console.log(`Type of response message ${typeof(response_array_Final)}`);
   } 
   // console.log('Response array is : ', response_array_Final);
   res.status(200).send(response_array_Final);

})

// Process with router
Router.post('/orderstatus',(req,res)=>{
   console.log("Admin management - orderstatus post route called");
   var Request_From_Client = "Get_Order_Detail_list_For_Admin";
   console.log('Request body is : ', req.body);
   Changed_Order_list = req.body;
   for(let i=0; i<Changed_Order_list.length; i++){
      let order = Changed_Order_list[i];
      User_Information_From_MySQL.Update_Order_Status_for_Admin(order.OrderId, order.OrderStatus);
   }  
   const Result_Delete_Cache = Redis_API.Delete_seperated_data_inRedis(client, Request_From_Client); // Delete cache after updating coupon status in database
   console.log(`Value of deleting data in Cache: ${Result_Delete_Cache}`);
   res.status(200).send({message: 'Order status updated successfully'});
})


// Export router to common usage
module.exports = Router;