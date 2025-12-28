
// Cross Origin Resource Sharing
const whitelist = [
    'https://www.yourside.com',
    'http://127.0.0.1:5500',
    'http://localhost:3500',
    'http://localhost:4200',
    // 'http://localhost:4200',
    'https://nenthombnc.com',
    'https://candlelightbnc.nenthombnc.website',
    'https://nenthombnc.com/login_handling/login'
];

const corsOption ={
    origin : (origin,callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) { // 
            callback(null,true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionSuccessStatus : 200,
    credentials: true 
}

module.exports = corsOption;