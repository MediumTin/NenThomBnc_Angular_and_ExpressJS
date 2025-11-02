// require('dotenv').config();
// const mysql = require('mysql2');

// const connection = mysql.createConnection({
//   host: process.env.MYSQL_DB_HOST,
//   user: process.env.MYSQL_DB_USER,
//   password: process.env.MYSQL_DB_PASSWORD,
//   database: process.env.MYSQL_DB_NAME
// });

// connection.connect(err => {
//   if (err) {
//     console.error('❌ Lỗi kết nối MySQL:', err.message);
//     process.exit(1);
//   }
//   console.log('✅ Đã kết nối tới MySQL thành công!');
// });
// module.exports = connection;


// db/connection.js
require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MYSQL_DB_HOST,
  user: process.env.MYSQL_DB_USER,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,   // tối đa 10 connection cùng lúc
  queueLimit: 0
});

module.exports = pool;