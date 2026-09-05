const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

let allOk = true;

const expectedLinks = [
  'crea-tu-historia.html',
  'desvarios-literarios.html',
  'desvarios-retro.html',
  'desvarios-mentales.html',
  'desvarios-de-humor.html',
  'desvarios-por-la-red.html',
  'foro.html',
  'index.html',
  'login.html'
];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
  expectedLinks.forEach(link => {
    if (!content.includes(link)) {
      console.error(`❌ File ${file} is missing link to ${link}!`);
      allOk = false;
    }
  });
});

if (allOk) {
  console.log(`✅ All ${htmlFiles.length} HTML files have all 7 header links perfectly synchronized!`);
}
