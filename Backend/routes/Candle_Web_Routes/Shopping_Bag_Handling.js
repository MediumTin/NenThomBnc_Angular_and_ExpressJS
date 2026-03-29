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

// const client = createClient({
//    username: 'default',
//    password: 'Ug2FCahkYUOsMzn8AkuvSIRoarnuJzwb',
//    socket: {
//        host: 'redis-13281.c292.ap-southeast-1-1.ec2.redns.redis-cloud.com',
//        port: 13281
//    }
// });  // Create a Redis client

// Process with router
Router.get('/',(req,res)=>{
   isAdminRightChecked = 0;
   //  res.cookie("type","candles",{ expires: new Date(Date.now() + (7*3600000+5000)) }).status(200).sendFile(path.join(__dirname,'../','../','views','Candle_Web_Routes','Search_And_Filtering_Product.html'));
   var isSessionValid = req.session.personal_information;
   if(isSessionValid != undefined){
      // Handle when client still valid
      const LOC_SessionID = req.sessionID; // Get session ID of client for authentication
      req.sessionStore.get(LOC_SessionID, async function(err, session) {
         if (err) {
             // Handle the error
             res.send("Not found SID in Redis cache");
         } else {
             // Work with the session
            // const LOC_Result_from_SessionStorage = session.personal_shopping_bag; // Return info related to shopping bag
            var customer_id = req.session.personal_information && req.session.personal_information.customer_id;
            if (!customer_id) {
            req.session.destroy();
            res.status(200).send(
            [{
               "status" : "Session timeout",
            }]
            );
            return;
            }
            var LOC_Result_from_SessionStorage = await SyncUp_Info_Redis_And_DB(customer_id);
            console.log(`LOC_Result_from_SessionStorage : ${LOC_Result_from_SessionStorage}`);
            console.log(`Global interface is ${Global_Interface.isFirstTimeLogin}`);
            LOC_Result_from_SessionStorage = JSON.parse(LOC_Result_from_SessionStorage);
            console.log(`type of LOC_Result_from_SessionStorage : ${(LOC_Result_from_SessionStorage[0])}`);
            old_array = LOC_Result_from_SessionStorage;
            res.status(200).render('Shopping_Bag',{
            Request_From_Header : "payment",
            account : `${CurrentUser}`,
            sessionStorage : JSON.stringify(LOC_Result_from_SessionStorage[0]) // Return info related to shopping bag
               });
         }
     });
      
   } else {
      // Session is timeout -> Request login again
      req.session.destroy();
      res.redirect('/login_handling');
   }
   
})


const SyncUp_Info_Redis_And_DB = async (customer_id)=>{
   await Redis_API.Connect_To_Redis(client); // Open connection to Redis
   const Result_Read_From_Cache = await Redis_API.Get_Personal_Shopping_Bag(client,customer_id); // Check request is exist in Cache or not
   console.log(`Value of reading data from Cache: ${Result_Read_From_Cache}`); 
   if(Result_Read_From_Cache == null){
      console.log("Miss cached");
      if(isDatabaseCombination){
         console.log("Database combination mode is ON");
         var Personal_Shopping_Bag = await User_Information_From_MySQL.GetShoppingBagFromUser_MYSQL(customer_id); // Read data from database
      } else {
         console.log("Database combination mode is OFF");
         var Personal_Shopping_Bag = await User_Information_Handling.GetShoppingBagFromUser(username); // Read data from database
      } 
      const Result_Write_To_Cache = await Set_Data_From_Database_To_RedisCache(username,JSON.stringify(Personal_Shopping_Bag)); // set new data from database to Redis cache
      console.log(`Value of writing data to Cache: ${Result_Write_To_Cache}`);
      // res.status(200).send(Data_From_Database); // After get data from database and write to Cache, it will response to client
      await Redis_API.Disconnect_To_Redis(client); // Close connection to Redis
      return Personal_Shopping_Bag;
   }
   else {
      console.log("Cached");
      // res.status(200).send(Result_Read_From_Cache); // Available in cache, Read in Cache
      console.log(`Result from Redis cache : ${Result_Read_From_Cache}`);
      await Redis_API.Disconnect_To_Redis(client); // Close connection to Redis
      return Result_Read_From_Cache;
   }
}

const Set_Data_From_Database_To_RedisCache = async (key,data) => {
   const Result_Of_Update_DB = await Redis_API.Set_Data_To_Redis(client,key,data);
   return Result_Of_Update_DB;
}

const First_Time_Loading = async (req,res) => {
   var result = await Menu_Candle_Processing.GetAllProductInformation();
   console.log("Result of First time loading : ",result);
   return result;
}

const Request_Filter_Product = async (req,res) => {
   var Request_Filter_type = req.body.Request_Of_Type;
   var Request_Filter_group = req.body.Request_Of_Group;
   var Request_Filter_brand = req.body.Request_Of_Brand;
   var Request_Filter_price = req.body.Request_Of_Price;
   var Request_Filter_color = req.body.Request_Of_Color;
   var Result_Filtered_Data = await Menu_Candle_Processing.FilterInfo(Request_Filter_type,Request_Filter_group,Request_Filter_brand,Request_Filter_price,Request_Filter_color);
   return Result_Filtered_Data;
   // console.log(`Check duplicate: ${Result_Filtered_Data}`); // Expectation: Return in object type
   // console.log(`Request of A is ${Request_Filter_type}`);
   // console.log(`Request of B is ${Request_Filter_group}`);
   // console.log(`Request of C is ${Request_Filter_brand}`);
   // console.log(`Request of D is ${Request_Filter_price}`);
   // console.log(`Request of E is ${Request_Filter_color}`);
}

const Request_Add_New_Product = async (req,res) => {
   var Request_Add_Name = req.body.productname;
   var Request_Add_Type = req.body.producttype;
   var Request_Add_Group = req.body.productgroup;
   var Request_Add_Brand = req.body.productbrand;
   var Request_Add_Price = req.body.productprice;
   var Request_Add_Price_Range = req.body.productpricerange;
   var Request_Add_Color = req.body.productcolor;
   var Request_Add_Image = req.body.productimage;
 
   var result = await Menu_Candle_Processing.AddNewProductInformation(
      Request_Add_Name,
      Request_Add_Type,
      Request_Add_Group,
      Request_Add_Brand,
      Request_Add_Price,
      Request_Add_Price_Range,
      Request_Add_Color,
      Request_Add_Image
   );
   console.log("Result of Add new product : ",result);
   if(result==1){
      // Add successfully
      res.status(200).redirect('/candles/adminright');
   } else {
      // Add failure
      res.status(200).redirect('/Add_new_product');
   }
   

}
// Export router to common usage
module.exports = Router;