const speakeasy = require('speakeasy');

const secret = speakeasy.generateSecret({ length: 20 });

console.log('Votre clé secrète Base32 :', secret.base32);
console.log('Votre clé secrète Hex :', secret.hex);
