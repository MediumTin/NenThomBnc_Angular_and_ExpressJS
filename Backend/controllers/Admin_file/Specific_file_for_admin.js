const Menu_Candle_Processing = require('../Website_Candle_Light/Menu_Candle_Processing_MongooseDB');
const User_Information_From_MySQL = require('../API_with_MySQL/MySQL_API_products_table');

const GetAllProduct_MongoDB_and_Update_Warehouse_MySQL = async (req,res) => {
   var Product_list = await Menu_Candle_Processing.GetAllProductInformation();
   console.log("Result of First time loading : ",Product_list);
   var Product_list_filtered = [];
    for(let i=0;i<Product_list.length;i++){
        Product_list_filtered[i] = `${Product_list[i].name}`;
    }
    console.log("Product_list_filtered is : ",Product_list_filtered);   // Expect type of data is string array
    console.log("Type of Product_list_filtered is : ",typeof(Product_list_filtered));   // Expect type of data is string array
   const status_update = await User_Information_From_MySQL.Update_All_Products_into_Warehouse_for_admin(Product_list_filtered); // Update new shopping bag to database
   return status_update;
}

module.exports = {
    GetAllProduct_MongoDB_and_Update_Warehouse_MySQL
};