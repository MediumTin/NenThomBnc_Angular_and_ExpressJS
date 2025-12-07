import { environment } from "../../../environments/environment";


export const BASE_URL = environment.production? 'https://nenthombnc.website' : 'http://localhost:3500';


// Process with "candles"
export const CANDLES_URL = BASE_URL + '/api/candles';                           // GET and POST method
export const CANDLES_AdminRight_URL = CANDLES_URL + '/adminright';         // GET method
export const CANDLES_AddNewProduct_URL = CANDLES_URL + '/addnewproduct';   // POST method
export const CANDLES_By_Tag_URL = CANDLES_URL + '/RequestGetCandleByTag/';
export const CANDLES_By_Filter_URL = CANDLES_URL + '/RequestGetCandleByFilter/';
export const CANDLES_By_Search_URL = CANDLES_URL + '/RequestGetCandleBySearch/';
export const CANDLES_By_RequestToBeRemoved = CANDLES_URL + '/RemoveProduct/';

// Process with "testangular"
export const TESTANGULAR_URL = BASE_URL + '/api/testangular';                   // GET method 

// Process with "oils"
export const OILS_URL = BASE_URL + '/api/oils';                                 // GET method 

// Process with "diffuse_oils"
export const DIFFUSE_OILS_URL = BASE_URL + '/api/diffuse_oils';                 // GET method 

// Process with "natural_oils"
export const NATURAL_OILS_URL = BASE_URL + '/api/natural_oils';                 // GET method 

// Process with "accessory"
export const ACCESSORY_URL = BASE_URL + '/api/accessory';                       // GET method 

// Process with "burn_candles"
export const BURN_CANDLES_URL = BASE_URL + '/api/burn_candles';                 // GET method 

// Process with "care_candles"
export const CARE_CANDLES_URL = BASE_URL + '/api/care_candles';                 // GET method 

// Process with "gift"
export const GIFT_URL = BASE_URL + '/api/gift';                                 // GET method 

// Process with "news"
export const NEWS_URL = BASE_URL + '/api/news';                                 // GET method

// Process with "Contact"
export const CONTACT_URL = BASE_URL + '/api/Contact';                           // GET method

// Process with "another_information"
export const ANOTHER_INFORMATION_URL = BASE_URL + '/api/another_information';                           // NO METHOD
export const ANOTHER_INFORMATION_Delivery_URL = ANOTHER_INFORMATION_URL + '/delivery_policy';       // GET method
export const ANOTHER_INFORMATION_Payment_URL = ANOTHER_INFORMATION_URL + '/payment_policy';         // GET method
export const ANOTHER_INFORMATION_Return_URL = ANOTHER_INFORMATION_URL + '/return_policy';           // GET method
export const ANOTHER_INFORMATION_Privacy_URL = ANOTHER_INFORMATION_URL + '/privacy_policy';         // GET method

// Process with "candle_information"
export const CANDLE_INFORMATION_URL = BASE_URL + '/api/candle_information';                                                     // GET and POST method
export const CANDLE_INFORMATION_Request_Write_to_Session_URL = CANDLE_INFORMATION_URL + '/requestwriteintosession';       // GET method


// Process with "login_handling"
export const LOGIN_HANDLING_URL = BASE_URL + '/api/login_handling';                 // GET method
export const LOGIN_HANDLING_Login_URL = LOGIN_HANDLING_URL + '/login';         // POST method
export const LOGIN_HANDLING_Register_URL = LOGIN_HANDLING_URL + '/register';   // POST method

// Process with "Add_new_product"
export const ADD_NEW_PRODUCT_URL = BASE_URL + '/api/Add_new_product';               // GET method

// Process with "payment_handling"
export const PAYMENT_HANDLING_URL = BASE_URL + '/api/payment_handling';                                         // GET and POST method
export const PAYMENT_HANDLING_Specific_Handling_URL = PAYMENT_HANDLING_URL + '/specific_handling';          // GET and POST method
export const PAYMENT_HANDLING_Merge_local_storage_and_DB = PAYMENT_HANDLING_URL + '/mergelocalstorageandDB'; // POST method

// Inteface for PayPal payment creation
export const Create_Order_URL = BASE_URL + '/api/payment/paypal/create-order';
export const Capture_Order_URL = BASE_URL + '/api/payment/paypal/capture-order';

// Process with "Shopping_Bag_handling"
export const SHOPPING_BAG_HANDLING_URL = BASE_URL + '/api/Shopping_Bag_handling';               // GET method

// Check current user information
export const CHECK_CURRENT_USER_URL = BASE_URL + '/api/check_user_identification';               // GET method

// Process with "oils"
export const GET_SESSION_DATA = BASE_URL + '/api/get-session'; 
export const GET_SESSION_ID = BASE_URL + '/api/get-sid'; 
export const CLEAR_SESSION_ID = BASE_URL + '/api/clear-sid'; 
export const DESTROY_SESSION_ID = BASE_URL + '/api/destroy-sid'; 
export const DESTROY_SESSION_DATA = BASE_URL + '/api/destroy-session'; 


export const FOODS_URL = BASE_URL + '/api/foods';
export const FOODS_TAGS_URL = FOODS_URL + '/tags';
export const FOODS_BY_SEARCH_URL = FOODS_URL + '/search/';
export const FOODS_BY_TAG_URL = FOODS_URL + '/tag/';
export const FOOD_BY_ID_URL = FOODS_URL + '/';


export const USER_LOGIN_URL = BASE_URL + '/api/users/login';
export const USER_REGISTER_URL = BASE_URL + '/api/users/register';


export const ORDERS_URL = BASE_URL + '/api/orders';
export const ORDER_CREATE_URL = ORDERS_URL + '/create';
export const ORDER_NEW_FOR_CURRENT_USER_URL = ORDERS_URL + '/newOrderForCurrentUser';
export const ORDER_PAY_URL = ORDERS_URL + '/pay';
export const ORDER_TRACK_URL = ORDERS_URL + '/track/';


