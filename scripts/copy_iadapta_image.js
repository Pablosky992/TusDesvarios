const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\narci\\.gemini\\antigravity\\brain\\c18bd4fe-befc-495f-885a-9e82e860280b\\.user_uploaded\\media_1788208175720.jpg';
const dest1 = path.join(__dirname, '..', 'images', 'red', 'escaparate-iadapta.jpg');
const dest2 = path.join(__dirname, '..', 'public', 'images', 'red', 'escaparate-iadapta.jpg');

fs.copyFileSync(src, dest1);
fs.copyFileSync(src, dest2);
console.log('Successfully copied user image for iAdapta!');
