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
const productModel = require('./controllers/API_with_MySQL/MySQL_API_products_table');
const Specific_file_for_admin = require('./controllers/Admin_file/Specific_file_for_admin');
const PayPal_Interface = require('./controllers/API_with_PayPal/PayPal_API');



// const clientRedis = new Redis({
//     username: 'default',
//     password: 'Ug2FCahkYUOsMzn8AkuvSIRoarnuJzwb',
//     socket: {
//         host: 'redis-13281.c292.ap-southeast-1-1.ec2.redns.redis-cloud.com',
//         port: 13281
//     }
// }); 


const clientRedis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  family: 4,           // 4 (IPv4) or 6 (IPv6)
  db: 0 // Not use socket and TTL config, socket only used for redis library while current is ioredis
});


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
const isProduction = process.env.IS_PRODUCTION === 'true'; // convert string to boolean (because .env only support string)
const isCombineAngular = process.env.IS_COMBINE_ANGULAR === 'true'; // convert string to boolean (because .env only support string)
const isNgrokCombined = process.env.IS_SIMULATE_WITH_NGROK === 'true'; 
// Example using session middleware
app.use(session({
    genid: function(req) {
        return uuidv4(); // use UUIDs for session IDs
      },
    // name: 'SessionID', // or your custom name
    secret : 'mediumtin',
    store : new RedisStore({client: clientRedis}), // Store SID or session of user into Redis cache
    resave : false,
    saveUninitialized: false, // Properties for re-create Cookies and send to Client
    cookie : {  
        // secure: true,
        // sameSite: 'None', // allow cross-origin
        secure: false, // in production, use true to force https, in local use false --> Should not be TRUE due to CPanel will be considered as insecure connection (not https)
        sameSite: (isCombineAngular) ?'Strict': (isProduction ? 'None' : 'lax'), // in production, use strict to avoid CSRF, in local use None (Lax in limited case): Strict for frontend and backend are same origin, None (Lax for Limited case) for different origin
        httpOnly: true, // allow client can know document.cookie or not
        // // expires: (new Date(Date.now() + TargetTime_Of_Milisecond + 7*60*60*1000)),
        maxAge : TargetTime_Of_Milisecond // 10 minute
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
app.options('*', cors(corsOptions)); // 🔥 BẮT BUỘC
// 1.3. Build-in middleware to convert incomming request to parsed data
app.use(express.urlencoded({extended:false}));
// 1.4. Build-in middleware to convert parsed data to JSON data
app.use(express.json());
// 1.5. Build-in middleware to convert incommong cookies to req.cookie object in express JS
app.use(cookieParser());
// 1.6. Built-in middleware to serve static files to all routes (if needed, can give permission only some specific routes)
app.use(express.static(
    isCombineAngular ? (
        isProduction ?
            path.join(__dirname,'/public/Generative_Static_Angular_files/Production') : // if in production, serve Angular combined files
            path.join(__dirname,'/public/Generative_Static_Angular_files/Development') // if in local and want to serve Angular combined files   
        ) :  
        path.join(__dirname,'/public') // if in local and want to serve other static files
    )); // Serve other static files (images, css, js, etc) without combined Angular
// isProduction

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
// API 10:  News product route
app.use('/api/news',require('./routes/Candle_Web_Routes/News'));
// API 11:  Contact product route
app.use('/api/contact',require('./routes/Candle_Web_Routes/Contact'));
// // API 12:  Another_information route
// app.use('/api/another_information',require('./routes/Candle_Web_Routes/Another_information'));
// API 13:  Detail product information
app.use('/api/candle_information',require('./routes/Candle_Web_Routes/Candle_Information'));
// API 14:  Login handling
app.use('/api/login_handling',require('./routes/Candle_Web_Routes/Login_Web_Page'));
// API 15: Check user identification
app.use('/api/check_user_identification',require('./routes/Candle_Web_Routes/CheckUserIdentification'));
// API 16: Admin - Add new product
// app.use('/api/Add_new_product',require('./routes/Candle_Web_Routes/Add_new_product_Information'));
// API 17: Payment handling
app.use('/api/payment_handling',require('./routes/Candle_Web_Routes/Payment_Handling'));
// API 18: Shopping bag handling
app.use('/api/Shopping_Bag_handling',require('./routes/Candle_Web_Routes/Shopping_Bag_Handling'));

// API 20: Test MySQL connection
app.use('/api/mysql',require('./routes/MySQL_TestConnection'));

// API 21: Get Data from MongoDB and merge with MySQL Warehouse
app.get('/api/admin/update_warehouse_mysql', async (req,res)=>{
    const status_update = await Specific_file_for_admin.GetAllProduct_MongoDB_and_Update_Warehouse_MySQL(req,res); // Update new shopping bag to database
    res.json({ message: `Update status is ${status_update}`});
})

// API 22: Payment PayPal gateway
app.use('/api/payment/paypal',require('./routes/Payment_Gateway/Payment_Paypal'));

// API 23: Payment VNPay gateway 
app.use('/api/payment/vnpay', require('./routes/Payment_Gateway/Payment_VNPay'));

// // API 25: Payment Momo gateway - Off Momo for now due to need to sign a contract with Momo
// app.use('/api/payment/momo', require('./routes/Payment_Gateway/Payment_Momo')); 

// API 24: Admin management gateway 
app.use('/api/admin_management', require('./routes/Candle_Web_Routes/Admin_management'));

// // API 26: Test API with Momo - Off Momo for now due to need to sign a contract with Momo
// app.get('/api/payment/momo_test', require('./controllers/API_with_Momo_Ex/Momo_Export'));

//--------------------------------Route to serve Angular app----------------------------------------------//
// Route tất cả các yêu cầu khác về index.html của Angular -> để Angular xử lý định tuyến phía client (không phải server API)
// API 19: Serve Angular app
if(isCombineAngular)
{
    if(isProduction){
        // Handle every other route with index.html, which will contain
        app.get('*', (req, res) => {
            console.log(`Request URL: ${path.join(__dirname, 'public/Generative_Static_Angular_files/Production/index.html')}`);
            res.sendFile(path.join(__dirname, 'public/Generative_Static_Angular_files/Production/index.html'));
        });
    }
    else {
        // Handle every other route with index.html, which will contain
        app.get('*', (req, res) => {
            console.log(`Request URL: ${path.join(__dirname, 'public/Generative_Static_Angular_files/Development/index.html')}`);
            res.sendFile(path.join(__dirname, 'public/Generative_Static_Angular_files/Development/index.html'));
        });
    }
}
//---------------------------------------For example : Specific Route and Middleware declaration--------------------------//

// Specific Custom Middleware to check authorization and get Json Web Token to make private action. Before this line, it will not require JWToken to execute
// app.use(verifyJWT);
// After this line, it will require JWToken branded to execute - After login and grant, will allow get data
// app.use('/api/employees',require('./routes/api/employees')); //example create one API


//---------------------------------------Error recognition and connection declaration-----------------------//
// 1.7. Custom Middleware for logging error request/response between server and client
app.use(errorHandler);

// Method is used to start a web server and listen for connections on a specified host and port
mongoose.connection.once('open',()=>{
    console.log('Connected to MongooseDB');
    // const server = http.createServer(app);
    const server = app.listen(PORT, ()=> console.log(`Server is running on Port: ${PORT}`));  
    require('./controllers/WebSocket/WebSocket_connection').init(server);
})

// const mysql = require('mysql2');
// const connection = mysql.createConnection({
//     host: process.env.MYSQL_DB_HOST,
//     user: process.env.MYSQL_DB_USER,
//     password: process.env.MYSQL_DB_PASSWORD,
//     database: process.env.MYSQL_DB_NAME
// });

// // Kết nối đến MySQL
// connection.connect(err => {
//   if (err) {
//     console.error('❌ Kết nối thất bại:', err);
//     return;
//   }
//   console.log('✅ Đã kết nối MySQL!');

//   // Câu lệnh SQL cơ bản
//   const query = 'SELECT * FROM products';

//   // Thực thi truy vấn
//   connection.query(query, (err, results, fields) => {
//     if (err) {
//       console.error('❌ Lỗi truy vấn:', err);
//       return;
//     }

//     console.log('📦 Dữ liệu lấy được:');
//     console.table(results);

//     // Đóng kết nối
//     connection.end();
//   });
// });







