require('dotenv').config();
const redis = require('redis');
const USER_NAME = 'username';
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions.js');
const {logger} = require('./middleware/logEvents'); 
const errorHandler = require('./middleware/errorHandler'); 
const verifyJWT = require('./middleware/verifyJWT.js');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn.js');
const expressHb = require('express-handlebars');
const session = require('express-session');
const nodemailer = require('nodemailer'); // declare for mail service
var cryp = require('crypto');
const Redis = require('ioredis');
const { v4: uuidv4 } = require("uuid");
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');


const clientRedis = new Redis({
    port: 17737,          // Redis port
    host: 'redis-17737.c16.us-east-1-3.ec2.redns.redis-cloud.com',   // Redis host
    family: 4,           // 4 (IPv4) or 6 (IPv6)
    password: 'eKmCEByJceBAy8EXlviDdGnvAbgwLWmI',
    db: 0
}); // defaut localhost

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

const SENDMAIL = async (mailDetails) => {
    try {
      const info = await transporter.sendMail(mailDetails)
      callback(info);
    } catch (error) {
      console.log(error);
    } 
  };

// import { engine } from 'express-handlebars';
const PORT = process.env.PORT || 3500;
const RedisPort = PORT;
const TargetTime_Of_Minute = 10; // allow in 10 minute
var TargetTime_Of_Milisecond = TargetTime_Of_Minute*60*1000;

// Example using session middleware
app.use(session({
    genid: function(req) {
        return uuidv4(); // use UUIDs for session IDs
      },
    // name: 'SessionID', // or your custom name
    secret : 'mediumtin',
    store : new RedisStore({client: clientRedis}), // Store SID or session of user into Redis cache
    resave : false,
    saveUninitialized: true, // Properties for re-create Cookies and send to Client
    cookie : {  
        // secure: true,
        // sameSite: 'None', // allow cross-origin
        secure: false, // allow cross-origin
        sameSite: 'lax', // allow cross-origin
        httpOnly: true, // allow client can know document.cookie or not
        // // expires: (new Date(Date.now() + TargetTime_Of_Milisecond + 7*60*60*1000)),
        maxAge : TargetTime_Of_Milisecond // 1 minute
    }
}))

// to connect express to handlbar
app.engine('handlebars', expressHb.engine());
app.set('view engine', 'handlebars');
// app.set('views', './views/Example_Express_Handlebar');
app.set('views', './views/Candle_Web_Routes');

const client = redis.createClient();
// client.connect();

// Connect to MongoDB
connectDB();

//---------------------------------------Common Middleware declaration---------------------------------------//
// 1.1. Custom middleware logger
app.use(logger);
// 1.2. Build-in middleware to share origin resource to other Routes
app.use(cors(corsOptions));
// 1.3. Build-in middleware to convert incomming request to parsed data
app.use(express.urlencoded({extended:false}));
// 1.4. Build-in middleware to convert parsed data to JSON data
app.use(express.json());
// 1.5. Build-in middleware to convert incommong cookies to req.cookie object in express JS
app.use(cookieParser());
// 1.6. Built-in middleware to serve static files to all routes (if needed, can give permission only some specific routes)
// app.use(express.static(path.join(__dirname,'/public/dist'))); // Serve Angular static files
app.use(express.static(path.join(__dirname,'/public'))); // Serve other static files (images, css, js, etc) without combined Angular


//---------------------------------------Common Route declaration-------------------------------------------//
console.log("Program is running ----------");


// HTML email template
const htmlEmail = `
    <html>
    <body>
        <h1>Welcome to Our Service!</h1>
        <p>Thank you for signing up. We're thrilled to have you on board.</p>
        <table><tr><th><img style="height:5px ;width: 5px;" src="3_Day_WKND.jpg" alt="Our Logo" /></th><th><img style="height:5px ;width: 5
        px;"  src="3_Day_WKND.jpg" alt="Our Logo" /></th></tr></table>
    </body>
    </html>
`;

// Unknown
app.get('/api/set-email',(req,res)=>{
    mailTransport.sendMail({
        from: '"NenThomBnC" <nenthombnc@gmail.com>',
        to: 'Tin.NguyenTrung3@vn.bosch.com',
        subject: 'Order confirmation',
        //text: 'Thank you for choosing our product. Your product will come to you soon! ',
        html: htmlEmail,
        attachments: [{
            filename: '3_Day_WKND.jpg',
            path: '3_Day_WKND.jpg',
            cid: '3_Day_WKND.jpg' //same cid value as in the html img src
        }],
        generateTextFromHtml: true,
        }, function(err){
        if(err) console.error( 'Unable to send email: ' + err );
        });
    res.send("Sent to email!");
})


// Example using JWT without libraries
// For example : Set new JWT mechanism
app.get('/set-JWT-Example',(req,res)=>{
    const header = {
        alg : "HS256",
        typ : "JWT"
    }
    
    const payload = {
        sub : "Trung Tin",
        exp : Date.now() + 3600000
    }
    
    //node crypsto generation jwt secret
    //  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    const JWTsecret = "c682737f1b9d1435c923a963e402f41059ecacdcd393aae69244ef3bb9bf514d";
    
    const EncodedHeader = btoa(JSON.stringify(header));
    const EncodedPayload = btoa(JSON.stringify(payload));
    const tokenData = `${EncodedHeader}.${EncodedPayload}`;
    const hmac = cryp.createHmac("sha256",JWTsecret); // sử dụng thuật toán băm secret key , base64 có thể mã hóa/giải mã nhưng băm sẽ ko thể giải mã được
    const signature = hmac.update(tokenData).digest('base64url'); // Generate signature based on Header and Payload
    res.json({
        token : `${tokenData}.${signature}`,
    })
})

// For example : Get and verify JWT
app.get('/api/get-JWT', (req,res)=>{
    const token = req.headers.authorization.slice(7);
    if(!token){
        return res.status(401).json({
            message : "Unauthorized!"
        })
    }
    const [encodedHeader, encodedPayload, EncodedSignature] = token.split("."); // seperate from header requested by client
    const tokenData = `${encodedHeader}.${encodedPayload}`;
    const hmac = cryp.createHmac("sha256",JWTsecret); // hash string (combined Header and Payload from client) for comparison with signature key
    const signature = hmac.update(tokenData).digest("base64url");
    if(signature === EncodedSignature){
        // do something when signature is correctly
    }
    res.json(null)
})


// For example : about express session
app.get('/api/get-session', (req,res)=>{
    res.send(req.session); // req.session.user.username
    console.log(`Cookie is ${req.cookie}`); // req.session.cookie.maxAge
    // Session will have 2 part : 1 is Cookie info and 2,3,4,... is data
})

// For example : get session ID from request header
app.get('/api/get-sid', (req,res)=>{
    console.log(`Cookie is ${req.headers.cookie}`); // req.session.cookie.maxAge
    console.log(`Session ID in server js is ${req.sessionID}`); // req.session.cookie.maxAge
    res.send(`Found in Redis with Session ID is ${req.sessionID}`);
    // req.sessionStore.get(req.sessionID, function(err, session) {
    //     if (err) {
    //         // Handle the error
    //         res.send("Not found SID in Redis cache");
    //         console.log("Not found SID in Redis cache");
    //     } else {
    //         // Work with the session
    //         res.send(`Found in Redis with Session ID is ${req.sessionID}\n and content is ${session.personal_information.username}`);
    //         console.log(`Found in Redis with Session ID is ${req.sessionID}\n and content is ${session.personal_information.username}`);
    //     }
    // });
    // Session will have 2 part : 1 is Cookie info and 2,3,4,... is data
})

// For example : clear session storage
app.get('/api/clear-sid', (req,res)=>{
    req.sessionStore.clear((err) =>{
        if(err){
            return res.send('Error clearing session.');
        }
    })
    res.send("OK")
})

// For example : destroy session storage
app.get('/api/destroy-sid', (req,res)=>{
    req.sessionStore.destroy(req.sessionID,(err) =>{
        if(err){
            return res.send('Error clearing session.');
        }
    })
    res.send("OK")
})

// For example : destroy session storage
app.get('/api/destroy-session', (req,res)=>{
    req.session.destroy();
    // res.send(req.session); // req.session.user.username
    console.log(`Destroyed is ${req.session}`); // req.session.cookie.maxAge
    // Session will have 2 part : 1 is Cookie info and 2,3,4,... is data
})

//-----------------------------------------------API Route declaration for Candle sale website----------------------------------------------//
// API 1:  Home Page route
app.use('/api',require('./routes/Candle_Web_Routes/HomePageRoute'));
// API 2:  Candle product route
app.use('/api/candles',require('./routes/Candle_Web_Routes/Candles'));
// // API 3:  Oils product route
// app.use('/api/oils',require('./routes/Candle_Web_Routes/Oils'));
// // API 4:  Diffuse_oils product route
// app.use('/api/diffuse_oils',require('./routes/Candle_Web_Routes/Diffuse_oils'));
// // API 5:  Natural_oils product route
// app.use('/api/natural_oils',require('./routes/Candle_Web_Routes/Natural_oils'));
// // API 6:  Accessory product route
// app.use('/api/accessory',require('./routes/Candle_Web_Routes/Accessory'));
// // API 7:  Burn_candles product route
// app.use('/api/burn_candles',require('./routes/Candle_Web_Routes/Burn_candles'));
// // API 8:  Care_candles product route
// app.use('/api/care_candles',require('./routes/Candle_Web_Routes/Care_candles'));
// // API 9:  Gift product route
// app.use('/api/gift',require('./routes/Candle_Web_Routes/Gift'));
// // API 10:  News product route
// app.use('/api/news',require('./routes/Candle_Web_Routes/News'));
// // API 11:  Contact product route
// app.use('/api/contact',require('./routes/Candle_Web_Routes/Contact'));
// API 12:  Another_information route
app.use('/api/another_information',require('./routes/Candle_Web_Routes/Another_information'));
// API 13:  Detail product information
app.use('/api/candle_information',require('./routes/Candle_Web_Routes/Candle_Information'));
// API 14:  Login handling
app.use('/api/login_handling',require('./routes/Candle_Web_Routes/Login_Web_Page'));
// API 15: Check user identification
app.use('/api/check_user_identification',require('./routes/Candle_Web_Routes/CheckUserIdentification'));
// API 16: Admin - Add new product
app.use('/api/Add_new_product',require('./routes/Candle_Web_Routes/Add_new_product_Information'));
// API 17: Payment handling
app.use('/api/payment_handling',require('./routes/Candle_Web_Routes/Payment_Handling'));
// API 18: Shopping bag handling
app.use('/api/Shopping_Bag_handling',require('./routes/Candle_Web_Routes/Shopping_Bag_Handling'));

//--------------------------------Route to serve Angular app----------------------------------------------//
// Route tất cả các yêu cầu khác về index.html của Angular -> để Angular xử lý định tuyến phía client (không phải server API)
// app.get('*', (req, res) => {
//     console.log(`Request URL: ${path.join(__dirname, 'public/dist/index.html')}`);
//   res.sendFile(path.join(__dirname, 'public/dist/index.html'));
// });

//---------------------------------------For example : Specific Route and Middleware declaration--------------------------//
// Specific Custom Middleware to check authorization and get Json Web Token to make private action. Before this line, it will not require JWToken to execute
// app.use(verifyJWT);
// After this line, it will require JWToken branded to execute - After login and grant, will allow get data
app.use('/api/employees',require('./routes/api/employees')); //example create one API


//---------------------------------------Error recognition and connection declaration-----------------------//
// 1.7. Custom Middleware for logging error request/response between server and client
app.use(errorHandler);

// Method is used to start a web server and listen for connections on a specified host and port
mongoose.connection.once('open',()=>{
    console.log('Connected to MongooseDB');
    app.listen(PORT, ()=> console.log(`Server is running on Port: ${PORT}`));  
})





