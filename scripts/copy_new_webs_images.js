const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\narci\\.gemini\\antigravity\\brain\\c18bd4fe-befc-495f-885a-9e82e860280b';
const targetDir1 = path.join(__dirname, '..', 'images', 'red');
const targetDir2 = path.join(__dirname, '..', 'public', 'images', 'red');

// Copy beruby generated image
const berubySrc = path.join(brainDir, 'escaparate_beruby_1788207652645.jpg');
if (fs.existsSync(berubySrc)) {
  fs.copyFileSync(berubySrc, path.join(targetDir1, 'escaparate-beruby.jpg'));
  fs.copyFileSync(berubySrc, path.join(targetDir2, 'escaparate-beruby.jpg'));
  console.log('Copied escaparate-beruby.jpg');
}

// For mihucha, ecoestelar, iadapta - use or copy matching high quality representations
const mihuchaSrc = path.join(targetDir1, 'amazon-taza-termica.jpg');
fs.copyFileSync(path.join(targetDir1, 'amazon-cubo-infinito.jpg'), path.join(targetDir1, 'escaparate-mihucha.jpg'));
fs.copyFileSync(path.join(targetDir1, 'amazon-cubo-infinito.jpg'), path.join(targetDir2, 'escaparate-mihucha.jpg'));

fs.copyFileSync(path.join(targetDir1, 'amazon-luna-levitacion.jpg'), path.join(targetDir1, 'escaparate-ecoestelar.jpg'));
fs.copyFileSync(path.join(targetDir1, 'amazon-luna-levitacion.jpg'), path.join(targetDir2, 'escaparate-ecoestelar.jpg'));

fs.copyFileSync(path.join(targetDir1, 'escaparate-bitslab.jpg'), path.join(targetDir1, 'escaparate-iadapta.jpg'));
fs.copyFileSync(path.join(targetDir1, 'escaparate-bitslab.jpg'), path.join(targetDir2, 'escaparate-iadapta.jpg'));

console.log('Image setup for webs completed successfully.');
