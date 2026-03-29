// Declare library and dependent module
const express = require('express');
const Router = express.Router();
const path = require('path');
var bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const Menu_Candle_Processing = require('../../controllers/Website_Candle_Light/Menu_Candle_Processing_MongooseDB');
const User_Information_Handling = require('../../controllers/Website_Candle_Light/User_Information_Handling');
const User_Information_From_MySQL = require('../../controllers/API_with_MySQL/MySQL_API_products_table');
const Global_Interface = require('../../controllers/Website_Candle_Light/Global_interface');

// Declare liberies for express-session
const session = require('express-session');
const Redis = require('ioredis');
const RedisStore = require('connect-redis').default;
// const clientRedis = new Redis(); // defaut localhost
const TargetTime_Of_Minute = 1;
var TargetTime_Of_Milisecond = TargetTime_Of_Minute*60*1000;
const isDatabaseCombination = process.env.IS_DATABASE_COMBINATION === 'true';

// var result = "";

const sessions = {};
// Router.get('/',(req,res)=>{
//    // Global_Interface.isFirstTimeLogin = true; // this variable for init class in next log in of next SID
//    // req.session.destroy(); // Same as log out session
//    // // res.status(200).sendFile(path.join(__dirname,'../','../','views','Candle_Detail_Product','Boostrap_Login_Form.html'));
//    // res.status(200).send(
//    //    [{
//    //       "status" : "Already in login of server"
//    //    }]
//    // )
// })

// Handle login action
Router.post('/login',(req,res)=>{
   console.log(`Login information is received with POST method in login handling.`);
   console.log(`Username is ${req.body.username}`);
   console.log(`Password is ${req.body.password}`);
   console.log(`Remember option is ${req.body.remember}`);
   LoginHandling(req, res);
})

// Hangle register action
Router.post('/register',(req,res)=>{
   console.log(`Register information is received with POST method in register handling.`);
   console.log(`Username is ${req.body.username}`);
   console.log(`Email is ${req.body.email}`);
   console.log(`Password is ${req.body.password}`);
   console.log(`Confirm-password is ${req.body.confirm_password}`);
   RegisterHandling(req,res);
   
})


const LoginHandling = async(req,res) => {
   if(isDatabaseCombination){
      console.log("Database combination mode is ON");
      var [isValidUser, isAdminRight, Full_name, Customer_ID] = await User_Information_From_MySQL.Check_Valid_User_in_MySQL(req.body.username, req.body.password);
   } else {
      console.log("Database combination mode is OFF");
      var [isValidUser, isAdminRight, UserName] = await User_Information_Handling.Check_Valid_User_in_Database(req.body.username, req.body.password);
   }  
   
   console.log(`isValidUser is ${isValidUser}`);
   var CurrentUser = req.body.username;
   if(isAdminRight && isValidUser){
      req.session.personal_information ={
         username: Full_name,
         age: 23,
         address : "Admin",
         sex: "Admin",
         member_type: "Admin",
         email: "admin@gmail.com",
         customer_id : Customer_ID
      };
      req.session.payment_information ={
            smart_banking : "Admin",
            momo : "Admin"
      };
      req.session.personal_shopping_bag = [];
      // res.render('Search_And_Filtering_Product_AdminRight',{
      //    account : `${CurrentUser}`
      // });
      // res.redirect('/candles/adminright');
      req.session.save(()=>{
         res.status(200).send(
         [{
            "Currentuser" : `${Full_name}`,
            // "SessionID" : `${req.sessionID}`,
            "isAdminRights" : true
         }]
      )
      })
   } else if (isValidUser) { 
      // Set new session for valid user

      // Way 1: Manual code based on Javascript
      // const sessionId = Date.now().toString();
      // sessions[sessionId] = {
      //    userId: req.body.username,
      // };
      // console.log(`Session ID is : ${sessions}`);
      // res.setHeader('Set-Cookie',`sessionId=${sessionId}; max-age=3600;httpOnly`).redirect('/'); // sent sessionID and redirect to Home Page
      
      // Way 2: Using express-session library
      req.session.personal_information ={
         username: Full_name,
         age: 23,
         address : "Huynh Tan Phat",
         sex: "Women",
         member_type: "VIP",
         email: "tranbichngoc22112001@gmail.com",
         customer_id : Customer_ID
      };
      req.session.payment_information ={
            smart_banking : "Vietinbank",
            momo : "0826780002"
      };
      req.session.personal_shopping_bag = [];
      console.log(`Session ID in Login js is ${req.sessionID} and username is ${req.session.personal_information.username} `); // req.session.cookie.maxAge
      req.session.save(()=>{
         // Session automatically add SessionID in cookie as code below, dont need to add manually
         // res.cookie('sid', sessionId, {
         // httpOnly: true,
         // secure: true, // bắt buộc nếu dùng HTTPS
         // sameSite: 'Strict', // hoặc 'Lax' nếu cần
         // maxAge: 1000 * 60 * 30 // 30 phút
         // });

         res.status(200).send(
         [{
            "Currentuser" : `${Full_name}`,
            // "SessionID" : `${req.sessionID}`, // dont send SessionID in manually for security reason
            "isAdminRights" : false
         }]
      )
      })
      
      console.log(`req.session.personal_information in LoginWebPage is ${req.session.personal_information}`);
      // res.cookie("connect.sid",`${req.sessionID}`,{ expires: new Date(Date.now() + (7*3600000+5000)) }).redirect('/');
      // res.redirect('/');
   } else {
      // res.redirect('/login_handling');
      res.status(200).send(
      [{
            "Currentuser" : undefined,
            // "SessionID" : undefined,
            "isAdminRights" : false
         }]
   )
   }
}


const RegisterHandling = async(req,res) => {
   if(isDatabaseCombination){
      console.log("Database combination mode is ON");
      var isAddUserValid = await User_Information_From_MySQL.Add_New_User_Information_in_MySQL(req.body.name_register, req.body.first_name_register,req.body.last_name_register,req.body.username, req.body.address_register, req.body.email, req.body.password, req.body.confirm_password);
   } else {
      console.log("Database combination mode is OFF");
      var isAddUserValid = await User_Information_Handling.Add_New_User_Information(req.body.username, req.body.email, req.body.password, req.body.confirm_password);
   }  

   console.log(`isAddUserValid is ${isAddUserValid}`);
   if(isAddUserValid){
      // res.status(200).sendFile(path.join(__dirname,'../','../','views','Candle_Web_Routes','HomePage.html'));
      // res.redirect('/');
      req.session.personal_information ={
         username: req.body.username,
         password: req.body.password,
         age: 23,
         address : "Huynh Tan Phat",
         sex: "Women",
         member_type: "VIP",
         email: "tranbichngoc22112001@gmail.com"
      };
      req.session.payment_information ={
            smart_banking : "Vietinbank",
            momo : "0826780002"
      };
      req.session.personal_shopping_bag = [];
      console.log(`Session ID in Login js is ${req.sessionID} and username is ${req.session.personal_information.username} `); // req.session.cookie.maxAge
      req.session.save(()=>{
         res.status(200).send(
         [{
            "Currentuser" : `${req.session.personal_information.username}`,
            "SessionID" : `${req.sessionID}`
         }]
      )
      })
   } else {
      // res.redirect('/login_handling');
      res.status(200).send(
      [{
            "Currentuser" : undefined,
            "SessionID" : undefined
         }])
   }
}

// Export router to common usage
module.exports = Router;