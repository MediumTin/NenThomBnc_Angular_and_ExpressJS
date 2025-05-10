import { environment } from "../../../environments/environment";


export const BASE_URL = environment.production? '' : 'http://localhost:3500';

// Process with "candles"
export const CANDLES_URL = BASE_URL + '/candles';                           // GET and POST method
export const CANDLES_AdminRight_URL = CANDLES_URL + '/adminright';         // GET method
export const CANDLES_AddNewProduct_URL = CANDLES_URL + '/addnewproduct';   // POST method
export const CANDLES_By_Tag_URL = CANDLES_URL + '/RequestGetCandleByTag/';
export const CANDLES_By_Filter_URL = CANDLES_URL + '/RequestGetCandleByFilter/';
export const CANDLES_By_Search_URL = CANDLES_URL + '/RequestGetCandleBySearch/';

// Process with "testangular"
export const TESTANGULAR_URL = BASE_URL + '/testangular';                   // GET method 

// Process with "oils"
export const OILS_URL = BASE_URL + '/oils';                                 // GET method 

// Process with "diffuse_oils"
export const DIFFUSE_OILS_URL = BASE_URL + '/diffuse_oils';                 // GET method 

// Process with "natural_oils"
export const NATURAL_OILS_URL = BASE_URL + '/natural_oils';                 // GET method 

// Process with "accessory"
export const ACCESSORY_URL = BASE_URL + '/accessory';                       // GET method 

// Process with "burn_candles"
export const BURN_CANDLES_URL = BASE_URL + '/burn_candles';                 // GET method 

// Process with "care_candles"
export const CARE_CANDLES_URL = BASE_URL + '/care_candles';                 // GET method 

// Process with "gift"
export const GIFT_URL = BASE_URL + '/gift';                                 // GET method 

// Process with "news"
export const NEWS_URL = BASE_URL + '/news';                                 // GET method

// Process with "Contact"
export const CONTACT_URL = BASE_URL + '/Contact';                           // GET method

// Process with "another_information"
export const ANOTHER_INFORMATION_URL = BASE_URL + '/another_information';                           // NO METHOD
export const ANOTHER_INFORMATION_Delivery_URL = ANOTHER_INFORMATION_URL + '/delivery_policy';       // GET method
export const ANOTHER_INFORMATION_Payment_URL = ANOTHER_INFORMATION_URL + '/payment_policy';         // GET method
export const ANOTHER_INFORMATION_Return_URL = ANOTHER_INFORMATION_URL + '/return_policy';           // GET method
export const ANOTHER_INFORMATION_Privacy_URL = ANOTHER_INFORMATION_URL + '/privacy_policy';         // GET method

// Process with "candle_information"
export const CANDLE_INFORMATION_URL = BASE_URL + '/candle_information';                                                     // GET and POST method
export const CANDLE_INFORMATION_Request_Write_to_Session_URL = CANDLE_INFORMATION_URL + '/requestwriteintosession';       // GET method


// Process with "login_handling"
export const LOGIN_HANDLING_URL = BASE_URL + '/login_handling';                 // GET method
export const LOGIN_HANDLING_Login_URL = LOGIN_HANDLING_URL + '/login';         // POST method
export const LOGIN_HANDLING_Register_URL = LOGIN_HANDLING_URL + '/register';   // POST method

// Process with "Add_new_product"
export const ADD_NEW_PRODUCT_URL = BASE_URL + '/Add_new_product';               // GET method

// Process with "payment_handling"
export const PAYMENT_HANDLING_URL = BASE_URL + '/payment_handling';                                         // GET and POST method
export const PAYMENT_HANDLING_Specific_Handling_URL = PAYMENT_HANDLING_URL + '/specific_handling';          // GET and POST method

// Process with "Shopping_Bag_handling"
export const SHOPPING_BAG_HANDLING_URL = BASE_URL + '/Shopping_Bag_handling';               // GET method
