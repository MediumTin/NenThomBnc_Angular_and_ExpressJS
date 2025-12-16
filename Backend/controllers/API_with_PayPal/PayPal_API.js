// const Menu_Candle_Processing = require('../Website_Candle_Light/Menu_Candle_Processing_MongooseDB');
let ACCESS_TOKEN = "";
let ACCESS_TOKEN_EXPIRE_TIME = 0;

//---- API PayPal 1:Paypal Authorization ----//
// API PayPal 1.1 : Generate PayPal access token
const Generate_access_token = async () => {
    const auth = Buffer.from(`${process.env.Client_ID_PayPal}:${process.env.Secret_Key_PayPal}`).toString('base64');
     const response = await fetch('https://api.sandbox.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });
    const data = await response.json();
    return data;
};
// end API PayPal 1.1

// API PayPal 1.2 : Terminate access_token
const Terminate_access_token = async (access_token) => {
    const response = await fetch('https://api.sandbox.paypal.com/v1/oauth2/token/revoke', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${access_token}`
        },
        body: `token=${access_token}`
    });
    if (response.ok) {
        console.log('Access token đã bị thu hồi thành công.');
    } else {
        console.error('Lỗi khi thu hồi access token:', response.statusText);
    }
};
// end API PayPal 1.2

// ---- Specific method based on standard PayPal API ---- //
const getPayPalAccessToken = async () => {
    const date = new Date();
    if(ACCESS_TOKEN && date.getTime() < ACCESS_TOKEN_EXPIRE_TIME) {
        console.log("Reusing existing PayPal access token.");
        return ACCESS_TOKEN;
    } else {
        // Lấy token mới
        const new_access_token = await Generate_access_token();
        console.log("New access token response:", new_access_token);
        ACCESS_TOKEN = new_access_token.access_token;
        ACCESS_TOKEN_EXPIRE_TIME = date.getTime() + (new_access_token.expires_in - 60) * 1000; // trừ 60 giây để đảm bảo token không hết hạn ngay khi sử dụng
        console.log("New access token is:", ACCESS_TOKEN);
        console.log("Access token expires at:", new Date(ACCESS_TOKEN_EXPIRE_TIME).toLocaleString());
        console.log("Generated new PayPal access token.");
        return ACCESS_TOKEN;
    }
}

const CreateOrder = async (req,res) => {
    let Total_Price_Before_VAT = "";
    let Total_VAT = "";
    let Total_Price_After_VAT  = "";
    console.log("Creating PayPal order...",req.body);
    const Order_detail = req.body.orderDetails;
    const Price_currency = req.body.orderDetails.Price_currency;
    console.log(`Price_currency is ${Price_currency}`);
    console.log(`type of Price_currency is ${typeof Price_currency}`);
    const select_list = req.body.orderDetails.Selected_List_Object;
    const selected_list_filtered = [];
    // for (let i = 0; i < select_list.length; i++) {
    //     selected_list_filtered.push(select_list[i].split(","));
    // }
    console.log(`Selected_List is ${select_list}`);
    console.log(`type of Selected_List is ${typeof select_list}`);
    console.log(`First item of Selected_List is ${select_list[0]}`);
    console.log(`First item of Selected_List is ${select_list[0].candle_name}`);
    let Detail_item_text = [];
    let new_Total_prive_before_VAT = 0;
    let New_VAT = 0;
    let new_Total_price_after_VAT = 0;
    for (let j = 0; j < select_list.length; j++) {
        Detail_item_text.push({
            name: select_list[j].candle_name,
            unit_amount: {
                currency_code: "USD",
                value: select_list[j].price
            },
            quantity: select_list[j].quatity,
            image_url: `https://nenthombnc.website/${select_list[j].image.replace(/\.\.\//g, '')}`
        });

        new_Total_prive_before_VAT += parseFloat(select_list[j].price).toFixed(2) * parseInt(select_list[j].quatity);
    }
    new_Total_prive_before_VAT = Math.round(new_Total_prive_before_VAT*100)/100; // To avoid floating point precision issues
    New_VAT = Math.round(new_Total_prive_before_VAT * 0.2 *100)/100; // Assuming VAT is 20%
    new_Total_price_after_VAT = Math.round((new_Total_prive_before_VAT + New_VAT)*100)/100;
    console.log(`new_Total_prive_before_VAT: ${new_Total_prive_before_VAT}, New_VAT: ${New_VAT}, new_Total_price_after_VAT: ${new_Total_price_after_VAT}`);
    console.log("Detail_item_text is:", Detail_item_text);
    console.log(`type of Detail_item_text is ${typeof Detail_item_text}`);
    console.log(`Detail_item_text is ${Detail_item_text[0]}`);
    console.log(`Detail_item_text is ${Detail_item_text[0].name}`);
    
    if(Price_currency === "2") {
        // Process for USD
        Total_Price_Before_VAT = (req.body.orderDetails.Total_Price_Before_VAT).slice(0, -4); // Remove " USD"
        Total_VAT = (req.body.orderDetails.Total_VAT).slice(0, -4); // Remove " USD"
        Total_Price_After_VAT = (req.body.orderDetails.Total_Price_After_VAT).slice(0, -4); // Remove " USD"
    } else if (Price_currency === "3"){
        // Process for EUR
        Total_Price_Before_VAT = (req.body.orderDetails.Total_Price_Before_VAT).slice(0, -4); // Remove " EUR"
        Total_VAT = (req.body.orderDetails.Total_VAT).slice(0, -4); // Remove " EUR"
        Total_Price_After_VAT = (req.body.orderDetails.Total_Price_After_VAT).slice(0, -4); // Remove " EUR"
    }
    else {
        // Process for VND
        Total_Price_Before_VAT = ""; // Placeholder for VND processing
        Total_VAT = ""; // Placeholder for VND processing
        Total_Price_After_VAT = ""; // Placeholder for VND processing
    }
    console.log(`Total_Price_Before_VAT: ${Total_Price_Before_VAT}, Total_VAT: ${Total_VAT}, Total_Price_After_VAT: ${Total_Price_After_VAT}`);
    console.log("Order detail received:", Order_detail);
    status_update = "";
    const accessToken = await getPayPalAccessToken();
    console.log(`Access Token is ${accessToken}`);
    // const accessToken = "REPLACE_WITH_YOUR_ACCESS_TOKEN"; // for testing purpose only
    const response = await fetch ("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
        "purchase_units": [
            {
            "amount": {
                "currency_code": "USD",
                "value": `${new_Total_price_after_VAT}`
                ,
                "breakdown": {
                    "item_total": {
                        "currency_code": "USD",
                        "value": `${new_Total_prive_before_VAT}`
                    }
                    ,
                    "shipping": {
                        "currency_code": "USD",
                        "value": "0.0"
                    },
                    "tax_total": {
                        "currency_code": "USD",
                        "value": `${New_VAT}`
                    }
                }
                // "currency_code": "USD",
                // "value": "100.00"
                // ,
                // "breakdown": {
                //     "item_total": {
                //         "currency_code": "USD",
                //         "value": "80.00"
                //     }
                //     ,
                //     "shipping": {
                //         "currency_code": "USD",
                //         "value": "0.0"
                //     },
                //     "tax_total": {
                //         "currency_code": "USD",
                //         "value": "20.00"
                //     }
                // }
            },
            "items": Detail_item_text,
            // "items": [
            //     {
            //         "name": `${select_list[0].candle_name}`,
            //         "unit_amount": {
            //             "currency_code": "USD",
            //             "value": `${select_list[0].price}`
            //         },
            //         "quantity": `${select_list[0].quatity}`,
            //         "image_url": `${select_list[0].image}`
            //     }
            //     // ,
            //     // {
            //     //     "name": "Shoes",
            //     //     "unit_amount": {
            //     //         "currency_code": "USD",
            //     //         "value": "25.00"
            //     //     },
            //     //     "quantity": "2",
            //     //     "image_url": "https://example.com/static/images/items/1/shoes_running.jpg",
            //     // }
            // ],
            "reference_id": "d9f80740-38f0-11e8-b467-0ed5f89f718b"
            }
        ],
        "intent": "CAPTURE",
        "payment_source": {
            "paypal": {
            "experience_context": {
                "payment_method_preference": "IMMEDIATE_PAYMENT_REQUIRED",
                "payment_method_selected": "PAYPAL",
                "brand_name": "EXAMPLE INC",
                "locale": "en-US",
                "landing_page": "LOGIN",
                "shipping_preference": "GET_FROM_FILE",
                "user_action": "PAY_NOW",
                "return_url": "https://example.com/returnUrl",
                "cancel_url": "https://example.com/cancelUrl"
            }
            }
        }
        })
    });
    const data = await response.json();
    // res.json({ id: data.id });
    return data;
}

const CaptureOrder = async (orderID) => {
    const accessToken = await getPayPalAccessToken();
    const response = await fetch (`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        }
    });
    const data = await response.json();
    console.log(`data is : ${data}`);
    return data;
}
const ShowOrderDetails = async (orderID) => {
    const accessToken = await getPayPalAccessToken();
    const response = await fetch (`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        }
    });
    const data = await response.json();
    console.log(`Order details: ${data}`);
    return data;
}

const UpdateOrder = async (orderID, updatedData) => {
    const accessToken = await getPayPalAccessToken();
    const response = await fetch (`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}`, {
        method: "PATCH",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedData)
    });
    if (response.ok) {
        console.log(`Order ${orderID} updated successfully.`);
    }
    else {
        console.error(`Failed to update order ${orderID}: ${response.statusText}`);
    }
    return response.ok;
}
module.exports = {
    CreateOrder,
    getPayPalAccessToken,
    CaptureOrder,
    ShowOrderDetails,
    UpdateOrder
};