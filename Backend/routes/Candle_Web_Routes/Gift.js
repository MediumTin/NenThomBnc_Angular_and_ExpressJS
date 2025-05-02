// Declare library and dependent module
const express = require('express');
const Router = express.Router();
const path = require('path');
const cookieParser = require('cookie-parser');

// Process with router
Router.get('/',(req,res)=>{
    // res.sendFile(path.join(__dirname,'../','../','views','Candle_Web_Routes','Gift.html'));
    var isSessionValid = req.session.personal_information; // Check session is exist or not
    if(isSessionValid != undefined){
        var CurrentUser = req.session.personal_information.username;
        cookieParser();
        console.log(`Current SID is ${req.sessionID}`);
        console.log(`Current Cookie is ${req.cookies.sessionID}`);
        res.status(200).render('Search_And_Filtering_Product',{
            Request_From_Header : "gifts",
            account : `${CurrentUser}`
        });
        // req.sessionStore.clear((err) =>{
        //     if(err){
        //         return res.send('Error clearing session.');
        //     }
        // })
        // req.session.destroy(function(){
        //     // req.logout();
        //     res.redirect('/');
        // });
    } else {
        // Session is timeout -> Request login again
        req.sessionStore.clear((err) =>{
            if(err){
                return res.send('Error clearing session.');
            }
        })
        // First way
        // req.logout();
        // req.session = null;

        // Second way
        req.session.destroy();
        // req.logout();
        
        // Third way
        // req.session.destroy(function(){
        //     // req.logout();
        //     res.redirect('/');
        // });


        res.redirect('/login_handling');
    }
    
})

// Export router to common usage
module.exports = Router;