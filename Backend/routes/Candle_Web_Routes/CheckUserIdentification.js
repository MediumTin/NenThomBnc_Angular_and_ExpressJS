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
const Global_Interface = require('../../controllers/Website_Candle_Light/Global_interface');

// Declare liberies for express-session
const session = require('express-session');
const Redis = require('ioredis');
const RedisStore = require('connect-redis').default;
// const clientRedis = new Redis(); // defaut localhost
const TargetTime_Of_Minute = 1;
var TargetTime_Of_Milisecond = TargetTime_Of_Minute*60*1000;




// Handle login action
Router.get('^/$|  ',(req,res)=>{
   console.log(`Login information is received with POST method in CheckUserIdentification.`);
   var isSessionValid = req.session.personal_information;
   console.log(`req.session.personal_information in CheckUserIdentify is ${req.session.personal_information}`);
      if(isSessionValid != undefined){
         var CurrentUser = req.session.personal_information.username;
         res.status(200).send(
            [{
               "Currentuser" : `${CurrentUser}`
            }]
         )
      } else {
         // Session is timeout -> Request login again
         res.status(200).send(
            [{
               "Currentuser" : "No User"
            }]
         )
         // res.redirect('/login_handling');
      }
})

// Export router to common usage
module.exports = Router;