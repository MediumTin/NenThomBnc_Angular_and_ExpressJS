// const connection = require('../../config/DB_Connection_MySQL_DB');

// // Lấy tất cả sản phẩm
// const getAllProducts = () => {
//   return new Promise((resolve, reject) => {
//     connection.query('SELECT * FROM products', (err, results) => {
//       if (err) {
//         console.error('❌ Lỗi truy vấn:', err);
//         return reject(err);
//       }
//       console.log('📦 Dữ liệu lấy được:');
//       console.table(results);
//       resolve(results);
//     });
//   });
// };

// // Thêm sản phẩm
// const  insertProduct = (data)=> {
//   return new Promise((resolve, reject) => {
//   const { name, price, description } = data;
//   connection.query(
//     'INSERT INTO products (name, price, description) VALUES (?, ?, ?)',
//     [name, price, description],
//     (err, result) => {
//       if (err) {
//         console.error('❌ Lỗi truy vấn:', err);
//         return reject(err);
//       }
//       console.log('📦 Thêm dữ liệu OK:');
//       resolve(result);
//     }
//   );
// });
// }

// // Cập nhật sản phẩm
// const updateProduct = (id, data) =>  {
//   return new Promise((resolve, reject) => {
//   const { name, price, description } = data;
//     connection.query(
//       'UPDATE products SET name=?, price=?, description=? WHERE id=?',
//       [name, price, description, id],
//       (err, result) => {
//       if (err) {
//         console.error('❌ Lỗi truy vấn:', err);
//         return reject(err);
//       }
//       console.log('📦 Sửa dữ liệu OK:');
//       resolve(result);
//     }
//     );
//   });
// }

// // Xóa sản phẩm
// const deleteProduct = (id) => {
//     return new Promise((resolve, reject) => {
//     connection.query('DELETE FROM products WHERE id=?', [id], (err, result) => {
//       if (err) {
//         console.error('❌ Lỗi truy vấn:', err);
//         return reject(err);
//       }
//       console.log('📦 Xóa dữ liệu OK:');
//       resolve(result);
//     });
//   });
// }

// module.exports = {
//   getAllProducts,
//   insertProduct,
//   updateProduct,
//   deleteProduct
// };

const pool = require('../../config/DB_Connection_MySQL_DB'); // đây là pool, không phải connection đơn lẻ

// Lấy tất cả sản phẩm
const getAllProducts = async () => {
  try {
    const [results] = await pool.query('SELECT * FROM products');
    console.log('📦 Dữ liệu lấy được:');
    console.table(results);
    return results;
  } catch (err) {
    console.error('❌ Lỗi truy vấn getAllProducts:', err);
    throw err;
  }
};

// Thêm sản phẩm
const insertProduct = async (data) => {
  const { name, price, description } = data;
  try {
    const [result] = await pool.query(
      'INSERT INTO products (name, price, description) VALUES (?, ?, ?)',
      [name, price, description]
    );
    console.log('📦 Thêm dữ liệu OK:', result);
    return result;
  } catch (err) {
    console.error('❌ Lỗi truy vấn insertProduct:', err);
    throw err;
  }
};

// Cập nhật sản phẩm
const updateProduct = async (id, data) => {
  const { name, price, description } = data;
  try {
    const [result] = await pool.query(
      'UPDATE products SET name=?, price=?, description=? WHERE id=?',
      [name, price, description, id]
    );
    console.log('📦 Sửa dữ liệu OK:', result);
    return result;
  } catch (err) {
    console.error('❌ Lỗi truy vấn updateProduct:', err);
    throw err;
  }
};

// Xóa sản phẩm
const deleteProduct = async (id) => {
  try {
    const [result] = await pool.query('DELETE FROM products WHERE id=?', [id]);
    console.log('📦 Xóa dữ liệu OK:', result);
    return result;
  } catch (err) {
    console.error('❌ Lỗi truy vấn deleteProduct:', err);
    throw err;
  }
};

const Check_Valid_User_in_MySQL = async(username_request, password_request) => {
    var isValidUser = 0, isValidAdminRight = 0;
    console.log(`Username request is ${username_request}`);
    console.log(`Password request is ${password_request}`);
    try {
      const [results] = await pool.query(`SELECT name FROM customers WHERE username = '${username_request}' AND password = '${password_request}'`);
      console.log('📦 Dữ liệu lấy được:');
      console.table(results);
      // return results;
      if(results.length != 0){
        isValidUser = 1;
        // Check valid admin right
        if(username_request == "Nguyen Trung Tin"){
            isValidAdminRight = 1;
            console.log("Valid admin right");
        }
      };
      console.log('Result of User finding is : ', isValidUser,' and admin right is : ', isValidAdminRight);
      return [isValidUser, isValidAdminRight];
    } catch (err) {
      console.error('❌ Lỗi truy vấn getAllProducts:', err);
      throw err;
    }

}

const Add_New_User_Information_in_MySQL = async(name_register, first_name_register, last_name_register, username_register, address_register, email, password, confirmed_password) => {
    var Result_Checking= 0;
    console.log(`Username request is ${username_register}`);
    console.log(`Password request is ${password}`);
    console.log(`First name request is ${first_name_register}`);
    console.log(`Last name request is ${last_name_register}`);
    console.log(`Name request is ${name_register}`);
    console.log(`Email request is ${email}`);
    console.log(`Address request is ${address_register}`);
    try {
      const [results] = await pool.query(`INSERT INTO customers (username, password, first_name, last_name, name, email, address) VALUES ('${username_register}',  '${password}', '${first_name_register}',  '${last_name_register}',  '${name_register}',  '${email}', '${address_register}');`);
      console.log('📦 Register successfully:');
      console.table(results);
      Result_Checking = 1;
      return Result_Checking;     
    } catch (err) {
      console.error('❌ Lỗi truy vấn:', err);
      throw err;
    }
}


module.exports = {
  getAllProducts,
  insertProduct,
  updateProduct,
  deleteProduct,
  Check_Valid_User_in_MySQL,
  Add_New_User_Information_in_MySQL
};