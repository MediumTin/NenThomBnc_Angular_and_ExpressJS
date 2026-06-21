
const { Console } = require('console');
const pool = require('../../config/DB_Connection_MySQL_DB'); // đây là pool, không phải connection đơn lẻ
const crypto = require('crypto');

// API_DB_1: Get quantity of specific product available in warehouse
const Get_quantity_available_in_Warehouse = async(Product_name) => {
    console.log(`Product_name request is ${Product_name}`);
    try {
      const [product_quantity] = await pool.query(`
        SELECT 
          inven.quantity_storage 
        FROM inventory inven
        JOIN products prod
          ON inven.product_id = prod.product_id
        WHERE product_name = '${Product_name}';
      `);
      console.log('📦 Dữ liệu lấy được:');
      console.table(product_quantity);
      return product_quantity[0].quantity_storage;
    } catch (err) {
      console.error('❌ Lỗi truy vấn Get_quantity_available_in_Warehouse:', err);
      throw err;
    }
}

// API_DB_2: Check valid user in MySQL database for login handling
const Check_Valid_User_in_MySQL = async(username_request, password_request) => {
    var isValidUser = 0, isValidAdminRight = 0, Full_name= "", Customer_ID = "";
    console.log(`Username request is ${username_request}`);
    console.log(`Password request is ${password_request}`);
    try {
      const [results] = await pool.query(`
        SELECT 
          first_name, 
          last_name, 
          customer_id 
        FROM customers 
        WHERE username = '${username_request}' AND password = '${password_request}'
      `);
      console.log('📦 Dữ liệu lấy được:');
      console.table(results);
      Customer_ID = results.length != 0 ? `${results[0].customer_id}` : ""; 
      Full_name = results.length != 0 ? `${results[0].first_name} ${results[0].last_name}` : "";
      // return results;
      if(results.length != 0){
        isValidUser = 1;
        // Check valid admin right
        if(username_request == "nguyentrungtin2001@gmail.com"){
            isValidAdminRight = 1;
            console.log("Valid admin right");
        }
      };
      console.log('Result of User finding is : ', isValidUser,' and admin right is : ', isValidAdminRight);
      return [isValidUser, isValidAdminRight, Full_name, Customer_ID];
    } catch (err) {
      console.error('❌ Lỗi truy vấn Check_Valid_User_in_MySQL:', err);
      throw err;
    }

}

// Get Customer ID in MySQL database for shopping bag handling - Unused for now
// const Get_Customer_ID_in_MySQL_DB_HighCorrection = async(Full_name_request) => {
//     console.log(`Full name request is ${Full_name_request}`);
//     try {
//       const [username_id] = await pool.query(`SELECT customer_id FROM customers WHERE name = '${Full_name_request}';`);
//       console.log('📦 Dữ liệu lấy được:');
//       console.table(username_id);
//       return username_id[0].customer_id;
//     } catch (err) {
//       console.error('❌ Lỗi truy vấn Get_Customer_ID_in_MySQL_DB_HighCorrection:', err);
//       throw err;
//     }

// }

// API_DB_3: Get customer list in MySQL database for admin right in user management page
const Get_Customer_List_in_MySQL_DB_for_Admin = async() => {
    console.log(`Getting all customer list for admin`);
    try {
      const [ResultList] = await pool.query(`
        SELECT 
          customer_id, 
          first_name, 
          last_name, 
          email, 
          address 
        FROM customers;
      `);
      console.log('📦 Dữ liệu lấy được:');
      console.table(ResultList);
      console.log(`ResultList length is ${ResultList.length}`); 
      console.log('First item of ResultList is : ', ResultList[0]);
      console.log('Type of first item of ResultList is : ', typeof(ResultList[0])); // object

      return ResultList;
    } catch (err) {
      console.error('❌ Lỗi truy vấn Get_Customer_List_in_MySQL_DB_for_Admin:', err);
      throw err;
    }
}

// API_DB_4 : Get shopping bag of user (Join 2 table)
const GetShoppingBagFromUser_MYSQL = async(customer_id) => {
    var isValidUser = 0, isValidAdminRight = 0, PersonalShoppingBag = "";
    var result = [];
    try{
        result = await pool.query(`
          SELECT 
            proc.product_name, 
            sbi.quantity, 
            proc.price_unit, 
            proc.product_image 
          FROM personal_shopping_bag AS psb 
          JOIN customers AS c 
            ON psb.customer_id = c.customer_id 
          JOIN shopping_bag_item AS sbi
            ON psb.shopping_bag_id = sbi.shopping_bag_id 
          JOIN products AS proc
            ON proc.product_id = sbi.product_id 
          WHERE c.customer_id = '${customer_id}';
        `);
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
    };
    console.log('Result of User finding is : ', isValidUser);
    return [PersonalShoppingBag];
}

// API_DB_5: Table 6: inventory - Read
const Get_Inventory_List_for_Admin = async() => {
    try {
      const [Inventory_List] = await pool.query(`
        SELECT 
          inven.inventory_id, 
          proc.product_name, 
          inven.quantity_storage, 
          w.name, 
          w.location 
        FROM inventory inven
        JOIN ware_houses w 
          ON inven.warehouse_id = w.warehouse_id
        JOIN products proc
          ON inven.product_id = proc.product_id;
      `);
      console.log('📦 Dữ liệu lấy được:');
      console.table(Inventory_List);
      return Inventory_List;
    } catch (err) {
      console.error('❌ Lỗi truy vấn Get_Inventory_List_for_Admin:', err);
      throw err;
    }
}

// API_DB_6 : Table 9: warehouses - Read
const Get_Warehouse_List_for_Admin = async() => {
    try {
      const [Warehouse_List] = await pool.query(`SELECT * FROM ware_houses;`);
      console.log('📦 Dữ liệu lấy được:');
      console.table(Warehouse_List);
      return Warehouse_List;
    } catch (err) {
      console.error('❌ Lỗi truy vấn Get_Warehouse_List_for_Admin:', err);
      throw err;
    }
}

// API_DB_7 : Table 5: order_details list - Read
const Get_Order_Detail_List_for_Admin = async() => {
    var Result_Checking= 0;
    try {
      const [results] = await pool.query(`
        SELECT 
          o.order_id, 
          o.order_date, 
          o.total_amount,
          o.status_order, 
          CONCAT(c.first_name, ' ', c.last_name) AS name, 
          o.customer_id 
        FROM orders o 
        JOIN customers c 
          ON o.customer_id = c.customer_id;
      `);
      console.log('📦 Dữ liệu lấy được:');
      console.table(results);
      return results;     
    } catch (err) {
      console.error('❌ Lỗi truy vấn:', err);
      throw err;
    }
}

// API_DB_8 : Table 5: order_details - Read
const Get_Order_Detail_for_Admin = async(order_id) => {
    try {
      // 1. order_id (order_details) → order_detail_id , quantity (order_details) → order_detail_id (order_details_inventory) → inventory_id (order_details_inventory) → inventory_id , product_id (inventory) → product_id , product_name , product_category , price_unit (products)
      // 2. order_id (payments) → payment_id , method , status_payment , payment_gateway_id (payments)
      const [results] = await pool.query(`
         SELECT 
	          od_detail.order_id,
            od_detail.order_detail_id,
	          pymt.payment_id,
            od_detail.quantity,
            pymt.method,
            pymt.status_payment,
            pymt.payment_gateway_id,
            inven.product_id,
            proc.product_name,
            proc.price_unit,
            proc.product_category
        FROM order_details od_detail
        JOIN payments pymt 
            ON od_detail.order_id = pymt.order_id
        JOIN order_details_inventory od_detail_inven
            ON od_detail.order_detail_id = od_detail_inven.order_detail_id
        JOIN inventory inven
            ON od_detail_inven.inventory_id = inven.inventory_id
	      JOIN products proc
            ON inven.product_id = proc.product_id
        WHERE od_detail.order_id = '${order_id}';
      `);
      console.log('📦 Dữ liệu lấy được Get_Order_Detail_for_Admin:');
      console.table(results);
      return results;     
    } catch (err) {
      console.error('❌ Lỗi truy vấn:', err);
      throw err;
    }
}

// Add new user information into MySQL database for register handling
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
      const [results] = await pool.query(`INSERT INTO customers (username, password, first_name, last_name, email, address) VALUES (?, ?, ?, ?, ?, ?)`, [username_register, password, first_name_register, last_name_register, email, address_register]);
      console.log('📦 Register successfully:');
      console.table(results);
      Result_Checking = 1;
      return Result_Checking;     
    } catch (err) {
      console.error('❌ Lỗi truy vấn:', err);
      throw err;
    }
}

// API_DB_18 : Create new item in shopping bag
const Update_Content_of_ShoppingBag_MYSQL = async(customer_id,ContentofChanged) => {
    var isValidUser = 0, isValidAdminRight = 0;
    var Result_Checking= 0;
    console.log(`Customer ID request is ${customer_id}`);
    console.log(`Content request is ${ContentofChanged}`);
    var RequestText = "";
    try{
        const RequestText_array = ContentofChanged.split(',');
        // RequestText += `('${customer_id}')`;
        // console.log(`Request Text is ${RequestText}`);
        const [results] = await pool.query(
          ` 
            INSERT INTO shopping_bag_item (shopping_bag_id, product_id, quantity)
            VALUES (
                ( SELECT shopping_bag_id 
                  FROM personal_shopping_bag 
                  JOIN customers ON personal_shopping_bag.customer_id = customers.customer_id
                  WHERE customers.customer_id = '${customer_id}'),
                (SELECT product_id FROM products WHERE product_name = '${RequestText_array[0]}'),
                ${RequestText_array[1]}
            );
          `
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

// Generate secure random integer between min and max (inclusive)
const secureRandomInt = (min, max) => {
  return crypto.randomInt(min, max + 1);
}

// Generate random Warehouse ID between 1 and 5
const Warehouse_id_random = () => {
  return secureRandomInt(1, 5);
}

// Generate random Quantity of product between 50 and 200
const Quantity_product_random = () => {
  return secureRandomInt(50, 200);
}

// Specific table : Read all product from MongoDB and Insert new random product into Ware_house of My SQL - Unused for now
// const Update_All_Products_into_Warehouse_for_admin = async(product_list) => {
//     var isValidUser = 0, isValidAdminRight = 0;
//     var Result_Checking= 0;
//     console.log(`product_list is ${product_list}`);
//     console.log(`Type of product_list is ${typeof(product_list)}`);
//     var RequestText = "";
//     for(let i = 0; i < product_list.length; i++){
//       if(i == product_list.length - 1){
//         RequestText += `('${Warehouse_id_random()}', '${product_list[i]}', ${Quantity_product_random()})`;
//       } else{
//         RequestText += `('${Warehouse_id_random()}', '${product_list[i]}', ${Quantity_product_random()}), `;
//       }
//     }
//     try{
//         const [results] = await pool.query(
//           ` INSERT INTO inventory (warehouse_id, product_sku, quantity_storage) 
//             VALUES ${RequestText};`
//         );
//         console.log('📦 Register successfully:');
//         console.table(results); 
//         Result_Checking = 1;
//         return Result_Checking;  
//     } catch(err){
//         console.error('❌ Lỗi truy vấn:', err);
//         throw err;
//     }
// }

// API_DB_9 : Specific table : Read all product from MongoDB and Insert new random product into Products of My SQL
const Update_All_Products_into_Products_for_admin = async(product_list) => {
    var Result_Checking= 0;
    console.log(`product_list is ${product_list}`);
    console.log(`Type of product_list is ${typeof(product_list)}`);
    var RequestText = "";
    for(let i = 0; i < product_list.length; i++){
      if(i == product_list.length - 1){
        RequestText += `('${product_list[i].product_name}', '${product_list[i].product_description}', ${product_list[i].price_unit}, '${product_list[i].product_category}', '${product_list[i].product_image}')`;
      } else{
        RequestText += `('${product_list[i].product_name}', '${product_list[i].product_description}', ${product_list[i].price_unit}, '${product_list[i].product_category}', '${product_list[i].product_image}'), `;
      }
    }
    try{
        const [results] = await pool.query(
          ` INSERT INTO products (product_name, product_description, price_unit, product_category, product_image ) 
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

// API_DB_10 : Add new product into Products of My SQL
const Add_new_product_to_Products_and_Inventory_MySQL = async(Product_name, Product_price, product_type, product_image, Product_quantity, Product_area) => {
    var Result_Checking= 0;
    console.log(`Product_name request is ${Product_name}`);
    console.log(`Product_quantity request is ${Product_quantity}`);
    console.log(`Product_area request is ${Product_area}`);
    try {
      const [results] = await pool.query(`
        INSERT INTO products (
          product_name,
          product_description,
          price_unit,
          product_category,
          product_image
        ) VALUES (
            '${Product_name}',
            '${Product_name}',
            '${Product_price}',
            '${product_type}',
            '${product_image}'
        );

        INSERT INTO inventory (
            product_id,
            warehouse_id,
            quantity_storage
        ) VALUES (
            LAST_INSERT_ID(),
            '${Product_area}',
            '${Product_quantity}'
        );

      `);
      console.log('📦 Dữ liệu lấy được:');
      console.table(results);
      // console.log(results.insertId); // Lấy ID của payment mới tạo
      Result_Checking = 1;
      return Result_Checking;
    } catch (err) {
      console.error('❌ Lỗi truy vấn Add_new_product_to_Products_and_Inventory_MySQL:', err);
      throw err;
    }
}

// API_DB_11 : Delete product in Products table and some dependant table
const Delete_product_in_Products = async(Product_name) => {
    var Result_Checking= 0;
    console.log(`Product_name request is ${Product_name}`);
    try {
      const [results] = await pool.query(`DELETE from products WHERE product_name = ?`, [Product_name]);
      console.log('📦 Dữ liệu lấy được:');
      console.table(results);
      // console.log(results.insertId); // Lấy ID của payment mới tạo
      Result_Checking = 1;
      return Result_Checking;
    } catch (err) {
      console.error('❌ Lỗi truy vấn Delete_product_in_Products:', err);
      throw err;
    }
}

// API_DB_12 : Create new order for user
const Create_New_Order_in_MySQL = async(customer_id,total_payment,status) => {
    var Result_Checking= 0;
    console.log(`Customer ID request is ${customer_id}`);
    console.log(`Total amount request is ${total_payment}`);
    console.log(`Status request is ${status}`);
    try {
      const [results] = await pool.query(`INSERT INTO orders (customer_id, total_amount, status_order) VALUES (?, ?, ?)`, [customer_id, total_payment, status]);
      console.log('📦 Register successfully:');
      console.table(results);
      console.log(results.insertId); // Lấy ID của đơn hàng mới tạo
      Result_Checking = 1;
      return results.insertId;     
    } catch (err) {
      console.error('❌ Lỗi truy vấn Create_New_Order_in_MySQL:', err);
      throw err;
    }
}
// API_DB_13 : Create new payment for user
const Create_New_payment_in_MySQL = async(order_id,status,method,payment_gateway_id) => {
    var Result_Checking= 0;
    console.log(`Order ID request is ${order_id}`);
    console.log(`Status request is ${status}`);
    console.log(`Method request is ${method}`);
    console.log(`Payment gateway ID request is ${payment_gateway_id}`);
    try {
      const [results] = await pool.query(`INSERT INTO payments (order_id, status_payment,method, payment_gateway_id) VALUES (?, ?, ?, ?)`, [order_id, status, method, payment_gateway_id]);
      console.log('📦 Register successfully:');
      console.table(results);
      console.log(results.insertId); // Lấy ID của payment mới tạo
      Result_Checking = 1;
      return results.insertId;     
    } catch (err) {
      console.error('❌ Lỗi truy vấn:', err);
      throw err;
    }K
}
// API_DB_14 : Create new order detail for user
const Create_Order_detail_Inventory_in_MySQL = async(order_id,payment_id,quantity,price_unit,product_name) => {
    var Result_Checking= 0;
    console.log(`Order ID request is ${order_id}`);
    console.log(`Payment ID request is ${payment_id}`);
    console.log(`Quantity request is ${quantity}`);
    console.log(`Price unit request is ${price_unit}`);
    subtotal = quantity * price_unit;
    console.log(`Subtotal request is ${subtotal}`);
    try {
      const [results] = await pool.query(`
        INSERT INTO order_details 
        (order_id, quantity)
        VALUES ( 
            '${order_id}',
            '${quantity}'
        );

        INSERT INTO order_details_inventory
        (order_detail_id, inventory_id)
        VALUES (
            LAST_INSERT_ID(),
            (SELECT inven.inventory_id 
             FROM inventory inven
             JOIN products prod
              ON inven.product_id = prod.product_id
              WHERE prod.product_name = '${product_name}'
              AND inven.warehouse_id = ${Warehouse_id_random()}
            )
        );

      `);
      // Currently, fix warehouse_id = 1, which is the main warehouse. In the future, we can add more complex algorithm to decide which warehouse to take product from based on quantity in warehouse, distance from warehouse to delivery address, etc.
      console.log('📦 Register successfully:');
      console.table(results);
      console.log(results.insertId); // Lấy ID của order_detail mới tạo
      Result_Checking = 1;
      return results.insertId;     
    } catch (err) {
      console.error('❌ Lỗi truy vấn:', err);
      throw err;
    }
}

// API_DB_15 : Get coupon list for admin
const Get_Coupon_List_for_Admin = async() => {
    console.log(`Getting all coupon list for admin`);
    try {
      const [ResultList] = await pool.query(`SELECT * FROM coupons;`);
      console.log('📦 Dữ liệu lấy được:');
      console.table(ResultList);
      console.log(`ResultList length is ${ResultList.length}`); 
      console.log('First item of ResultList is : ', ResultList[0]);
      console.log('Type of first item of ResultList is : ', typeof(ResultList[0])); // object
      return ResultList;
    } catch (err) {
      console.error('❌ Lỗi truy vấn Get_Coupon_List_for_Admin:', err);
      throw err;
    }
}

// API_DB_16 : Update coupon status for admin
const Update_Coupon_Status_for_Admin = async(coupon_id, status) => {
    console.log(`Updating coupon status for coupon ID: ${coupon_id} to status: ${status}`);
    try {
      const [ResultList] = await pool.query(`UPDATE coupons SET status = ? WHERE coupon_id = ?`, [status, coupon_id]);
      console.log('📦 Dữ liệu cập nhật:');
      console.table(ResultList);
      console.log(`ResultList length is ${ResultList.length}`); 
      console.log('First item of ResultList is : ', ResultList[0]);
      console.log('Type of first item of ResultList is : ', typeof(ResultList[0])); // object
      return ResultList;
    } catch (err) {
      console.error('❌ Lỗi truy vấn Get_Coupon_List_for_Admin:', err);
      throw err;
    }
}

// API_DB_17 : Update order status for admin
const Update_Order_Status_for_Admin = async(order_id, status) => {
    var Result_Checking= 0;
    try {
      const [results] = await pool.query(`UPDATE orders SET status_order = ? WHERE order_id = ?`, [status, order_id]);
      console.log('📦 Dữ liệu cập nhật:');
      console.table(results);
      return results;     
    } catch (err) {
      console.error('❌ Lỗi truy vấn:', err);
      throw err;
    }
}

// API 18: Add chat history of user and assistant into MySQL database  - Not login
const Add_Chat_History_in_MySQL = async(SessionID, user_message, assistant_response) => {
    var Result_Checking= 0;
    console.log(`Session ID request is ${SessionID}`);
    console.log(`User message request is ${user_message}`);
    console.log(`Assistant response request is ${assistant_response}`);
    try {
      const [results] = await pool.query(`INSERT INTO History_AI_Chatbot (session_id_chatbot, role, content) VALUES (?, ?, ?)`, [SessionID, user_message, assistant_response]);
      console.log('📦 Register successfully:');
      Result_Checking = 1;
      return Result_Checking;     
    } catch (err) {
      console.error('❌ Lỗi truy vấn in Add_Chat_History_in_MySQL:', err);
      throw err;
    }
}

// API 19: Add chat history of user and assistant into MySQL database  - Customer logined
const Add_Chat_History_in_MySQL_Login = async(customer_id, SessionID, user_message, assistant_response) => {
    var Result_Checking= 0;
    console.log(`Customer ID request is ${customer_id}`);
    console.log(`Session ID request is ${SessionID}`);
    console.log(`User message request is ${user_message}`);
    console.log(`Assistant response request is ${assistant_response}`);
    try {
      const [results] = await pool.query(`INSERT INTO History_AI_Chatbot (customer_id,session_id_chatbot, role, content) VALUES (?, ?, ?, ?)`, [customer_id, SessionID, user_message, assistant_response]);
      console.log('📦 Register successfully:');
      Result_Checking = 1;
      return Result_Checking;     
    } catch (err) {
      console.error('❌ Lỗi truy vấn in Add_Chat_History_in_MySQL_Login:', err);
      throw err;
    }
}

// API 20:
const Get_Chat_History_in_MySQL_DB = async(session_id) => {
    console.log(`Getting Get_Chat_History_in_MySQL_DB`);
    try {
      const [ResultList] = await pool.query(`
        SELECT role, content
        FROM (
            SELECT role, content, message_id
            FROM History_AI_Chatbot
            WHERE session_id_chatbot = '${session_id}'
            ORDER BY message_id DESC
            LIMIT 10
        ) AS last_10
        ORDER BY message_id ASC;

      `);
      console.log('📦 Dữ liệu lấy được:');
      console.table(ResultList);
      console.log(`ResultList length is ${ResultList.length}`); 
      console.log('First item of ResultList is : ', ResultList[0]);
      console.log('Type of first item of ResultList is : ', typeof(ResultList[0])); // object

      return ResultList;
    } catch (err) {
      console.error('❌ Lỗi truy vấn Get_Chat_History_in_MySQL_DB:', err);
      throw err;
    }
}
module.exports = {
  Check_Valid_User_in_MySQL,
  Add_New_User_Information_in_MySQL,
  Update_Content_of_ShoppingBag_MYSQL,
  GetShoppingBagFromUser_MYSQL,
  // Update_All_Products_into_Warehouse_for_admin, // Unused for now
  Get_quantity_available_in_Warehouse,
  // Get_Customer_ID_in_MySQL_DB_HighCorrection, // Unused for now
  Create_New_Order_in_MySQL,
  Create_New_payment_in_MySQL,
  Create_Order_detail_Inventory_in_MySQL,
  Add_new_product_to_Products_and_Inventory_MySQL,
  Delete_product_in_Products,
  Get_Customer_List_in_MySQL_DB_for_Admin,
  Get_Coupon_List_for_Admin,
  Get_Inventory_List_for_Admin,
  Get_Warehouse_List_for_Admin,
  Get_Order_Detail_List_for_Admin,
  Get_Order_Detail_for_Admin,
  Update_Coupon_Status_for_Admin,
  Update_Order_Status_for_Admin,
  Update_All_Products_into_Products_for_admin,
  Add_Chat_History_in_MySQL,
  Add_Chat_History_in_MySQL_Login,
  Get_Chat_History_in_MySQL_DB
};