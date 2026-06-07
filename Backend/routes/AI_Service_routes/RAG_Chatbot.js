// Declare library and dependent module
const express = require('express');
const Router = express.Router();
const path = require('path');
const axios = require("axios");

// Process with router
// Router.get('/',(req,res)=>{
//     var isSessionValid = req.session.personal_information; // Check session is exist or not
//     if(isSessionValid != undefined){
//         var CurrentUser = req.session.personal_information.username;
//         res.render('Contact',{
//             account : `${CurrentUser}`
//         });
//     } else {
//         // Session is timeout -> Request login again
//         res.redirect('/login_handling');
//     }
// })
Router.post('/',async (req,res)=>{
    console.log("Request body:", req.body); // Log the request body to see what data is being sent
    const productId = req.body;
    const question = productId.content; // Extract the question from the request body
    var AI_Chatbot_response = "";
    // dummy response for testing
        try {
            const response = await axios.post(
                "http://localhost:8000/chat",
                {
                    "question": question
                }
            );
            console.log("AI Service Response:", response.data.answer); // Log the response from the AI service
            AI_Chatbot_response = response.data.answer;
            // res.json(response.data);

        } catch (error) {
            console.error(error);
            // res.status(500).json({
            //     error: "AI Service Error"
            // });
            AI_Chatbot_response = "AI Service Error";
        }


    const response = {
        id : "1111",
        role : "assistant",
        content : AI_Chatbot_response,
        time : new Date().toISOString()
    };
    res.json(response);
})

// Export router to common usage
module.exports = Router;