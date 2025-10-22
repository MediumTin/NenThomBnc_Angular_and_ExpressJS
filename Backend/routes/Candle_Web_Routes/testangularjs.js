// Declare library and dependent module
const express = require('express');
const Router = express.Router();
const path = require('path');
const Redis_API = require('../../controllers/API_with_Redis/API_Redis');
const { createClient } = require('redis');
const client = createClient({
   username: process.env.REDIS_USERNAME,
   password: process.env.REDIS_PASSWORD,
   socket: {
       host: process.env.REDIS_HOST,
       port: process.env.REDIS_PORT
   }
});  // Create a Redis client

// Process with router
Router.get('/',(req,res)=>{
   // res.clearCookie("oils"); // Xoa redundant cookie in JS script
   var isSessionValid = req.session.personal_information;
   if(isSessionValid != undefined){
      var CurrentUser = req.session.personal_information.username;
      res.status(200).sendFile(path.join(__dirname,'../','../','views','Candle_Web_Routes','TestHTML.html'));
   } else {
      // Session is timeout -> Request login again
      res.redirect('/login_handling');
   }
      // res.cookie("type","oils",{ expires: new Date(Date.now() + (7*3600000+5000))}).status(200).sendFile(path.join(__dirname,'../','../','views','Candle_Web_Routes','Search_And_Filtering_Product.html'));
      // expire time in 10 second
   })

 const First_Time_Loading = async (req,res) => {
    var result = await Menu_Candle_Processing.GetAllProductInformation();
    console.log("Result of First time loading : ",result);
    return result;
 }

// Export router to common usage
module.exports = Router;