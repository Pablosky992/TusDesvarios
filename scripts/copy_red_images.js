const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\narci\\.gemini\\antigravity\\brain\\c18bd4fe-befc-495f-885a-9e82e860280b';
const targetDir1 = path.join(__dirname, '..', 'images', 'red');
const targetDir2 = path.join(__dirname, '..', 'public', 'images', 'red');

fs.mkdirSync(targetDir1, { recursive: true });
fs.mkdirSync(targetDir2, { recursive: true });

const files = fs.readdirSync(brainDir);

const mapping = {
  'escaparate_tusdesvarios': 'escaparate-tusdesvarios.jpg',
  'escaparate_cronicas': 'escaparate-cronicas.jpg',
  'escaparate_retrobit': 'escaparate-retrobit.jpg',
  'escaparate_bitslab': 'escaparate-bitslab.jpg',
  'amazon_luna_levitacion': 'amazon-luna-levitacion.jpg',
  'amazon_teclado_retro': 'amazon-teclado-retro.jpg',
  'amazon_proyector_astronauta': 'amazon-proyector-astronauta.jpg',
  'amazon_mini_arcade': 'amazon-mini-arcade.jpg',
  'amazon_taza_termica': 'amazon-taza-termica.jpg',
  'amazon_cubo_infinito': 'amazon-cubo-infinito.jpg',
  'amazon_reloj_nixie': 'amazon-reloj-nixie.jpg',
  'amazon_martillo_thor': 'amazon-martillo-thor.jpg',
};

for (const [prefix, destName] of Object.entries(mapping)) {
  const match = files.filter(f => f.startsWith(prefix) && f.endsWith('.jpg')).sort().pop();
  if (match) {
    const src = path.join(brainDir, match);
    fs.copyFileSync(src, path.join(targetDir1, destName));
    fs.copyFileSync(src, path.join(targetDir2, destName));
    console.log(`Copied ${match} -> ${destName}`);
  } else {
    console.warn(`Could not find image for ${prefix}`);
  }
}
