const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\narci\\.gemini\\antigravity\\brain\\c18bd4fe-befc-495f-885a-9e82e860280b';

const imageMap = {
  'arquetipo-oscuro.jpg': 'arquetipo_oscuro_1788100062960.jpg',
  'termometro-desvario.jpg': 'termometro_desvario_1788100080214.jpg',
  'enigmas-logica.jpg': 'enigmas_logica_1788100096679.jpg',
  'supervivencia-apocalipsis.jpg': 'supervivencia_apocalipsis_1788100114785.jpg',
  'trampas-mentales.jpg': 'trampas_mentales_1788100133993.jpg',
  'monstruo-interior.jpg': 'monstruo_interior_1788100160967.jpg',
  'dilemas-morales.jpg': 'dilemas_morales_1788100180360.jpg',
  'curiosidades-insolitas.jpg': 'curiosidades_insolitas_1788100207513.jpg'
};

const dest1 = path.join(__dirname, '..', 'images', 'tests');
const dest2 = path.join(__dirname, '..', 'public', 'images', 'tests');

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
console.log('All test images copied successfully!');
