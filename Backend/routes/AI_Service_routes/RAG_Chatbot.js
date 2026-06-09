// Declare library and dependent module
const express = require('express');
const Router = express.Router();
const path = require('path');
const axios = require("axios");
const User_Information_From_MySQL = require('../../controllers/API_with_MySQL/MySQL_API_products_table');
const isProduction = process.env.IS_PRODUCTION === 'true';
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

function nowTime() {
    return new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}
Router.post('/',async (req,res)=>{
    console.log("Request body:", req.body); // Log the request body to see what data is being sent
    const question_from_user = req.body;
    const question = question_from_user.content; // Extract the question from the request body
    const sessionId_for_chatbot = question_from_user.id; // Extract the session ID from the request body
    console.log("Received question:", question); // Log the received question
    console.log("Received session ID:", sessionId_for_chatbot); // Log the received session ID
    var AI_Chatbot_response = "";

    // Get Chat history from MySQL database for the current session ID
    var chat_history = await User_Information_From_MySQL.Get_Chat_History_in_MySQL_DB(sessionId_for_chatbot);
    console.log("Chat history:", chat_history);

    var customer_id = req.session.personal_information && req.session.personal_information.customer_id;
   if (!customer_id) {
        console.log("Customer ID is not available in session. Using 'guest' as customer ID.");    // Add user question into MySQL database for future training and improving AI chatbot
        const Result_add_question = await User_Information_From_MySQL.Add_Chat_History_in_MySQL(sessionId_for_chatbot, "user", question);
        console.log(`Result_add_questionis ${Result_add_question}`);
   } else {
        console.log(`Customer ID from session is ${customer_id}`);    // Add user question into MySQL database for future training and improving AI chatbot
        const Result_add_question_Login = await User_Information_From_MySQL.Add_Chat_History_in_MySQL_Login(customer_id,sessionId_for_chatbot, "user", question);
        console.log(`Result_add_question_Login is ${Result_add_question_Login}`);
   }

    // dummy response for testing
        try {
            const response = await axios.post(
                (isProduction ? process.env.Production_FastAPI_AI_Service_URL : process.env.Local_FastAPI_AI_Service_URL) + "/chat",
                {
                    "question": question,
                    "chat_history": chat_history
                }
            );
            console.log("AI Service Response:", response.data.answer); // Log the response from the AI service
            AI_Chatbot_response = response.data.answer;
            if (!customer_id) {
                // Add assistant response into MySQL database for future training and improving AI chatbot
                const Result_add_response = await User_Information_From_MySQL.Add_Chat_History_in_MySQL(sessionId_for_chatbot, "assistant", AI_Chatbot_response);
                console.log(`Result_add_response is ${Result_add_response}`);
            } else {
                // Add assistant response into MySQL database for future training and improving AI chatbot
                const Result_add_response_Login = await User_Information_From_MySQL.Add_Chat_History_in_MySQL_Login(customer_id,sessionId_for_chatbot, "assistant", AI_Chatbot_response);
                console.log(`Result_add_response_Login is ${Result_add_response_Login}`);
            }
            // res.json(response.data);

        } catch (error) {
            console.error(error);
            // res.status(500).json({
            //     error: "AI Service Error"
            // });
            AI_Chatbot_response = "AI Service Error";
        }

    
    const response = {
        id : sessionId_for_chatbot,
        role : "assistant",
        content : AI_Chatbot_response,
        time : nowTime()
    };

    res.json(response);
})

// Export router to common usage
module.exports = Router;