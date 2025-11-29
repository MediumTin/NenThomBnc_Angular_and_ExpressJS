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
    var isValidUser = 0, isValidAdminRight = 0, Username= "";
    console.log(`Username request is ${username_request}`);
    console.log(`Password request is ${password_request}`);
    try {
      const [results] = await pool.query(`SELECT name FROM customers WHERE username = '${username_request}' AND password = '${password_request}'`);
      console.log('📦 Dữ liệu lấy được:');
      console.table(results);
      Username = results.length != 0 ? results[0].name : "";
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
      return [isValidUser, isValidAdminRight, Username];
    } catch (err) {
      console.error('❌ Lỗi truy vấn getAllProducts:', err);
      throw err;
    }

}

const Get_Customer_ID_in_MySQL_DB = async(username_request) => {
    console.log(`Username request is ${username_request}`);
    try {
      const [username_id] = await pool.query(`SELECT customer_id FROM customers WHERE name = '${username_request}';`);
      console.log('📦 Dữ liệu lấy được:');
      console.table(username_id);
      return username_id;
    } catch (err) {
      console.error('❌ Lỗi truy vấn Get_Customer_ID_in_MySQL_DB:', err);
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
const Update_Content_of_ShoppingBag_MYSQL = async(username_request,ContentofChanged) => {
    var isValidUser = 0, isValidAdminRight = 0;
    var Result_Checking= 0;
    console.log(`Username request is ${username_request}`);
    console.log(`Content request is ${ContentofChanged}`);
    var RequestText = "";
    try{
        // const [username_id] = await Get_Customer_ID_in_MySQL_DB(username_request);
        const [username_id_raw] = await pool.query(`SELECT customer_id FROM customers WHERE name = '${username_request}';`);
        const username_id = username_id_raw[0].customer_id;
        console.log('📦 Dữ liệu lấy được username_id:',username_id);
        // for(let i = 0; i < ContentofChanged.length; i++){
        //     let candle_name = ContentofChanged[i].candle_name;
        //     let quantity = ContentofChanged[i].quantity;
        //     let price_unit = ContentofChanged[i].price_unit;
        //     let candle_image = ContentofChanged[i].candle_image;
        //     if(i == ContentofChanged.length - 1){
        //         RequestText += `('${username_id}', '${candle_name}', ${quantity}, ${price_unit}, '${candle_image}')`;
        //     } else{
        //         RequestText += `('${username_id}', '${candle_name}', ${quantity}, ${price_unit}, '${candle_image}'), `;
        //     }
        // };
        const RequestText_array = ContentofChanged.split(',');
        RequestText += `('${username_id}', '${RequestText_array[0]}', ${RequestText_array[1]}, ${RequestText_array[2]}, '${RequestText_array[3]}')`;
        console.log(`Request Text is ${RequestText}`);
        const [results] = await pool.query(
          ` INSERT INTO personal_shopping_bag (customer_id, candle_name, quantity, price_unit, candle_image) 
            VALUES ${RequestText};`
        );
        console.log('📦 Register successfully:');
        console.table(results); 
        Result_Checking = 1;
        return Result_Checking;  
    } catch(err){
        console.error('❌ Lỗi truy vấn:', err);
        throw err;
    }
}

const GetShoppingBagFromUser_MYSQL = async(username_request) => {
    var isValidUser = 0, isValidAdminRight = 0, PersonalShoppingBag = "";
    var result = [];
    try{
        result = await pool.query(`SELECT psb.candle_name, psb.quantity, psb.price_unit, psb.candle_image FROM personal_shopping_bag AS psb JOIN customers AS c ON psb.customer_id = c.customer_id WHERE c.name = '${username_request}';`);
        console.log('📦 Dữ liệu lấy được:');
        console.table(result);

    } catch(err){
        console.error('❌ Lỗi truy vấn GetShoppingBagFromUser_MYSQL:', err);
        throw err;
    }
    console.log(`Result length is ${result.length}`);
    console.log('type of result is : ', typeof(result)); // object
    console.log('Result content full is : ', result[0]);
    console.log('Result content 1 is : ', result[1]);
    console.log('Result content first item is : ', result[0][0]);
    if(result.length != 0){
        isValidUser = 1;
        // PersonalShoppingBag = result[0].personal_shopping_bag;
        // console.log('User is : ', result);
        // console.log('User email is : ', result[0].email);
        // console.log('User shopping bag is : ', result[0].personal_shopping_bag);
        // console.log('Type of User shopping bag is : ', typeof(result[0].personal_shopping_bag)); // object
        // console.log('Length of User shopping bag is : ', (result[0].personal_shopping_bag).length); // 18
        // console.log('First item of User shopping bag is : ', result[0].personal_shopping_bag[0]); // Candle Snuffer,1,85.000,../../../../assets/img/Automation/Image/26.jpg
        // console.log('Type of first item of User shopping bag is : ', typeof(result[0].personal_shopping_bag[0])); // string
        return result[0];
      //         Result content full is :  [
      //   {
      //     candle_name: 'Candle matchbox',
      //     quantity: 1,
      //     price_unit: '10.00',
      //     candle_image: '../../../../assets/img/Automation/Image/28.jpg'
      //   },
      //   {
      //     candle_name: 'Candle Snuffer',
      //     quantity: 9,
      //     price_unit: '85.00',
      //     candle_image: '../../../../assets/img/Automation/Image/26.jpg'
      //   },
      //   {
      //     candle_name: 'Lumos Honeydrew And Coconut',
      //     quantity: 1,
      //     price_unit: '480.00',
      //     candle_image: '../../../../assets/img/Automation/Image/13.jpg'
      //   },
      //   {
      //     candle_name: 'Candle Snuffer',
      //     quantity: 9,
      //     price_unit: '85.00',
      //     candle_image: '../../../../assets/img/Automation/Image/26.jpg'
      //   },
      //   {
      //     candle_name: '3 Day WKND',
      //     quantity: 5,
      //     price_unit: '300.00',
      //     candle_image: '../../../../assets/img/Automation/Image/1.jpg'
      //   }
      // ]
    };
    console.log('Result of User finding is : ', isValidUser);
    return [PersonalShoppingBag];
}

module.exports = {
  getAllProducts,
  insertProduct,
  updateProduct,
  deleteProduct,
  Check_Valid_User_in_MySQL,
  Add_New_User_Information_in_MySQL,
  Update_Content_of_ShoppingBag_MYSQL,
  GetShoppingBagFromUser_MYSQL
};