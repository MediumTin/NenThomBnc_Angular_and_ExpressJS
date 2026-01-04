// controllers/API_with_Momo_Ex/MoMo.js
const https = require('https');
const crypto = require('crypto');
const isProduction = process.env.IS_PRODUCTION === 'true';

module.exports = async (req, res) => {
    try {
        var partnerCode = isProduction ? process.env.Momo_Partner_code_Production : process.env.Momo_Partner_code_Development;
        var accessKey = isProduction ? process.env.Momo_Access_Key_Production : process.env.Momo_Access_Key_Development;
        var secretkey = isProduction ? process.env.Momo_Secret_Key_Production : process.env.Momo_Secret_Key_Development;
        var requestId = partnerCode + new Date().getTime();
        var orderId = requestId;
        var orderInfo = "pay with MoMo";
        var redirectUrl = isProduction ? process.env.Momo_Redirect_URL_Production : process.env.Momo_Redirect_URL_Development;
        var ipnUrl = isProduction ? process.env.Momo_IPN_URL_Production : process.env.Momo_IPN_URL_Development;
        var amount = "50000";
        var requestType = "captureWallet"
        var extraData = "";

        var rawSignature = "accessKey="+accessKey+"&amount=" + amount+"&extraData=" + extraData+"&ipnUrl=" + ipnUrl+"&orderId=" + orderId+"&orderInfo=" + orderInfo+"&partnerCode=" + partnerCode +"&redirectUrl=" + redirectUrl+"&requestId=" + requestId+"&requestType=" + requestType;
        console.log("--------------------RAW SIGNATURE----------------");
        console.log(rawSignature);
        var signature = crypto.createHmac('sha256', secretkey)
            .update(rawSignature)
            .digest('hex');
        console.log("--------------------SIGNATURE----------------");
        console.log(signature);
        const requestBody = JSON.stringify({
            partnerCode : partnerCode,
            accessKey : accessKey,
            requestId : requestId,
            amount : amount,
            orderId : orderId,
            orderInfo : orderInfo,
            redirectUrl : redirectUrl,
            ipnUrl : ipnUrl,
            extraData : extraData,
            requestType : requestType,
            signature : signature,
            lang: 'en'
        });

        const agent = new https.Agent({
            keepAlive: true,
            timeout: 30000
        });

        const options = {
            hostname: isProduction ? process.env.Momo_Hostname_Production : process.env.Momo_Hostname_Development,
            port: 443,
            path: process.env.Momo_API_Path_App,
            method: 'POST',
            agent: agent,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        };

        const momoReq = https.request(options, momoRes => {
            let data = '';
            momoRes.on('data', chunk => data += chunk);
            momoRes.on('end', () => {
                res.json(JSON.parse(data)); // trả về response cho client
            });
        });

        // ⏱️ TIMEOUT 30s
        momoReq.setTimeout(30000, () => {
            momoReq.destroy(new Error('MoMo request timeout after 30s'));
        });

        momoReq.on('error', e => {
            console.error(e);
            res.status(500).json({error: e.message});
        });

        momoReq.write(requestBody);
        momoReq.end();

    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
};
