const YooKassa = require('yookassa');

const yooKassa = new YooKassa({
  shopId: process.env.YOOKASSA_SHOP_ID,
  secretKey: process.env.YOOKASSA_API_KEY,
});

module.exports = yooKassa;
