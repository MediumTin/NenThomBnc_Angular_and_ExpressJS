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

module.exports = {
  getAllProducts,
  insertProduct,
  updateProduct,
  deleteProduct
};