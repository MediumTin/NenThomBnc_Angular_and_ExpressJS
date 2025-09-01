// Declare library and dependent module
const express = require('express');
const Router = express.Router();
const path = require('path');
const Redis_API = require('../../controllers/API_with_Redis/API_Redis');
const expressHb = require('express-handlebars');
const cookieParser = require('cookie-parser');
const { createClient } = require('redis');

Router.get('/',(req,res)=>{
    
   // Scenario 2: If want user must login before access the website
   //  var isSessionValid = req.session.personal_information; // Check session is exist or not
   //  if(isSessionValid != undefined){
   //       // If authentication is successful -> Return to endpoint "Session is normal"
   //      console.log(`Session ID in HomePageRoute is ${req.sessionID}`);
   //      res.status(200).send(
   //       [{
   //          "status" : "Session is normal",
   //       }]
   //    );
   //  }
   //  else {
   //     // If session is not exist -> Return to endpoint "Session is timeout"
   //    res.status(200).send(
   //       [{
   //          "status" : "Session is timeout",
   //       }]
   //    )
   // }
    
})

// Export router to common usage
module.exports = Router;