const WebSocket = require('ws');

let wss;

function init(server) {
  wss = new WebSocket.Server({ server });
  // 🔥 BẮT BUỘC PHẢI CÓ
  wss.on('connection', (ws) => {
    console.log('🔌 WebSocket client connected');

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);

        // ✅ GÁN Ở ĐÂY
        if (data.orderId) {
          ws.orderId = data.orderId;
          console.log('✅ WS subscribed to orderId:', ws.orderId);
        }
      } catch (err) {
        console.error('WS message parse error', err);
      }
    });
     ws.on('close', () => {
      console.log('❌ WS closed for orderId:', ws.orderId);
    });
  });
}


function emitPaymentStatus(orderId, status) {
  console.log(`Emitting payment status for order ${orderId}: ${status}`);
  if (!wss) {
    console.error('WebSocket server not initialized.');
    return;
  }

  wss.clients.forEach(ws => {
    console.log(`Checking client with orderId: ${ws.orderId}`);
    console.log(`Client readyState: ${orderId}`);
    if (ws.readyState === WebSocket.OPEN && ws.orderId === orderId) {
      ws.send(JSON.stringify({ orderId, status }));
    }
  });
}

module.exports = { init, emitPaymentStatus };
