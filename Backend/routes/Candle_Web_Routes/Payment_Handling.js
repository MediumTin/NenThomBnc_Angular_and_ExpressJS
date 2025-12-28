// Declare library and dependent module
const express = require('express');
const Router = express.Router();
const path = require('path');
const Menu_Candle_Processing = require('../../controllers/Website_Candle_Light/Menu_Candle_Processing_MongooseDB');
const User_Information_Handling = require('../../controllers/Website_Candle_Light/User_Information_Handling');
const User_Information_From_MySQL = require('../../controllers/API_with_MySQL/MySQL_API_products_table');
var isAdminRightChecked;
const Global_Interface = require('../../controllers/Website_Candle_Light/Global_interface');
const Redis_API = require('../../controllers/API_with_Redis/API_Redis');
const { createClient } = require('redis');
const samplearray2 = ['Location 1', 'Location 2'];
const nodemailer = require('nodemailer'); // declare for mail service
const isDatabaseCombination = process.env.IS_DATABASE_COMBINATION === 'true';
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


var mailTransport = nodemailer.createTransport({
   service: "gmail",
   host: "smtp.gmail.com",
   port: 465,
   secure: true,
   auth : {
       user: "nguyentrungtin1002@gmail.com",
       pass : "xsmm tqvr dldv fcys",
   }
});

Router.post('/',async (req,res)=>{
   // const {user, pwd} = req.body;
   var Request_From_Client = `${req.body.name}`;
   console.log(`Post status is received. Message is ${req.body.name}`);
   if (Request_From_Client == "First_Time_load"){
      console.log("Request first time load page");
      await Redis_API.Connect_To_Redis(client); // Open connection to Redis
      const Result_Read_From_Cache = await Redis_API.Get_Data_From_Redis(client,Request_From_Client); // Check request is exist in Cache or not
      console.log(`Value of reading data from Cache: ${Result_Read_From_Cache}`); 
      if(Result_Read_From_Cache == null){
         console.log("Miss cached");
         const Data_From_Database = await First_Time_Loading(req,res); // missing in cache , Request read from Database
         const Result_Write_To_Cache = await Set_Data_From_Database_To_RedisCache(Request_From_Client,JSON.stringify(Data_From_Database)); // set new data from database to Redis cache
         console.log(`Value of writing data to Cache: ${Result_Write_To_Cache}`);
         res.status(200).send(Data_From_Database); // After get data from database and write to Cache, it will response to client
      }
      else {
         console.log("Cached");
         res.status(200).send(Result_Read_From_Cache); // Available in cache, Read in Cache
      }
      await Redis_API.Disconnect_To_Redis(client); // Close connection to Redis
   }
   else if (Request_From_Client == "Request_Filter_Product"){
      console.log("Request filter product");
      // Prepare some use cases for cache as : candle, oil, best_seller, discount (simple request - statement)
      await Redis_API.Connect_To_Redis(client); // Open connection to Redis
      var Total_Request_Filter_Product = `${req.body.Request_Of_Type},${req.body.Request_Of_Group},${req.body.Request_Of_Brand},${req.body.Request_Of_Price},${req.body.Request_Of_Color}`;
      console.log(`Total Request type : ------ ${Total_Request_Filter_Product}`);
      const Result_Read_From_Cache_FilterProduct = await Redis_API.Get_Data_From_Redis(client,Total_Request_Filter_Product); 
      console.log(`Value of reading data from Cache: ${Result_Read_From_Cache_FilterProduct}`); 
      if(Result_Read_From_Cache_FilterProduct == null){
         console.log("Filter product miss cached");
         const Data_From_Database_FilterProduct = await Request_Filter_Product(req,res); // user for complicated request (multiple conditions)
         const Result_Write_To_Cache_FilterProduct = await Set_Data_From_Database_To_RedisCache(Total_Request_Filter_Product,JSON.stringify(Data_From_Database_FilterProduct)); // set new data from database to Redis cache
         console.log(`Value of writing data to Cache: ${Result_Write_To_Cache_FilterProduct}`);
         res.status(200).send(Data_From_Database_FilterProduct);
      } else {
         console.log("Filter product cached");
         res.status(200).send(Result_Read_From_Cache_FilterProduct); // Available in cache, Read in Cache
      }
      await Redis_API.Disconnect_To_Redis(client); // Close connection to Redis
   }
   else {
      console.log("Invalid request from client");
   }  
})

Router.post('/specific_handling',async (req,res)=>{
   // Startdard way:
   // 1. Set new value in Database
   // 2. Delete from Cache
   // 3. Read cache failure (miss cached)
   // 4. Read data from Datbase due to missing Cache
   // 5. Write new data to Cache
   //Request_Add_New_Product(req,res);
   // await Redis_API.Connect_To_Redis(client); // Open connection to Redis
   // await Redis_API.Delete_Data_In_Redis(client);
   // await Redis_API.Disconnect_To_Redis(client);
   var requested_username = req.session.personal_information.username;
   console.log(`Requested username for payment handling is ${requested_username}`);
   var requested_password = req.session.personal_information.password;
   console.log(`Requested password for payment handling is ${requested_password}`);

   const Payment_gateway_id = req.body.Payment_gateway_id;
   console.log(`PayPal order ID is ${Payment_gateway_id}`);

   const Method_by_Order = req.body.Method_by_Order;
   console.log(`Method_by_Order is ${Method_by_Order}`);

   const Customer_ID_Info = await User_Information_From_MySQL.Get_Customer_ID_in_MySQL_DB_HighCorrection(requested_username,requested_password);
   console.log(`Customer_ID_Info is ${Customer_ID_Info}`);

   var total_price_After_VAT = req.body.Total_Price_After_VAT;
   console.log(`Total price after VAT is ${total_price_After_VAT}`);

   // Create new order in order table
   const Get_new_OrderID_created = await User_Information_From_MySQL.Create_New_Order_in_MySQL(Customer_ID_Info,total_price_After_VAT,'Processing');
   console.log(`Create_New_Order result is ${Get_new_OrderID_created}`);

   // Create new payment in payment table
   const Get_new_PaymentID_created = await User_Information_From_MySQL.Create_New_payment_in_MySQL(Get_new_OrderID_created,total_price_After_VAT,'Processing',Method_by_Order, Payment_gateway_id);
   console.log(`Create_New_payment result is ${Get_new_PaymentID_created}`);

   var selectedList = (req.body.Selected_List);
   console.log(`Name of first item is ${selectedList[0]}`);
   console.log(`Type first item is ${typeof(selectedList[0])}`);
   // selectedList = selectedList.split(",")
   //selectedList = selectedList[0].split(",")
   var Afterchange = selectedList[0].split(",")
   var selectedList_filtered2 = [];
   var selectedListt_with_order_detail = [];
   console.log(`Type first item after split is ${typeof(Afterchange)}`);
   console.log(`Name of first item after split is ${Afterchange[0]}`);
   
   for(let i = 0;i<selectedList.length;i++){
      selectedList_filtered2[i] = selectedList[i].split(","); // Split each item in selectedList by comma
      const Create_new_Order_detail_in_MySQL = await User_Information_From_MySQL.Create_Order_detail_in_MySQL(Get_new_OrderID_created,Get_new_PaymentID_created,selectedList_filtered2[i][1], selectedList_filtered2[i][2]);
      console.log(`Create_Order_detail_in_MySQL result is ${Create_new_Order_detail_in_MySQL}`);
      selectedListt_with_order_detail[i] = Create_new_Order_detail_in_MySQL;

   }
   console.log(`Type first item after split selectedList_filtered2 is ${typeof(selectedList_filtered2[0])}`);
   console.log(`Name of first item after split selectedList_filtered2 is ${selectedList_filtered2[0][0]}`);

   var length_of_selectedList = (selectedList.length);
   var selectedList_filtered = Array(length_of_selectedList).fill(null).map(() => Array(4)); // Declare empty 2 direction array (2 row, each row 4 elements)
   var Generated_HTML_SelectedProduct ="";
   var Generated_Attached_Image = [];
   ///////////////////////////////////////////////////////////////
   for(let i = 0;i<length_of_selectedList;i++){
      // for(let j=0;j<4;j++){
      //    selectedList_filtered[i][j] = selectedList_filtered2[i*4 + j]; 
      // }
      Generated_HTML_SelectedProduct += `
         <tr>
            <td>${selectedListt_with_order_detail[i]}</td>
            <td>${selectedList_filtered2[i][0]}</td>
            <td><img src="cid:${selectedList_filtered2[i][3]}" style="width:100px;height:100px;"></td>
            <td>${selectedList_filtered2[i][1]}</td>
            <td>${selectedList_filtered2[i][2]}</td>
            <td>${Number(selectedList_filtered2[i][2])*1000*Number(selectedList_filtered2[i][1])}</td>
         </tr>
      `
      // selectedList_filtered[i][0] is product name
      // selectedList_filtered[i][1] is quantity
      // selectedList_filtered[i][2] is price unit   
      // selectedList_filtered[i][3] is image path
      // Number(selectedList_filtered[i][2])*1000*Number(selectedList_filtered[i][1]) is total price

      Generated_Attached_Image[i] = {
         filename: path.basename(selectedList_filtered2[i][3]),
         path: path.join(__dirname, '../../public/img/Automation/Image', path.basename(selectedList_filtered2[i][3])), 
         cid: `${selectedList_filtered2[i][3]}` //same cid value as in the html img src
      }
   }
   ////////////////////////////////
   // console.log('Generated HTML is' ,Generated_Attached_Image);
   const htmlEmail2 = `<!DOCTYPE html>
      <html lang="en">

      <head>
         <meta charset="UTF-8">
         <meta http-equiv="X-UA-Compatible" content="IE=edge">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>BnCCandle</title>
         <link rel="icon" type="image/x-icon" href="../img/IconBnC.ico"> 
         <!-- Declare css and include into this file -->
         <!-- <link rel="stylesheet" href="../css/style_Candle.css" />    -->
         <link rel="stylesheet" href="../css/Header_Component.css" />  
         
         <!-- Declare Boostrap CSS -->
         <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
         <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js">
         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js">
         <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css">

      </head>

      <body>
         <!-- 1. Search bar and Navigation bar in header page. -->
         <div class="div-footer;" style="background-color: white;">
            <!-- Describe search bar and logo -->
            <table class="table1">
                  <tr>
                     <td><p>Order number is ${Get_new_OrderID_created}</p></td>
                  </tr>
                  <tr>
                     <td><p>Payment number is ${Get_new_PaymentID_created}</p></td>
                  </tr>
                  <tr>
                     <td><p>National buyer is ${req.body.Nation_buyer}</p></td>
                  </tr>
                  <tr>
                     <td><p>Total price before VAT is ${req.body.Total_Price_Before_VAT}</p></td>
                  </tr>
                  <tr>
                     <td><p>VAT payment is ${req.body.Total_VAT}</p></td>
                  </tr>
                  <tr>
                     <td><p>Total price after VAT is ${req.body.Total_Price_After_VAT}</p></td>
                  </tr>
            </table>
            <p>Detail your product as below</p>
            <table>
                  <tr>
                     <td><b>Order detail number</b></td>
                     <td><b>Product Name</b></td>
                     <td><b>Product Image</b></td>
                     <td><b>Quatity</b></td>
                     <td><b>Price Unit</b></td>
                     <td><b>Total price</b></td>
                  </tr>
                  ${Generated_HTML_SelectedProduct}
                  
            </table>
            <p>Thank you so much for your selection. See you later!</p>
         </div>

      </body>

      </html>`;
   console.log(`HTML email is ${htmlEmail2}`);
   console.log(`Email is ${req.body.Email}`);
   console.log(`Image is ${Generated_Attached_Image[0].filename}`);
   console.log(`Image is ${Generated_Attached_Image[0].path}`);
   console.log(`Image is ${Generated_Attached_Image[0].cid}`);
   console.log(`Slice 12 is ${selectedList_filtered2[0][3].slice(12)}`); // path.basename(selectedList_filtered2[i][3])
      console.log(`File name is ${path.basename(selectedList_filtered2[0][3])}`);
   mailTransport.sendMail({
      from: '"NenThomBnC" <nenthombnc@gmail.com>',
      to: `${req.body.Email}`,
      subject: 'Order confirmation',
      //text: 'Thank you for choosing our product. Your product will come to you soon! ',
      html: htmlEmail2,
      attachments: Generated_Attached_Image,
      generateTextFromHtml: true,
      }, function(err){
      if(err) console.error( 'Unable to send email: ' + err );
      });
      Generated_Attached_Image = [];
      var Personal_Shopping_Bag = await Menu_Candle_Processing.Update_Content_of_HistoricalBag(
         req.body.Username,
         req.body.Email,
         req.body.Visa_number,
         req.body.Visa_valid_date,
         req.body.Visa_cvv,
         req.body.Nation_buyer,
         req.body.Nation_zip_buyer,
         req.body.Nation_state_buyer,
         req.body.VAT_number_buyer,
         req.body.Total_Price_Before_VAT,
         req.body.Total_VAT,
         req.body.Total_Price_After_VAT,
         req.body.Selected_List,
      );
      // response to client that payment is successful
      // res.status(200).send(
      //    [{
      //       "status_of_confirmed_order" : "Successful",
      //    }]
      // )
      res.status(200).send(
         [{
            "status" : "status_of_confirmed_order",
         }]
      )
})


Router.post('/mergelocalstorageandDB',async (req,res)=>{
   // Startdard way:
   // 1. Set new value in Database
   // 2. Delete from Cache
   // 3. Read cache failure (miss cached)
   // 4. Read data from Datbase due to missing Cache
   // 5. Write new data to Cache
   //Request_Add_New_Product(req,res);
   // await Redis_API.Connect_To_Redis(client); // Open connection to Redis
   // await Redis_API.Delete_Data_In_Redis(client);
   // await Redis_API.Disconnect_To_Redis(client);
   
   let Quatity_array = req.body.quatity_array; // array of quantity, but when typeof is object, because it is array (JS consider array is object)
   let Candle_name_array = req.body.candle_name_array; // array of candle name
   let Image_array = req.body.image_array; // array of image path
   let Price_array = req.body.price_array; // array of price unit

   console.log(`Quatity_array is ${Quatity_array}`); 
   console.log(`Candle_name_array is ${Candle_name_array}`);
   // Candle_name_array[0] = Candle Snuffer
   console.log(`Image_array is ${Image_array}`);
   console.log(`Price_array is ${Price_array}`);
   console.log(`Type of first item in Quatity_array is ${typeof(Quatity_array)}`);
   console.log(`Type of first item in Candle_name_array is ${typeof(Candle_name_array)}`);
   console.log(`Type of first item in Image_array is ${typeof(Image_array)}`);
   console.log(`Type of first item in Price_array is ${typeof(Price_array)}`);
   var CurrentUser = req.session.personal_information.username;
   let Merge_data_from_localstorage = [];
   let length_of_merge_array = (Quatity_array != undefined) ? Quatity_array.length : 0; // if local storage is empty, length of merge array = 0
   console.log(`Length Merge_data_from_localstorage 1 is ${Merge_data_from_localstorage.length}`);
   if(Quatity_array != undefined){
      // local storage is not empty
      for(let i=0;i<length_of_merge_array;i++){
         // Write into Database each item from local storage
         Merge_data_from_localstorage[i] = `${Candle_name_array[i]},${Quatity_array[i]},${Price_array[i]},${Image_array[i]}`;
         // Write to database and clear Redis cache
         console.log(`Username is ${CurrentUser}`);
         if(isDatabaseCombination){
            console.log("Database combination mode is ON");
            await User_Information_From_MySQL.Update_Content_of_ShoppingBag_MYSQL(CurrentUser,Merge_data_from_localstorage[i]); // Update new shopping bag to database
         } else {
            console.log("Database combination mode is OFF");
            await User_Information_Handling.Update_Content_of_ShoppingBag(CurrentUser,Merge_data_from_localstorage[i]); // Update new shopping bag to database
         }  
      }
      console.log(`Merge_data_from_localstorage after local storage only is ${Merge_data_from_localstorage}`);
      
      console.log(`Length Quatity_array is ${Quatity_array.length}`);
      console.log(`Length Merge_data_from_localstorage 2 is ${Merge_data_from_localstorage.length}`);
      await Redis_API.Connect_To_Redis(client); // Open connection to Redis
      const Result_Delete_Cache = await Redis_API.Delete_seperated_data_inRedis(client,CurrentUser); // Delete data in Redis cache
      console.log(`Value of deleting data in Cache: ${Result_Delete_Cache}`);
      await Redis_API.Disconnect_To_Redis(client); // Close connection to Redis
   }
   
   var LOC_Result_from_Database = await ReadShoppingBag_From_Database_and_Redis(CurrentUser);
   console.log(`LOC_Result_from_Database---------------- : ${LOC_Result_from_Database}`);
   console.log(`Type of LOC_Result_from_Database , expect is Array of String : ${typeof(LOC_Result_from_Database)}`);
   // LOC_Result_from_Database = JSON.parse(LOC_Result_from_Database);
   console.log(`First item of LOC_Result_from_Database : ${LOC_Result_from_Database[0]}`); // Candle Snuffer,1,85.000,../../../../assets/img/Automation/Image/26.jpg
   console.log(`Type of First item with LOC_Result_from_Database : ${typeof(LOC_Result_from_Database[0])}`); // string
   // let count_item_in_database = 0;
   // for(let i = length_of_merge_array; i < (LOC_Result_from_Database.length + length_of_merge_array);i++){
   //    Merge_data_from_localstorage[i] = LOC_Result_from_Database[count_item_in_database];
   //    count_item_in_database += 1;
   // }
   // console.log(`Length LOC_Result_from_Database is ${LOC_Result_from_Database.length}`);
   // console.log(`Length Merge_data_from_localstorage 3 is ${Merge_data_from_localstorage.length}`);
   // console.log(`Merge_data_from_localstorage after add database is ${Merge_data_from_localstorage}`);
   // console.log(`Type of Merge_data_from_localstorage is ${typeof(Merge_data_from_localstorage)}`); // object (array)
   // console.log(`First item of Merge_data_from_localstorage is ${Merge_data_from_localstorage[0]}`);
   // console.log(`Type of First item of Merge_data_from_localstorage is ${typeof(Merge_data_from_localstorage[0])}`); // string
   /// Sync up between local storage and database
//

   /// After sync up, write to database and Redis cache
   // // Write to database and clear Redis cache
   // var Personal_Shopping_Bag = await User_Information_Handling.Update_Content_of_ShoppingBag(CurrentUser,Merge_data_from_localstorage); // Update new shopping bag to database
   // console.log(`Value of writing data to Database: ${Personal_Shopping_Bag}`);
   // clear Redis cache
   // await Redis_API.Connect_To_Redis(client); // Open connection to Redis
   // const Result_Delete_Cache = await Redis_API.Delete_seperated_data_inRedis(client,CurrentUser); // Delete data in Redis cache
   // console.log(`Value of deleting data in Cache: ${Result_Delete_Cache}`);
   // await Redis_API.Disconnect_To_Redis(client); // Close connection to Redis

   // Write to Redis cache (for backup, not necessary)
   // await Redis_API.Connect_To_Redis(client); // Open connection to Redis
   // const Result_Write_To_Cache = await Set_Data_From_Database_To_RedisCache(CurrentUser,JSON.stringify(Merge_data_from_localstorage)); // set new data from database to Redis cache
   // console.log(`Value of writing data to Cache: ${Result_Write_To_Cache}`);
   // await Redis_API.Disconnect_To_Redis(client); // Close connection to Redis
   res.status(200).send(
   [{
      "Currentuser" : `${req.session.personal_information.username}`,
      "personal_shopping_bag" : JSON.stringify(LOC_Result_from_Database)
   }]);
})

// Process with router
Router.get('/',(req,res)=>{
   isAdminRightChecked = 0;
   //  res.cookie("type","candles",{ expires: new Date(Date.now() + (7*3600000+5000)) }).status(200).sendFile(path.join(__dirname,'../','../','views','Candle_Web_Routes','Search_And_Filtering_Product.html'));
   var isSessionValid = req.session.personal_information;
   if(isSessionValid != undefined){
      const LOC_SessionID = req.sessionID; // Get session ID of client for authentication
      req.sessionStore.get(LOC_SessionID, async function(err, session) {
         if (err) {
             // Handle the error
             res.send("Not found SID in Redis cache");
         } else {
             // Work with the session
            //  res.send(`Found in Redis with Session ID is ${req.sessionID}\n and content is ${session.personal_information.username}`);
            const LOC_Result_from_SessionStorage = session.personal_shopping_bag;
            var CurrentUser = session.personal_information.username;
            var LOC_Result_from_Database = await SyncUp_Info_Redis_And_DB(CurrentUser);
            console.log(`LOC_Result_from_Database : ${LOC_Result_from_Database}`);
            console.log(`LOC_Result_from_SessionStorage : ${LOC_Result_from_SessionStorage}`); // missing sync up between local storage and database --> make later
            console.log(`Global interface is ${Global_Interface.isFirstTimeLogin}`);

            // Scenario 1: If want user can access the website without login
            LOC_Result_from_Database = JSON.parse(LOC_Result_from_Database);

            // Scenario 2: If want user must login before access the website
            // if(Global_Interface.isFirstTimeLogin != false){
            //    Global_Interface.isFirstTimeLogin = true;
            //    LOC_Result_from_Database = JSON.parse(LOC_Result_from_Database);
            // }
            // if(Global_Interface.isFirstTimeLogin == false){
            //    // first time after request write
            //    Global_Interface.isFirstTimeLogin = true;
            // }

            res.status(200).send(
            [{
               "Currentuser" : `${req.session.personal_information.username}`,
               "personal_shopping_bag" : JSON.stringify(LOC_Result_from_Database[0])
            }]);
         }
     });
   } else {
      // Session is timeout -> Request login again
      req.session.destroy();
      // res.redirect('/login_handling');
      res.status(200).send(
         [{
            "status" : "Session is timeout",
         }]
      )
   }

   
   
})

// Process with router
Router.get('/specific_handling',(req,res)=>{
   isAdminRightChecked = 1;
   var isSessionValid = req.session.personal_information; // Check session is exist or not
   if(isSessionValid != undefined){
      var CurrentUser = req.session.personal_information.username;
      // res.status(200).sendFile(path.join(__dirname,'../','../','views','Candle_Web_Routes','Search_And_Filtering_Product_AdminRight.html'));
      res.status(200).render('Search_And_Filtering_Product_AdminRight',{
         account : `${CurrentUser}`,
         User_for_payment : `${CurrentUser}`
      });
   } else {
      // Session is timeout -> Request login again
      res.redirect('/login_handling');
   }
   
})

const SyncUp_Info_Redis_And_DB = async (username)=>{
   await Redis_API.Connect_To_Redis(client); // Open connection to Redis
   const Result_Read_From_Cache = await Redis_API.Get_Personal_Shopping_Bag(client,username); // Check request is exist in Cache or not
   console.log(`Value of reading data from Cache: ${Result_Read_From_Cache}`); 
   if(Result_Read_From_Cache == null){
      console.log("Miss cached");
      if(isDatabaseCombination){
         console.log("Database combination mode is ON");
         var Personal_Shopping_Bag = await User_Information_From_MySQL.GetShoppingBagFromUser_MYSQL(username); // Read data from database
      } else {
         console.log("Database combination mode is OFF");
         var Personal_Shopping_Bag = await User_Information_Handling.GetShoppingBagFromUser(username); // Read data from database
      } 
      console.log(`Value of reading data from Database: ${Personal_Shopping_Bag}`);
      console.log(`Type of reading data from Database: ${typeof(Personal_Shopping_Bag)}`);

      console.log(`First item is ${Personal_Shopping_Bag[0]}`); // Candle Snuffer,1,85.000,../../../../assets/img/Automation/Image/26.jpg
      // Personal_Shopping_Bag = JSON.parse(Personal_Shopping_Bag);
      console.log(`Type of first item is ${typeof(Personal_Shopping_Bag[0])}`); // string


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

const ReadShoppingBag_From_Database_and_Redis = async (username)=>{
   await Redis_API.Connect_To_Redis(client); // Open connection to Redis
   const Result_Read_From_Cache = await Redis_API.Get_Personal_Shopping_Bag(client,username); // Check request is exist in Cache or not
   console.log(`Value of reading data from Cache: ${Result_Read_From_Cache}`); 
   if(Result_Read_From_Cache == null){
      console.log("Miss cached");
      if(isDatabaseCombination){
         console.log("Database combination mode is ON");
         var Personal_Shopping_Bag = await User_Information_From_MySQL.GetShoppingBagFromUser_MYSQL(username); // Read data from database
         // Need to convert from array of objects to array of strings to same as MongooseDB
         let Converted_array_of_strings = [];
         for(let i=0;i<Personal_Shopping_Bag.length;i++){
            Converted_array_of_strings[i] = Personal_Shopping_Bag[i].candle_name + ',' + Personal_Shopping_Bag[i].quantity + ',' + Personal_Shopping_Bag[i].price_unit + ',' + Personal_Shopping_Bag[i].candle_image;
         }
         Personal_Shopping_Bag = Converted_array_of_strings;
      } else {
         console.log("Database combination mode is OFF");
         var Personal_Shopping_Bag = await User_Information_Handling.GetShoppingBagFromUser(username); // Read data from database
      } 
      console.log(`Value of reading data from Database: ${Personal_Shopping_Bag}`);
      console.log(`Type of reading data from Database: ${typeof(Personal_Shopping_Bag)}`);
      console.log(`First item is ${Personal_Shopping_Bag[0]}`); // Candle Snuffer,1,85.000,../../../../assets/img/Automation/Image/26.jpg
      console.log(`Type of first item is ${typeof(Personal_Shopping_Bag[0])}`); // string
      const Result_Write_To_Cache = await Set_Data_From_Database_To_RedisCache(username,JSON.stringify(Personal_Shopping_Bag)); // set new data from database to Redis cache
      console.log(`Value of writing data to Cache: ${Result_Write_To_Cache}`);
      await Redis_API.Disconnect_To_Redis(client); // Close connection to Redis
      return Personal_Shopping_Bag;
   }
   else {
      console.log("Cached");
      const Result_Read_From_Cache_2 = JSON.parse(Result_Read_From_Cache);
      // res.status(200).send(Result_Read_From_Cache); // Available in cache, Read in Cache
      console.log(`Result from Redis cache : ${Result_Read_From_Cache_2}`);
      console.log(`Type of reading data from Redis cache: ${typeof(Result_Read_From_Cache_2)}`);
      console.log(`First item is ${Result_Read_From_Cache_2[0]}`); // string
      console.log(`Type of first item is ${typeof(Result_Read_From_Cache_2[0])}`); // string

      await Redis_API.Disconnect_To_Redis(client); // Close connection to Redis
      return Result_Read_From_Cache_2;
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