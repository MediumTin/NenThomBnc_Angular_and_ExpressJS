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
                "value": "10.00"
            },
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

module.exports = {
    CreateOrder,
    getPayPalAccessToken,
    CaptureOrder
};