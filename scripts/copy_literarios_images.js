const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\narci\\.gemini\\antigravity\\brain\\c18bd4fe-befc-495f-885a-9e82e860280b';

const imageMap = {
  'el-susurro-relojes.jpg': 'el_susurro_relojes_1788101289265.jpg',
  'el-ultimo-eco-andromeda.jpg': 'el_ultimo_eco_andromeda_1788101314344.jpg',
  'la-taberna-cuervo-ciego.jpg': 'la_taberna_cuervo_ciego_1788101339538.jpg',
  'el-coleccionista-silencios.jpg': 'el_coleccionista_silencios_1788101366623.jpg',
  'microrrelatos-impacto.jpg': 'microrrelatos_impacto_1788101396642.jpg'
};

const dest1 = path.join(__dirname, '..', 'images', 'literarios');
const dest2 = path.join(__dirname, '..', 'public', 'images', 'literarios');

if (!fs.existsSync(dest1)) fs.mkdirSync(dest1, { recursive: true });
if (!fs.existsSync(dest2)) fs.mkdirSync(dest2, { recursive: true });

for (const [targetName, sourceName] of Object.entries(imageMap)) {
  const srcPath = path.join(brainDir, sourceName);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(dest1, targetName));
    fs.copyFileSync(srcPath, path.join(dest2, targetName));
    console.log(`Copied ${targetName} successfully.`);
  } else {
    console.error(`Source not found: ${srcPath}`);
  }
}
console.log('All literary images copied successfully!');
